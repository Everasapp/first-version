import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import {
  currentMonthLanding,
  sagreExploreLinks,
} from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";
import { findCulturaTownPathByName } from "@/src/lib/seo/cultura-towns";
import { cityEventsPath } from "@/src/lib/seo/paths";

const SAGRE_PATH = "/eventi-sardegna/sagre";

const SAGRE_TITLE = "Sagre in Sardegna: calendario feste di paese e tradizioni";
const SAGRE_DESCRIPTION =
  "Calendario delle sagre in Sardegna: feste di paese, tradizioni e rassegne gastronomiche da Nord a Sud, con date e comuni aggiornati.";

const SAGRE_PARAGRAPHS = [
  "Le sagre in Sardegna sono il modo più diretto di capire un paese: piazza piena, piatti tipici, musica e spesso una processione. Qui trovi il calendario evergreen delle feste di paese pubblicate su EVERAS, ordinate per data, con comune e scheda pratica.",
  "Se cerchi “sagre in Sardegna” di solito vuoi sapere cosa c’è questo weekend, quale mese è più ricco e dove andare vicino a Cagliari, Sassari, Olbia, Alghero o Nuoro. Da questa pagina passi ai mesi, ai weekend datati e alle guide delle feste grandi (Autunno in Barbagia, Santa Greca, Festival della Bottarga).",
  "Organizzi una sagra o una festa di Pro Loco? Pubblicala su EVERAS: entra in calendario e resta visibile a chi cerca cosa fare sull’isola.",
];

const SAGRE_FAQS = [
  {
    question: "Quali sono le sagre più importanti in Sardegna?",
    answer:
      "Tra le più cercate trovi Autunno in Barbagia nei paesi interni, Santa Greca a Decimomannu, il Festival della Bottarga, lo Sposalizio Selargino a Selargius e le feste legate a Sant’Efisio a Cagliari. Il calendario sotto elenca anche le sagre di paese più piccole.",
  },
  {
    question: "Quando si fanno le sagre in Sardegna?",
    answer:
      "Tutto l’anno, con picchi in primavera e autunno. Estate e settembre sono ricchi di feste di paese; l’autunno porta le Cortes Apertas. Usa i link ai mesi e al weekend per filtrare le date.",
  },
  {
    question: "Dove trovare sagre vicino a Cagliari o Sassari?",
    answer:
      "Apri gli eventi di Cagliari o Sassari, oppure scorre questa pagina e filtra per comune sulla scheda. Molte sagre del Campidano e del Nord-Ovest sono a poca distanza dalle due città.",
  },
  {
    question: "Le sagre in Sardegna sono gratuite?",
    answer:
      "L’ingresso in piazza è spesso libero; cibo, degustazioni e alcuni spettacoli possono essere a pagamento. Il dettaglio è sulla scheda dell’evento.",
  },
  {
    question: "Come segnalare una sagra su EVERAS?",
    answer:
      "Dalla home puoi pubblicare un evento: bastano titolo, date, comune e una locandina. Dopo la revisione entra nel calendario sagre e nelle pagine città.",
  },
];

export const metadata: Metadata = {
  title: SAGRE_TITLE,
  description: SAGRE_DESCRIPTION,
  alternates: { canonical: SAGRE_PATH },
  openGraph: {
    title: `${SAGRE_TITLE} | EVERAS`,
    description: SAGRE_DESCRIPTION,
    url: SAGRE_PATH,
    type: "website",
    images: defaultOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SAGRE_TITLE} | EVERAS`,
    description: SAGRE_DESCRIPTION,
    images: defaultOgImages().map((image) => image.url),
  },
};

function isSagraEvent(title: string, categories: string[] | undefined) {
  const hay = `${title} ${(categories ?? []).join(" ")}`.toLowerCase();
  return (
    /sagra|sagre|festa di paese|feste di paese|cortes apertas|tradizion/.test(
      hay,
    ) || (categories ?? []).some((c) => /sagre|tradizion/i.test(c))
  );
}

export default async function SagreHubPage() {
  const [{ events: categoryEvents, error: categoryError }, { events: allEvents }] =
    await Promise.all([
      loadFilteredPublishedEvents({ categorySlug: "sagre-tradizioni" }),
      loadFilteredPublishedEvents(),
    ]);

  const byId = new Map(categoryEvents.map((event) => [event.id, event]));
  for (const event of allEvents) {
    if (byId.has(event.id)) continue;
    if (isSagraEvent(event.title, event.categories)) {
      byId.set(event.id, event);
    }
  }

  const events = [...byId.values()].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
  const error = categoryError;
  const month = currentMonthLanding();
  const weekends = weekendExploreLinks(2);

  const geoChips = [
    "Cagliari",
    "Sassari",
    "Olbia",
    "Alghero",
    "Nuoro",
  ].flatMap((city) => {
    const cultura = findCulturaTownPathByName(city);
    return [
      { href: cityEventsPath(city), label: `Eventi ${city}` },
      ...(cultura ? [{ href: cultura, label: `Guida ${city}` }] : []),
    ];
  });

  return (
    <EventLandingView
      eyebrow="Sagre e tradizioni"
      h1="Sagre in Sardegna"
      subtitle="Feste di paese, calendario e rassegne gastronomiche"
      intro={SAGRE_DESCRIPTION}
      paragraphs={SAGRE_PARAGRAPHS}
      events={events.slice(0, 36)}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi in Sardegna", href: "/eventi-sardegna" },
        { name: "Sagre" },
      ]}
      faqs={SAGRE_FAQS}
      quickLinks={[
        { href: "/eventi-weekend", label: "Weekend" },
        { href: month.path, label: `Sagre di ${month.name}` },
        { href: "/eventi/sagre-tradizioni", label: "Categoria sagre" },
        { href: "/eventi-gratuiti", label: "Gratuiti" },
        ...weekends,
        ...geoChips.slice(0, 6),
      ]}
      highlights={[
        {
          href: "/eventi-sardegna/autunno-in-barbagia",
          label: "Autunno in Barbagia",
          meta: "Cortes Apertas e tappe",
        },
        {
          href: "/eventi-sardegna/santa-greca",
          label: "Santa Greca",
          meta: "Decimomannu e Campidano",
        },
        {
          href: "/eventi-sardegna/festival-della-bottarga",
          label: "Festival della Bottarga",
          meta: "Gastronomia e mare",
        },
        {
          href: "/eventi-sardegna",
          label: "Tutti gli eventi in Sardegna",
          meta: "Hub calendario",
        },
      ]}
      highlightsTitle="Feste e sagre da non perdere"
      relatedLinks={[
        ...sagreExploreLinks().filter((link) => link.href !== SAGRE_PATH),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
        { href: "/cultura-sarda", label: "Scopri la Sardegna" },
      ]}
      jsonLd={[
        collectionPageSchema({
          name: "Sagre in Sardegna",
          description: SAGRE_DESCRIPTION,
          url: absoluteUrl(SAGRE_PATH),
        }),
        eventsItemListSchema({
          name: "Sagre in Sardegna",
          path: SAGRE_PATH,
          events: events.slice(0, 36),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi in Sardegna", path: "/eventi-sardegna" },
          { name: "Sagre", path: SAGRE_PATH },
        ]),
        faqPageSchema(SAGRE_FAQS),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
