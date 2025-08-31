import Stripe from "stripe";
import { buffer } from "micro";
import { sendAssetEmail } from "@/lib/sendgrid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getCustomerEmail(id) {
  const customer = await stripe.customers.retrieve(id);
  return customer.email || null;
}

async function getProductFromInvoice(paymentIntent) {
  if (!paymentIntent.invoice) return null;

  const invoice = await stripe.invoices.retrieve(paymentIntent.invoice, {
    expand: ["lines.data.price.product"],
  });

  const lineItem = invoice.lines.data[0];

  return {
    priceId: lineItem.price.id,
    productId: lineItem.price.product.id || lineItem.price.product,
    productName: lineItem.price.product.name,
    amount: lineItem.amount_total,
  };
}

// Method 2: Get product/price from checkout session
async function getProductFromCheckoutSession(paymentIntentId) {
  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      limit: 10,
    });

    if (sessions.data.length === 0) {
      return null;
    }

    const session = sessions.data[0];

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    if (lineItems.data.length === 0) {
      return null;
    }

    const lineItem = lineItems.data[0];

    let productId = null;
    let productName = null;

    if (typeof lineItem.price.product === "string") {
      productId = lineItem.price.product;
      try {
        const product = await stripe.products.retrieve(productId);
        productName = product.name;
      } catch (error) {
        console.log("Could not fetch product details:", error);
      }
    } else if (lineItem.price.product) {
      productId = lineItem.price.product.id;
      productName = lineItem.price.product.name;
    }

    const result = {
      priceId: lineItem.price.id,
      productId: productId,
      productName: productName || lineItem.description,
      quantity: lineItem.quantity,
      amount: lineItem.amount_total,
    };

    return result;
  } catch (error) {
    console.error("Error fetching checkout session:", error);
    return null;
  }
}

async function getProductFromCharge(paymentIntent) {
  if (!paymentIntent.latest_charge) return null;

  const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);

  if (charge.metadata?.productId && charge.metadata?.priceId) {
    return {
      productId: charge.metadata.productId,
      priceId: charge.metadata.priceId,
    };
  }

  return null;
}

async function getEmailFromCharge(paymentIntent) {
  if (!paymentIntent.latest_charge) return null;

  try {
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
    return charge.billing_details?.email || charge.receipt_email || null;
  } catch (error) {
    console.error("Error fetching charge:", error);
    return null;
  }
}

async function getEmailFromCheckoutSession(paymentIntentId) {
  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    if (sessions.data.length === 0) return null;

    const session = sessions.data[0];
    return session.customer_details?.email || session.customer_email || null;
  } catch (error) {
    console.error("Error fetching checkout session for email:", error);
    return null;
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
    return;
  }

  const buf = await buffer(request);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return response
      .status(400)
      .json({ error: `Webhook Error: ${error.message}` });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      let email = null;

      if (paymentIntent.customer) {
        email =
          typeof paymentIntent.customer === "string"
            ? await getCustomerEmail(paymentIntent.customer)
            : paymentIntent.customer?.email;
      }

      if (!email && paymentIntent.receipt_email) {
        email = paymentIntent.receipt_email;
      }

      if (!email) {
        email = await getEmailFromCharge(paymentIntent);
      }

      if (!email) {
        email = await getEmailFromCheckoutSession(paymentIntent.id);
      }

      if (!email) {
        return response.status(400).json({ error: "No customer email found" });
      }

      let productInfo = null;

      productInfo = await getProductFromCheckoutSession(paymentIntent.id);

      if (
        !productInfo &&
        paymentIntent.metadata?.productId &&
        paymentIntent.metadata?.priceId
      ) {
        productInfo = {
          productId: paymentIntent.metadata.productId,
          priceId: paymentIntent.metadata.priceId,
        };
      }

      if (!productInfo && paymentIntent.invoice) {
        productInfo = await getProductFromInvoice(paymentIntent);
      }

      if (!productInfo) {
        productInfo = await getProductFromCharge(paymentIntent);
      }

      if (!productInfo) {
        console.error("No product information found");
        return response
          .status(400)
          .json({ error: "No product information found" });
      }

      await sendAssetEmail(email, productInfo.productId, productInfo.priceId);
    }

    // RECOMMENDED: Handle checkout.session.completed instead
    // This is much easier as it has direct access to line items and customer email
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;

      if (!email) {
        return response.status(400).json({ error: "No customer email found" });
      }

      // Retrieve line items with expanded product information
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        }
      );

      // Process each product in the order
      for (const item of lineItems.data) {
        let productId = null;
        let productName = null;

        if (typeof item.price.product === "string") {
          productId = item.price.product;

          try {
            const product = await stripe.products.retrieve(productId);
            productName = product.name;
          } catch (err) {
            productName = item.description;
          }
        } else if (item.price.product) {
          productId = item.price.product.id;
          productName = item.price.product.name;
        }

        const priceId = item.price.id;

        await sendAssetEmail(email, productId, priceId);
      }

      return response.status(200).json({ received: true });
    }
  } catch (error) {
    console.error(`Webhook handler failed: ${error.message}`);
    return response.status(500).json({ error: error.message });
  }

  return response.status(200).json({ received: true });
}
