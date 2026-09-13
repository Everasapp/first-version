import {
  addDaysYmd,
  formatRomeLongDay,
  romeDayRange,
  romeYmd,
} from "@/src/lib/seo/rome-time";
import {
  rollingWeekendRange,
  weekendLongDatePhrase,
} from "@/src/lib/seo/weekends";

export type DateLandingKey = "oggi" | "domani" | "weekend" | "settimana";

export const DATE_LANDING_META: Record<
  DateLandingKey,
  { path: string; title: string; h1: string; description: string }
> = {
  oggi: {
    path: "/eventi-oggi",
    title: "Cosa fare oggi in Sardegna",
    h1: "Cosa fare oggi in Sardegna",
    description:
      "Scopri cosa fare oggi in Sardegna: concerti, sagre, mostre e appuntamenti in corso sull’isola.",
  },
  domani: {
    path: "/eventi-domani",
    title: "Eventi in Sardegna domani",
    h1: "Eventi in Sardegna domani",
    description:
      "Programma di domani in Sardegna: eventi, spettacoli e appuntamenti da non perdere.",
  },
  weekend: {
    path: "/eventi-weekend",
    title: "Eventi in Sardegna questo weekend",
    h1: "Eventi in Sardegna questo weekend",
    description:
      "Cosa fare nel weekend in Sardegna: festival, concerti, sagre e attività da venerdì a domenica.",
  },
  settimana: {
    path: "/eventi?date=settimana",
    title: "Eventi questa settimana in Sardegna",
    h1: "Eventi questa settimana",
    description: "Gli eventi della settimana in Sardegna su EVERAS.",
  },
};

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

export function getDateLandingContext(
  dateKey: Exclude<DateLandingKey, "settimana">,
  from = new Date(),
) {
  if (dateKey === "weekend") {
    const weekend = rollingWeekendRange(from);
    return {
      range: { start: weekend.start, end: weekend.end },
      datePhrase: weekendLongDatePhrase(weekend.fridayYmd, weekend.sundayYmd),
      metaDescription: `Cosa fare in Sardegna da ${weekendLongDatePhrase(weekend.fridayYmd, weekend.sundayYmd)}: sagre, concerti e appuntamenti su EVERAS.`,
    };
  }

  const todayYmd = romeYmd(from);
  const targetYmd =
    dateKey === "oggi" ? todayYmd : addDaysYmd(todayYmd, 1);
  const range = romeDayRange(targetYmd);
  const datePhrase = formatRomeLongDay(targetYmd);
  return {
    range,
    datePhrase,
    metaDescription:
      dateKey === "oggi"
        ? `Cosa fare in Sardegna ${datePhrase}: eventi, sagre e concerti aggiornati su EVERAS.`
        : `Eventi in Sardegna ${datePhrase}: programma, città e dettagli su EVERAS.`,
  };
}

export function getDateRange(filter: string) {
  const precise = ISO_DAY_RE.exec(filter.trim());
  if (precise) {
    const ymd = `${precise[1]}-${precise[2]}-${precise[3]}`;
    const year = Number(precise[1]);
    const month = Number(precise[2]);
    const day = Number(precise[3]);
    const probe = new Date(Date.UTC(year, month - 1, day));
    if (
      probe.getUTCFullYear() === year &&
      probe.getUTCMonth() === month - 1 &&
      probe.getUTCDate() === day
    ) {
      return romeDayRange(ymd);
    }
    return null;
  }

  const todayYmd = romeYmd(new Date());

  switch (filter) {
    case "oggi":
      return romeDayRange(todayYmd);
    case "domani":
      return romeDayRange(addDaysYmd(todayYmd, 1));
    case "weekend": {
      const weekend = rollingWeekendRange();
      return { start: weekend.start, end: weekend.end };
    }
    case "settimana": {
      const start = romeDayRange(todayYmd).start;
      const end = romeDayRange(addDaysYmd(todayYmd, 7)).start;
      return { start, end };
    }
    default:
      return null;
  }
}

export function getMonthRange(year: number, monthIndex: number) {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);
  return { start, end };
}
