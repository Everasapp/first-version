import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/src/lib/seo/schema";
import {
  DATE_LANDING_META,
  type DateLandingKey,
} from "@/src/lib/seo/dateRange";
import { absoluteUrl } from "@/src/lib/seo/site";
import { categories } from "@/src/data/categories";

type DateLandingPageProps = {
  dateKey: Exclude<DateLandingKey, "settimana">;
};

export function buildDateLandingMetadata(
  dateKey: Exclude<DateLandingKey, "settimana">,
): Metadata {
  const meta = DATE_LANDING_META[dateKey];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.path },
    openGraph: {
      title: `${meta.title} | EVERAS`,
      description: meta.description,
      url: meta.path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | EVERAS`,
      description: meta.description,
    },
  };
}

export default async function DateLandingPage({ dateKey }: DateLandingPageProps) {
  const meta = DATE_LANDING_META[dateKey];
  const { events, error } = await loadFilteredPublishedEvents({
    date: dateKey,
  });

  const faqs = [
    {
      question: `Dove trovo gli eventi di ${dateKey === "oggi" ? "oggi" : dateKey === "domani" ? "domani" : "questo weekend"} in Sardegna?`,
      answer:
        "Su EVERAS raccogliamo concerti, sagre, mostre e appuntamenti da tutta l’isola. Filtra per città o categoria per restringere i risultati.",
    },
    {
      question: "Gli eventi sono aggiornati in tempo reale?",
      answer:
        "Pubblichiamo e aggiorniamo continuamente il calendario. Controlla sempre data, orario e dettagli sulla scheda evento.",
    },
  ];

  const relatedLinks = [
    { href: "/eventi", label: "Tutti gli eventi" },
    { href: "/eventi-oggi", label: "Eventi oggi" },
    { href: "/eventi-domani", label: "Eventi domani" },
    { href: "/eventi-weekend", label: "Eventi weekend" },
    ...categories.slice(0, 4).map((category) => ({
      href: `/eventi/${category.slug}`,
      label: category.name,
    })),
  ];

  return (
    <EventLandingView
      h1={meta.h1}
      intro={meta.description}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: meta.h1 },
      ]}
      faqs={faqs}
      relatedLinks={relatedLinks}
      jsonLd={[
        collectionPageSchema({
          name: meta.h1,
          description: meta.description,
          url: absoluteUrl(meta.path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: meta.h1, path: meta.path },
        ]),
      ]}
    />
  );
}
