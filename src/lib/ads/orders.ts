import "server-only";

import { Resend } from "resend";

import { addCalendarMonths, LAUNCH_PROMO_LIMIT, LAUNCH_PROMO_USED_OFFSET } from "@/src/lib/ads/advertising-packages";
import {
  getOrderChargeAmount,
  type AdvertisingOrderRow,
} from "@/src/lib/ads/types";
import {
  ADMIN_NOTIFICATION_EMAIL,
  getEmailFromAddress,
  getSiteUrl,
} from "@/src/lib/notifications/config";
import { buildAdminEmailLayout } from "@/src/lib/notifications/email-layout";
import { escapeHtml, formatItalianDateTime } from "@/src/lib/notifications/format";
import { createAdminClient, tryCreateAdminClient } from "@/src/lib/supabase/admin";

export type { AdvertisingOrderRow };
export { getOrderChargeAmount };

function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    ADMIN_NOTIFICATION_EMAIL
  );
}

async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[advertising] RESEND_API_KEY non configurata");
    return { ok: false as const, error: "RESEND_API_KEY mancante" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getEmailFromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    console.error("[advertising] Invio email fallito:", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}

function placementLabel(placement: string) {
  return placement === "home" ? "Home" : "Pagine interne";
}

function durationLabel(months: number) {
  return `${months} ${months === 1 ? "mese" : "mesi"}`;
}

function priceLabel(price: number, currency = "EUR") {
  if (currency === "EUR") return `€${Number(price).toFixed(0)}`;
  return `${Number(price).toFixed(2)} ${currency}`;
}

function orderPayUrl(order: AdvertisingOrderRow) {
  return `${getSiteUrl()}/pubblicita/ordine/${order.access_token}`;
}

function adminOrderUrl(order: AdvertisingOrderRow) {
  return `${getSiteUrl()}/admin/pubblicita/${order.id}`;
}

function customerEmailLayout({
  title,
  intro,
  bodyHtml,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro?: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/images/everas-logo-v2.png`;
  const ctaHtml =
    ctaLabel && ctaHref
      ? `<p style="margin:28px 0 0;"><a href="${escapeHtml(ctaHref)}" style="display:inline-block;background:#E67E22;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px;">${escapeHtml(ctaLabel)}</a></p>`
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
                      <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;">EVERAS</div>
                      <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2;font-weight:800;">${escapeHtml(title)}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;color:#334155;font-size:15px;line-height:1.65;">
                      ${intro ? `<p style="margin:0 0 16px;">${escapeHtml(intro)}</p>` : ""}
                      ${bodyHtml}
                      ${ctaHtml}
                      <p style="margin:28px 0 0;color:#64748b;">Grazie,<br /><strong style="color:#075EAE;">EVERAS</strong></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendAdvertisingRequestReceivedEmail(
  order: AdvertisingOrderRow,
) {
  const html = customerEmailLayout({
    title: "Richiesta pubblicità ricevuta",
    intro: `Ciao ${order.contact_name},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">abbiamo ricevuto la tua richiesta di pubblicità su EVERAS.</p>
      <p style="margin:0 0 8px;"><strong>Pacchetto:</strong> ${escapeHtml(order.package_name)}</p>
      <p style="margin:0 0 8px;"><strong>Durata:</strong> ${escapeHtml(durationLabel(order.duration_months))}</p>
      <p style="margin:0 0 16px;"><strong>Importo:</strong> ${escapeHtml(priceLabel(getOrderChargeAmount(order), order.currency))}</p>
      <p style="margin:0;">Per completare l'ordine puoi procedere al pagamento tramite PayPal. Dopo il pagamento, il materiale verrà verificato prima della pubblicazione.</p>
    `,
    ctaLabel: "Paga con PayPal",
    ctaHref: orderPayUrl(order),
  });

  return sendResendEmail({
    to: order.email,
    subject: "EVERAS - Richiesta pubblicità ricevuta",
    html,
  });
}

export async function sendAdvertisingPaymentReceivedEmail(
  order: AdvertisingOrderRow,
) {
  const html = customerEmailLayout({
    title: "Pagamento ricevuto",
    intro: `Ciao ${order.contact_name},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">abbiamo ricevuto il tuo pagamento di ${escapeHtml(priceLabel(getOrderChargeAmount(order), order.currency))}.</p>
      <p style="margin:0 0 12px;">La tua richiesta pubblicitaria è ora in fase di verifica.</p>
      <p style="margin:0 0 8px;"><strong>Attività:</strong> ${escapeHtml(order.company_name)}</p>
      <p style="margin:0 0 8px;"><strong>Pacchetto:</strong> ${escapeHtml(order.package_name)}</p>
      <p style="margin:0 0 16px;"><strong>Durata:</strong> ${escapeHtml(durationLabel(order.duration_months))}</p>
      <p style="margin:0;">Il banner verrà pubblicato dopo la verifica e l'approvazione.</p>
    `,
  });

  return sendResendEmail({
    to: order.email,
    subject: "EVERAS - Pagamento ricevuto",
    html,
  });
}

export async function sendAdvertisingAdminReviewEmail(
  order: AdvertisingOrderRow,
) {
  const html = buildAdminEmailLayout({
    eyebrow: "Pubblicità",
    title: "Nuova pubblicità da verificare",
    intro: "Nuova richiesta pubblicitaria.",
    rows: [
      { label: "Azienda", value: order.company_name },
      { label: "Referente", value: order.contact_name },
      { label: "Email", value: order.email },
      { label: "Pacchetto", value: order.package_name },
      { label: "Importo", value: priceLabel(getOrderChargeAmount(order), order.currency) },
      { label: "Posizione", value: placementLabel(order.placement) },
      { label: "Sito", value: order.website_url },
      {
        label: "Banner",
        value:
          (order.banner_urls?.length
            ? order.banner_urls.join("\n")
            : order.banner_url) || "—",
      },
    ],
    ctaLabel: "Apri nell'admin",
    ctaHref: adminOrderUrl(order),
  });

  return sendResendEmail({
    to: getAdminEmail(),
    subject: "EVERAS - Nuova pubblicità da verificare",
    html,
  });
}

export async function sendAdvertisingApprovedEmail(order: AdvertisingOrderRow) {
  const period =
    order.start_date && order.expiration_date
      ? `${formatItalianDate(order.start_date)} - ${formatItalianDate(order.expiration_date)}`
      : "—";

  const html = customerEmailLayout({
    title: "Il tuo banner è online",
    intro: `Ciao ${order.contact_name},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">il tuo banner è stato approvato ed è ora online su EVERAS.</p>
      <p style="margin:0 0 8px;"><strong>Attività:</strong> ${escapeHtml(order.company_name)}</p>
      <p style="margin:0 0 8px;"><strong>Posizione:</strong> ${escapeHtml(placementLabel(order.placement))}</p>
      <p style="margin:0 0 16px;"><strong>Periodo:</strong> ${escapeHtml(period)}</p>
      <p style="margin:0;">Grazie per aver scelto EVERAS.</p>
    `,
  });

  return sendResendEmail({
    to: order.email,
    subject: "EVERAS - Il tuo banner è online",
    html,
  });
}

export async function sendAdvertisingNeedsChangesEmail(
  order: AdvertisingOrderRow,
  note: string,
) {
  const html = customerEmailLayout({
    title: "Sono necessarie modifiche al materiale",
    intro: `Ciao ${order.contact_name},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">abbiamo verificato la tua richiesta pubblicitaria e sono necessarie alcune modifiche.</p>
      <p style="margin:0 0 8px;"><strong>Attività:</strong> ${escapeHtml(order.company_name)}</p>
      <p style="margin:0 0 8px;"><strong>Pacchetto:</strong> ${escapeHtml(order.package_name)}</p>
      <p style="margin:16px 0 8px;"><strong>Nota:</strong></p>
      <p style="margin:0 0 16px;padding:12px 14px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">${escapeHtml(note)}</p>
      <p style="margin:0;">Puoi aggiornare il banner dalla pagina del tuo ordine. Non è richiesto un nuovo pagamento.</p>
    `,
    ctaLabel: "Aggiorna il materiale",
    ctaHref: orderPayUrl(order),
  });

  return sendResendEmail({
    to: order.email,
    subject: "EVERAS - Sono necessarie modifiche al materiale",
    html,
  });
}

export async function sendAdvertisingRejectedEmail(
  order: AdvertisingOrderRow,
  reason: string,
) {
  const html = customerEmailLayout({
    title: "Richiesta pubblicitaria non approvata",
    intro: `Ciao ${order.contact_name},`,
    bodyHtml: `
      <p style="margin:0 0 12px;">la tua richiesta pubblicitaria non è stata approvata.</p>
      <p style="margin:0 0 8px;"><strong>Attività:</strong> ${escapeHtml(order.company_name)}</p>
      <p style="margin:0 0 8px;"><strong>Pacchetto:</strong> ${escapeHtml(order.package_name)}</p>
      <p style="margin:16px 0 8px;"><strong>Motivazione:</strong></p>
      <p style="margin:0 0 16px;padding:12px 14px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">${escapeHtml(reason)}</p>
      <p style="margin:0;">Per ulteriori informazioni puoi rispondere a questa email o contattarci.</p>
    `,
  });

  return sendResendEmail({
    to: order.email,
    subject: "EVERAS - Richiesta pubblicitaria non approvata",
    html,
  });
}

function formatItalianDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}

export async function getOrderByAccessToken(token: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("advertising_orders")
    .select("*")
    .eq("access_token", token)
    .maybeSingle();

  if (error) throw error;
  return data as AdvertisingOrderRow | null;
}

export async function getOrderById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("advertising_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as AdvertisingOrderRow | null;
}

export async function getOrderByPayPalOrderId(paypalOrderId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("advertising_orders")
    .select("*")
    .eq("paypal_order_id", paypalOrderId)
    .maybeSingle();

  if (error) throw error;
  return data as AdvertisingOrderRow | null;
}

/**
 * Conferma pagamento solo dopo verifica PayPal (capture COMPLETED).
 * Idempotente: se già paid/awaiting_approval/active non reinvia email.
 */
export async function markOrderPaidFromPayPal({
  order,
  paypalOrderId,
  paypalCaptureId,
}: {
  order: AdvertisingOrderRow;
  paypalOrderId: string;
  paypalCaptureId: string;
}): Promise<AdvertisingOrderRow> {
  const alreadyProcessed = [
    "paid",
    "awaiting_approval",
    "needs_changes",
    "approved",
    "active",
  ].includes(order.status);

  if (alreadyProcessed) {
    return order;
  }

  if (order.status !== "awaiting_payment") {
    throw new Error(
      `Ordine in stato non pagabile: ${order.status}`,
    );
  }

  const supabase = createAdminClient();
  const paidAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "awaiting_approval",
      paypal_order_id: paypalOrderId,
      paypal_capture_id: paypalCaptureId,
      paid_at: paidAt,
    })
    .eq("id", order.id)
    .eq("status", "awaiting_payment")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    // Race: already updated
    const refreshed = await getOrderById(order.id);
    if (!refreshed) throw new Error("Ordine non trovato dopo il pagamento.");
    return refreshed;
  }

  const updated = data as AdvertisingOrderRow;

  await sendAdvertisingPaymentReceivedEmail(updated);
  await sendAdvertisingAdminReviewEmail(updated);

  return updated;
}

/**
 * Conferma pagamento manuale (es. dopo verifica ricevuta PayPal NCP).
 * Usare solo dall'admin dopo aver controllato il pagamento.
 */
export async function markOrderPaidManually(
  order: AdvertisingOrderRow,
  note?: string,
): Promise<AdvertisingOrderRow> {
  if (order.status !== "awaiting_payment") {
    throw new Error(
      `Impossibile segnare come pagato un ordine in stato ${order.status}.`,
    );
  }

  const supabase = createAdminClient();
  const paidAt = new Date().toISOString();
  const adminNotes = [order.admin_notes, note].filter(Boolean).join("\n") || null;

  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "awaiting_approval",
      paid_at: paidAt,
      admin_notes: adminNotes,
    })
    .eq("id", order.id)
    .eq("status", "awaiting_payment")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const refreshed = await getOrderById(order.id);
    if (!refreshed) throw new Error("Ordine non trovato.");
    return refreshed;
  }

  const updated = data as AdvertisingOrderRow;
  await sendAdvertisingPaymentReceivedEmail(updated);
  await sendAdvertisingAdminReviewEmail(updated);
  return updated;
}

export async function approveAdvertisingOrder(order: AdvertisingOrderRow) {
  if (!["awaiting_approval", "needs_changes", "paid"].includes(order.status)) {
    throw new Error(`Impossibile approvare un ordine in stato ${order.status}.`);
  }

  const start = new Date();
  const expiration = addCalendarMonths(start, order.duration_months);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "active",
      start_date: start.toISOString(),
      expiration_date: expiration.toISOString(),
      approved_at: start.toISOString(),
      rejection_reason: null,
    })
    .eq("id", order.id)
    .select("*")
    .single();

  if (error) throw error;

  const updated = data as AdvertisingOrderRow;
  await sendAdvertisingApprovedEmail(updated);
  return updated;
}

export async function requestAdvertisingChanges(
  order: AdvertisingOrderRow,
  note: string,
) {
  if (!["awaiting_approval", "paid", "needs_changes"].includes(order.status)) {
    throw new Error(
      `Impossibile richiedere modifiche per lo stato ${order.status}.`,
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "needs_changes",
      admin_notes: note,
    })
    .eq("id", order.id)
    .select("*")
    .single();

  if (error) throw error;

  const updated = data as AdvertisingOrderRow;
  await sendAdvertisingNeedsChangesEmail(updated, note);
  return updated;
}

export async function rejectAdvertisingOrder(
  order: AdvertisingOrderRow,
  reason: string,
) {
  if (
    !["awaiting_approval", "paid", "needs_changes", "active"].includes(
      order.status,
    )
  ) {
    throw new Error(`Impossibile rifiutare un ordine in stato ${order.status}.`);
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "rejected",
      rejection_reason: reason,
      rejected_at: now,
      admin_notes: reason,
    })
    .eq("id", order.id)
    .select("*")
    .single();

  if (error) throw error;

  const updated = data as AdvertisingOrderRow;
  await sendAdvertisingRejectedEmail(updated, reason);
  return updated;
}

export async function expireAdvertisingOrders(now = new Date()) {
  const supabase = createAdminClient();
  const iso = now.toISOString();

  const { data, error } = await supabase
    .from("advertising_orders")
    .update({
      status: "expired",
      expired_at: iso,
    })
    .eq("status", "active")
    .lt("expiration_date", iso)
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}

export async function getActiveHomeBanners(now = new Date()) {
  const supabase = tryCreateAdminClient();
  if (!supabase) return [];

  const iso = now.toISOString();

  const { data, error } = await supabase
    .from("advertising_orders")
    .select(
      "id, company_name, website_url, banner_url, banner_urls, expiration_date, start_date",
    )
    .eq("status", "active")
    .eq("placement", "home")
    .gt("expiration_date", iso)
    .order("approved_at", { ascending: false });

  if (error) {
    console.error("[advertising] getActiveHomeBanners:", error);
    return [];
  }

  return (data ?? []).filter((row) => {
    const urls = Array.isArray(row.banner_urls) ? row.banner_urls : [];
    return (
      urls.some((url) => typeof url === "string" && url.length > 0) ||
      (typeof row.banner_url === "string" && row.banner_url.length > 0)
    );
  });
}

export type LaunchPromoState = {
  limit: number;
  used: number;
  remaining: number;
  active: boolean;
};

/**
 * Conta i clienti che hanno effettivamente pagato con prezzo promozionale.
 * Non include draft, awaiting_payment, cancelled, né ordini non pagati.
 *
 * Parte da LAUNCH_PROMO_USED_OFFSET (2/10): le promozioni disponibili
 * vanno dalla 3ª alla 10ª; a 10 slot usati la promo si chiude.
 */
export async function getLaunchPromoState(): Promise<LaunchPromoState> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    const used = LAUNCH_PROMO_USED_OFFSET;
    return {
      limit: LAUNCH_PROMO_LIMIT,
      used,
      remaining: Math.max(0, LAUNCH_PROMO_LIMIT - used),
      active: used < LAUNCH_PROMO_LIMIT,
    };
  }

  const { count, error } = await supabase
    .from("advertising_orders")
    .select("id", { count: "exact", head: true })
    .eq("promo_applied", true)
    .not("paid_at", "is", null)
    .neq("status", "cancelled");

  if (error) {
    console.error("[advertising] getLaunchPromoState:", error);
    // Fail-safe: non esporre promo se non possiamo contare
    return {
      limit: LAUNCH_PROMO_LIMIT,
      used: LAUNCH_PROMO_LIMIT,
      remaining: 0,
      active: false,
    };
  }

  const used = Math.min(
    LAUNCH_PROMO_LIMIT,
    LAUNCH_PROMO_USED_OFFSET + (count ?? 0),
  );
  const remaining = Math.max(0, LAUNCH_PROMO_LIMIT - used);
  return {
    limit: LAUNCH_PROMO_LIMIT,
    used,
    remaining,
    active: used < LAUNCH_PROMO_LIMIT,
  };
}

export { formatItalianDateTime };
