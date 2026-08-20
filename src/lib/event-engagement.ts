export type EventEngagementCounts = {
  likesCount: number;
  viewsCount: number;
  sharesCount: number;
};

export function engagementFromRow(row: {
  favorites_count?: number | null;
  views_count?: number | null;
  shares_count?: number | null;
}): EventEngagementCounts {
  return {
    likesCount: Number(row.favorites_count ?? 0),
    viewsCount: Number(row.views_count ?? 0),
    sharesCount: Number(row.shares_count ?? 0),
  };
}

export function formatEngagementCount(value: number) {
  return new Intl.NumberFormat("it-IT").format(value);
}

/** Conta un inoltro anche se l’utente lascia subito il sito (WhatsApp, Instagram). */
export function incrementEventShares(eventId: string) {
  if (!eventId) return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;

  try {
    void fetch(`${url}/rest/v1/rpc/increment_event_shares`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ event_id: eventId }),
      keepalive: true,
    });
  } catch {
    // Non bloccare la condivisione se il conteggio fallisce.
  }
}
