import type { Metadata } from "next";

import type { EventCardData } from "@/src/components/home/EventCard";
import EventLandingView from "@/src/components/seo/EventLandingView";
import { categories } from "@/src/data/categories";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { currentMonthLanding, sagreExploreLinks, yearLanding } from "@/src/lib/seo/calendar";
import { getDateRange } from "@/src/lib/seo/dateRange";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl } from "@/src/lib/seo/site";
import { findCulturaTownPathByName } from "@/src/lib/seo/cultura-towns";
import { cityEventsPath } from "@/src/lib/seo/paths";
import {
  buildLandingStats,
  splitCityLandingEvents,
} from "@/src/lib/seo/landing-copy";
import { EVENTI_SARDEGNA_HUB_INTENT } from "@/src/lib/seo/landing-intents";
import { formatEventHighlightList } from "@/src/lib/seo/weekends";
import { dedupeLinks, temporalExploreLinks } from "@/src/lib/seo/internal-links";

const HUB_PATH = EVENTI_SARDEGNA_HUB_INTENT.path;
const HUB_H1 = EVENTI_SARDEGNA_HUB_INTENT.h1;
const HUB_TITLE = EVENTI_SARDEGNA_HUB_INTENT.seoTitle;

const HUB_COVER = {
  src: "/images/seo/eventi-sardegna-cover.webp",
  alt: "Piazza in Sardegna con sagra e concerto all’aperto la sera",
};

const GEO_CITIES = ["Cagliari", "Sassari", "Olbia", "Alghero", "Nuoro"] as const;

const HIGHLIGHT_MATCHERS: Array<{ label: string; match: RegExp }> = [
  { label: "Autunno in Barbagia", match: /autunno in barbagia/i },
  { label: "Santa Greca", match: /santa greca/i },
  { label: "Festival della Bottarga", match: /bottarga/i },
  { label: "JazzAlguer", match: /jazzalguer|jazz alguer/i },
  { label: "Monumenti Aperti", match: /monumenti aperti/i },
  { label: "Isole che Parlano", match: /isole che parlano/i },
];

const SAGRE_CATEGORY_SLUGS = new Set(["sagre-tradizioni", "celebrazioni"]);
const CONCERTI_CATEGORY_SLUGS = new Set(["musica-concerti"]);

function eventCategorySlugs(event: EventCardData): string[] {
  const labels =
    event.categories && event.categories.length > 0
      ? event.categories
      : event.category
        ? [event.category]
        : [];
  return labels
    .map((label) => {
      const needle = label.toLocaleLowerCase("it");
      return categories.find(
        (category) => category.name.toLocaleLowerCase("it") === needle,
      )?.slug;
    })
    .filter((slug): slug is string => Boolean(slug));
}

function eventMatchesSlugs(event: EventCardData, slugs: Set<string>) {
  return eventCategorySlugs(event).some((slug) => slugs.has(slug));
}

function takeMatching(
  pool: EventCardData[],
  predicate: (event: EventCardData) => boolean,
  limit: number,
) {
  const matched = pool.filter(predicate).slice(0, limit);
  const matchedIds = new Set(matched.map((event) => event.eventId));
  return {
    matched,
    remaining: pool.filter((event) => !matchedIds.has(event.eventId)),
  };
}

function buildHubEditorial(stats: ReturnType<typeof buildLandingStats>) {
  const cityNames = stats.topCities.slice(0, 4).map((city) => city.name);
  const categoryNames = stats.topCategories
    .slice(0, 4)
    .map((category) => category.name.toLocaleLowerCase("it"));
  const citiesJoined = formatEventHighlightList(cityNames);
  const categoriesJoined = formatEventHighlightList(categoryNames);

  const intro =
    stats.total === 0
      ? "EVERAS è il calendario aggiornato degli eventi in Sardegna: sagre, feste tradizionali, concerti, spettacoli e festival. Quando ci sono date pubblicate le trovi qui, con scorciatoie per oggi, il weekend e i mesi."
      : `EVERAS è il calendario aggiornato degli eventi in Sardegna: ${stats.total} ${stats.total === 1 ? "appuntamento" : "appuntamenti"} già in programma${categoriesJoined ? `, tra ${categoriesJoined}` : ""}${citiesJoined ? `, con più presenza a ${citiesJoined}` : ""}. Da qui parti per oggi, il weekend e le prossime settimane sull’isola.`;

  const paragraphs = [
    "Se ti serve sapere cosa fare in Sardegna oggi, questo weekend o nei prossimi giorni, usa i collegamenti sotto: trovi sagre e feste di paese, concerti e spettacoli, festival e anche gli eventi gratuiti quando l’ingresso libero è indicato sulla scheda.",
    stats.freeCount > 0
      ? `In questo momento ${stats.freeCount} ${stats.freeCount === 1 ? "appuntamento è segnalato" : "appuntamenti sono segnalati"} come gratuiti o a ingresso libero: puoi aprirli dalla sezione dedicata o dalla pagina Eventi gratuiti in Sardegna.`
      : "Molte sagre e feste di piazza sono a ingresso libero; concerti e festival possono richiedere biglietto. Controlla sempre la scheda: EVERAS indica dove trovarlo quando l’organizzatore lo pubblica.",
    "Il catalogo con filtri è su Cerca eventi; questa pagina resta l’hub editoriale del calendario. Pubblicare una sagra o un concerto su EVERAS lo fa entrare in guida e nelle pagine città.",
  ];

  return { intro, paragraphs };
}

export async function generateMetadata(): Promise<Metadata> {
  const { events } = await loadFilteredPublishedEvents();
  const stats = buildLandingStats(events);
  const description =
    stats.total > 0
      ? `Scopri ${stats.total} eventi in Sardegna: sagre, concerti e attività. Cosa fare oggi, questo weekend e nelle prossime settimane su EVERAS.`
      : EVENTI_SARDEGNA_HUB_INTENT.metaDescription;

  return {
    title: HUB_TITLE,
    description,
    alternates: { canonical: HUB_PATH },
    openGraph: {
      title: `${HUB_TITLE} | EVERAS`,
      description,
      url: HUB_PATH,
      type: "website",
      images: [
        { url: HUB_COVER.src, width: 1200, height: 630, alt: HUB_COVER.alt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${HUB_TITLE} | EVERAS`,
      description,
      images: [HUB_COVER.src],
    },
  };
}

function formatHighlightMeta(startDate: string, municipality?: string) {
  const date = new Date(startDate);
  const dateLabel = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  return [dateLabel, municipality?.trim()].filter(Boolean).join(" · ");
}

export default async function EventiSardegnaHubPage() {
  const { events, error } = await loadFilteredPublishedEvents();
  const stats = buildLandingStats(events);
  const editorial = buildHubEditorial(stats);
  const month = currentMonthLanding();
  const year = yearLanding(month.year);
  const weekendLinks = weekendExploreLinks(2);
  const datedWeekends = weekendLinks.map((link) => link.label).join(" e ");

  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(events, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });

  let pool = upcomingRest;
  const sagreTake = takeMatching(
    pool,
    (event) => eventMatchesSlugs(event, SAGRE_CATEGORY_SLUGS),
    pool.length,
  );
  pool = sagreTake.remaining;
  const concertiTake = takeMatching(
    pool,
    (event) => eventMatchesSlugs(event, CONCERTI_CATEGORY_SLUGS),
    pool.length,
  );
  pool = concertiTake.remaining;
  const freeTake = takeMatching(pool, (event) => event.isFree, pool.length);
  pool = freeTake.remaining;

  const sections = [
    ...(today.length > 0
      ? [
          {
            id: "oggi",
            title: "Eventi di oggi in Sardegna",
            events: today,
          },
        ]
      : []),
    ...(weekend.length > 0
      ? [
          {
            id: "weekend",
            title: "Eventi del weekend",
            events: weekend,
          },
        ]
      : []),
    ...(sagreTake.matched.length > 0
      ? [
          {
            id: "sagre",
            title: "Sagre e feste tradizionali",
            events: sagreTake.matched,
          },
        ]
      : []),
    ...(concertiTake.matched.length > 0
      ? [
          {
            id: "concerti",
            title: "Concerti e spettacoli",
            events: concertiTake.matched,
          },
        ]
      : []),
    ...(freeTake.matched.length > 0
      ? [
          {
            id: "gratuiti",
            title: "Eventi gratuiti",
            events: freeTake.matched,
          },
        ]
      : []),
    ...(pool.length > 0
      ? [
          {
            id: "prossimi",
            title: "Altri prossimi eventi",
            events: pool,
          },
        ]
      : []),
  ];

  const listedInSections = sections.flatMap((section) => section.events);
  const upcoming =
    listedInSections.length > 0 ? listedInSections : events;

  const faqs = [
    {
      question: "Cosa c’è da fare in Sardegna questo fine settimana?",
      answer: `Apri Eventi Sardegna questo weekend per il fine settimana in corso. Se stai pianificando giorni precisi, usa le pagine datate${datedWeekends ? `, per esempio ${datedWeekends}` : ""}.`,
    },
    {
      question: "Quali sono gli eventi in programma oggi in Sardegna?",
      answer:
        "La pagina Eventi Sardegna oggi mostra solo gli appuntamenti della giornata in corso. Da lì passi a Eventi Sardegna domenica, al weekend e al Sud.",
    },
    {
      question: "Dove trovare le sagre in Sardegna?",
      answer:
        "Apri Sagre in Sardegna per il calendario evergreen delle feste di paese. Trovi anche hub come Autunno in Barbagia o Santa Greca quando sono in stagione.",
    },
    {
      question: "Quali eventi ci sono a Cagliari, Sassari o Olbia?",
      answer:
        "Usa i link città in questa pagina. Per contesto sui luoghi apri anche le guide Scopri della città.",
    },
    {
      question: "Gli eventi in Sardegna sono gratuiti?",
      answer:
        "Dipende dall’appuntamento. La pagina Eventi gratuiti in Sardegna raccoglie solo quelli segnalati free o a ingresso libero.",
    },
    {
      question: `Dov’è il calendario eventi Sardegna ${year.year}?`,
      answer: `Apri ${year.title}: i mesi da gennaio a dicembre, con sagre, concerti e festival già pubblicati.`,
    },
    {
      question: "Come segnalare un evento su EVERAS?",
      answer:
        "Dalla home puoi pubblicare titolo, date, comune e locandina. Dopo la revisione compare nel calendario e nelle pagine città.",
    },
  ];

  const highlights = HIGHLIGHT_MATCHERS.map((item) => {
    const event = events.find((row) => item.match.test(row.title));
    if (!event) return null;
    return {
      href: `/eventi/${event.id}`,
      label: item.label,
      meta: formatHighlightMeta(event.startDate, event.municipality),
    };
  }).filter((row): row is NonNullable<typeof row> => row != null);

  const hubHighlights = [
    {
      href: "/eventi-oggi",
      label: "Eventi Sardegna oggi",
      meta: "Solo la giornata odierna",
    },
    {
      href: "/eventi-weekend",
      label: "Eventi Sardegna questo weekend",
      meta:
        weekendLinks.map((l) => l.label).join(" · ") || "Fine settimana in corso",
    },
    {
      href: "/eventi-sardegna/sagre",
      label: "Sagre in Sardegna",
      meta: "Calendario feste di paese",
    },
    {
      href: "/eventi/musica-concerti",
      label: "Concerti e spettacoli",
      meta: "Musica live sull’isola",
    },
    {
      href: year.path,
      label: year.title,
      meta: "Tutti i mesi dell’anno",
    },
    {
      href: month.path,
      label: month.title,
      meta: "Calendario del mese in corso",
    },
    {
      href: "/eventi-domenica",
      label: "Eventi Sardegna domenica",
      meta: "Solo la domenica del weekend",
    },
    {
      href: "/eventi-sud-sardegna-oggi",
      label: "Eventi Sud Sardegna oggi",
      meta: "Cagliari e il Sud",
    },
    {
      href: "/eventi-gratuiti",
      label: "Eventi gratuiti in Sardegna",
      meta: "Ingresso libero dove indicato",
    },
  ];

  const mergedHighlights = [
    ...hubHighlights,
    ...highlights.filter(
      (item) =>
        !hubHighlights.some((hub) =>
          hub.label.toLowerCase().includes(item.label.toLowerCase()),
        ),
    ),
  ].slice(0, 10);

  const geoQuickLinks = GEO_CITIES.flatMap((city) => {
    const cultura = findCulturaTownPathByName(city);
    return [
      { href: cityEventsPath(city), label: city },
      ...(cultura ? [{ href: cultura, label: `Guida ${city}` }] : []),
    ];
  });

  return (
    <EventLandingView
        eyebrow="Guida eventi"
        h1={HUB_H1}
        subtitle="Cosa fare in Sardegna oggi e nei prossimi giorni"
        intro={editorial.intro}
        paragraphs={editorial.paragraphs}
        events={upcoming}
        resultCount={stats.total}
        sections={sections.length > 0 ? sections : undefined}
        errorMessage={error?.message}
        cover={HUB_COVER}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Eventi in Sardegna" },
        ]}
        faqs={faqs}
        quickLinks={[
          { href: "/eventi-oggi", label: "Eventi oggi" },
          { href: "/eventi-domani", label: "Domani" },
          { href: "/eventi-weekend", label: "Questo weekend" },
          { href: "/eventi-domenica", label: "Domenica" },
          { href: "/eventi-sud-sardegna-oggi", label: "Sud oggi" },
          { href: year.path, label: `Calendario ${year.year}` },
          { href: month.path, label: month.name },
          { href: "/eventi-sardegna/sagre", label: "Sagre" },
          { href: "/eventi/musica-concerti", label: "Concerti" },
          { href: "/eventi-gratuiti", label: "Gratuiti" },
          ...weekendLinks,
          ...geoQuickLinks.slice(0, 10),
          { href: "/eventi", label: "Cerca eventi" },
        ]}
        highlights={mergedHighlights}
        highlightsTitle="Calendario: oggi, weekend, sagre e festival"
        relatedLinks={dedupeLinks([
          ...temporalExploreLinks(HUB_PATH),
          ...sagreExploreLinks().filter((link) => link.href !== HUB_PATH),
          ...weekendExploreLinks(),
          ...festivalHubLinks(),
          { href: "/cultura-sarda", label: "Scopri la Sardegna" },
          { href: "/cultura", label: "Cultura sarda" },
        ])}
        jsonLd={[
          collectionPageSchema({
            name: HUB_H1,
            description: editorial.intro,
            url: absoluteUrl(HUB_PATH),
          }),
          eventsItemListSchema({
            name: HUB_H1,
            path: HUB_PATH,
            events: upcoming,
          }),
          breadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Eventi in Sardegna", path: HUB_PATH },
          ]),
          faqPageSchema(faqs),
        ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
