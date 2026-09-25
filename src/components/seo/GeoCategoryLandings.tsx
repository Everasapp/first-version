import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventLandingView from "@/src/components/seo/EventLandingView";
import MonsteraPromoBanner from "@/src/components/ads/MonsteraPromoBanner";
import {
  WorkshopCorsiLandingPage,
  buildWorkshopCorsiLandingMetadata,
} from "@/src/components/seo/WorkshopCorsiLandingPage";
import type { Category } from "@/src/data/categories";
import type { City } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { currentMonthLanding } from "@/src/lib/seo/calendar";
import { getDateRange } from "@/src/lib/seo/dateRange";
import {
  buildCategoryLandingEditorial,
  buildCityCategoryLandingEditorial,
  buildCityLandingEditorial,
  buildLandingStats,
  splitCityLandingEvents,
} from "@/src/lib/seo/landing-copy";
import {
  coreDateLinks,
  dedupeLinks,
} from "@/src/lib/seo/internal-links";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { cultureTownPathForCity } from "@/src/lib/seo/cultura-areas";
import { findCultureTown } from "@/src/lib/seo/cultura-towns";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import {
  categoryEventsPath,
  cityCategoryEventsPath,
  cityEventsPath,
  cityToSlug,
} from "@/src/lib/seo/paths";
import {
  absoluteUrl,
  cityLandingRobots,
  defaultOgImages,
  landingRobots,
} from "@/src/lib/seo/site";

function romeYear(from = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
  }).format(from);
}

export function buildCityLandingMetadata(
  city: City,
  counts?: { upcoming: number; total: number },
): Metadata {
  const year = romeYear();
  const title = `Eventi a ${city.city} ${year}`;
  const description = `Eventi a ${city.city}: cosa fare oggi e questo weekend. Concerti, sagre e appuntamenti aggiornati su EVERAS.`;
  const path = cityEventsPath(city.city);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots:
      counts === undefined
        ? undefined
        : cityLandingRobots(counts.upcoming, counts.total),
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
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

export function buildCategoryLandingMetadata(
  category: Category,
  eventCount?: number,
): Metadata {
  if (category.slug === "workshop-corsi") {
    return buildWorkshopCorsiLandingMetadata(eventCount);
  }

  const year = romeYear();
  const title = `${category.name} in Sardegna ${year}`;
  const description = `${category.name} in Sardegna: calendario aggiornato di date, città e dettagli. Cosa fare oggi e nel weekend su EVERAS.`;
  const path = categoryEventsPath(category.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots:
      eventCount === undefined ? undefined : landingRobots(eventCount),
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
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

export function buildCityCategoryLandingMetadata(
  city: City,
  category: Category,
  eventCount?: number,
): Metadata {
  const title = `${category.name} a ${city.city}`;
  const description = `${category.name} a ${city.city}: calendario aggiornato di eventi, date e luoghi su EVERAS.`;
  const path = cityCategoryEventsPath(city.city, category.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots:
      eventCount === undefined ? undefined : landingRobots(eventCount),
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
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

export async function CityLandingPage({ city }: { city: City }) {
  const { events: published, error } = await loadFilteredPublishedEvents({
    city: city.city,
    includeExpired: true,
  });
  const month = currentMonthLanding();

  const upcoming = published.filter((event) =>
    isPublicEventActive(event.startDate, event.endDate),
  );
  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(upcoming, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });

  const stats = buildLandingStats(upcoming);
  const editorial = buildCityLandingEditorial({
    cityName: city.city,
    area: city.area,
    upcomingCount: upcoming.length,
    todayCount: today.length,
    weekendCount: weekend.length,
    freeCount: stats.freeCount,
    topCategories: stats.topCategories,
  });

  const path = cityEventsPath(city.city);
  const h1 = `Eventi a ${city.city}`;
  const cultureArticle = findCultureTown(cityToSlug(city.city));
  const cultureHref = cultureArticle?.path ?? cultureTownPathForCity(city);

  const categoryLinks = stats.topCategories.map((category) => ({
    href: cityCategoryEventsPath(city.city, category.slug),
    label: category.name,
  }));

  const faqs = [
    {
      question: `Quali eventi ci sono a ${city.city}?`,
      answer:
        upcoming.length > 0
          ? `In questa pagina: ${upcoming.length} ${upcoming.length === 1 ? "evento futuro" : "eventi futuri"}, con sezioni per oggi, weekend e prossimi appuntamenti.`
          : `Quando vengono pubblicati compaiono qui. Intanto guarda gli eventi in Sardegna oggi e nel weekend.`,
    },
    {
      question: "Posso filtrare per categoria?",
      answer:
        categoryLinks.length > 0
          ? `Sì: usa i collegamenti rapidi alle categorie più presenti a ${city.city}, oppure apri tutte le categorie da Esplora.`
          : `Sì: dalle pagine categoria in Sardegna o dalla ricerca eventi su EVERAS.`,
    },
  ];

  const sections = [];
  if (today.length > 0) {
    sections.push({
      id: "oggi",
      title: `Oggi a ${city.city}`,
      events: today,
    });
  }
  if (weekend.length > 0) {
    sections.push({
      id: "weekend",
      title: `Questo weekend a ${city.city}`,
      events: weekend,
    });
  }
  if (upcomingRest.length > 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi eventi a ${city.city}`,
      events: upcomingRest,
    });
  } else if (sections.length === 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi eventi a ${city.city}`,
      events: upcoming,
      emptyHint: `Non ci sono appuntamenti futuri a ${city.city} al momento.`,
    });
  }

  return (
    <EventLandingView
      eyebrow={city.area}
      h1={h1}
      subtitle={editorial.subtitle}
      intro={editorial.intro}
      paragraphs={editorial.paragraphs}
      events={upcoming}
      sections={sections}
      errorMessage={error?.message}
      promo={
        city.city === "Sassari" ? <MonsteraPromoBanner /> : undefined
      }
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: city.city },
      ]}
      faqs={faqs}
      quickLinks={[
        { href: "/eventi-oggi", label: "Oggi in Sardegna" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: month.path, label: `${month.name} ${month.year}` },
        ...categoryLinks.slice(0, 5),
      ]}
      relatedLinks={dedupeLinks([
        { href: cultureHref, label: `Guida Cultura di ${city.city}` },
        ...coreDateLinks(),
        { href: month.path, label: `Eventi ${month.name} ${month.year}` },
        ...categories.slice(0, 6).map((category) => ({
          href: cityCategoryEventsPath(city.city, category.slug),
          label: `${category.name} a ${city.city}`,
        })),
      ])}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: editorial.intro,
          url: absoluteUrl(path),
        }),
        eventsItemListSchema({
          name: h1,
          path,
          events: upcoming,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: city.city, path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}

export async function CategoryLandingPage({
  category,
}: {
  category: Category;
}) {
  if (category.slug === "workshop-corsi") {
    return <WorkshopCorsiLandingPage />;
  }

  const { events, error } = await loadFilteredPublishedEvents({
    categorySlug: category.slug,
  });
  const month = currentMonthLanding();
  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(events, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });

  const stats = buildLandingStats(events);
  const editorial = buildCategoryLandingEditorial({
    categoryName: category.name,
    categorySlug: category.slug,
    upcomingCount: events.length,
    todayCount: today.length,
    weekendCount: weekend.length,
    freeCount: stats.freeCount,
    topCities: stats.topCities,
  });

  const path = categoryEventsPath(category.slug);
  const h1 = `${category.name} in Sardegna`;
  const label = category.name.toLocaleLowerCase("it");

  const faqs = [
    {
      question: `Dove trovo ${label} in Sardegna?`,
      answer:
        events.length > 0
          ? `In questa pagina: ${events.length} ${events.length === 1 ? "evento" : "eventi"} in programma, con sezioni per oggi, weekend e prossimi appuntamenti.`
          : `Quando sono pubblicati compaiono qui. Intanto guarda oggi, weekend e il calendario mensile su EVERAS.`,
    },
    {
      question: `Come trovo ${label} vicino a me?`,
      answer:
        stats.topCities.length > 0
          ? `Parti dalle città in evidenza in questa pagina, oppure apri la landing di un comune e filtra per categoria.`
          : `Apri una città da Esplora o dalla home, oppure combina città e categoria dalle pagine locali.`,
    },
  ];

  const sections = [];
  if (today.length > 0) {
    sections.push({
      id: "oggi",
      title: `${category.name} oggi`,
      events: today,
    });
  }
  if (weekend.length > 0) {
    sections.push({
      id: "weekend",
      title: `${category.name} questo weekend`,
      events: weekend,
    });
  }
  if (upcomingRest.length > 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi: ${category.name}`,
      events: upcomingRest,
    });
  } else if (sections.length === 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi: ${category.name}`,
      events,
      emptyHint: `Non ci sono ${label} futuri pubblicati al momento.`,
    });
  }

  const otherCategories = categories
    .filter((item) => item.slug !== category.slug)
    .slice(0, 4)
    .map((item) => ({
      href: categoryEventsPath(item.slug),
      label: item.name,
    }));

  return (
    <EventLandingView
      h1={h1}
      subtitle={editorial.subtitle}
      intro={editorial.intro}
      paragraphs={editorial.paragraphs}
      events={events}
      sections={sections}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: category.name },
      ]}
      faqs={faqs}
      quickLinks={[
        { href: "/eventi-oggi", label: "Oggi" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: month.path, label: `${month.name} ${month.year}` },
        ...stats.topCities.slice(0, 5).map((city) => ({
          href: cityCategoryEventsPath(city.name, category.slug),
          label: city.name,
        })),
      ]}
      relatedLinks={dedupeLinks([
        ...coreDateLinks(path),
        { href: month.path, label: `Eventi ${month.name} ${month.year}` },
        ...stats.topCities.slice(0, 4).map((city) => ({
          href: cityEventsPath(city.name),
          label: `Eventi a ${city.name}`,
        })),
        ...otherCategories,
      ])}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: editorial.intro,
          url: absoluteUrl(path),
        }),
        eventsItemListSchema({
          name: h1,
          path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: category.name, path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}

export async function CityCategoryLandingPage({
  city,
  category,
}: {
  city: City;
  category: Category;
}) {
  if (!city || !category) notFound();

  const { events, error } = await loadFilteredPublishedEvents({
    city: city.city,
    categorySlug: category.slug,
  });
  const month = currentMonthLanding();
  const todayRange = getDateRange("oggi");
  const weekendRange = getDateRange("weekend");
  const { today, weekend, upcomingRest } = splitCityLandingEvents(events, {
    today: todayRange ?? { start: new Date(0), end: new Date(0) },
    weekend: weekendRange ?? { start: new Date(0), end: new Date(0) },
  });
  const stats = buildLandingStats(events);
  const editorial = buildCityCategoryLandingEditorial({
    cityName: city.city,
    categoryName: category.name,
    upcomingCount: events.length,
    todayCount: today.length,
    weekendCount: weekend.length,
    freeCount: stats.freeCount,
  });

  const path = cityCategoryEventsPath(city.city, category.slug);
  const h1 = `${category.name} a ${city.city}`;
  const label = category.name.toLocaleLowerCase("it");

  const faqs = [
    {
      question: `Ci sono ${label} a ${city.city} questo mese?`,
      answer:
        events.length > 0
          ? `Sì: in questa pagina trovi ${events.length} ${events.length === 1 ? "appuntamento" : "appuntamenti"} di ${label} a ${city.city}.`
          : `Al momento no. Esplora tutti gli eventi a ${city.city} o ${label} in Sardegna.`,
    },
    {
      question: "Come continuo a esplorare?",
      answer: `Passa alla città, alla categoria in tutta l’isola, a oggi o al weekend dalle scorciatoie in pagina.`,
    },
  ];

  const sections = [];
  if (today.length > 0) {
    sections.push({
      id: "oggi",
      title: `${category.name} oggi a ${city.city}`,
      events: today,
    });
  }
  if (weekend.length > 0) {
    sections.push({
      id: "weekend",
      title: `${category.name} questo weekend a ${city.city}`,
      events: weekend,
    });
  }
  if (upcomingRest.length > 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi: ${category.name} a ${city.city}`,
      events: upcomingRest,
    });
  } else if (sections.length === 0) {
    sections.push({
      id: "prossimi",
      title: `Prossimi: ${category.name} a ${city.city}`,
      events,
      emptyHint: `Non ci sono ${label} futuri a ${city.city} al momento.`,
    });
  }

  return (
    <EventLandingView
      eyebrow={city.area}
      h1={h1}
      subtitle={editorial.subtitle}
      intro={editorial.intro}
      paragraphs={editorial.paragraphs}
      events={events}
      sections={sections}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: city.city, href: cityEventsPath(city.city) },
        { name: category.name },
      ]}
      faqs={faqs}
      quickLinks={[
        { href: "/eventi-oggi", label: "Oggi" },
        { href: "/eventi-weekend", label: "Weekend" },
        { href: "/eventi-gratuiti", label: "Gratuiti" },
        { href: month.path, label: `${month.name} ${month.year}` },
      ]}
      relatedLinks={dedupeLinks([
        {
          href: cityEventsPath(city.city),
          label: `Tutti gli eventi a ${city.city}`,
        },
        {
          href: categoryEventsPath(category.slug),
          label: `${category.name} in Sardegna`,
        },
        ...coreDateLinks(path),
      ])}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: editorial.intro,
          url: absoluteUrl(path),
        }),
        eventsItemListSchema({
          name: h1,
          path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: city.city, path: cityEventsPath(city.city) },
          { name: category.name, path },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
