import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventLandingView from "@/src/components/seo/EventLandingView";
import type { Category } from "@/src/data/categories";
import type { City } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/src/lib/seo/schema";
import {
  categoryEventsPath,
  cityCategoryEventsPath,
  cityEventsPath,
} from "@/src/lib/seo/paths";
import { absoluteUrl } from "@/src/lib/seo/site";

export function buildCityLandingMetadata(city: City): Metadata {
  const title = `Eventi a ${city.city}`;
  const description = `Scopri gli eventi a ${city.city} (${city.area}): concerti, sagre, mostre e appuntamenti su EVERAS.`;
  const path = cityEventsPath(city.city);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
    },
  };
}

export function buildCategoryLandingMetadata(category: Category): Metadata {
  const title = `${category.name} in Sardegna`;
  const description = `Eventi di ${category.name.toLocaleLowerCase("it")} in tutta la Sardegna. Trova date, luoghi e biglietti su EVERAS.`;
  const path = categoryEventsPath(category.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
    },
  };
}

export function buildCityCategoryLandingMetadata(
  city: City,
  category: Category,
): Metadata {
  const title = `${category.name} a ${city.city}`;
  const description = `${category.name} a ${city.city}: calendario aggiornato di eventi, date e luoghi su EVERAS.`;
  const path = cityCategoryEventsPath(city.city, category.slug);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | EVERAS`,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EVERAS`,
      description,
    },
  };
}

export async function CityLandingPage({ city }: { city: City }) {
  const { events, error } = await loadFilteredPublishedEvents({
    city: city.city,
  });
  const path = cityEventsPath(city.city);
  const h1 = `Eventi a ${city.city}`;
  const intro = `Il calendario aggiornato di ${city.city}: concerti, sagre, cultura e appuntamenti in ${city.area}.`;

  return (
    <EventLandingView
      eyebrow={city.area}
      h1={h1}
      intro={intro}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: city.city },
      ]}
      faqs={[
        {
          question: `Quali eventi ci sono a ${city.city}?`,
          answer: `Su EVERAS trovi gli eventi pubblicati a ${city.city} e dintorni, con data, luogo e dettagli utili per organizzarti.`,
        },
        {
          question: "Posso filtrare per categoria?",
          answer: `Sì: esplora le categorie collegate sotto, oppure apri una pagina come Concerti a ${city.city}.`,
        },
      ]}
      relatedLinks={[
        { href: "/eventi-oggi", label: "Eventi oggi" },
        { href: "/eventi-weekend", label: "Questo weekend" },
        ...categories.slice(0, 6).map((category) => ({
          href: cityCategoryEventsPath(city.city, category.slug),
          label: `${category.name} a ${city.city}`,
        })),
      ]}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: intro,
          url: absoluteUrl(path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: city.city, path },
        ]),
      ]}
    />
  );
}

export async function CategoryLandingPage({
  category,
}: {
  category: Category;
}) {
  const { events, error } = await loadFilteredPublishedEvents({
    categorySlug: category.slug,
  });
  const path = categoryEventsPath(category.slug);
  const h1 = `${category.name} in Sardegna`;
  const intro = `Tutti gli eventi di ${category.name.toLocaleLowerCase("it")} in Sardegna: date, città e dettagli su EVERAS.`;

  return (
    <EventLandingView
      h1={h1}
      intro={intro}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: category.name },
      ]}
      faqs={[
        {
          question: `Come trovo ${category.name.toLocaleLowerCase("it")} vicino a me?`,
          answer:
            "Apri una città dal menu Esplora o dalla home, oppure combina città e categoria dalle pagine locali.",
        },
      ]}
      relatedLinks={[
        { href: "/categorie", label: "Tutte le categorie" },
        { href: "/eventi-oggi", label: "Eventi oggi" },
        { href: cityEventsPath("Sassari"), label: "Eventi a Sassari" },
        { href: cityEventsPath("Cagliari"), label: "Eventi a Cagliari" },
        { href: cityEventsPath("Alghero"), label: "Eventi ad Alghero" },
      ]}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: intro,
          url: absoluteUrl(path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: category.name, path },
        ]),
      ]}
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
  const path = cityCategoryEventsPath(city.city, category.slug);
  const h1 = `${category.name} a ${city.city}`;
  const intro = `Calendario di ${category.name.toLocaleLowerCase("it")} a ${city.city}: trova date, luoghi e informazioni pratiche.`;

  return (
    <EventLandingView
      eyebrow={city.area}
      h1={h1}
      intro={intro}
      events={events}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi", href: "/eventi" },
        { name: city.city, href: cityEventsPath(city.city) },
        { name: category.name },
      ]}
      faqs={[
        {
          question: `Ci sono ${category.name.toLocaleLowerCase("it")} a ${city.city} questo mese?`,
          answer: `Controlla l’elenco aggiornato qui sopra. Se non trovi risultati, esplora tutti gli eventi a ${city.city} o la categoria in tutta la Sardegna.`,
        },
      ]}
      relatedLinks={[
        { href: cityEventsPath(city.city), label: `Tutti gli eventi a ${city.city}` },
        {
          href: categoryEventsPath(category.slug),
          label: `${category.name} in Sardegna`,
        },
        { href: "/eventi-weekend", label: "Questo weekend" },
      ]}
      jsonLd={[
        collectionPageSchema({
          name: h1,
          description: intro,
          url: absoluteUrl(path),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi", path: "/eventi" },
          { name: city.city, path: cityEventsPath(city.city) },
          { name: category.name, path },
        ]),
      ]}
    />
  );
}
