import { ITALIAN_MONTHS } from "@/src/lib/seo/calendar";
import {
  addDaysYmd,
  romeYmd,
  zonedTimeToUtc,
} from "@/src/lib/seo/rome-time";

const ROME_TZ = "Europe/Rome";

export type CalendarWeekend = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  paragraphs: string[];
  /** Inclusive Friday (Europe/Rome). */
  fridayYmd: string;
  /** Inclusive Sunday (Europe/Rome). */
  sundayYmd: string;
  start: Date;
  end: Date;
  dateLabel: string;
  shortLabel: string;
};

function romeWeekdayIndex(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: ROME_TZ,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

function parseYmd(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
}

function monthName(monthIndex: number) {
  return ITALIAN_MONTHS[monthIndex];
}

/** Friday of the current or next weekend (Fri–Sun, Europe/Rome). */
export function currentWeekendFridayYmd(from = new Date()) {
  const today = romeYmd(from);
  const weekday = romeWeekdayIndex(from);
  if (weekday === 0) return addDaysYmd(today, -2);
  if (weekday === 6) return addDaysYmd(today, -1);
  if (weekday === 5) return today;
  return addDaysYmd(today, 5 - weekday);
}

/** Rolling Fri–Sun window for filters and `/eventi-weekend`. */
export function rollingWeekendRange(from = new Date()) {
  return weekendLanding(currentWeekendFridayYmd(from));
}

/** Human phrase: «venerdì 18 a domenica 20 settembre 2026». */
export function weekendLongDatePhrase(fridayYmd: string, sundayYmd: string) {
  const friday = parseYmd(fridayYmd);
  const sunday = parseYmd(sundayYmd);
  const fridayMonth = monthName(friday.monthIndex);
  const sundayMonth = monthName(sunday.monthIndex);

  if (friday.year === sunday.year && friday.monthIndex === sunday.monthIndex) {
    return `venerdì ${friday.day} a domenica ${sunday.day} ${fridayMonth} ${sunday.year}`;
  }

  if (friday.year === sunday.year) {
    return `venerdì ${friday.day} ${fridayMonth} a domenica ${sunday.day} ${sundayMonth} ${sunday.year}`;
  }

  return `venerdì ${friday.day} ${fridayMonth} ${friday.year} a domenica ${sunday.day} ${sundayMonth} ${sunday.year}`;
}

function weekendDateLabel(fridayYmd: string, sundayYmd: string) {
  const friday = parseYmd(fridayYmd);
  const sunday = parseYmd(sundayYmd);
  const fridayMonth = monthName(friday.monthIndex);
  const sundayMonth = monthName(sunday.monthIndex);

  if (friday.year === sunday.year && friday.monthIndex === sunday.monthIndex) {
    return `${friday.day}-${sunday.day} ${fridayMonth} ${sunday.year}`;
  }

  if (friday.year === sunday.year) {
    return `${friday.day} ${fridayMonth} – ${sunday.day} ${sundayMonth} ${sunday.year}`;
  }

  return `${friday.day} ${fridayMonth} ${friday.year} – ${sunday.day} ${sundayMonth} ${sunday.year}`;
}

function weekendSlug(fridayYmd: string, sundayYmd: string) {
  const friday = parseYmd(fridayYmd);
  const sunday = parseYmd(sundayYmd);
  const fridayMonth = monthName(friday.monthIndex);
  const sundayMonth = monthName(sunday.monthIndex);

  if (friday.year === sunday.year && friday.monthIndex === sunday.monthIndex) {
    return `${friday.day}-${sunday.day}-${fridayMonth}-${sunday.year}`;
  }

  if (friday.year === sunday.year) {
    return `${friday.day}-${fridayMonth}-${sunday.day}-${sundayMonth}-${sunday.year}`;
  }

  return `${friday.day}-${fridayMonth}-${friday.year}-${sunday.day}-${sundayMonth}-${sunday.year}`;
}

function weekendShortLabel(fridayYmd: string, sundayYmd: string) {
  const friday = parseYmd(fridayYmd);
  const sunday = parseYmd(sundayYmd);
  const fridayMonth = monthName(friday.monthIndex);
  const sundayMonth = monthName(sunday.monthIndex);

  if (friday.monthIndex === sunday.monthIndex) {
    return `${friday.day}-${sunday.day} ${fridayMonth}`;
  }

  return `${friday.day} ${fridayMonth} – ${sunday.day} ${sundayMonth}`;
}

function weekendParagraphs(dateLabel: string) {
  return [
    `Questo è il calendario del fine settimana ${dateLabel} in Sardegna: sagre, concerti e feste paese da venerdì a domenica, con comune e locandina.`,
    `Lo usi se stai cercando cosa fare in quei giorni precisi, non un elenco che cambia ogni ora. Apri la scheda per orari, ingresso e come arrivare.`,
    `Per il weekend in corso c’è anche la pagina sempre aggiornata Eventi weekend. Da qui puoi passare al mese o alle guide delle feste più cercate.`,
  ];
}

export function weekendLanding(fridayYmd: string): CalendarWeekend {
  const sundayYmd = addDaysYmd(fridayYmd, 2);
  const dateLabel = weekendDateLabel(fridayYmd, sundayYmd);
  const slug = weekendSlug(fridayYmd, sundayYmd);
  const start = zonedTimeToUtc(fridayYmd, "00:00:00", ROME_TZ);
  const end = zonedTimeToUtc(addDaysYmd(sundayYmd, 1), "00:00:00", ROME_TZ);

  return {
    slug,
    path: `/eventi-sardegna/${slug}`,
    title: `Eventi del fine settimana in Sardegna ${dateLabel}`,
    h1: `Eventi del weekend ${dateLabel}`,
    description: `Cosa fare in Sardegna nel fine settimana ${dateLabel}: sagre, concerti e feste paese da Nord a Sud.`,
    paragraphs: weekendParagraphs(dateLabel),
    fridayYmd,
    sundayYmd,
    start,
    end,
    dateLabel,
    shortLabel: weekendShortLabel(fridayYmd, sundayYmd),
  };
}

export function upcomingWeekends(count = 10, from = new Date()) {
  const weekends: CalendarWeekend[] = [];
  let friday = currentWeekendFridayYmd(from);
  for (let index = 0; index < count; index += 1) {
    weekends.push(weekendLanding(friday));
    friday = addDaysYmd(friday, 7);
  }
  return weekends;
}

export function findWeekend(slug: string) {
  return upcomingWeekends(16).find((weekend) => weekend.slug === slug);
}

export function weekendExploreLinks(count = 5) {
  return upcomingWeekends(count).map((weekend) => ({
    href: weekend.path,
    label: weekend.shortLabel,
  }));
}

export function formatEventHighlightList(titles: string[]) {
  const cleaned = titles.map((title) => title.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} e ${cleaned[1]}`;
  const head = cleaned.slice(0, -1).join(", ");
  return `${head} e ${cleaned[cleaned.length - 1]}`;
}
