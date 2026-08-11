import { NextResponse } from "next/server";

import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL?.trim() || "m.canalis@live.it";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendResendEmail({
  to,
  replyTo,
  subject,
  html,
}: {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ||
    process.env.NEWSLETTER_FROM_EMAIL ||
    "EVERAS <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 },
    );
  }

  const name =
    typeof body === "object" && body && "name" in body
      ? String((body as { name: unknown }).name ?? "").trim()
      : "";
  const email =
    typeof body === "object" && body && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim()
      : "";
  const message =
    typeof body === "object" && body && "message" in body
      ? String((body as { message: unknown }).message ?? "").trim()
      : "";

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Inserisci il tuo nome." },
      { status: 400 },
    );
  }

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json(
      { error: "Inserisci un'email valida." },
      { status: 400 },
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Il messaggio deve avere almeno 10 caratteri." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        message,
      });

    if (insertError) {
      console.error("contact_messages insert failed:", insertError.message);
    }

    await sendResendEmail({
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Contatto EVERAS da ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
          <p><strong>Nuovo messaggio dal form Contatti</strong></p>
          <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Messaggio:</strong></p>
          <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invio non riuscito. Riprova tra poco.",
      },
      { status: 500 },
    );
  }
}
