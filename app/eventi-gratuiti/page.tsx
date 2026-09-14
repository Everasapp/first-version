import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { currentMonthLanding } from "@/src/lib/seo/calendar";
import { getDateRange } from "@/src/lib/seo/dateRange";
import {
  buildLandingStats,
  splitCityLandingEvents,
} from "@/src/lib/seo/landing-copy";
import {
  coreDateLinks,
  dedupeLinks,
  linksFromLandingStats,
} from "@/src/lib/seo/internal-links";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import {
  absoluteUrl,
  defaultOgImages,
  landingRobots,
} from "@/src/lib/seo/site";

const PATH = "/eventi-gratuiti";
const H1 = "Eventi gratuiti in Sardegna";
const TITLE = "Eventi gratuiti in Sardegna";

export async function generateMetadata(): Promise<Metadata> {
  const { events } = await loadFilteredPublishedEvents({ freeOnly: true });
  const description =
    "Eventi gratuiti e a ingresso libero in Sardegna: concerti, sagre, culture e appuntamenti aggiornati su EVERAS.";
  return {
    title: TITLE,
    description,
    robots: landingRobots(events.length),
    alternates: { canonical: PATH },
    openGraph: {
      title: `${TITLE} | EVERAS`,
      description,
      url: PATH,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | EVERAS`,
      description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export default async function EventiGratuitiPage() {
  const { events, error } = await loadFilteredPublishedEvents({
    freeOnly: true,
  });
  const month = currentMonthLanding();
  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(events, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });
  const stats = buildLandingStats(events);
  const fromStats = linksFromLandingStats(stats);

  const intro =
    events.length === 0
      ? "Al momento non ci sono eventi gratuiti futuri pubblicati su EVERAS. Quando Comuni e organizzatori segnalano l’ingresso libero, li trovi qui."
      : `In Sardegna trovi ${events.length} ${events.length === 1 ? "evento gratuito" : "eventi gratuiti"} o a ingresso libero già in calendario${
          today.length > 0 || weekend.length > 0
            ? ` (${[
                today.length > 0 ? `${today.length} oggi` : null,
                weekend.length > 0 ? `${weekend.length} nel weekend` : null,
              ]
                .filter(Boolean)
                .join(", ")})`
            : ""
        }.`;

  const paragraphs = [
    "Questa pagina raccoglie solo gli appuntamenti segnalati come gratuiti o a ingresso libero sulla scheda. Controlla sempre i dettagli: alcune attività collaterali possono essere a pagamento.",
    stats.topCities.length > 0
      ? `Tra le località con più eventi gratuiti in questo periodo ci sono ${stats.topCities
          .slice(0, 3)
          .map((city) => city.name)
          .join(", ")}.`
      : "Usa i collegamenti a oggi, weekend e categorie per continuare a esplorare.",
  ];

  const sections = [];
  if (today.length > 0) {
    sections.push({
      id: "oggi",
      title: "Gratuiti oggi",
      events: today,
    });
  }
  if (weekend.length > 0) {
    sections.push({
      id: "weekend",
      title: "Gratuiti questo weekend",
      events: weekend,
    });
  }
  if (upcomingRest.length > 0) {
    sections.push({
      id: "prossimi",
      title: "Prossimi eventi gratuiti",
      events: upcomingRest,
    });
  } else if (sections.length === 0) {
    sections.push({
      id: "prossimi",
      title: "Prossimi eventi gratuiti",
      events,
      emptyHint: "Nessun evento gratuito futuro al momento.",
    });
  }

  const faqs = [
    {
      question: "Cosa significa evento gratuito su EVERAS?",
      answer:
        "È un appuntamento segnalato dall’organizzatore come gratuito o a ingresso libero. Verifica sempre la scheda per prenotazioni o attività opzionali a pagamento.",
    },
    {
      question: "Dove trovo altri eventi?",
      answer:
        "Apri oggi, weekend, il mese in corso o le categorie (sagre, musica, famiglie) dal menu Esplora e da questa pagina.",
    },
  ];

  return (
    <EventLandingView
      h1={H1}
      subtitle={
        events.length > 0
          ? `Ingresso libero: ${events.length} ${events.length === 1 ? "appuntamento" : "appuntamenti"} in Sardegna.`
          : "Ingresso libero in Sardegna su EVERAS."
      }
      intro={intro}
      paragraphs={paragraphs}
      events={events}
      sections={sections}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: "Gratuiti" },
      ]}
      faqs={faqs}
      quickLinks={dedupeLinks([
        { href: "/eventi-oggi", label: "Oggi" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: month.path, label: `${month.name} ${month.year}` },
        ...fromStats.quickLinks,
      ])}
      relatedLinks={dedupeLinks([
        ...coreDateLinks(PATH),
        ...fromStats.relatedCityLinks,
        ...fromStats.relatedCategoryLinks,
      ])}
      jsonLd={[
        collectionPageSchema({
          name: H1,
          description: intro,
          url: absoluteUrl(PATH),
        }),
        eventsItemListSchema({
          name: H1,
          path: PATH,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: "Gratuiti", path: PATH },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
