export type DateLandingKey = "oggi" | "domani" | "weekend" | "settimana";

export const DATE_LANDING_META: Record<
  DateLandingKey,
  { path: string; title: string; h1: string; description: string }
> = {
  oggi: {
    path: "/eventi-oggi",
    title: "Eventi oggi in Sardegna",
    h1: "Eventi oggi in Sardegna",
    description:
      "Scopri cosa fare oggi in Sardegna: concerti, sagre, mostre e appuntamenti in corso sull’isola.",
  },
  domani: {
    path: "/eventi-domani",
    title: "Eventi domani in Sardegna",
    h1: "Eventi domani in Sardegna",
    description:
      "Programma di domani in Sardegna: eventi, spettacoli e appuntamenti da non perdere.",
  },
  weekend: {
    path: "/eventi-weekend",
    title: "Eventi questo weekend in Sardegna",
    h1: "Eventi questo weekend in Sardegna",
    description:
      "Cosa fare nel weekend in Sardegna: festival, concerti, sagre e attività per tutta la famiglia.",
  },
  settimana: {
    path: "/eventi?date=settimana",
    title: "Eventi questa settimana in Sardegna",
    h1: "Eventi questa settimana",
    description:
      "Gli eventi della settimana in Sardegna su EVERAS.",
  },
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const ISO_DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True se il filtro è una data civile YYYY-MM-DD. */
export function isPreciseDateFilter(filter: string) {
  return ISO_DAY_RE.test(filter.trim());
}

/** Etichetta italiana per preset o data precisa (es. «20 settembre 2026»). */
export function formatSearchDateLabel(filter: string) {
  const trimmed = filter.trim();
  if (!trimmed) return undefined;

  const presets: Record<string, string> = {
    oggi: "Oggi",
    domani: "Domani",
    weekend: "Questo weekend",
    settimana: "Questa settimana",
  };
  if (presets[trimmed]) return presets[trimmed];

  const match = ISO_DAY_RE.exec(trimmed);
  if (!match) return trimmed;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return trimmed;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getDateRange(filter: string) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const weekendStart = addDays(today, daysUntilSaturday);
  const weekendEnd = addDays(weekendStart, 2);

  const weekEnd = addDays(today, 7);

  const precise = ISO_DAY_RE.exec(filter.trim());
  if (precise) {
    const year = Number(precise[1]);
    const month = Number(precise[2]);
    const day = Number(precise[3]);
    const start = new Date(year, month - 1, day);
    if (
      start.getFullYear() === year &&
      start.getMonth() === month - 1 &&
      start.getDate() === day
    ) {
      return { start, end: addDays(start, 1) };
    }
    return null;
  }

  switch (filter) {
    case "oggi":
      return { start: today, end: tomorrow };
    case "domani":
      return { start: tomorrow, end: dayAfterTomorrow };
    case "weekend":
      return { start: weekendStart, end: weekendEnd };
    case "settimana":
      return { start: today, end: weekEnd };
    default:
      return null;
  }
}

export function getMonthRange(year: number, monthIndex: number) {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);
  return { start, end };
}
