import type { Metadata } from "next";

/** Canonical production origin — always www. */
export const SITE_URL = "https://www.everas.it";
export const SITE_NAME = "EVERAS";
export const SITE_LOCALE = "it_IT";
export const DEFAULT_OG_IMAGE = "/og.jpg?v=20260811g";

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function defaultOgImages() {
  return [
    {
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: "EVERAS — Eventi in Sardegna",
      type: "image/jpeg" as const,
    },
  ];
}

/** Thin landing pages with zero upcoming events should not compete in search. */
export function landingRobots(eventCount: number): Metadata["robots"] {
  return eventCount > 0 ? undefined : { index: false, follow: true };
}

export function filteredListingRobots(): Metadata["robots"] {
  return { index: false, follow: true };
}
