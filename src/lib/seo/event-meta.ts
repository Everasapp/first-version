import { isPublicEventExpired } from "@/src/lib/eventActive";
import { stripHtml } from "@/src/lib/sanitizeHtml";

const ROME_TZ = "Europe/Rome";

export function italianPlacePreposition(place: string) {
  const first = place.trim().charAt(0);
  return /^[aeiouàèéìíîòóùú]/i.test(first) ? "ad" : "a";
}

export function formatSeoEventDay(startAt: string) {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return "";

  const yearFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
  });
  const includeYear = yearFmt.format(start) !== yearFmt.format(new Date());

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: includeYear ? "numeric" : undefined,
    timeZone: ROME_TZ,
  }).format(start);
}

function mentionsCity(title: string, city: string) {
  return title.toLocaleLowerCase("it").includes(city.toLocaleLowerCase("it"));
}

/** Title for SERP: "Nome evento a Cagliari · 12 settembre". */
export function eventSeoTitle(
  title: string,
  municipality: string,
  startAt: string,
) {
  const name = title.trim();
  const city = municipality.trim();
  const day = formatSeoEventDay(startAt);
  const withPlace =
    city && !mentionsCity(name, city)
      ? `${name} ${italianPlacePreposition(city)} ${city}`
      : name;

  if (day && !withPlace.toLocaleLowerCase("it").includes(day.toLocaleLowerCase("it"))) {
    return `${withPlace} · ${day}`;
  }
  return withPlace;
}

export function eventSeoDescription(
  title: string,
  municipality: string,
  startAt: string,
  description: string | null,
) {
  const city = municipality.trim();
  const day = formatSeoEventDay(startAt);
  const place = city
    ? `${italianPlacePreposition(city)} ${city}`
    : "in Sardegna";
  const when = day ? ` il ${day}` : "";
  const lead = `Scopri ${title.trim()} ${place}${when} su EVERAS.`;
  const body = stripHtml(description || "")
    .replace(/\s+/g, " ")
    .trim();
  const combined = body ? `${lead} ${body}` : lead;
  if (combined.length <= 160) return combined;
  return `${combined.slice(0, 157).trimEnd()}…`;
}

export function eventDetailRobots(
  startAt: string,
  endAt: string | null | undefined,
): { index: false; follow: true } | undefined {
  return isPublicEventExpired(startAt, endAt)
    ? { index: false, follow: true }
    : undefined;
}
