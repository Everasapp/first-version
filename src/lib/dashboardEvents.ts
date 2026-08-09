export type DashboardFilter = "pubblicati" | "bozze" | "scaduti";

export type DashboardEventStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

type EventForBucket = {
  status: DashboardEventStatus;
  start_at: string;
  end_at?: string | null;
};

export function isEventExpired(event: EventForBucket, now = Date.now()) {
  const reference = new Date(event.end_at ?? event.start_at).getTime();
  return Number.isFinite(reference) && reference < now;
}

export function getEventBucket(
  event: EventForBucket,
  now = Date.now(),
): DashboardFilter {
  if (event.status === "published" && isEventExpired(event, now)) {
    return "scaduti";
  }

  if (event.status === "published") {
    return "pubblicati";
  }

  return "bozze";
}

export function parseDashboardFilter(
  value: string | string[] | undefined,
): DashboardFilter {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === "bozze" || raw === "scaduti" || raw === "pubblicati") {
    return raw;
  }

  return "pubblicati";
}
