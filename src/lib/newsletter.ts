import { categories } from "@/src/data/categories";
import { escapeHtml } from "@/src/lib/notifications/format";
import { formatEventDateRange } from "@/src/lib/formatEventDate";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import type { GeoArea } from "@/src/lib/geo-area";
import { areaExplorePath } from "@/src/lib/geo-area";

export type NewsletterEvent = {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at?: string | null;
  category: string;
  categories?: string[] | null;
  is_free: boolean;
  price_from: number | string | null;
  image_url?: string | null;
  is_featured?: boolean;
};

export function getCategoryLabel(slug: string | null | undefined) {
  if (!slug) return "Tutte le categorie";
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function formatNewsletterEventDate(startAt: string, endAt?: string | null) {
  return formatEventDateRange(startAt, endAt, { includeWeekday: true });
}

export function formatWeekRangeLabel(start: Date, endExclusive: Date) {
  const lastDay = new Date(endExclusive.getTime() - 60 * 60 * 1000);
  const startLabel = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Rome",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Rome",
  }).format(lastDay);
  return `${startLabel} – ${endLabel}`;
}

function eventPriceLabel(event: NewsletterEvent) {
  const pricing = resolveEventPricing(event.is_free, event.price_from);
  if (pricing.isFree) return "Gratuito";
  if (pricing.priceFrom != null) {
    return `Da ${new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(pricing.priceFrom)}`;
  }
  return "A pagamento";
}

function eventCardHtml(event: NewsletterEvent, siteUrl: string) {
  const href = `${siteUrl}/eventi/${encodeURIComponent(event.slug)}`;
  const image = event.image_url || `${siteUrl}/images/concert.webp`;
  const place = event.location_name || event.municipality;
  const category = resolveCategoryLabels(event)[0] ?? "Evento";
  const price = eventPriceLabel(event);

  return `
    <tr>
      <td style="padding:0 0 22px;">
        <a href="${escapeHtml(href)}" style="display:block;text-decoration:none;color:#0f172a;">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(event.title)}" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:16px;object-fit:cover;" />
          <div style="padding:14px 2px 0;">
            <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#075EAE;font-weight:700;">
              ${escapeHtml(event.municipality)} · ${escapeHtml(category)}
            </div>
            <div style="margin-top:6px;font-size:18px;line-height:1.3;font-weight:800;">
              ${escapeHtml(event.title)}
            </div>
            <div style="margin-top:6px;color:#475569;font-size:14px;line-height:1.5;">
              ${escapeHtml(formatNewsletterEventDate(event.start_at, event.end_at))}
              · ${escapeHtml(place)}
              · ${escapeHtml(price)}
            </div>
          </div>
        </a>
      </td>
    </tr>
  `;
}

export function buildNewsletterHtml({
  fullName,
  city,
  area,
  category,
  weekLabel,
  nearbyEvents,
  areaEvents,
  siteUrl,
  unsubToken,
}: {
  fullName: string | null;
  city: string | null;
  area: GeoArea | null;
  category: string | null;
  weekLabel: string;
  nearbyEvents: NewsletterEvent[];
  areaEvents: NewsletterEvent[];
  siteUrl: string;
  unsubToken: string;
}) {
  const greeting = fullName?.trim().split(/\s+/)[0] || "ciao";
  const logoUrl = `${siteUrl}/images/everas-logo-v2.png`;
  const exploreHref = `${siteUrl}${areaExplorePath(area)}`;
  const areaLabel = area || "Sardegna";
  const categoryLabel = category ? getCategoryLabel(category) : null;
  const introPlace = city
    ? `vicino a ${city}${area ? ` e nel ${area}` : ""}`
    : area
      ? `nel ${area}`
      : "in Sardegna";

  const nearbyHtml = nearbyEvents.map((event) => eventCardHtml(event, siteUrl)).join("");
  const areaHtml = areaEvents.map((event) => eventCardHtml(event, siteUrl)).join("");
  const hasEvents = nearbyEvents.length + areaEvents.length > 0;

  return `<!DOCTYPE html>
<html lang="it">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 18px;">
                <img src="${escapeHtml(logoUrl)}" alt="EVERAS" width="140" style="display:block;height:auto;max-width:140px;" />
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:28px 28px 12px;background:#075EAE;color:#ffffff;">
                      <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;">
                        Newsletter settimanale · ${escapeHtml(weekLabel)}
                      </div>
                      <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;font-weight:800;">
                        Cosa fare questa settimana
                      </h1>
                      <p style="margin:10px 0 0;font-size:15px;line-height:1.5;opacity:0.92;">
                        ${escapeHtml(areaLabel)}${categoryLabel ? ` · ${escapeHtml(categoryLabel)}` : ""}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <p style="margin:0 0 8px;color:#0f172a;font-size:16px;">
                        Ciao ${escapeHtml(greeting)},
                      </p>
                      <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                        Ecco gli eventi in programma ${escapeHtml(introPlace)} dal ${escapeHtml(weekLabel)}.
                      </p>
                      ${
                        hasEvents
                          ? `
                        ${
                          nearbyEvents.length
                            ? `<p style="margin:0 0 14px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#E67E22;font-weight:800;">Vicino a te${city ? ` · ${escapeHtml(city)}` : ""}</p>
                               <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${nearbyHtml}</table>`
                            : ""
                        }
                        ${
                          areaEvents.length
                            ? `<p style="margin:${nearbyEvents.length ? "8px" : "0"} 0 14px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#075EAE;font-weight:800;">${escapeHtml(area ? `Nel ${area}` : "In Sardegna")}</p>
                               <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${areaHtml}</table>`
                            : ""
                        }
                      `
                          : `<p style="margin:0;color:#64748b;font-size:15px;">Questa settimana non abbiamo trovato eventi per la tua zona. Intanto puoi esplorare tutta la Sardegna su EVERAS.</p>`
                      }
                      <p style="margin:12px 0 0;">
                        <a href="${escapeHtml(exploreHref)}" style="display:inline-block;background:#E67E22;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px;">
                          Vedi tutti gli eventi
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 12px 0;text-align:center;color:#94a3b8;font-size:12px;line-height:1.6;">
                Ricevi questa email perché ti sei iscritto alla newsletter settimanale EVERAS.<br />
                <a href="${escapeHtml(siteUrl)}/newsletter/disiscriviti?token=${encodeURIComponent(unsubToken)}" style="color:#075EAE;text-decoration:none;">
                  Disiscriviti
                </a>
                ·
                <a href="${escapeHtml(siteUrl)}/dashboard/newsletter" style="color:#075EAE;text-decoration:none;">
                  Gestisci preferenze
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
