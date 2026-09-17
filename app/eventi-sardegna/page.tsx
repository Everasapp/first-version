import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { currentMonthLanding, sagreExploreLinks, yearLanding } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl } from "@/src/lib/seo/site";
import { findCulturaTownPathByName } from "@/src/lib/seo/cultura-towns";
import { cityEventsPath } from "@/src/lib/seo/paths";
import { buildLandingStats } from "@/src/lib/seo/landing-copy";
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

function buildHubEditorial(stats: ReturnType<typeof buildLandingStats>) {
  const cityNames = stats.topCities.slice(0, 4).map((city) => city.name);
  const categoryNames = stats.topCategories
    .slice(0, 4)
    .map((category) => category.name.toLocaleLowerCase("it"));
  const citiesJoined = formatEventHighlightList(cityNames);
  const categoriesJoined = formatEventHighlightList(categoryNames);

  const intro =
    stats.total === 0
      ? "EVERAS raccoglie eventi, sagre, concerti e attività in Sardegna. Quando il calendario ha date pubblicate le trovi qui, con link a oggi, weekend e mesi."
      : `In Sardegna ci sono ${stats.total} ${stats.total === 1 ? "prossimo evento" : "prossimi eventi"} pubblicati su EVERAS${categoriesJoined ? `, tra ${categoriesJoined}` : ""}${citiesJoined ? `, con più presenza a ${citiesJoined}` : ""}. Questa è la guida principale per capire cosa fare sull’isola.`;

  const paragraphs = [
    "Se cerchi eventi in Sardegna o cosa fare in Sardegna, di solito ti servono tre risposte: cosa c’è oggi, cosa fare questo weekend e quali sagre o concerti cadono nel mese. Da qui arrivi alle pagine dedicate senza filtri nascosti, con data, comune e locandina sulla scheda.",
    stats.freeCount > 0
      ? `Tra i prossimi appuntamenti, ${stats.freeCount} ${stats.freeCount === 1 ? "è segnalato" : "sono segnalati"} come gratuiti o a ingresso libero: puoi anche aprire la pagina Eventi gratuiti in Sardegna.`
      : "Molte sagre e feste di piazza sono a ingresso libero; concerti e festival possono richiedere biglietto. Controlla sempre la scheda: EVERAS indica dove trovarlo quando l’organizzatore lo pubblica.",
    "Il catalogo completo con filtri è su Cerca eventi; qui resti nell’hub editoriale. Pubblicare una sagra o un concerto su EVERAS lo fa entrare in guida e nelle pagine città.",
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
  const upcoming = events.slice(0, 24);
  const stats = buildLandingStats(events);
  const editorial = buildHubEditorial(stats);
  const month = currentMonthLanding();
  const year = yearLanding(month.year);
  const weekendLinks = weekendExploreLinks(2);
  const datedWeekends = weekendLinks.map((link) => link.label).join(" e ");

  const faqs = [
    {
      question: "Cosa c’è da fare in Sardegna questo fine settimana?",
      answer: `Apri Eventi in Sardegna questo weekend per il fine settimana in corso. Se stai pianificando giorni precisi, usa le pagine datate${datedWeekends ? `, per esempio ${datedWeekends}` : ""}.`,
    },
    {
      question: "Quali sono gli eventi in programma oggi in Sardegna?",
      answer:
        "La pagina Eventi in Sardegna oggi mostra solo gli appuntamenti della giornata in corso. Da lì passi a domani e al weekend.",
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
      href: "/eventi-weekend",
      label: "Eventi in Sardegna questo weekend",
      meta:
        weekendLinks.map((l) => l.label).join(" · ") || "Fine settimana in corso",
    },
    {
      href: "/eventi-sardegna/sagre",
      label: "Sagre in Sardegna",
      meta: "Calendario feste di paese",
    },
    {
      href: year.path,
      label: year.title,
      meta: "Tutti i mesi dell’anno",
    },
    {
      href: month.path,
      label: `Eventi a ${month.name.toLocaleLowerCase("it")} ${month.year}`,
      meta: "Calendario del mese in corso",
    },
    {
      href: "/eventi-oggi",
      label: "Eventi in Sardegna oggi",
      meta: "Solo la giornata odierna",
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
        subtitle="Cosa fare oggi, questo weekend e nelle prossime settimane"
        intro={editorial.intro}
        paragraphs={editorial.paragraphs}
        events={upcoming}
        errorMessage={error?.message}
        cover={HUB_COVER}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Eventi in Sardegna" },
        ]}
        faqs={faqs}
        quickLinks={[
          { href: "/eventi-oggi", label: "Eventi oggi" },
          { href: "/eventi-domani", label: "Eventi domani" },
          { href: "/eventi-weekend", label: "Questo weekend" },
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
        highlightsTitle="Parti da qui"
        relatedLinks={dedupeLinks([
          ...temporalExploreLinks(HUB_PATH),
          ...sagreExploreLinks().filter((link) => link.href !== HUB_PATH),
          ...weekendExploreLinks(),
          ...festivalHubLinks(),
          { href: "/cultura-sarda", label: "Scopri la Sardegna" },
          { href: "/cultura", label: "Cultura Sarda" },
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
