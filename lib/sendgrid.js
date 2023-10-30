import client from "@sendgrid/client";
import mail from "@sendgrid/mail";
import { PRODUCTS } from "@/data/shop";
import { CDN_URL } from "@/lib/constants";

const REFERENCE_LIBRARY_EMAIL_LIST = "a89a484e-85c1-484c-a989-bed809e4813e";

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

export async function sendAssetEmail(to, productId, priceId) {
  try {
    const product = PRODUCTS.find(
      ({ id, price_id }) => id === productId || priceId === price_id
    );

    const downloadUrl =
      product.id === "master-bundle"
        ? `${CDN_URL}/assets/master-bundle.zip`
        : `${CDN_URL}/assets/${product.id}.rar`;

    const message = {
      to,
      from: "wes@mndlss.tv",
      subject: `MNDLSS - ${product.title} Download`,
      html: `
        <div>
          <p>Thank you for purchasing ${product.title} from MNDLSS.tv!</p>
          <p>
            <a href='${downloadUrl}'>Click here to download ${product.title}</a>
          </p>
        </div>
      `,
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
