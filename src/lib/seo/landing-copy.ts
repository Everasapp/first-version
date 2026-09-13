import type { EventCardData } from "@/src/components/home/EventCard";
import { categories } from "@/src/data/categories";
import {
  categoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";
import type { DateLandingKey } from "@/src/lib/seo/dateRange";
import { currentMonthLanding } from "@/src/lib/seo/calendar";
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

function citySentence(stats: LandingStats) {
  if (stats.topCities.length === 0) return null;
  const names = stats.topCities.slice(0, 3).map((city) => city.name);
  if (names.length === 1) {
    return `${names[0]} è la località con più appuntamenti in questo elenco.`;
  }
  return `${joinIt(names)} sono tra le località con più eventi in programma.`;
}

function categorySentence(stats: LandingStats) {
  if (stats.topCategories.length === 0) return null;
  const names = stats.topCategories
    .slice(0, 3)
    .map((category) => category.name.toLocaleLowerCase("it"));
  return `Tra le tipologie più presenti trovi ${joinIt(names)}.`;
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
}) {
  const { dateKey, stats, datePhrase } = input;
  const when =
    dateKey === "oggi"
      ? "oggi"
      : dateKey === "domani"
        ? "domani"
        : "questo weekend";

  const subtitle =
    dateKey === "weekend"
      ? `Scopri cosa fare in Sardegna da ${datePhrase}.`
      : dateKey === "oggi"
        ? `Cosa fare in Sardegna ${datePhrase}.`
        : `Il programma di ${datePhrase} in tutta l’isola.`;

  const intro =
    stats.total === 0
      ? dateKey === "weekend"
        ? `Per il weekend ${datePhrase} non ci sono ancora eventi pubblicati su EVERAS. Torna tra poco oppure esplora il calendario del mese e le guide alle feste più cercate.`
        : `Per ${when} non ci sono ancora eventi pubblicati su EVERAS. Controlla domani, il weekend o il calendario mensile: aggiorniamo continuamente date e locandine da tutta la Sardegna.`
      : dateKey === "weekend"
        ? `Questo weekend in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} tra concerti, sagre, festival e appuntamenti culturali. L’elenco copre da ${datePhrase} e si aggiorna man mano che Comuni, Pro Loco e organizzatori pubblicano nuove date.`
        : dateKey === "oggi"
          ? `Oggi in Sardegna sono in programma ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} su EVERAS: concerti, sagre, cultura e tempo libero, con comune, orario e locandina sulla scheda.`
          : `Domani in Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"} già pubblicati: scegli città e categoria, poi apri la scheda per luogo e dettagli pratici.`;

  const paragraphs: string[] = [];

  if (stats.total > 0) {
    const cities = citySentence(stats);
    const cats = categorySentence(stats);
    const free = freeSentence(stats);
    const bodyParts = [cities, cats, free].filter(Boolean) as string[];
    if (bodyParts.length > 0) {
      paragraphs.push(bodyParts.join(" "));
    }

    paragraphs.push(
      dateKey === "weekend"
        ? `Usa i collegamenti rapidi sotto per passare alle città e alle categorie con più presenza nel weekend, oppure apri oggi, domani e il mese in corso. Ogni scheda evento resta il punto di verità per orario, ingresso e come arrivare.`
        : `Filtra per città o tipologia dai collegamenti rapidi, confronta con il weekend e con il mese in corso, e apri la scheda per conferma di orario e luogo. EVERAS non sostituisce il biglietto: indica dove trovarlo quando l’organizzatore lo ha pubblicato.`,
    );

    if (stats.total >= 8) {
      paragraphs.push(
        `Se stai organizzando un giro in giornata, parti dalle località in evidenza e verifica sulla mappa del comune come muoverti: in Sardegna i tempi di spostamento contano più delle distanze in chilometri.`,
      );
    }
  } else {
    paragraphs.push(
      `Nel frattempo puoi guardare gli eventi del weekend, il calendario mensile o le categorie più cercate — sagre, musica, famiglie — e tornare qui quando il programma si riempie.`,
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
  const dateLinks: LandingLink[] = [
    { href: "/eventi-oggi", label: "Eventi oggi" },
    { href: "/eventi-domani", label: "Eventi domani" },
    { href: "/eventi-weekend", label: "Eventi weekend" },
  ].filter((link) => {
    if (dateKey === "oggi") return link.href !== "/eventi-oggi";
    if (dateKey === "domani") return link.href !== "/eventi-domani";
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
    { href: month.path, label: `Eventi ${month.name} ${month.year}` },
    { href: "/eventi-sardegna", label: "Calendario eventi Sardegna" },
    { href: "/eventi", label: "Tutti gli eventi" },
    { href: "/eventi/sagre-tradizioni", label: "Sagre e tradizioni" },
    { href: "/eventi/musica-concerti", label: "Musica e spettacoli" },
    { href: "/eventi/famiglie-bambini", label: "Famiglie e bambini" },
  ];

  return { quickLinks, relatedLinks };
}
