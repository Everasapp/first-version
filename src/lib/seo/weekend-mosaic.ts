import type { EventCardData } from "@/src/components/home/EventCard";
import { absoluteUrl } from "@/src/lib/seo/site";

export const WEEKEND_OG_SIZE = { width: 1200, height: 630 } as const;
export const WEEKEND_MOSAIC_MIN_POSTERS = 4;
export const WEEKEND_MOSAIC_MAX_POSTERS = 8;

export function weekendOgPath(slug: string, cacheKey?: number | string) {
  const path = `/og/weekend/${encodeURIComponent(slug)}`;
  if (cacheKey === undefined || cacheKey === "") return path;
  return `${path}?n=${encodeURIComponent(String(cacheKey))}`;
}

export function isPlaceholderPoster(url: string) {
  const value = url.trim().toLocaleLowerCase("it");
  return !value || value.includes("concert.webp") || value.includes("og.jpg");
}

export function toAbsolutePosterUrl(url: string) {
  const value = url.trim();
  if (!value) return null;
  if (isPlaceholderPoster(value)) return null;
  if (value.startsWith("https://") || value.startsWith("http://")) return value;
  if (value.startsWith("/")) return absoluteUrl(value);
  return null;
}

export function pickWeekendPosterUrls(
  events: EventCardData[],
  limit = WEEKEND_MOSAIC_MAX_POSTERS,
) {
  const seen = new Set<string>();
  const urls: string[] = [];
  const ranked = [...events].sort((left, right) => {
    if (Boolean(left.isFeatured) !== Boolean(right.isFeatured)) {
      return left.isFeatured ? -1 : 1;
    }
    return 0;
  });

  for (const event of ranked) {
    const absolute = toAbsolutePosterUrl(event.imageUrl);
    if (!absolute || seen.has(absolute)) continue;
    seen.add(absolute);
    urls.push(absolute);
    if (urls.length >= limit) break;
  }

  return urls;
}

export function splitPosterRows(urls: string[]) {
  if (urls.length >= 8) {
    return { top: urls.slice(0, 4), bottom: urls.slice(4, 8) };
  }
  if (urls.length === 7) {
    return { top: urls.slice(0, 4), bottom: urls.slice(4, 7) };
  }
  if (urls.length === 6) {
    return { top: urls.slice(0, 3), bottom: urls.slice(3, 6) };
  }
  if (urls.length === 5) {
    return { top: urls.slice(0, 3), bottom: urls.slice(3, 5) };
  }
  if (urls.length === 4) {
    return { top: urls.slice(0, 2), bottom: urls.slice(2, 4) };
  }
  return { top: urls, bottom: [] as string[] };
}
