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

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function sendResendEmail({
  to,
  replyTo,
  subject,
  html,
}: {
  to: string;
  replyTo?: string;
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
      ...(replyTo ? { reply_to: replyTo } : {}),
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

  const link =
    typeof body === "object" && body && "link" in body
      ? String((body as { link: unknown }).link ?? "").trim()
      : "";
  const note =
    typeof body === "object" && body && "note" in body
      ? String((body as { note: unknown }).note ?? "").trim()
      : "";
  const email =
    typeof body === "object" && body && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim()
      : "";

  if (!link || !isValidHttpUrl(link)) {
    return NextResponse.json(
      { error: "Incolla un link valido (http o https)." },
      { status: 400 },
    );
  }

  if (email && (!email.includes("@") || email.length < 5)) {
    return NextResponse.json(
      { error: "Inserisci un'email valida oppure lasciala vuota." },
      { status: 400 },
    );
  }

  if (note.length > 2000) {
    return NextResponse.json(
      { error: "La nota è troppo lunga." },
      { status: 400 },
    );
  }

  const storedEmail = email || "segnalazione@everas.it";
  const storedMessage = [
    "SEGNALAZIONE EVENTO",
    `Link: ${link}`,
    note ? `Nota: ${note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const supabase = await createClient();
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({
        name: "Segnalazione evento",
        email: storedEmail,
        message: storedMessage,
      });

    if (insertError) {
      console.error("suggest-event insert failed:", insertError.message);
    }

    await sendResendEmail({
      to: CONTACT_TO_EMAIL,
      replyTo: email || undefined,
      subject: "Nuova segnalazione evento su EVERAS",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
          <p><strong>Nuova segnalazione evento</strong></p>
          <p><strong>Link:</strong> <a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>
          ${
            email
              ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`
              : "<p><strong>Email:</strong> non indicata</p>"
          }
          ${
            note
              ? `<p><strong>Nota:</strong></p><p style="white-space:pre-wrap;">${escapeHtml(note)}</p>`
              : ""
          }
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Suggest event send failed:", error);
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
