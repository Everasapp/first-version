/** Canonical production origin — always www. */
export const SITE_URL = "https://www.everas.it";
export const SITE_NAME = "EVERAS";
export const SITE_LOCALE = "it_IT";

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
