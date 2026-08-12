import { escapeHtml } from "@/src/lib/notifications/format";
import { getSiteUrl } from "@/src/lib/notifications/config";

type AdminEmailLayoutInput = {
  eyebrow?: string;
  title: string;
  intro?: string;
  rows: Array<{ label: string; value: string }>;
  ctaLabel?: string;
  ctaHref?: string;
};

export function buildAdminEmailLayout({
  eyebrow = "Notifica amministratore",
  title,
  intro,
  rows,
  ctaLabel,
  ctaHref,
}: AdminEmailLayoutInput) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/images/everas-logo-v2.png`;

  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">
              ${escapeHtml(row.label)}
            </div>
            <div style="margin-top:4px;font-size:16px;color:#0f172a;font-weight:600;line-height:1.4;">
              ${escapeHtml(row.value)}
            </div>
          </td>
        </tr>`,
    )
    .join("");

  const ctaHtml =
    ctaLabel && ctaHref
      ? `
        <p style="margin:28px 0 0;">
          <a href="${escapeHtml(ctaHref)}" style="display:inline-block;background:#E67E22;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px;">
            ${escapeHtml(ctaLabel)}
          </a>
        </p>`
      : "";

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
              <td style="background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:28px 28px 10px;background:#075EAE;color:#ffffff;">
                      <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;">
                        ${escapeHtml(eyebrow)}
                      </div>
                      <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;font-weight:800;">
                        ${escapeHtml(title)}
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      ${
                        intro
                          ? `<p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>`
                          : ""
                      }
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${rowsHtml}
                      </table>
                      ${ctaHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 12px 0;color:#64748b;font-size:13px;line-height:1.6;">
                <strong style="color:#075EAE;">EVERAS</strong><br />
                La piattaforma degli eventi della Sardegna
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
