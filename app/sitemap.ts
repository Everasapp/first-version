import type { MetadataRoute } from "next";
import { NEW_PASSION_PATHS, PASSION_PATH } from "@/src/lib/editorial-learning-paths";
import { CAREER_LEARNING_PATHS, careerPathUrl } from "@/src/lib/career-learning-paths";
import { learningSeoPages, matchesLearningSeoPage } from "@/src/lib/seo/learning-pages";
import { loadHomeEventRows } from "@/src/lib/home/load-events";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/src/lib/supabase/public";
import { isLearningEvent, LEARNING_PATH, PUBLIC_LEARNING_FILTER } from "@/src/lib/learning-courses";
import { SITE_URL } from "@/src/lib/seo/site";
import { CULTURA_ARTICLES } from "@/src/lib/seo/cultura-articles";
import { CULTURE_TOWNS, isEditorialCultureTown } from "@/src/lib/seo/cultura-towns";
import { CULTURE_AREAS } from "@/src/lib/seo/cultura-areas";
import { PUBLISHED_EVENTS_CACHE_SECONDS, PUBLISHED_EVENTS_CACHE_TAG } from "@/src/lib/seo/published-events-cache";

/** Refresh the sitemap response. Rows stay on the existing published-events cache. */
export const revalidate = 900;

type LearningSitemapRow = {
  slug: string | null;
  updated_at: string | null;
  category: string | null;
  categories: string[] | null;
  subcategory: string | null;
};

const loadLearningSitemapRows = unstable_cache(async () => {
  const supabase = createPublicClient();
  const rows: LearningSitemapRow[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase.from("events")
      .select("slug, updated_at, category, categories, subcategory")
      .eq("status", "published")
      .or(PUBLIC_LEARNING_FILTER)
      .not("slug", "is", null)
      .order("slug", { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    const chunk = (data ?? []) as LearningSitemapRow[];
    rows.push(...chunk.filter(isLearningEvent));
    if (chunk.length < pageSize) return rows;
  }
}, ["learning-sitemap-v1"], {
  revalidate: PUBLISHED_EVENTS_CACHE_SECONDS,
  tags: [PUBLISHED_EVENTS_CACHE_TAG],
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [...new Set([
    "/", LEARNING_PATH, "/idee-e-percorsi", "/cultura", "/cultura-sarda",
    ...CAREER_LEARNING_PATHS.map((path) => careerPathUrl(path.slug)),
    PASSION_PATH, ...NEW_PASSION_PATHS.map((path) => path.path),
    "/per-gli-organizzatori", "/chi-siamo", "/contatti", "/privacy", "/cookie", "/termini", "/pubblicita",
    ...CULTURA_ARTICLES.map((article) => article.path),
    ...CULTURE_AREAS.filter((area) => area.townPagesLive).map((area) => area.path),
    ...CULTURE_TOWNS.filter(isEditorialCultureTown).map((article) => article.path),
  ])];
  // Only list populated evergreen SEO pages; empty ones remain noindex.
  const { rows: homeRows, error: homeError } = await loadHomeEventRows();
  const activeLearning = homeRows.filter((row) => isPublicEventActive(row.start_at, row.end_at));
  if (!homeError) {
    for (const page of learningSeoPages) {
      if (activeLearning.some((row) => matchesLearningSeoPage({
        title: row.title,
        municipality: row.municipality,
        learningTopic: row.subcategory ?? undefined,
        categories: resolveCategoryLabels(row),
        category: row.category,
        isFree: resolveEventPricing(row.is_free, row.price_from).isFree,
      }, page))) {
        pages.push(`/corsi/${page.slug}`);
      }
    }
  }

  const base: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" || path === LEARNING_PATH ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === LEARNING_PATH ? 0.9 : 0.5,
  }));
  try {
    const rows = await loadLearningSitemapRows();
    const unique = new Map(rows.filter((row) => row.slug).map((row) => [row.slug!, row]));
    return [...base, ...Array.from(unique, ([slug, row]) => {
      const updatedAt = row.updated_at ? new Date(row.updated_at) : undefined;
      return {
        url: `${SITE_URL}/eventi/${encodeURIComponent(slug)}`,
        ...(updatedAt && !Number.isNaN(updatedAt.getTime()) ? { lastModified: updatedAt } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })];
  } catch (error) {
    console.error("Sitemap corsi non disponibile:", error);
    return base;
  }
}
