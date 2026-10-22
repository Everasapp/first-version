import { isVerifiedSeasonalAnnouncementOpen } from "@/src/lib/verified-seasonal-listings";

/**
 * Evento scaduto per le liste pubbliche (Esplora, ricerca, home).
 * - con end_at → scaduto dopo la fine, anche se l’annuncio era stato verificato
 * - senza end_at, annuncio stagionale verificato → visibile fino alla scadenza della verifica
 * - senza end_at, tutti gli altri → scaduto dopo la giornata di inizio (Europe/Rome)
 */
export function isPublicEventExpired(
  startAt: string,
  endAt?: string | null,
  now: Date = new Date(),
  listing?: { slug?: string | null },
) {
  if (endAt) {
    const end = new Date(endAt).getTime();
    return !Number.isFinite(end) || end < now.getTime();
  }

  if (isVerifiedSeasonalAnnouncementOpen(listing?.slug, now)) {
    return false;
  }

  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) {
    return true;
  }

  const romeDay = (value: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(value);

  return romeDay(start) < romeDay(now);
}

export function isPublicEventActive(
  startAt: string,
  endAt?: string | null,
  now: Date = new Date(),
  listing?: { slug?: string | null },
) {
  return !isPublicEventExpired(startAt, endAt, now, listing);
}
