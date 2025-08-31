import { addEmailToContacts, sendFreeAssetPackEmail } from "@/lib/sendgrid";

export default async function handler(request, response) {
  try {
    const { email } = request.body;

    await addEmailToContacts(email);

    await sendFreeAssetPackEmail(email);

    return response.status(204).end();
  } catch (error) {
    return response
      .status(500)
      .send(error.message || "Sorry, something went wrong");
  }
}
