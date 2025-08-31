import { NextResponse } from "next/server";
import { addEmailToContacts, sendFreeAssetPackEmail } from "@/lib/sendgrid";

export async function POST(request) {
  try {
    const { email } = await request.json();

    await addEmailToContacts(email);
    await sendFreeAssetPackEmail(email);

    return NextResponse.json({ received: true }, { status: 204 });
  } catch {
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
