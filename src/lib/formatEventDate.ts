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

export function formatEventHoursDetail(
  startAt: string,
  endAt?: string | null,
) {
  const summary = formatEventDateRange(startAt, endAt, { includeWeekday: true });
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) {
    return { summary, lines: [] as string[] };
  }

  const dateLabel = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
  }).format(start);

  if (!endAt) {
    if (isMidnightRome(start)) {
      return { summary: dateLabel, lines: [`Tutto il giorno, ${dateLabel}`] };
    }
    return {
      summary,
      lines: [`Inizio: ${dateLabel} alle ${romeTime(start)}`],
    };
  }

  const end = new Date(endAt);
  if (Number.isNaN(end.getTime())) {
    return {
      summary,
      lines: [`Inizio: ${dateLabel} alle ${romeTime(start)}`],
    };
  }

  const sameDay = romeDayKey(start) === romeDayKey(end);
  const endDateLabel = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ROME_TZ,
  }).format(end);

  if (sameDay && isMidnightRome(start) && isEndOfDayRome(end)) {
    return { summary: dateLabel, lines: [`Tutto il giorno, ${dateLabel}`] };
  }

  if (sameDay) {
    if (isMidnightRome(start)) {
      return {
        summary,
        lines: [`Il ${dateLabel}, fino alle ${romeTime(end)}`],
      };
    }
    return {
      summary,
      lines: [`${dateLabel}, dalle ${romeTime(start)} alle ${romeTime(end)}`],
    };
  }

  const startBit = isMidnightRome(start)
    ? `Dal ${dateLabel}`
    : `Dal ${dateLabel} alle ${romeTime(start)}`;
  const endBit = isEndOfDayRome(end)
    ? `al ${endDateLabel}`
    : `al ${endDateLabel} alle ${romeTime(end)}`;

  return { summary, lines: [`${startBit} ${endBit}`] };
}
