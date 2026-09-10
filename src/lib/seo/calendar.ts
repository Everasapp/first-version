export const ITALIAN_MONTHS = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
] as const;

export type CalendarMonth = {
  slug: string;
  name: string;
  year: number;
  monthIndex: number;
  path: string;
  title: string;
  h1: string;
  description: string;
  paragraphs: string[];
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function monthLanding(year: number, monthIndex: number): CalendarMonth {
  const name = ITALIAN_MONTHS[monthIndex];
  const label = capitalize(name);
  const slug = `${name}-${year}`;
  return {
    slug,
    name: label,
    year,
    monthIndex,
    path: `/eventi-sardegna/${slug}`,
    title: `Eventi e sagre di ${name} ${year} in Sardegna`,
    h1: `Eventi di ${label} ${year} in Sardegna`,
    description: `Calendario di ${label.toLocaleLowerCase("it")} ${year} in Sardegna: sagre, concerti, festival e feste paese da Nord a Sud.`,
    paragraphs: monthParagraphs(label, year, monthIndex),
  };
}

function monthParagraphs(label: string, year: number, monthIndex: number) {
  const month = label.toLocaleLowerCase("it");
  const seasonal =
    monthIndex >= 8 || monthIndex <= 1
      ? "È stagione di sagre, vendemmia, castagne e rassegne nei paesi interni: Autunno in Barbagia, fiere e weekend lunghi fuori città."
      : monthIndex >= 2 && monthIndex <= 4
        ? "In primavera tornano processioni, Monumenti Aperti e le prime feste all’aperto, da Sant’Efisio a Cagliari fino ai borghi."
        : "In estate il calendario si sposta su spiagge, piazze e arene: concerti, feste paese e sagre di pesce da Nord a Sud.";

  return [
    `Questo è il calendario di ${month} ${year} in Sardegna: date vere, comuni e locandine, non un elenco generico. Lo usi per decidere cosa fare nel weekend, quale sagra vale un viaggio e quali concerti cadono nello stesso periodo.`,
    seasonal,
    `Filtra per città se ti muovi in zona, oppure torna alla guida Eventi e sagre per oggi, domani e le feste principali. Aggiorniamo le schede appena arrivano da Comuni, Pro Loco e organizzatori.`,
  ];
}

export function upcomingCalendarMonths(count = 6, from = new Date()) {
  const months: CalendarMonth[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    const cursor = new Date(from.getFullYear(), from.getMonth() + offset, 1);
    months.push(monthLanding(cursor.getFullYear(), cursor.getMonth()));
  }
  return months;
}

export function findCalendarMonth(slug: string) {
  return upcomingCalendarMonths(14).find((month) => month.slug === slug);
}

export function sagreExploreLinks() {
  const months = upcomingCalendarMonths(4);
  return [
    { href: "/eventi-sardegna", label: "Eventi e sagre" },
    { href: "/eventi-oggi", label: "Oggi" },
    { href: "/eventi-domani", label: "Domani" },
    { href: "/eventi-weekend", label: "Weekend" },
    { href: "/eventi/sagre-tradizioni", label: "Sagre e tradizioni" },
    ...months.map((month) => ({
      href: month.path,
      label: `${month.name} ${month.year}`,
    })),
  ];
}
