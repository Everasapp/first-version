/**
 * Evento scaduto per le liste pubbliche (Esplora, ricerca, home).
 * - con end_at → scaduto dopo la fine
 * - senza end_at → scaduto dopo la giornata di inizio (Europe/Rome)
 */
export function isPublicEventExpired(
  startAt: string,
  endAt?: string | null,
  now: Date = new Date(),
) {
  if (endAt) {
    const end = new Date(endAt).getTime();
    return !Number.isFinite(end) || end < now.getTime();
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
) {
  return !isPublicEventExpired(startAt, endAt, now);
}
