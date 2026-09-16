import type { Metadata } from "next";

import type { EventCardData } from "@/src/components/home/EventCard";
import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  eventsItemListSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks } from "@/src/lib/seo/calendar";
import {
  festivalHubLinks,
  type FestivalHub,
} from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";
import { findCulturaTownPathByName } from "@/src/lib/seo/cultura-towns";

export function buildFestivalLandingMetadata(hub: FestivalHub): Metadata {
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: hub.path },
    openGraph: {
      title: `${hub.title} | EVERAS`,
      description: hub.description,
      url: hub.path,
      type: "website",
      images: defaultOgImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.title} | EVERAS`,
      description: hub.description,
      images: defaultOgImages().map((image) => image.url),
    },
  };
}

function formatScheduleDates(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "Data da confermare";

  const startLabel = start.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });

  if (!endDate) return startLabel;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return startLabel;

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  if (sameDay) return startLabel;

  const endLabel = end.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });
  return `${startLabel} – ${endLabel}`;
}

function buildScheduleRows(hub: FestivalHub, events: EventCardData[]) {
  if (hub.slug !== "autunno-in-barbagia") return [];

  // Prefer town stops over the season-long umbrella event.
  const stops = events
    .filter((event) => {
      const title = event.title.trim();
      return !/^autunno in barbagia 20\d{2}$/i.test(title);
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const rows = stops.map((event) => {
    const place =
      event.municipality?.trim() ||
      event.location?.trim() ||
      "Località da confermare";
    const culturaPath = findCulturaTownPathByName(place);
    return {
      datesLabel: formatScheduleDates(event.startDate, event.endDate),
      place,
      href: `/eventi/${event.id}`,
      note: culturaPath ? "Apri tappa" : "Apri evento",
    };
  });

  // Deduplicate same place+dates if multiple similar cards exist.
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.datesLabel}|${row.place.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function FestivalLandingPage({ hub }: { hub: FestivalHub }) {
  const { events, error } = await loadFilteredPublishedEvents({
    titleIncludes: hub.titleIncludes,
    includeExpired: true,
  });

  const scheduleRows = buildScheduleRows(hub, events);
  const culturaLinks = scheduleRows
    .map((row) => {
      const path = findCulturaTownPathByName(row.place);
      if (!path) return null;
      return { href: path, label: `Guida ${row.place}` };
    })
    .filter((link): link is { href: string; label: string } => link != null);

  const uniqueCulturaLinks = culturaLinks.filter(
    (link, index, arr) =>
      arr.findIndex((item) => item.href === link.href) === index,
  );

  return (
    <EventLandingView
      eyebrow="Feste e sagre"
      h1={hub.h1}
      intro={hub.description}
      paragraphs={hub.paragraphs}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi in Sardegna", href: "/eventi-sardegna" },
        { name: hub.h1 },
      ]}
      faqs={hub.faqs}
      scheduleRows={scheduleRows}
      scheduleTitle={
        hub.slug === "autunno-in-barbagia"
          ? "Calendario tappe 2026"
          : "Calendario"
      }
      relatedLinks={[
        ...uniqueCulturaLinks.slice(0, 8),
        ...sagreExploreLinks(),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ].filter((link) => link.href !== hub.path)}
      jsonLd={[
        collectionPageSchema({
          name: hub.h1,
          description: hub.description,
          url: absoluteUrl(hub.path),
        }),
        eventsItemListSchema({
          name: hub.h1,
          path: hub.path,
          events,
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi in Sardegna", path: "/eventi-sardegna" },
          { name: hub.h1, path: hub.path },
        ]),
        faqPageSchema(hub.faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
