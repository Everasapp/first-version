import { NextResponse } from "next/server";

import { sendSignupConfirmationEmail } from "@/src/lib/auth/send-confirmation-email";

export const runtime = "nodejs";

const GENERIC_MESSAGE =
  "Se l’account esiste, ti abbiamo inviato un’email da EVERAS. Controlla anche Spam e Promozioni.";

export async function POST(request: Request) {
  let email = "";

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email : "";
  } catch {
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }

  try {
    await sendSignupConfirmationEmail(email);
  } catch (error) {
    console.error("[auth] Invio conferma fallito:", error);
  }

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
