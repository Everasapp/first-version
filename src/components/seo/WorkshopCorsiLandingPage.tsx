import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { categories } from "@/src/data/categories";
import { getDateRange } from "@/src/lib/seo/dateRange";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  buildLandingStats,
  splitCityLandingEvents,
} from "@/src/lib/seo/landing-copy";
import { currentMonthLanding } from "@/src/lib/seo/calendar";
import { coreDateLinks, dedupeLinks } from "@/src/lib/seo/internal-links";
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
import {
  categoryEventsPath,
  cityCategoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";
import {
  filterWorkshopRelevantEvents,
  workshopTipologiePresent,
} from "@/src/lib/seo/workshop-relevance";

const PATH = "/eventi/workshop-corsi";
const CATEGORY_NAME = "Workshop e corsi";
const H1 = "Corsi e workshop in Sardegna";

function romeYear(from = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
  }).format(from);
}

function joinIt(parts: string[]) {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} e ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

export function buildWorkshopCorsiLandingMetadata(
  eventCount?: number,
): Metadata {
  const year = romeYear();
  const title = `Corsi e workshop in Sardegna ${year}`;
  const description =
    "Scopri corsi, workshop e laboratori in Sardegna: attività creative, formative e pratiche a Cagliari, Sassari, Olbia, Nuoro e nelle altre località dell'isola.";

  return {
    title,
    description,
    alternates: { canonical: PATH },
    robots:
      eventCount === undefined ? undefined : landingRobots(eventCount),
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: PATH,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

export async function WorkshopCorsiLandingPage() {
  const { events: rawEvents, error } = await loadFilteredPublishedEvents({
    categorySlug: "workshop-corsi",
  });
  const events = filterWorkshopRelevantEvents(rawEvents);

  const month = currentMonthLanding();
  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(events, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });

  const stats = buildLandingStats(events);
  const tipologie = workshopTipologiePresent(events);

  const subtitleParts: string[] = [];
  if (today.length > 0) {
    subtitleParts.push(
      `${today.length} ${today.length === 1 ? "oggi" : "oggi"}`,
    );
  }
  if (weekend.length > 0) {
    subtitleParts.push(`${weekend.length} nel weekend`);
  }
  if (events.length > 0) {
    subtitleParts.push(
      `${events.length} ${events.length === 1 ? "in programma" : "in programma"}`,
    );
  }
  const subtitle =
    subtitleParts.length > 0
      ? `Corsi, workshop e laboratori: ${subtitleParts.join(" · ")}.`
      : "Corsi, workshop e laboratori in Sardegna su EVERAS.";

  let intro: string;
  if (events.length === 0) {
    intro =
      "Al momento non ci sono corsi, workshop o laboratori futuri pubblicati su EVERAS. Quando arrivano nuove date le trovi qui, con comune, orario e scheda pratica.";
  } else {
    const cityNames = stats.topCities.slice(0, 4).map((city) => city.name);
    intro = `In Sardegna trovi ${events.length} ${
      events.length === 1 ? "appuntamento formativo" : "appuntamenti formativi"
    } già in calendario: corsi, workshop e laboratori${
      cityNames.length > 0 ? `, con più presenza a ${joinIt(cityNames)}` : ""
    }. Da qui parti per oggi, il weekend e le prossime settimane.`;
  }

  const paragraphs: string[] = [
    "Su EVERAS questa pagina raccoglie le attività in cui si impara facendo: corsi pratici, workshop e laboratori aperti al pubblico, dalle città ai paesi. Non è un catalogo di scuole: sono date pubblicate dagli organizzatori, con luogo e dettagli sulla scheda.",
  ];

  if (tipologie.length > 0) {
    paragraphs.push(
      `In questo periodo compaiono soprattutto ${joinIt(tipologie)}. La lista sotto si aggiorna quando vengono pubblicati nuovi eventi.`,
    );
  }

  if (events.length > 0) {
    if (stats.freeCount > 0) {
      paragraphs.push(
        stats.freeCount === events.length
          ? "Gli appuntamenti in elenco risultano gratuiti o a ingresso libero, dove indicato sulla scheda."
          : `Di questi, ${stats.freeCount} ${
              stats.freeCount === 1 ? "è segnalato" : "sono segnalati"
            } come gratuiti o a ingresso libero.`,
      );
    }
    paragraphs.push(
      "Per una città specifica usa i collegamenti rapidi ai corsi e workshop locali, oppure confronta con oggi e il weekend in tutta l’isola.",
    );
  } else {
    paragraphs.push(
      "Nel frattempo esplora gli eventi di oggi e del weekend in Sardegna, o passa al calendario mensile.",
    );
  }

  const faqs = [
    {
      question: "Dove trovare corsi e workshop in Sardegna?",
      answer:
        events.length > 0
          ? `In questa pagina: ${events.length} ${
              events.length === 1
                ? "appuntamento formativo"
                : "appuntamenti formativi"
            } in programma, con sezioni per oggi, weekend e prossimi corsi e workshop.`
          : "Quando sono pubblicati compaiono qui. Intanto guarda oggi, weekend e il calendario mensile su EVERAS.",
    },
    {
      question: "Ci sono corsi e workshop a Cagliari e Sassari?",
      answer:
        stats.topCities.some((city) =>
          ["Cagliari", "Sassari"].includes(city.name),
        )
          ? "Sì: quando ci sono date in quelle città le trovi nei collegamenti «Corsi e workshop a…» in questa pagina, oppure apri direttamente la landing della città filtrata per workshop e corsi."
          : "Quando gli organizzatori pubblicano date a Cagliari o Sassari compaiono qui e nelle pagine locali di workshop e corsi. Puoi anche aprire gli eventi della città e filtrare dalla scheda.",
    },
    {
      question: "Come trovare workshop nel weekend?",
      answer:
        weekend.length > 0
          ? `Apri la sezione «Corsi e workshop questo weekend» più sotto, oppure la pagina Eventi Sardegna questo weekend per tutto il calendario dell’isola.`
          : "Quando ci sono workshop nel fine settimana li trovi nella sezione dedicata di questa pagina e in Eventi Sardegna questo weekend.",
    },
    {
      question: "Come trovare laboratori in una località specifica?",
      answer:
        stats.topCities.length > 0
          ? `Usa i link «Corsi e workshop a…» per le città con date pubblicate (${joinIt(
              stats.topCities.slice(0, 5).map((city) => city.name),
            )}), oppure apri la pagina eventi del comune.`
          : "Apri la pagina eventi del comune che ti interessa: se ci sono laboratori o corsi in categoria workshop, compaiono anche nei filtri locali.",
    },
  ];

  const sections = [];
  if (today.length > 0) {
    sections.push({
      id: "oggi",
      title: "Corsi e workshop oggi",
      events: today,
    });
  }
  if (weekend.length > 0) {
    sections.push({
      id: "weekend",
      title: "Corsi e workshop questo weekend",
      events: weekend,
    });
  }
  if (upcomingRest.length > 0) {
    sections.push({
      id: "prossimi",
      title: "Prossimi corsi e workshop",
      events: upcomingRest,
    });
  } else if (sections.length === 0) {
    sections.push({
      id: "prossimi",
      title: "Prossimi corsi e workshop",
      events,
      emptyHint:
        "Non ci sono corsi, workshop o laboratori futuri pubblicati al momento.",
    });
  }

  const cityQuickLinks = stats.topCities.slice(0, 8).map((city) => ({
    href: cityCategoryEventsPath(city.name, "workshop-corsi"),
    label: `Corsi e workshop a ${city.name}`,
  }));

  const otherCategories = categories
    .filter((item) => item.slug !== "workshop-corsi")
    .slice(0, 4)
    .map((item) => ({
      href: categoryEventsPath(item.slug),
      label: item.name,
    }));

  return (
    <EventLandingView
      eyebrow="Workshop e corsi"
      h1={H1}
      subtitle={subtitle}
      intro={intro}
      paragraphs={paragraphs}
      events={events}
      sections={sections}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: CATEGORY_NAME },
      ]}
      faqs={faqs}
      quickLinks={[
        { href: "/eventi-oggi", label: "Oggi" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: month.path, label: `${month.name} ${month.year}` },
        ...cityQuickLinks,
      ]}
      relatedLinks={dedupeLinks([
        ...coreDateLinks(PATH),
        { href: "/eventi-sardegna", label: "Eventi in Sardegna" },
        { href: month.path, label: `Eventi ${month.name} ${month.year}` },
        ...stats.topCities.slice(0, 4).map((city) => ({
          href: cityEventsPath(city.name),
          label: `Eventi a ${city.name}`,
        })),
        ...otherCategories,
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
          { name: CATEGORY_NAME, path: PATH },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
