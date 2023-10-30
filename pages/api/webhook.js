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
    }
  } catch (error) {
    return response.status(500).send(error.message);
  }

  return response.status(200).json({ received: true });
}
