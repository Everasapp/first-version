const ROME_TZ = "Europe/Rome";

function romeDayKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function romeTime(value: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ROME_TZ,
  }).format(value);
}

function isMidnightRome(value: Date) {
  return romeTime(value) === "00:00";
}

function isEndOfDayRome(value: Date) {
  const t = romeTime(value);
  return t === "23:59" || t === "23:58";
}

/**
 * Formatta inizio/fine evento in italiano (Europe/Rome).
 * Mostra la data di fine solo se presente e diversa / con orario diverso.
 */
export function formatEventDateRange(
  startAt: string,
  endAt?: string | null,
  options?: { includeWeekday?: boolean },
) {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return "";

  const dateOpts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
    ...(options?.includeWeekday ? { weekday: "long" as const } : {}),
  };

  const startDateLabel = new Intl.DateTimeFormat("it-IT", dateOpts).format(start);
  const startTime = romeTime(start);

  if (!endAt) {
    return isMidnightRome(start)
      ? startDateLabel
      : `${startDateLabel} · ${startTime}`;
  }

  const end = new Date(endAt);
  if (Number.isNaN(end.getTime())) {
    return isMidnightRome(start)
      ? startDateLabel
      : `${startDateLabel} · ${startTime}`;
  }

  const sameDay = romeDayKey(start) === romeDayKey(end);

  if (sameDay) {
    if (isMidnightRome(start) && isEndOfDayRome(end)) {
      return startDateLabel;
    }
    if (isMidnightRome(start)) {
      return `${startDateLabel} · fino alle ${romeTime(end)}`;
    }
    return `${startDateLabel} · ${startTime}–${romeTime(end)}`;
  }

  const endDateLabel = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
  }).format(end);

  // Multi-day all-day style: hide default midnight / end-of-day times
  if (isMidnightRome(start) && isEndOfDayRome(end)) {
    return `${startDateLabel} – ${endDateLabel}`;
  }

  const endTime = romeTime(end);
  return `${startDateLabel} · ${startTime} – ${endDateLabel} · ${endTime}`;
}
