import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendAssetEmail } from "@/lib/sendgrid";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

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

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Get customer email
      const email =
        typeof paymentIntent.customer === "string"
          ? await getCustomerEmail(paymentIntent.customer)
          : paymentIntent.customer?.email;

      if (!email) {
        console.error("No email found for customer");
        return NextResponse.json(
          { error: "No customer email found" },
          { status: 400 }
        );
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
      }

      if (!productInfo) {
        productInfo = await getProductFromCheckoutSession(paymentIntent.id);
      }

      if (!productInfo && paymentIntent.invoice) {
        productInfo = await getProductFromInvoice(paymentIntent);
      }

      if (!productInfo) {
        productInfo = await getProductFromCharge(paymentIntent);
      }

      if (!productInfo) {
        console.error("No product information found");
        return NextResponse.json(
          { error: "No product information found" },
          { status: 400 }
        );
      }

      await sendAssetEmail(email, productInfo.productId, productInfo.priceId);
    }
  } catch (error) {
    console.error(`Webhook handler failed: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
