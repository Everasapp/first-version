const ROME_TZ = "Europe/Rome";

export function formatStoryDate(startAt: string) {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
  }).format(date);
}

export function formatStoryTime(startAt: string) {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";

  const time = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ROME_TZ,
  }).format(date);

  return time === "00:00" ? "" : time;
}

export function buildEventShareUrl(slug: string, origin?: string) {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "https://www.everas.it");
  return `${base.replace(/\/$/, "")}/eventi/${slug}`;
}
