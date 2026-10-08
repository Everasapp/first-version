import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/src/lib/supabase/public";
import {
  PUBLISHED_EVENTS_CACHE_SECONDS,
  PUBLISHED_EVENTS_CACHE_TAG,
} from "@/src/lib/seo/published-events-cache";

export type HomeEventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories?: string[] | null;
  province: string | null;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  is_featured: boolean;
  created_at?: string | null;
  views_count?: number | null;
  favorites_count?: number | null;
  shares_count?: number | null;
};

const fetchCachedHomeEventRows = unstable_cache(
  async (): Promise<HomeEventRow[]> => {
    const supabase = createPublicClient();
    const lookback = new Date();
    lookback.setUTCDate(lookback.getUTCDate() - 120);
    const pageSize = 1000;
    const rows: HomeEventRow[] = [];

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, slug, title, category, categories, province, municipality, location_name, start_at, end_at, image_url, is_free, price_from, is_featured, created_at, views_count, favorites_count, shares_count",
        )
        .eq("status", "published")
        .gte("start_at", lookback.toISOString())
        .order("start_at", { ascending: true })
        .range(from, from + pageSize - 1);

      // Throw inside the cache so transient failures never cache empty/partial lists.
      if (error) throw new Error(error.message);
      const chunk = (data ?? []) as HomeEventRow[];
      rows.push(...chunk);
      if (chunk.length < pageSize) return rows;
    }
  },
  ["homepage-event-rows-v1"],
  {
    revalidate: PUBLISHED_EVENTS_CACHE_SECONDS,
    tags: [PUBLISHED_EVENTS_CACHE_TAG],
  },
);

export async function loadHomeEventRows() {
  try {
    return { rows: await fetchCachedHomeEventRows(), error: null };
  } catch (error) {
    return {
      rows: [] as HomeEventRow[],
      error: {
        message: error instanceof Error ? error.message : "Unable to load home events",
      },
    };
  }
}
