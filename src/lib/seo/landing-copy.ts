import type { EventCardData } from "@/src/components/home/EventCard";
import { categories } from "@/src/data/categories";
import {
  categoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";
import type { DateLandingKey } from "@/src/lib/seo/dateRange";
import { currentMonthLanding, currentYearLanding } from "@/src/lib/seo/calendar";
import { formatEventHighlightList } from "@/src/lib/seo/weekends";

export type LandingLink = { href: string; label: string };

export type LandingStats = {
  total: number;
  freeCount: number;
  topCities: Array<{ name: string; count: number; href: string }>;
  topCategories: Array<{
    name: string;
    slug: string;
    count: number;
    href: string;
  }>;
};

function joinIt(parts: string[]) {
  return formatEventHighlightList(parts) ?? "";
}

function categorySlugForLabel(label: string) {
  const needle = label.toLocaleLowerCase("it");
  return categories.find(
    (category) => category.name.toLocaleLowerCase("it") === needle,
  )?.slug;
}

export function buildLandingStats(
  events: EventCardData[],
  options: { maxCities?: number; maxCategories?: number } = {},
): LandingStats {
  const maxCities = options.maxCities ?? 5;
  const maxCategories = options.maxCategories ?? 5;
  const cityCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let freeCount = 0;

  for (const event of events) {
    if (event.isFree) freeCount += 1;

    const city = (event.municipality || event.location || "").trim();
    if (city && city.toLocaleLowerCase("it") !== "sardegna") {
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }

    const labels =
      event.categories && event.categories.length > 0
        ? event.categories
        : event.category
          ? [event.category]
          : [];
    for (const label of labels) {
      const slug = categorySlugForLabel(label);
      if (!slug) continue;
      categoryCounts.set(slug, (categoryCounts.get(slug) ?? 0) + 1);
    }
  }

  const topCities = [...cityCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "it"))
    .slice(0, maxCities)
    .map(([name, count]) => ({
      name,
      count,
      href: cityEventsPath(name),
    }));

  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "it"))
    .slice(0, maxCategories)
    .map(([slug, count]) => {
      const category = categories.find((item) => item.slug === slug)!;
      return {
        name: category.name,
        slug,
        count,
        href: categoryEventsPath(slug),
      };
    });

  return { total: events.length, freeCount, topCities, topCategories };
}

function freeSentence(stats: LandingStats) {
  if (stats.freeCount <= 0) return null;
  if (stats.freeCount === stats.total) {
    return "In questa selezione tutti gli appuntamenti risultano gratuiti o a ingresso libero, dove indicato sulla scheda.";
  }
  return `Di questi, ${stats.freeCount} ${stats.freeCount === 1 ? "è segnalato" : "sono segnalati"} come gratuiti o a ingresso libero.`;
}

export function buildDateLandingEditorial(input: {
  dateKey: Exclude<DateLandingKey, "settimana">;
  stats: LandingStats;
  /** e.g. «venerdì 18 a domenica 20 settembre 2026» or «domenica 13 settembre 2026» */
  datePhrase: string;
  highlightTitles?: string[];
}) {
  const { dateKey, stats, datePhrase, highlightTitles = [] } = input;
  const cityNames = stats.topCities.slice(0, 3).map((city) => city.name);
  const categoryNames = stats.topCategories
    .slice(0, 3)
    .map((category) => category.name.toLocaleLowerCase("it"));
  const citiesJoined = cityNames.length ? joinIt(cityNames) : null;
  const categoriesJoined = categoryNames.length ? joinIt(categoryNames) : null;
  const highlightsJoined = formatEventHighlightList(highlightTitles);

  if (dateKey === "oggi") {
    const subtitle = `Programma di ${datePhrase} in tutta l’isola.`;
    if (stats.total === 0) {
      return {
        subtitle,
        intro:
          "Per oggi non ci sono ancora eventi pubblicati su EVERAS. Controlla domani, il weekend o il calendario del mese: aggiorniamo continuamente date e locandine.",
        paragraphs: [
          "Nel frattempo puoi aprire Eventi Sardegna domani, Eventi Sardegna questo weekend o gli eventi gratuiti, e tornare qui quando il programma della giornata si riempie.",
        ],
      };
    }

    const intro = categoriesJoined
      ? `Oggi in Sardegna trovi ${stats.total} ${stats.total === 1 ? "appuntamento" : "appuntamenti"} tra ${categoriesJoined}.${citiesJoined ? ` Scopri eventi a ${citiesJoined} e scegli cosa fare vicino a te.` : " Apri la scheda per orario, comune e ingresso."}`
      : `Oggi in Sardegna sono in programma ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} su EVERAS${citiesJoined ? `, con più presenza a ${citiesJoined}` : ""}. Ogni scheda riporta comune, orario e locandina.`;

    const paragraphs: string[] = [];
    const free = freeSentence(stats);
    if (free) paragraphs.push(free);
    paragraphs.push(
      "Confronta con il programma di domani e con il weekend se stai organizzando più di una sera. EVERAS indica dove trovare il biglietto quando l’organizzatore lo ha pubblicato: non sostituisce la biglietteria ufficiale.",
    );
    return { subtitle, intro, paragraphs };
  }

  if (dateKey === "domani") {
    const subtitle = `Pianifica ${datePhrase} con date e luoghi aggiornati.`;
    if (stats.total === 0) {
      return {
        subtitle,
        intro:
          "Per domani non ci sono ancora eventi pubblicati su EVERAS. Guarda cosa c’è oggi, prepara il weekend oppure apri il mese in corso mentre il calendario si aggiorna.",
        paragraphs: [
          "Le schede compaiono qui appena Comuni, Pro Loco e organizzatori pubblicano nuove date. Puoi anche esplorare sagre e concerti dalle categorie e tornare a questa pagina più tardi.",
        ],
      };
    }

    const intro = citiesJoined
      ? `Domani in Sardegna il calendario conta ${stats.total} ${stats.total === 1 ? "evento" : "eventi"}${categoriesJoined ? ` tra ${categoriesJoined}` : ""}. Le località con più appuntamenti in elenco sono ${citiesJoined}.`
      : `Domani in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento già pubblicato" : "eventi già pubblicati"}${categoriesJoined ? ` tra ${categoriesJoined}` : ""}. Usa le schede per luogo, orario e dettagli pratici.`;

    const paragraphs: string[] = [];
    const free = freeSentence(stats);
    if (free) paragraphs.push(free);
    paragraphs.push(
      "Se la giornata di oggi è già piena, questa pagina serve a chiudere il programma di Eventi Sardegna domani prima di partire. Quando il fine settimana è vicino, passa anche a Eventi Sardegna questo weekend.",
    );
    return { subtitle, intro, paragraphs };
  }

  if (dateKey === "domenica") {
    const subtitle = `Solo ${datePhrase}, non tutto il weekend.`;
    if (stats.total === 0) {
      return {
        subtitle,
        intro:
          "Per la prossima domenica non ci sono ancora eventi pubblicati su EVERAS. Controlla Eventi Sardegna questo weekend, oggi o il mese in corso.",
        paragraphs: [
          "Questa pagina elenca solo la domenica: sagre, processioni e concerti di quel giorno. Il venerdì e il sabato restano su Eventi Sardegna questo weekend.",
        ],
      };
    }

    const intro = citiesJoined
      ? `Domenica in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"}${categoriesJoined ? ` tra ${categoriesJoined}` : ""}, con più presenza a ${citiesJoined}.`
      : `Domenica in Sardegna sono in programma ${stats.total} ${stats.total === 1 ? "appuntamento" : "appuntamenti"}${categoriesJoined ? ` tra ${categoriesJoined}` : ""}. Apri la scheda per comune, orario e ingresso.`;

    const paragraphs: string[] = [];
    const free = freeSentence(stats);
    if (free) paragraphs.push(free);
    paragraphs.push(
      "È la vista della sola domenica del weekend in corso (o di oggi, se sei già in domenica). Per venerdì e sabato usa Eventi Sardegna questo weekend; per lunedì Eventi Sardegna domani quando cade così.",
    );
    return { subtitle, intro, paragraphs };
  }

  // weekend evergreen
  const subtitle = `Da ${datePhrase} su tutta l’isola.`;
  if (stats.total === 0) {
    return {
      subtitle,
      intro: `Per il weekend ${datePhrase} non ci sono ancora eventi pubblicati su EVERAS. Torna tra poco oppure esplora il mese, le sagre e gli eventi gratuiti.`,
      paragraphs: [
        "Il fine settimana corrente si aggiorna in automatico: quando arrivano nuove locandine le trovi qui, senza dover cercare la pagina datata.",
      ],
    };
  }

  const intro = `Questo weekend in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} tra sagre, concerti, festival e attività.${categoriesJoined ? ` Tra le tipologie più presenti: ${categoriesJoined}.` : ""}${citiesJoined ? ` Più presenza a ${citiesJoined}.` : ""}`;

  const paragraphs: string[] = [];
  const free = freeSentence(stats);
  if (free) paragraphs.push(free);
  if (highlightsJoined) {
    paragraphs.push(`Tra gli appuntamenti in calendario: ${highlightsJoined}.`);
  }
  paragraphs.push(
    "Questa è la landing evergreen del weekend in corso (venerdì–domenica). Per un fine settimana con date fisse usa le pagine datate del calendario; per oggi e domani restano le pagine dedicate. Apri la scheda per conferma di orario e ingresso.",
  );
  if (stats.total >= 8) {
    paragraphs.push(
      "Se stai organizzando un giro in giornata, parti dalle località in evidenza e verifica i tempi di spostamento: in Sardegna contano più dei chilometri sulla carta.",
    );
  }

  return { subtitle, intro, paragraphs };
}

export function buildDateLandingFaqs(
  dateKey: Exclude<DateLandingKey, "settimana">,
  stats: LandingStats,
  datePhrase: string,
) {
  const whenLabel =
    dateKey === "oggi"
      ? "oggi"
      : dateKey === "domani"
        ? "domani"
        : dateKey === "domenica"
          ? "domenica"
          : "questo weekend";

  return [
    {
      question: `Dove trovo gli eventi di ${whenLabel} in Sardegna?`,
      answer:
        stats.total > 0
          ? `In questa pagina: ${stats.total} ${stats.total === 1 ? "appuntamento" : "appuntamenti"} per ${datePhrase}. Apri la scheda per orario, comune e ingresso.`
          : `Quando sono pubblicati compaiono qui. Intanto esplora weekend, mese e categorie su EVERAS.`,
    },
    {
      question: "Le date sono aggiornate?",
      answer:
        "Sì: mostriamo solo eventi pubblicati sul calendario EVERAS. Controlla sempre orario e dettagli sulla scheda prima di partire.",
    },
    {
      question: "Posso filtrare per città o categoria?",
      answer:
        "Sì. Usa i collegamenti rapidi in pagina oppure la ricerca eventi per restringere per comune e tipologia.",
    },
  ];
}

export function buildDateLandingLinks(
  dateKey: Exclude<DateLandingKey, "settimana">,
  stats: LandingStats,
): { quickLinks: LandingLink[]; relatedLinks: LandingLink[] } {
  const month = currentMonthLanding();
  const year = currentYearLanding();
  const dateLinks: LandingLink[] = [
    { href: "/eventi-oggi", label: "Eventi Sardegna oggi" },
    { href: "/eventi-domani", label: "Eventi Sardegna domani" },
    { href: "/eventi-weekend", label: "Eventi Sardegna questo weekend" },
    { href: "/eventi-domenica", label: "Eventi Sardegna domenica" },
    { href: "/eventi-sud-sardegna-oggi", label: "Eventi Sud Sardegna oggi" },
  ].filter((link) => {
    if (dateKey === "oggi") return link.href !== "/eventi-oggi";
    if (dateKey === "domani") return link.href !== "/eventi-domani";
    if (dateKey === "domenica") return link.href !== "/eventi-domenica";
    return link.href !== "/eventi-weekend";
  });

  const quickLinks: LandingLink[] = [
    ...stats.topCities.slice(0, 4).map((city) => ({
      href: city.href,
      label: city.name,
    })),
    ...stats.topCategories.slice(0, 4).map((category) => ({
      href: category.href,
      label: category.name,
    })),
  ];

  const relatedLinks: LandingLink[] = [
    ...dateLinks,
    { href: "/eventi-gratuiti", label: "Eventi gratuiti in Sardegna" },
    {
      href: month.path,
      label: month.title,
    },
    { href: year.path, label: year.title },
    { href: "/eventi-sardegna", label: "Calendario eventi in Sardegna" },
    { href: "/eventi-sardegna/sagre", label: "Sagre in Sardegna" },
    { href: "/eventi", label: "Cerca e filtra tutti gli eventi" },
    { href: "/eventi/sagre-tradizioni", label: "Sagre e tradizioni" },
    { href: "/eventi/musica-concerti", label: "Concerti e spettacoli" },
  ];

  return { quickLinks, relatedLinks };
}

export function eventOverlapsRange(
  event: Pick<EventCardData, "startDate" | "endDate">,
  range: { start: Date; end: Date },
) {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : start;
  return start < range.end && end >= range.start;
}

export function splitCityLandingEvents(
  upcoming: EventCardData[],
  ranges: { today: { start: Date; end: Date }; weekend: { start: Date; end: Date } },
) {
  const today = upcoming.filter((event) =>
    eventOverlapsRange(event, ranges.today),
  );
  const todayIds = new Set(today.map((event) => event.eventId));
  const weekend = upcoming.filter(
    (event) =>
      eventOverlapsRange(event, ranges.weekend) && !todayIds.has(event.eventId),
  );
  const listedIds = new Set([
    ...todayIds,
    ...weekend.map((event) => event.eventId),
  ]);
  const upcomingRest = upcoming.filter(
    (event) => !listedIds.has(event.eventId),
  );

  return { today, weekend, upcomingRest };
}

export function buildCityLandingEditorial(input: {
  cityName: string;
  area: string;
  upcomingCount: number;
  todayCount: number;
  weekendCount: number;
  freeCount: number;
  topCategories: LandingStats["topCategories"];
}) {
  const {
    cityName,
    area,
    upcomingCount,
    todayCount,
    weekendCount,
    freeCount,
    topCategories,
  } = input;

  const subtitleParts: string[] = [];
  if (todayCount > 0) {
    subtitleParts.push(
      `${todayCount} ${todayCount === 1 ? "evento oggi" : "eventi oggi"}`,
    );
  }
  if (weekendCount > 0) {
    subtitleParts.push(
      `${weekendCount} nel weekend`,
    );
  }
  if (upcomingCount > 0) {
    subtitleParts.push(
      `${upcomingCount} ${upcomingCount === 1 ? "prossimo" : "prossimi"} in calendario`,
    );
  }
  const subtitle =
    subtitleParts.length > 0
      ? `A ${cityName}: ${subtitleParts.join(" · ")}.`
      : `Calendario eventi a ${cityName}.`;

  const intro =
    upcomingCount === 0
      ? `Al momento non ci sono eventi futuri pubblicati a ${cityName}. Quando Comuni, Pro Loco e organizzatori caricano nuove date, le trovi qui con orario, luogo e locandina.`
      : `Scopri gli eventi in programma a ${cityName}, in ${area}. In questa pagina trovi concerti, sagre, spettacoli e appuntamenti per il tempo libero${
          todayCount > 0
            ? `: oggi ${todayCount === 1 ? "c’è 1 evento" : `ci sono ${todayCount} eventi`}`
            : ""
        }${
          weekendCount > 0
            ? `${todayCount > 0 ? "," : ":"} nel prossimo weekend ${weekendCount}`
            : ""
        }.`;

  const paragraphs: string[] = [];
  if (upcomingCount > 0) {
    if (topCategories.length > 0) {
      paragraphs.push(
        `Le tipologie più presenti a ${cityName} in questo periodo sono ${joinIt(
          topCategories
            .slice(0, 3)
            .map((category) => category.name.toLocaleLowerCase("it")),
        )}. Apri la scheda per conferma di orario e ingresso.`,
      );
    }
    if (freeCount > 0) {
      paragraphs.push(
        freeCount === upcomingCount
          ? `Gli appuntamenti in elenco risultano gratuiti o a ingresso libero, dove indicato sulla scheda.`
          : `Tra i prossimi eventi, ${freeCount} ${freeCount === 1 ? "è segnalato" : "sono segnalati"} come gratuiti o a ingresso libero.`,
      );
    }
    paragraphs.push(
      `Usa i collegamenti a oggi, weekend e categorie per restringere la ricerca, oppure apri la guida Cultura di ${cityName} per contesto su musei e tradizioni del paese.`,
    );
  } else {
    paragraphs.push(
      `Nel frattempo esplora gli eventi in Sardegna oggi e nel weekend, oppure la guida Cultura di ${cityName} per musei, tradizioni e cosa visitare.`,
    );
  }

  return { subtitle, intro, paragraphs };
}

const CATEGORY_HOOKS: Record<string, string> = {
  "musica-concerti":
    "Dal live in piazza ai festival e agli spettacoli teatrali, questa categoria raccoglie la programmazione musicale e di scena sull’isola.",
  "sagre-tradizioni":
    "Sagre di paese, feste patronali e appuntamenti legati alle tradizioni: cibo, corti aperte e rituali che cambiano di borgo in borgo.",
  "locali-ballo":
    "Serate in locale, DJ set e ballo: per chi cerca l’atmosfera notturna oltre al grande evento all’aperto.",
  "sport-competizioni":
    "Gare, tornei e appuntamenti sportivi aperti al pubblico, dalla corsa alla vela fino agli eventi amatoriali.",
  "fiere-mercatini":
    "Fiere, mercatini e mercati tematici: bancarelle, artigianato e prodotti locali in città e nei paesi.",
  "arte-cultura":
    "Mostre, visite, rassegne e appuntamenti culturali in musei, gallerie e spazi pubblici.",
  "workshop-corsi":
    "Laboratori, corsi e incontri formativi aperti a chi vuole imparare o approfondire un mestiere o una pratica.",
  celebrazioni:
    "Ricorrenze civiche e celebrazioni collettive quando sono aperte al calendario EVERAS.",
  "food-drink":
    "Degustazioni, food festival, aperitivi e appuntamenti enogastronomici oltre le sagre classiche.",
  "famiglie-bambini":
    "Laboratori, spettacoli e uscite pensate anche per famiglie e bambini, con orari e luoghi sulla scheda.",
  benessere:
    "Yoga, wellness e momenti di cura del corpo aperti al pubblico quando pubblicati dagli organizzatori.",
  "business-networking":
    "Incontri professionali, networking e appuntamenti per chi lavora o fa impresa in Sardegna.",
};

export function buildCategoryLandingEditorial(input: {
  categoryName: string;
  categorySlug: string;
  upcomingCount: number;
  todayCount: number;
  weekendCount: number;
  freeCount: number;
  topCities: LandingStats["topCities"];
}) {
  const {
    categoryName,
    categorySlug,
    upcomingCount,
    todayCount,
    weekendCount,
    freeCount,
    topCities,
  } = input;

  const label = categoryName.toLocaleLowerCase("it");
  const hook = CATEGORY_HOOKS[categorySlug];

  const subtitleParts: string[] = [];
  if (todayCount > 0) {
    subtitleParts.push(
      `${todayCount} ${todayCount === 1 ? "oggi" : "oggi"}`,
    );
  }
  if (weekendCount > 0) {
    subtitleParts.push(`${weekendCount} nel weekend`);
  }
  if (upcomingCount > 0) {
    subtitleParts.push(
      `${upcomingCount} ${upcomingCount === 1 ? "in programma" : "in programma"}`,
    );
  }
  const subtitle =
    subtitleParts.length > 0
      ? `${categoryName} in Sardegna: ${subtitleParts.join(" · ")}.`
      : `${categoryName} in Sardegna su EVERAS.`;

  let intro: string;
  if (upcomingCount === 0) {
    intro = `Al momento non ci sono ${label} futuri pubblicati su EVERAS. Quando arrivano nuove date le trovi qui, con comune, orario e locandina.`;
  } else {
    const timing: string[] = [];
    if (todayCount > 0) timing.push(`oggi ${todayCount}`);
    if (weekendCount > 0) timing.push(`nel weekend ${weekendCount}`);
    intro = `In Sardegna trovi ${upcomingCount} ${upcomingCount === 1 ? "appuntamento" : "appuntamenti"} di ${label} già in calendario${
      timing.length > 0 ? ` (${timing.join(", ")})` : ""
    }.`;
  }

  const paragraphs: string[] = [];
  if (hook) paragraphs.push(hook);

  if (upcomingCount > 0) {
    if (topCities.length > 0) {
      paragraphs.push(
        topCities.length === 1
          ? `In questo periodo la località con più ${label} è ${topCities[0].name}.`
          : `Tra le località con più ${label} in questo periodo ci sono ${joinIt(
              topCities.slice(0, 3).map((city) => city.name),
            )}.`,
      );
    }
    if (freeCount > 0) {
      paragraphs.push(
        freeCount === upcomingCount
          ? `Gli eventi in elenco risultano gratuiti o a ingresso libero, dove indicato sulla scheda.`
          : `Di questi, ${freeCount} ${freeCount === 1 ? "è segnalato" : "sono segnalati"} come gratuiti o a ingresso libero.`,
      );
    }
    paragraphs.push(
      `Apri la scheda per dettagli pratici, oppure restringi per città dai collegamenti rapidi. Puoi anche confrontare con oggi, weekend e il mese in corso.`,
    );
  } else {
    paragraphs.push(
      `Nel frattempo esplora gli eventi di oggi e del weekend in tutta la Sardegna, o passa al calendario mensile.`,
    );
  }

  return { subtitle, intro, paragraphs };
}

export function buildCityCategoryLandingEditorial(input: {
  cityName: string;
  categoryName: string;
  upcomingCount: number;
  todayCount: number;
  weekendCount: number;
  freeCount: number;
}) {
  const {
    cityName,
    categoryName,
    upcomingCount,
    todayCount,
    weekendCount,
    freeCount,
  } = input;
  const label = categoryName.toLocaleLowerCase("it");

  const subtitleParts: string[] = [];
  if (todayCount > 0) subtitleParts.push(`${todayCount} oggi`);
  if (weekendCount > 0) subtitleParts.push(`${weekendCount} nel weekend`);
  if (upcomingCount > 0) {
    subtitleParts.push(`${upcomingCount} in calendario`);
  }
  const subtitle =
    subtitleParts.length > 0
      ? `${categoryName} a ${cityName}: ${subtitleParts.join(" · ")}.`
      : `${categoryName} a ${cityName} su EVERAS.`;

  const intro =
    upcomingCount === 0
      ? `Al momento non ci sono ${label} futuri pubblicati a ${cityName}. Controlla tutti gli eventi della città o la categoria in Sardegna.`
      : `Calendario di ${label} a ${cityName}: ${upcomingCount} ${upcomingCount === 1 ? "appuntamento" : "appuntamenti"} in programma${
          todayCount > 0 || weekendCount > 0
            ? ` (${[
                todayCount > 0 ? `${todayCount} oggi` : null,
                weekendCount > 0 ? `${weekendCount} nel weekend` : null,
              ]
                .filter(Boolean)
                .join(", ")})`
            : ""
        }.`;

  const paragraphs: string[] = [];
  if (upcomingCount > 0) {
    if (freeCount > 0) {
      paragraphs.push(
        freeCount === upcomingCount
          ? `In elenco risultano gratuiti o a ingresso libero, dove indicato sulla scheda.`
          : `${freeCount} ${freeCount === 1 ? "evento è gratuito" : "eventi sono gratuiti"} o a ingresso libero, dove segnalato.`,
      );
    }
    paragraphs.push(
      `Apri la scheda per orario e luogo. Da qui puoi passare a tutti gli eventi a ${cityName}, a ${label} in Sardegna, oppure a oggi e al weekend.`,
    );
  } else {
    paragraphs.push(
      `Torna presto, oppure esplora gli eventi a ${cityName} e ${label} in tutta l’isola.`,
    );
  }

  return { subtitle, intro, paragraphs };
}
