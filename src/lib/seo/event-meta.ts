import { isPublicEventExpired } from "@/src/lib/eventActive";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { stripHtml } from "@/src/lib/sanitizeHtml";

const ROME_TZ = "Europe/Rome";
const META_MAX_LENGTH = 160;

const MONTH_LONG_IT = new Intl.DateTimeFormat("it-IT", {
  month: "long",
  timeZone: ROME_TZ,
});

type RomeDayParts = {
  year: number;
  month: number;
  day: number;
};

export function italianPlacePreposition(place: string) {
  const first = place.trim().charAt(0);
  return /^[aeiouàèéìíîòóùú]/i.test(first) ? "ad" : "a";
}

function romeDayParts(value: string): RomeDayParts | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return { year, month, day };
}

function monthNameIt(month: number, year: number, day: number) {
  // Build a UTC noon date that formats to the intended Rome calendar month.
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return MONTH_LONG_IT.format(probe);
}

function formatSingleRomeDay(parts: RomeDayParts) {
  return `${parts.day} ${monthNameIt(parts.month, parts.year, parts.day)} ${parts.year}`;
}

/**
 * Date for SERP: always includes the year (Europe/Rome).
 * Multi-day same month: "26–29 settembre 2026".
 * Cross-month: "28 settembre–2 ottobre 2026".
 */
export function formatSeoEventDay(
  startAt: string,
  endAt?: string | null,
) {
  const start = romeDayParts(startAt);
  if (!start) return "";

  const end =
    typeof endAt === "string" && endAt.trim()
      ? romeDayParts(endAt)
      : null;

  if (
    !end ||
    (end.year === start.year &&
      end.month === start.month &&
      end.day === start.day)
  ) {
    return formatSingleRomeDay(start);
  }

  if (end.year === start.year && end.month === start.month) {
    return `${start.day}–${end.day} ${monthNameIt(start.month, start.year, start.day)} ${start.year}`;
  }

  if (end.year === start.year) {
    return `${start.day} ${monthNameIt(start.month, start.year, start.day)}–${end.day} ${monthNameIt(end.month, end.year, end.day)} ${start.year}`;
  }

  return `${formatSingleRomeDay(start)}–${formatSingleRomeDay(end)}`;
}

/** Normalize place/title text for comparison only (never write back to DB). */
function normalizeForPlaceCompare(value: string) {
  return value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/,\s*[a-z]{2}\b/gi, " ")
    .replace(/[^a-z0-9\s]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Token-aware place match: avoids false positives from bare `.includes()`
 * (e.g. "Uri" inside unrelated words) and handles "Santa Teresa Gallura".
 */
export function textMentionsPlace(text: string, place: string) {
  const normalizedPlace = normalizeForPlaceCompare(place);
  if (normalizedPlace.length < 2) return false;

  const placeTokens = normalizedPlace.split(" ").filter(Boolean);
  const textTokens = normalizeForPlaceCompare(text).split(" ").filter(Boolean);
  if (placeTokens.length === 0 || textTokens.length < placeTokens.length) {
    return false;
  }

  for (let i = 0; i <= textTokens.length - placeTokens.length; i++) {
    let match = true;
    for (let j = 0; j < placeTokens.length; j++) {
      if (textTokens[i + j] !== placeTokens[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }

  return false;
}

function textMentionsSeoDay(text: string, day: string) {
  if (!day) return false;
  // Require the full SEO day including the correct year (e.g. "5 settembre 2026").
  // "5 settembre" or a different year (e.g. 2025) must not suppress appending.
  return text.toLocaleLowerCase("it").includes(day.toLocaleLowerCase("it"));
}

function truncateSeoText(value: string, max = META_MAX_LENGTH) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;

  const budget = max - 1;
  const slice = trimmed.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");
  const cut =
    lastSpace >= Math.floor(budget * 0.6) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

function formatSeoPriceSuffix(
  isFree: boolean | string | number | null | undefined,
  priceFrom: number | string | null | undefined,
) {
  const pricing = resolveEventPricing(isFree, priceFrom);

  if (pricing.priceFrom !== undefined) {
    const amount = pricing.priceFrom;
    const formatted = Number.isInteger(amount)
      ? String(amount)
      : amount.toFixed(2).replace(".", ",");
    return `Da €${formatted}.`;
  }

  if (pricing.isFree) {
    return "Ingresso gratuito.";
  }

  return "";
}

function usefulDescriptionExcerpt(
  description: string | null,
  leadParts: string[],
) {
  let body = stripHtml(description || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!body) return "";

  for (const part of leadParts) {
    const needle = part.trim();
    if (needle.length < 4) continue;
    const lowerBody = body.toLocaleLowerCase("it");
    const lowerNeedle = needle.toLocaleLowerCase("it");
    if (!lowerBody.startsWith(lowerNeedle)) continue;
    const next = body.charAt(needle.length);
    if (next && !/[\s.,;:–—-]/.test(next)) continue;
    body = body.slice(needle.length).replace(/^[\s.,;:–—-]+/, "").trim();
  }

  return body;
}

/** Title for SERP: official DB name + place/date only when missing. */
export function eventSeoTitle(
  title: string,
  municipality: string,
  startAt: string,
  endAt?: string | null,
) {
  const name = title.trim();
  const city = municipality.trim();
  const day = formatSeoEventDay(startAt, endAt);

  const withPlace =
    city && !textMentionsPlace(name, city)
      ? `${name} ${italianPlacePreposition(city)} ${city}`
      : name;

  if (day && !textMentionsSeoDay(withPlace, day)) {
    return `${withPlace} · ${day}`;
  }

  return withPlace;
}

export function eventSeoDescription(
  title: string,
  municipality: string,
  startAt: string,
  description: string | null,
  endAt?: string | null,
  isFree?: boolean | string | number | null,
  priceFrom?: number | string | null,
) {
  const name = title.trim();
  const city = municipality.trim();
  const day = formatSeoEventDay(startAt, endAt);

  let lead = name;
  if (city && !textMentionsPlace(name, city)) {
    lead = `${lead} ${italianPlacePreposition(city)} ${city}`;
  }
  if (day) {
    lead = `${lead} il ${day}`;
  }
  lead = `${lead}.`;

  const excerpt = usefulDescriptionExcerpt(description, [
    name,
    city ? `${italianPlacePreposition(city)} ${city}` : "",
    day ? `il ${day}` : "",
    day,
  ]);

  const priceSuffix = formatSeoPriceSuffix(isFree, priceFrom);
  const body = excerpt ? `${lead} ${excerpt}` : lead;

  if (!priceSuffix) {
    return truncateSeoText(body);
  }

  // Keep the full price/free suffix; truncate only lead+excerpt to fit.
  const reserved = 1 + priceSuffix.length; // leading space + suffix
  const bodyMax = Math.max(24, META_MAX_LENGTH - reserved);
  const truncatedBody =
    body.length <= bodyMax ? body : truncateSeoText(body, bodyMax);

  return `${truncatedBody} ${priceSuffix}`.replace(/\s+/g, " ").trim();
}

export function eventDetailRobots(
  startAt: string,
  endAt: string | null | undefined,
): { index: false; follow: true } | undefined {
  return isPublicEventExpired(startAt, endAt)
    ? { index: false, follow: true }
    : undefined;
}
