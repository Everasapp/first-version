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
