import {
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
} from "@/src/lib/admin/email-campaigns";
import { getSiteUrl } from "@/src/lib/notifications/config";
import { escapeHtml } from "@/src/lib/notifications/format";
import { tryCreateAdminClient } from "@/src/lib/supabase/admin";

const lastSentAt = new Map<string, number>();
const SEND_COOLDOWN_MS = 60_000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildConfirmUrl(tokenHash: string, type: string) {
  const site = getSiteUrl();
  const params = new URLSearchParams({
    token_hash: tokenHash,
    type,
    next: "/dashboard",
  });
  return `${site}/conferma-email?${params.toString()}`;
}

function buildConfirmationHtml(confirmUrl: string) {
  const site = getSiteUrl();
  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;padding:32px 28px;border:1px solid #e2e8f0;">
            <tr>
              <td>
                <p style="margin:0;color:#075EAE;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">EVERAS</p>
                <h1 style="margin:12px 0 16px;color:#0f172a;font-size:24px;line-height:1.3;">Conferma la tua email</h1>
                <p style="margin:0 0 18px;color:#334155;font-size:15px;line-height:1.65;">
                  Grazie per esserti registrato. Tocca il pulsante per attivare l’account.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:#E67E22;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:12px;">
                    Conferma email
                  </a>
                </p>
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
                  Se non hai creato tu questo account, ignora il messaggio.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">
            EVERAS · Eventi in Sardegna<br />
            <a href="${escapeHtml(site)}" style="color:#075EAE;text-decoration:none;">${escapeHtml(site.replace(/^https?:\/\//, ""))}</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendViaResend(to: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CAMPAIGN_FROM_EMAIL,
      to: [to],
      reply_to: CAMPAIGN_REPLY_TO,
      subject: "Conferma la tua email su EVERAS",
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
}

/** Invia la conferma da mail.everas.it (Resend), non dal SMTP di default di Supabase. */
export async function sendSignupConfirmationEmail(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    return { ok: true as const };
  }

  const lastSent = lastSentAt.get(email);
  if (lastSent && Date.now() - lastSent < SEND_COOLDOWN_MS) {
    return { ok: true as const };
  }

  const admin = tryCreateAdminClient();
  if (!admin) {
    console.error("[auth] Manca SUPABASE_SERVICE_ROLE_KEY: conferma via Resend saltata.");
    return { ok: false as const };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
    },
  });

  if (error || !data) {
    return { ok: true as const };
  }

  const user = data.user as { email_confirmed_at?: string | null } | undefined;
  if (user?.email_confirmed_at) {
    return { ok: true as const };
  }

  const properties = data.properties as
    | {
        hashed_token?: string;
        verification_type?: string;
      }
    | undefined;
  const tokenHash = properties?.hashed_token;
  const type = properties?.verification_type || "magiclink";

  if (!tokenHash) {
    console.error("[auth] generateLink senza hashed_token");
    return { ok: false as const };
  }

  await sendViaResend(email, buildConfirmationHtml(buildConfirmUrl(tokenHash, type)));
  lastSentAt.set(email, Date.now());
  return { ok: true as const };
}
