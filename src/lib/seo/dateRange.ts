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

export function getDateRange(filter: string) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const weekendStart = addDays(today, daysUntilSaturday);
  const weekendEnd = addDays(weekendStart, 2);

  const weekEnd = addDays(today, 7);

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
