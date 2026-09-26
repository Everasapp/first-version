import "server-only";

import { tryCreateAdminClient } from "@/src/lib/supabase/admin";

export type AdvertisingTrackEvent = "impression" | "click";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isAdvertisingOrderId(value: string) {
  return UUID_RE.test(value);
}

export async function trackAdvertisingBannerEvent({
  orderId,
  event,
}: {
  orderId: string;
  event: AdvertisingTrackEvent;
}) {
  if (!isAdvertisingOrderId(orderId)) {
    return { ok: false as const, error: "Ordine non valido." };
  }
  if (event !== "impression" && event !== "click") {
    return { ok: false as const, error: "Evento non valido." };
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return { ok: false as const, error: "Servizio non disponibile." };
  }

  const { error } = await supabase.rpc("increment_advertising_banner_stat", {
    p_order_id: orderId,
    p_event: event,
  });

  if (error) {
    console.error("[advertising] track event:", error);
    return { ok: false as const, error: "Registrazione non riuscita." };
  }

  return { ok: true as const };
}

export type AdvertisingDailyStat = {
  day: string;
  impressions: number;
  clicks: number;
};

export async function getAdvertisingDailyStats(
  orderId: string,
  days = 14,
): Promise<AdvertisingDailyStat[]> {
  const supabase = tryCreateAdminClient();
  if (!supabase || !isAdvertisingOrderId(orderId)) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - Math.max(1, days - 1));
  const sinceKey = since.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("advertising_banner_stats_daily")
    .select("day, impressions, clicks")
    .eq("order_id", orderId)
    .gte("day", sinceKey)
    .order("day", { ascending: true });

  if (error) {
    console.error("[advertising] daily stats:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    day: String(row.day),
    impressions: Number(row.impressions ?? 0),
    clicks: Number(row.clicks ?? 0),
  }));
}

export function formatCtr(impressions: number, clicks: number) {
  if (impressions <= 0) return "—";
  return `${((clicks / impressions) * 100).toFixed(1)}%`;
}
