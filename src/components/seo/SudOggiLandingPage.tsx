import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { getDateLandingContext } from "@/src/lib/seo/dateRange";
import { buildLandingStats } from "@/src/lib/seo/landing-copy";
import { SUD_OGGI_INTENT } from "@/src/lib/seo/landing-intents";
import {
  absoluteUrl,
  defaultOgImages,
  landingRobots,
} from "@/src/lib/seo/site";
import {
  formatEventHighlightList,
  weekendExploreLinks,
} from "@/src/lib/seo/weekends";
import { dedupeLinks, temporalExploreLinks } from "@/src/lib/seo/internal-links";
import { cityEventsPath } from "@/src/lib/seo/paths";

const SUD_AREA = "Sud Sardegna";
const SUD_CITIES = ["Cagliari", "Quartu Sant'Elena", "Monserrato"] as const;

function joinIt(parts: string[]) {
  return formatEventHighlightList(parts) ?? "";
}

export async function buildSudOggiLandingMetadata(): Promise<Metadata> {
  const { events } = await loadFilteredPublishedEvents({
    date: "oggi",
    areaLabel: SUD_AREA,
  });
  const description = SUD_OGGI_INTENT.metaDescription;
  return {
    title: SUD_OGGI_INTENT.seoTitle,
    description,
    robots: landingRobots(events.length),
    alternates: { canonical: SUD_OGGI_INTENT.path },
    openGraph: {
      title: `${SUD_OGGI_INTENT.seoTitle} | EVERAS`,
      description,
      url: SUD_OGGI_INTENT.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${SUD_OGGI_INTENT.seoTitle} | EVERAS`,
      description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function SudOggiLandingPage() {
  const context = getDateLandingContext("oggi");
  const { events, error } = await loadFilteredPublishedEvents({
    date: "oggi",
    areaLabel: SUD_AREA,
  });
  const stats = buildLandingStats(events);
  const cityNames = stats.topCities.slice(0, 3).map((city) => city.name);
  const categoryNames = stats.topCategories
    .slice(0, 3)
    .map((category) => category.name.toLocaleLowerCase("it"));
  const citiesJoined = cityNames.length ? joinIt(cityNames) : null;
  const categoriesJoined = categoryNames.length ? joinIt(categoryNames) : null;

  const intro =
    stats.total === 0
      ? `Per oggi nel Sud Sardegna non ci sono ancora eventi pubblicati su EVERAS. Controlla Eventi Sardegna oggi per tutta l’isola, oppure Cagliari e il weekend.`
      : `Oggi nel Sud Sardegna trovi ${stats.total} ${stats.total === 1 ? "evento" : "eventi"}${categoriesJoined ? ` tra ${categoriesJoined}` : ""}${citiesJoined ? `, con più presenza a ${citiesJoined}` : ""}.`;

  const paragraphs = [
    `Questa pagina è solo ${context.datePhrase} e solo i comuni del Sud (Cagliari, Campidano, Sulcis, Sarrabus e hinterland). Non elenca Nord e Centro: per quelli usa Eventi Sardegna oggi.`,
    stats.freeCount > 0
      ? `Qui ${stats.freeCount} ${stats.freeCount === 1 ? "appuntamento è segnalato" : "appuntamenti sono segnalati"} come gratuiti o a ingresso libero, dove indicato sulla scheda.`
      : "Controlla ingresso e orario sulla scheda prima di partire: sagre di piazza e mostre sono spesso libere, i concerti no.",
  ];

  const faqs = [
    {
      question: "Cosa c’è oggi nel Sud Sardegna?",
      answer:
        stats.total > 0
          ? `In questa pagina: ${stats.total} appuntamenti di oggi nei comuni del Sud. Apri la scheda per orario, comune e ingresso.`
          : "Quando sono pubblicati compaiono qui. Intanto guarda Eventi Sardegna oggi, Cagliari e il weekend.",
    },
    {
      question: "Quali comuni rientrano nel Sud?",
      answer:
        "Cagliari e hinterland, Campidano, Sulcis e Sarrabus: gli stessi comuni del filtro Sud Sardegna. Sassari, Olbia, Nuoro e Oristano stanno su Eventi Sardegna oggi.",
    },
  ];

  const quickLinks = [
    ...SUD_CITIES.map((city) => ({
      href: cityEventsPath(city),
      label: city,
    })),
    ...stats.topCategories.slice(0, 3).map((category) => ({
      href: category.href,
      label: category.name,
    })),
  ];

  return (
    <EventLandingView
      eyebrow="Sud Sardegna"
      h1={SUD_OGGI_INTENT.h1}
      subtitle={`Programma di ${context.datePhrase} a Cagliari e nel Sud.`}
      intro={intro}
      paragraphs={paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi Sardegna oggi", href: "/eventi-oggi" },
        { name: SUD_OGGI_INTENT.h1 },
      ]}
      faqs={faqs}
      quickLinks={quickLinks}
      relatedLinks={dedupeLinks([
        ...temporalExploreLinks(SUD_OGGI_INTENT.path),
        ...weekendExploreLinks(2),
      ])}
      jsonLd={[
        collectionPageSchema({
          name: SUD_OGGI_INTENT.h1,
          description: SUD_OGGI_INTENT.metaDescription,
          url: absoluteUrl(SUD_OGGI_INTENT.path),
        }),
        eventsItemListSchema({
          name: SUD_OGGI_INTENT.h1,
          path: SUD_OGGI_INTENT.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi Sardegna oggi", path: "/eventi-oggi" },
          { name: SUD_OGGI_INTENT.h1, path: SUD_OGGI_INTENT.path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
