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

async function getProductFromCheckoutSession(paymentIntentId) {
  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      expand: ["data.line_items.data.price.product"],
    });

    if (sessions.data.length === 0) return null;

    const session = sessions.data[0];
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const lineItem = lineItems.data[0];

    return {
      priceId: lineItem.price.id,
      productId: lineItem.price.product.id || lineItem.price.product,
      productName: lineItem.price.product.name,
      quantity: lineItem.quantity,
      amount: lineItem.amount_total,
    };
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

  const requestBuffer = await buffer(request);
  const signature = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      requestBuffer,
      signature,
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
        if (email) {
          console.log("Got email from charge:", email);
        }
      }

      if (!email) {
        email = await getEmailFromCheckoutSession(paymentIntent.id);
        if (email) {
          console.log("Got email from checkout session:", email);
        }
      }

      if (!email) {
        console.error("No email found for payment intent:", paymentIntent.id);
        return response.status(400).json({ error: "No customer email found" });
      }

      let productInfo = null;

      if (
        paymentIntent.metadata?.productId &&
        paymentIntent.metadata?.priceId
      ) {
        productInfo = {
          productId: paymentIntent.metadata.productId,
          priceId: paymentIntent.metadata.priceId,
        };
        console.log("Got product info from metadata:", productInfo);
      }

      if (!productInfo) {
        productInfo = await getProductFromCheckoutSession(paymentIntent.id);
        if (productInfo) {
          console.log("Got product info from checkout session:", productInfo);
        }
      }

      if (!productInfo && paymentIntent.invoice) {
        productInfo = await getProductFromInvoice(paymentIntent);
        if (productInfo) {
          console.log("Got product info from invoice:", productInfo);
        }
      }

      if (!productInfo) {
        productInfo = await getProductFromCharge(paymentIntent);
        if (productInfo) {
          console.log("Got product info from charge:", productInfo);
        }
      }

      if (!productInfo) {
        console.error("No product information found");
        return response
          .status(400)
          .json({ error: "No product information found" });
      }

      await sendAssetEmail(email, productInfo.productId, productInfo.priceId);
    }
  } catch (error) {
    console.error(`Webhook handler failed: ${error.message}`);
    return response.status(500).json({ error: error.message });
  }

  return response.status(200).json({ received: true });
}
