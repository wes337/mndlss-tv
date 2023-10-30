import Stripe from "stripe";
import { sendAssetEmail } from "@/lib/sendgrid";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

async function getCustomerEmail(id) {
  const customer = await stripe.customers.retrieve(id);
  return customer.email || null;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).end();
  }

  const buf = await buffer(request);
  const sig = request.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const email =
        typeof paymentIntent.customer === "string"
          ? await getCustomerEmail(paymentIntent.customer)
          : paymentIntent.customer.email;

      const productId = paymentIntent.metadata?.product;
      const priceId = paymentIntent.priceId;

      await sendAssetEmail(email, productId, priceId);
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }

  return response.status(200).json({ received: true });
}
