import client from "@sendgrid/client";
import mail from "@sendgrid/mail";
import { PRODUCTS } from "@/data/shop";

const REFERENCE_LIBRARY_EMAIL_LIST = "a89a484e-85c1-484c-a989-bed809e4813e";

const EMAIL_DESIGNS = {
  "texturo-ultimo": "5a0960fc-5cf7-4dda-b1f3-8caf2ebc8458",
  "reference-library": "fdaa521a-bde4-4873-8ab5-1f765812cb4f",
  fonts: "c3659b29-b61a-4e29-824d-8650914f3b90",
  "big-arrows": "54d1afdf-68be-40b8-8a9d-344056e34217",
  "gummy-letters": "d8bd7397-2e7a-457c-a431-402b28d0716c",
  "krink-hits": "2819302c-66bf-482d-89ea-0837334a40b4",
  "crt-world": "191dc579-8ed5-490e-85f6-4009eb6853f3",
  "free-sample": "8802749b-2d5e-4f10-9847-025d1663a83e",
  "spray-hits": "d56e60f4-731a-4283-934c-7773a0c953d5",
  "master-bundle": "95d45036-4c78-4383-9d66-c222ff2036ea",
};

client.setApiKey(process.env.SENDGRID_API_KEY);
mail.setApiKey(process.env.SENDGRID_API_KEY);

async function getEmailDesign(id) {
  try {
    const request = {
      url: `/v3/designs/${id}`,
      method: "GET",
    };

    const [, body] = await client.request(request);

    return body;
  } catch (error) {
    console.error(error);
  }
}

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
    const email = await getEmailDesign(EMAIL_DESIGNS["free-sample"]);

    const message = {
      to,
      from: "support@mndlss.tv",
      subject: "MNDLSS - Your free asset pack awaits!",
      html: email.html_content,
    };

    await mail.send(message);
  } catch (error) {
    console.error(error);
  }
}

export async function sendAssetEmail(to, productId, priceId) {
  try {
    const product = PRODUCTS.find(
      ({ id, price_id }) => id === productId || priceId === price_id
    );

    const email = await getEmailDesign(EMAIL_DESIGNS[product.id]);

    const message = {
      to,
      from: "support@mndlss.tv",
      subject: `MNDLSS - ${email.subject}`,
      html: email.html_content,
    };

    await mail.send(message);

    if (product.id === "reference-library") {
      await addEmailToContacts(to, REFERENCE_LIBRARY_EMAIL_LIST);
    }
  } catch (error) {
    console.error(error);
  }
}

export default client;
