import {
  addDaysYmd,
  formatRomeLongDay,
  romeDayRange,
  romeYmd,
} from "@/src/lib/seo/rome-time";
import {
  DOMANI_INTENT,
  DOMENICA_INTENT,
  OGGI_INTENT,
  WEEKEND_EVERGREEN_INTENT,
} from "@/src/lib/seo/landing-intents";
import {
  nextSundayYmd,
  rollingWeekendRange,
  weekendLongDatePhrase,
  weekendShortDatePhrase,
} from "@/src/lib/seo/weekends";

export type DateLandingKey = "oggi" | "domani" | "weekend" | "domenica" | "settimana";

export const DATE_LANDING_META: Record<
  DateLandingKey,
  { path: string; title: string; h1: string; description: string }
> = {
  oggi: {
    path: OGGI_INTENT.path,
    title: OGGI_INTENT.seoTitle,
    h1: OGGI_INTENT.h1,
    description: OGGI_INTENT.metaDescription,
  },
  domani: {
    path: DOMANI_INTENT.path,
    title: DOMANI_INTENT.seoTitle,
    h1: DOMANI_INTENT.h1,
    description: DOMANI_INTENT.metaDescription,
  },
  weekend: {
    path: WEEKEND_EVERGREEN_INTENT.path,
    title: WEEKEND_EVERGREEN_INTENT.seoTitle,
    h1: WEEKEND_EVERGREEN_INTENT.h1,
    description: WEEKEND_EVERGREEN_INTENT.metaDescription,
  },
  domenica: {
    path: DOMENICA_INTENT.path,
    title: DOMENICA_INTENT.seoTitle,
    h1: DOMENICA_INTENT.h1,
    description: DOMENICA_INTENT.metaDescription,
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
    domenica: "Domenica",
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
    const longPhrase = weekendLongDatePhrase(
      weekend.fridayYmd,
      weekend.sundayYmd,
    );
    const shortPhrase = weekendShortDatePhrase(
      weekend.fridayYmd,
      weekend.sundayYmd,
    );
    return {
      range: { start: weekend.start, end: weekend.end },
      datePhrase: longPhrase,
      shortDatePhrase: shortPhrase,
      h1: WEEKEND_EVERGREEN_INTENT.h1,
      title: WEEKEND_EVERGREEN_INTENT.seoTitle,
      metaDescription: `Eventi Sardegna questo weekend (${longPhrase}): sagre, concerti e attività su EVERAS.`,
    };
  }

  if (dateKey === "domenica") {
    const sundayYmd = nextSundayYmd(from);
    const range = romeDayRange(sundayYmd);
    const datePhrase = formatRomeLongDay(sundayYmd);
    return {
      range,
      datePhrase,
      shortDatePhrase: datePhrase,
      h1: DOMENICA_INTENT.h1,
      title: DOMENICA_INTENT.seoTitle,
      metaDescription: `Eventi Sardegna domenica (${datePhrase}): sagre, concerti e feste di paese su EVERAS.`,
    };
  }

  const todayYmd = romeYmd(from);
  const targetYmd =
    dateKey === "oggi" ? todayYmd : addDaysYmd(todayYmd, 1);
  const range = romeDayRange(targetYmd);
  const datePhrase = formatRomeLongDay(targetYmd);

  if (dateKey === "oggi") {
    return {
      range,
      datePhrase,
      shortDatePhrase: datePhrase,
      h1: OGGI_INTENT.h1,
      title: OGGI_INTENT.seoTitle,
      metaDescription: `Eventi Sardegna oggi (${datePhrase}): sagre, concerti e attività aggiornati su EVERAS.`,
    };
  }

  return {
    range,
    datePhrase,
    shortDatePhrase: datePhrase,
    h1: DOMANI_INTENT.h1,
    title: DOMANI_INTENT.seoTitle,
    metaDescription: `Eventi Sardegna domani (${datePhrase}): programma per città, sagre e spettacoli su EVERAS.`,
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
    case "domenica":
      return romeDayRange(nextSundayYmd());
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

export function getYearRange(year: number) {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year + 1, 0, 1),
  };
}
