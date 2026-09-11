import { SITE_NAME, SITE_URL, absoluteUrl } from "@/src/lib/seo/site";

export function websiteSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "it-IT",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/eventi?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/everas-logo-v2.webp"),
    sameAs: [
      "https://www.instagram.com/everas.app/",
      "https://www.facebook.com/profile.php?id=61575344263784",
    ],
  };
}

export function breadcrumbListSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function placeSchema(input: {
  name: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
}) {
  return {
    "@type": "Place",
    name: input.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address || undefined,
      addressLocality: input.city || undefined,
      addressRegion: input.province || "Sardegna",
      addressCountry: "IT",
    },
  };
}

export function eventSchema(input: {
  name: string;
  description: string;
  startAt: string;
  endAt?: string | null;
  imageUrl?: string | null;
  url: string;
  isFree: boolean;
  priceFrom?: number;
  ticketUrl?: string | null;
  locationName: string;
  address?: string | null;
  city: string;
  province?: string | null;
  organizerName?: string | null;
}) {
  const offers =
    input.ticketUrl || input.isFree || input.priceFrom !== undefined
      ? {
          "@type": "Offer",
          url: input.ticketUrl || input.url,
          price: input.isFree ? 0 : input.priceFrom,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    startDate: input.startAt,
    endDate: input.endAt || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: input.imageUrl ? [input.imageUrl] : undefined,
    url: input.url,
    location: placeSchema({
      name: input.locationName,
      address: input.address,
      city: input.city,
      province: input.province,
    }),
    organizer: input.organizerName
      ? {
          "@type": "Organization",
          name: input.organizerName,
        }
      : undefined,
    offers,
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  aboutName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    image: [absoluteUrl(input.imageUrl)],
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    inLanguage: "it-IT",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/everas-logo-v2.webp"),
      },
    },
    about: input.aboutName
      ? {
          "@type": "Place",
          name: input.aboutName,
        }
      : undefined,
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** ItemList of absolute URLs — helps Google discover listing pages. */
export function itemListSchema(input: {
  name: string;
  url: string;
  items: Array<{ name: string; url: string }>;
}): Record<string, unknown> | undefined {
  if (!input.items.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: input.url,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * ItemList from event cards (`id` = public slug under `/eventi/...`).
 */
export function eventsItemListSchema(input: {
  name: string;
  path: string;
  events: Array<{ title: string; id: string }>;
  limit?: number;
}): Record<string, unknown> | undefined {
  const limit = input.limit ?? 20;
  return itemListSchema({
    name: input.name,
    url: absoluteUrl(input.path),
    items: input.events.slice(0, limit).map((event) => ({
      name: event.title,
      url: absoluteUrl(`/eventi/${event.id}`),
    })),
  });
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
): Record<string, unknown> | undefined {
  if (!faqs.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
