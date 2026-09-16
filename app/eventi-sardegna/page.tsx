import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { currentMonthLanding, sagreExploreLinks } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

const HUB_PATH = "/eventi-sardegna";

const HUB_TITLE = "Eventi in Sardegna: sagre, concerti e festival";
const HUB_DESCRIPTION =
  "Calendario eventi in Sardegna aggiornato: cosa fare oggi, nel weekend e mese per mese. Sagre, concerti, feste di paese e festival da Nord a Sud.";

const HUB_PARAGRAPHS = [
  "Se cerchi eventi in Sardegna, di solito vuoi tre risposte rapide: cosa c’è oggi, cosa fare nel weekend e dove si fa sagra. Questa è la guida principale di EVERAS: un calendario vivo con data, comune e locandina, non un elenco statico.",
  "Da qui arrivi alle pagine dedicate — Eventi oggi, weekend, mesi e feste grandi come Autunno in Barbagia, Santa Greca o JazzAlguer — senza filtri nascosti. Pubblichiamo appuntamenti da Comuni, Pro Loco e fonti locali, e aggiorniamo ogni giorno.",
  "Organizzi una sagra o un concerto? Pubblicala su EVERAS: entra in guida e resta visibile a chi cerca cosa fare sull’isola.",
];

const HUB_FAQS_BASE = [
  {
    question: "Quali sono gli eventi in programma oggi in Sardegna?",
    answer:
      "La pagina Eventi oggi mostra solo gli appuntamenti della giornata in corso, con orario e luogo sulla scheda.",
  },
  {
    question: "Quali sono le feste e le sagre in Sardegna?",
    answer:
      "Oltre al calendario mese per mese trovi le guide alle feste più cercate: Autunno in Barbagia, Candelieri, Sartiglia, Cavalcata Sarda, Ardia, Corsa degli Scalzi, Sposalizio Selargino e Sant’Efisio.",
  },
];

const HIGHLIGHT_MATCHERS: Array<{ label: string; match: RegExp }> = [
  { label: "Autunno in Barbagia", match: /autunno in barbagia/i },
  { label: "Santa Greca", match: /santa greca/i },
  { label: "Festival della Bottarga", match: /bottarga/i },
  { label: "JazzAlguer", match: /jazzalguer|jazz alguer/i },
  { label: "Monumenti Aperti", match: /monumenti aperti/i },
  { label: "Isole che Parlano", match: /isole che parlano/i },
];

export const metadata: Metadata = {
  title: HUB_TITLE,
  description: HUB_DESCRIPTION,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    title: `${HUB_TITLE} | EVERAS`,
    description: HUB_DESCRIPTION,
    url: HUB_PATH,
    type: "website",
    images: defaultOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${HUB_TITLE} | EVERAS`,
    description: HUB_DESCRIPTION,
    images: defaultOgImages().map((image) => image.url),
  },
};

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
  const month = currentMonthLanding();
  const datedWeekends = weekendExploreLinks(2)
    .map((link) => link.label)
    .join(" e ");
  const faqs = [
    {
      question: "Cosa c’è da fare in Sardegna questo fine settimana?",
      answer: `Apri Eventi weekend per il fine settimana in corso. Se stai pianificando i giorni dopo, usa le pagine datate, per esempio ${datedWeekends}.`,
    },
    ...HUB_FAQS_BASE,
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

  // Always surface festival hubs even if a matching event card is missing.
  const hubHighlights = [
    {
      href: "/eventi-sardegna/autunno-in-barbagia",
      label: "Autunno in Barbagia 2026",
      meta: "Calendario tappe e Cortes Apertas",
    },
    {
      href: "/eventi-sardegna/monumenti-aperti",
      label: "Monumenti Aperti",
      meta: "Visite guidate in tutta l’isola",
    },
    {
      href: month.path,
      label: `Eventi di ${month.name}`,
      meta: "Sagre e rassegne del mese in corso",
    },
  ];

  const mergedHighlights = [
    ...hubHighlights,
    ...highlights.filter(
      (item) =>
        !hubHighlights.some(
          (hub) =>
            hub.label.toLowerCase().includes(item.label.toLowerCase()) ||
            item.label.toLowerCase().includes("autunno"),
        ),
    ),
  ].slice(0, 8);

  return (
    <EventLandingView
      eyebrow="Guida eventi"
      h1={HUB_TITLE}
      subtitle="Cosa fare oggi, nel weekend e per tutto l’anno"
      intro={HUB_DESCRIPTION}
      paragraphs={HUB_PARAGRAPHS}
      events={upcoming}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi in Sardegna" },
      ]}
      faqs={faqs}
      quickLinks={[
        { href: "/eventi-oggi", label: "Oggi" },
        { href: "/eventi-domani", label: "Domani" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: "/eventi-gratuiti", label: "Gratuiti" },
        { href: month.path, label: "Questo mese" },
        { href: "/eventi", label: "Tutti gli eventi" },
      ]}
      highlights={mergedHighlights}
      highlightsTitle="Da non perdere"
      relatedLinks={[
        ...sagreExploreLinks().filter((link) => link.href !== HUB_PATH),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
        { href: "/cultura-sarda", label: "Scopri la Sardegna" },
        { href: "/cultura", label: "Cultura Sarda" },
      ]}
      jsonLd={[
        collectionPageSchema({
          name: HUB_TITLE,
          description: HUB_DESCRIPTION,
          url: absoluteUrl(HUB_PATH),
        }),
        eventsItemListSchema({
          name: HUB_TITLE,
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
