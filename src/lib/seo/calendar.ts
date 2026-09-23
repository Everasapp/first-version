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

export type CalendarYear = {
  year: number;
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  paragraphs: string[];
};

const MONTH_SLUG_RE = new RegExp(
  `^(${ITALIAN_MONTHS.join("|")})-(\\d{4})$`,
);

/** First year with a dedicated annual calendar landing. */
export const CALENDAR_YEAR_MIN = 2026;

export function yearLanding(year: number): CalendarYear {
  return {
    year,
    slug: String(year),
    path: `/eventi-sardegna/${year}`,
    title: `Calendario eventi Sardegna ${year}`,
    h1: `Calendario eventi Sardegna ${year}`,
    description: `Calendario eventi in Sardegna ${year}: sagre, concerti, festival e feste di paese mese per mese, con date e comuni su EVERAS.`,
    paragraphs: [
      `Questa è la vista annuale ${year}: non è la pagina di oggi né il weekend in corso. Qui trovi gli appuntamenti pubblicati per l’anno, organizzati per mese, con link alle landing da gennaio a dicembre.`,
      `Se cerchi “calendario eventi Sardegna ${year}” di solito vuoi sapere quando cadono sagre, concerti e festival e in quale comune. Apri il mese per l’elenco completo; la scheda evento ha orario, ingresso e locandina.`,
      `Da qui passi anche a Eventi in Sardegna (guida evergreen), alle sagre e alle città. Il calendario si aggiorna quando Comuni, Pro Loco e organizzatori pubblicano nuove date.`,
    ],
  };
}

export function yearMonths(year: number): CalendarMonth[] {
  return ITALIAN_MONTHS.map((_, monthIndex) => monthLanding(year, monthIndex));
}

export function currentYearLanding(from = new Date()) {
  return yearLanding(currentMonthLanding(from).year);
}

export function calendarYears(from = new Date()) {
  const currentYear = currentMonthLanding(from).year;
  const years: CalendarYear[] = [];
  for (let year = Math.max(CALENDAR_YEAR_MIN, currentYear); year <= currentYear + 1; year += 1) {
    years.push(yearLanding(year));
  }
  if (!years.some((item) => item.year === CALENDAR_YEAR_MIN)) {
    years.unshift(yearLanding(CALENDAR_YEAR_MIN));
  }
  return years;
}

export function findCalendarYear(slug: string) {
  if (!/^\d{4}$/.test(slug)) return undefined;
  const year = Number(slug);
  const currentYear = currentMonthLanding().year;
  if (year < CALENDAR_YEAR_MIN || year > currentYear + 1) return undefined;
  return yearLanding(year);
}

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
    title: `Eventi Sardegna ${name} ${year}`,
    h1: `Eventi Sardegna ${name} ${year}`,
    description: `Eventi Sardegna ${name} ${year}: sagre, concerti e festival per città e weekend su EVERAS.`,
    paragraphs: monthParagraphs(label, year, monthIndex),
  };
}

function monthParagraphs(label: string, year: number, monthIndex: number) {
  const month = label.toLocaleLowerCase("it");

  const seasonalByMonth: Record<number, string> = {
    0: `A gennaio in Sardegna il ritmo è spesso invernale: mercatini residui, rassegne indoor e feste di paese al chiuso, quando pubblicate. Usa questa pagina per ${month} ${year} senza confonderla con il weekend corrente.`,
    1: `Febbraio mescola Carnevale (dove in calendario) e primi appuntamenti culturali al chiuso. Il focus resta ${month} ${year}: date fisse, non “questo weekend”.`,
    2: `A marzo tornano uscite all’aperto e, dove presenti, aperture straordinarie e feste primaverili. Controlla ${month} ${year} città per città.`,
    3: `Aprile è spesso mese di processioni, visite e prime sagre di stagione. Qui trovi solo gli eventi di ${month} ${year} già pubblicati su EVERAS.`,
    4: `Maggio porta rassegne e feste all’aperto; a Cagliari e in altri comuni possono comparire grandi celebrazioni se sono in calendario. Filtra ${month} ${year} per non mescolare mesi diversi.`,
    5: `A giugno il programma si sposta su piazze e costa: concerti, feste paese e sagre di inizio estate, quando caricate. Questa è la vista di ${month} ${year}.`,
    6: `Luglio è alto calendario estivo: serate, festival e sagre di pesce o di paese. Parti da ${month} ${year} e approfondisci sulle schede.`,
    7: `Agosto concentra vacanze e appuntamenti notturni; verifica sempre orario e comune sulla scheda. Elenco dedicato a ${month} ${year}.`,
    8: `Settembre chiude l’estate con tradizioni, festival e sagre di fine stagione. Usa ${month} ${year} per pianificare weekend e trasferte senza confonderlo con “eventi oggi”.`,
    9: `Ottobre apre l’autunno nei paesi interni: fiere, sagre e rassegne come Autunno in Barbagia quando sono in programma. Calendario di ${month} ${year}.`,
    10: `Novembre resta nel segno delle feste di paese e delle rassegne autunnali. Qui vedi solo ${month} ${year}, con link ai weekend datati del mese.`,
    11: `Dicembre porta Natale, mercatini e Capodanno dove pubblicati dagli organizzatori. Non inventiamo date: mostriamo ciò che è in calendario per ${month} ${year}.`,
  };

  return [
    `Questa è la landing di ${month} ${year} in Sardegna: eventi con data nel mese, comuni e locandine, pensata per query come “eventi Sardegna ${month} ${year}” e “sagre Sardegna ${month}”.`,
    seasonalByMonth[monthIndex] ??
      `Il calendario di ${month} ${year} si aggiorna man mano che arrivano nuove pubblicazioni.`,
    `Collega il mese ai weekend datati, a oggi/domani quando rilevanti, e alle categorie (sagre, concerti). Il mese precedente e successivo sono in fondo alla pagina.`,
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

/** Current calendar month in Europe/Rome. */
export function currentMonthLanding(from = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(from);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return monthLanding(year, month - 1);
}

export function findCalendarMonth(slug: string) {
  const match = MONTH_SLUG_RE.exec(slug);
  if (!match) return undefined;
  const monthName = match[1] as (typeof ITALIAN_MONTHS)[number];
  const monthIndex = ITALIAN_MONTHS.indexOf(monthName);
  const year = Number(match[2]);
  if (monthIndex < 0) return undefined;
  const currentYear = currentMonthLanding().year;
  if (year < CALENDAR_YEAR_MIN || year > currentYear + 1) return undefined;
  return monthLanding(year, monthIndex);
}

export function sagreExploreLinks() {
  const year = currentYearLanding();
  const months = upcomingCalendarMonths(4);
  return [
    { href: "/eventi-sardegna", label: "Eventi e sagre" },
    { href: year.path, label: year.title },
    { href: "/eventi-sardegna/sagre", label: "Sagre in Sardegna" },
    { href: "/eventi-oggi", label: "Oggi" },
    { href: "/eventi-domani", label: "Domani" },
    { href: "/eventi-weekend", label: "Weekend" },
    { href: "/eventi-domenica", label: "Domenica" },
    { href: "/eventi-sud-sardegna-oggi", label: "Sud oggi" },
    ...months.map((month) => ({
      href: month.path,
      label: `${month.name} ${month.year}`,
    })),
  ];
}
