import client from "@sendgrid/client";
import mail from "@sendgrid/mail";
import { CDN_URL } from "@/lib/constants";

client.setApiKey(process.env.SENDGRID_API_KEY);
mail.setApiKey(process.env.SENDGRID_API_KEY);

export async function addEmailToContacts(email, list) {
  try {
    const data = {
      contacts: [
        {
          email,
        },
      ],
    };

    if (list) {
      data.list_ids = [list];
    }

    const request = {
      url: `/v3/marketing/contacts`,
      method: "PUT",
      body: data,
    };

    await client.request(request);
  } catch (error) {
    console.error(error);
  }
}

export async function sendFreeAssetPackEmail(to) {
  try {
    const message = {
      to,
      from: "wes@mndlss.tv",
      subject: "MNDLSS Free Asset Pack",
      html: `
        <div>
          <p>Thank you for signing up to MNDLSS.tv!</p>
          <p>
            <a href='${CDN_URL}/free.zip'>Click here to download your FREE asset pack</a>
          </p>
        </div>
      `,
    };

    await mail.send(message);
  } catch (error) {
    console.error(error);
  }
}

export default client;
