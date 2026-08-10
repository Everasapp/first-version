import { categories } from "@/src/data/categories";

export type NewsletterEvent = {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  location_name: string | null;
  start_at: string;
  category: string;
  is_free: boolean;
  price_from: number | string | null;
};

export function getCategoryLabel(slug: string | null | undefined) {
  if (!slug) return "Tutte le categorie";
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function formatNewsletterEventDate(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

export function buildNewsletterHtml({
  fullName,
  city,
  category,
  events,
  siteUrl,
  unsubToken,
}: {
  fullName: string | null;
  city: string | null;
  category: string | null;
  events: NewsletterEvent[];
  siteUrl: string;
  unsubToken: string;
}) {
  const greeting = fullName?.trim().split(/\s+/)[0] || "ciao";
  const preferenceLine = [
    city ? `a ${city}` : null,
    category ? `categoria ${getCategoryLabel(category)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const eventRows = events
    .map((event) => {
      const price = event.is_free
        ? "Gratuito"
        : event.price_from != null && Number.isFinite(Number(event.price_from))
          ? `Da ${new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
            }).format(Number(event.price_from))}`
          : "A pagamento";

      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #e2e8f0;">
            <a href="${siteUrl}/eventi/${event.slug}" style="color:#0f172a;text-decoration:none;font-size:18px;font-weight:700;">
              ${escapeHtml(event.title)}
            </a>
            <div style="margin-top:6px;color:#475569;font-size:14px;">
              ${escapeHtml(formatNewsletterEventDate(event.start_at))}
              · ${escapeHtml(event.location_name || event.municipality)}
              · ${escapeHtml(price)}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="padding:28px 28px 8px;background:#075EAE;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;">EVERAS</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">La tua settimana di eventi</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 12px;color:#0f172a;font-size:16px;">
                  Ciao ${escapeHtml(greeting)},
                </p>
                <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                  Ecco gli eventi in programma nei prossimi 7 giorni
                  ${preferenceLine ? ` (${escapeHtml(preferenceLine)})` : ""}.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${eventRows || `<tr><td style="color:#64748b;font-size:15px;">Nessun evento trovato per le tue preferenze questa settimana.</td></tr>`}
                </table>
                <p style="margin:28px 0 0;">
                  <a href="${siteUrl}/eventi" style="display:inline-block;background:#E67E22;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px;">
                    Esplora tutti gli eventi
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 28px;color:#94a3b8;font-size:12px;line-height:1.5;">
                Ricevi questa email perché ti sei iscritto alla newsletter settimanale Everas.
                <a href="${siteUrl}/newsletter/disiscriviti?token=${encodeURIComponent(unsubToken)}" style="color:#075EAE;">
                  Disiscriviti
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
