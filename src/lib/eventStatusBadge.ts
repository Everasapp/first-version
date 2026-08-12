/** Oltre questa durata l'evento è considerato periodo/mostra, non spettacolo orario. */
const LONG_RUNNING_MS = 24 * 60 * 60 * 1000;

export type EventStatusBadge = {
  /** Spettacolo in corso in questo momento (tag rosso). */
  happeningNow: boolean;
  /** Periodo/mostra attivo in queste date (tag blu). */
  isActiveEvent: boolean;
  statusLabel?: string;
};

/**
 * Stato live dell'evento rispetto a `now`:
 * - durata ≤ 24h e dentro start/end → "In corso"
 * - durata > 24h e dentro start/end → "Evento attivo"
 * - senza end_at o fuori intervallo → nessun badge
 */
export function resolveEventStatusBadge(
  startAt: string,
  endAt?: string | null,
  now: Date = new Date(),
): EventStatusBadge {
  if (!endAt) {
    return { happeningNow: false, isActiveEvent: false };
  }

  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const current = now.getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    current < start ||
    current > end
  ) {
    return { happeningNow: false, isActiveEvent: false };
  }

  const duration = end - start;

  if (duration > LONG_RUNNING_MS) {
    return {
      happeningNow: false,
      isActiveEvent: true,
      statusLabel: "Evento attivo",
    };
  }

  return {
    happeningNow: true,
    isActiveEvent: false,
    statusLabel: "In corso",
  };
}
