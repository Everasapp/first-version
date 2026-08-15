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

type EventForSearch = {
  title: string;
  municipality: string;
  location_name?: string | null;
  start_at: string;
};

const ROME_TZ = "Europe/Rome";

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

export function parseDashboardSearchQuery(
  value: string | string[] | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim();
}

/** YYYY-MM-DD from query, or empty if invalid. */
export function parseDashboardSearchDate(
  value: string | string[] | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = (raw ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return "";
  }
  return trimmed;
}

function eventStartDayRome(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function eventMatchesDashboardSearch(
  event: EventForSearch,
  query: string,
  date: string,
): boolean {
  if (query) {
    const haystack = [
      event.title,
      event.municipality,
      event.location_name ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(query.toLowerCase())) {
      return false;
    }
  }

  if (date) {
    if (eventStartDayRome(event.start_at) !== date) {
      return false;
    }
  }

  return true;
}

export function buildDashboardHref(options: {
  filtro?: DashboardFilter;
  cerca?: string;
  data?: string;
}) {
  const params = new URLSearchParams();
  if (options.filtro && options.filtro !== "pubblicati") {
    params.set("filtro", options.filtro);
  } else if (options.filtro === "pubblicati") {
    params.set("filtro", "pubblicati");
  }
  if (options.cerca?.trim()) {
    params.set("cerca", options.cerca.trim());
  }
  if (options.data) {
    params.set("data", options.data);
  }
  const qs = params.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}
