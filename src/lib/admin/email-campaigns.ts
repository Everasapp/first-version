import { getSiteUrl } from "@/src/lib/notifications/config";
import { escapeHtml } from "@/src/lib/notifications/format";

export const CAMPAIGN_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || "EVERAS <info@everas.it>";

export const CAMPAIGN_REPLY_TO = "info@everas.it";

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function parseEmailList(raw: string): string[] {
  const parts = raw
    .split(/[\n,;]+/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const unique = new Set<string>();
  for (const part of parts) {
    if (EMAIL_RE.test(part)) {
      unique.add(part);
    }
  }

  return Array.from(unique).sort((a, b) => a.localeCompare(b, "it"));
}

export function isValidCampaignEmail(email: string) {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

export function buildCampaignHtml(subject: string, message: string) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/images/everas-logo-v2.png`;
  const bodyHtml = escapeHtml(message).replaceAll("\n", "<br />");

  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 18px;">
                <img src="${logoUrl}" alt="EVERAS" width="140" style="display:block;height:auto;max-width:140px;" />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;padding:28px;">
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:800;">
                  ${escapeHtml(subject)}
                </h1>
                <div style="color:#334155;font-size:15px;line-height:1.65;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.5;">
                EVERAS · Eventi in Sardegna<br />
                <a href="${escapeHtml(siteUrl)}" style="color:#075EAE;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>
                · <a href="mailto:info@everas.it" style="color:#075EAE;text-decoration:none;">info@everas.it</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendCampaignEmailViaResend({
  to,
  subject,
  html,
  from,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from: string;
  replyTo: string;
}) {
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
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    error?: { message?: string };
  };

  if (!response.ok) {
    const message =
      body.error?.message ||
      body.message ||
      `Resend error ${response.status}`;
    throw new Error(message);
  }

  return { id: body.id ?? null };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type EmailCampaignRow = {
  id: string;
  subject: string;
  body_text: string;
  body_html: string;
  from_email: string;
  reply_to: string;
  status: "draft" | "sending" | "sent" | "partial" | "failed";
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
};

export type EmailCampaignRecipientRow = {
  id: string;
  campaign_id: string;
  email: string;
  status: "pending" | "sent" | "failed";
  error: string | null;
  resend_id: string | null;
  sent_at: string | null;
  created_at: string;
};

export function campaignStatusLabel(status: EmailCampaignRow["status"]) {
  switch (status) {
    case "draft":
      return "Bozza";
    case "sending":
      return "Invio in corso";
    case "sent":
      return "Inviata";
    case "partial":
      return "Parziale";
    case "failed":
      return "Fallita";
    default:
      return status;
  }
}
