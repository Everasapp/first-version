import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { categories } from "@/src/data/categories";

const SITE_URL = "https://www.everas.it";

export const revalidate = 3600;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/eventi`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categorie`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contatti`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/diventa-organizzatore`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pubblica`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termini`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookie`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categorie/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const supabase = getSupabase();

  if (!supabase) {
    return [...staticRoutes, ...categoryRoutes];
  }

  const [{ data: events }, { data: organizers }] = await Promise.all([
    supabase
      .from("events")
      .select("slug, updated_at, start_at")
      .eq("status", "published")
      .not("slug", "is", null)
      .order("start_at", { ascending: false })
      .limit(5000),
    supabase
      .from("profiles")
      .select("id, updated_at")
      .in("role", ["organizzatore", "admin"])
      .limit(2000),
  ]);

  const eventRoutes: MetadataRoute.Sitemap = (events ?? [])
    .filter((event) => Boolean(event.slug))
    .map((event) => ({
      url: `${SITE_URL}/eventi/${event.slug}`,
      lastModified: new Date(event.updated_at || event.start_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const organizerRoutes: MetadataRoute.Sitemap = (organizers ?? []).map(
    (organizer) => ({
      url: `${SITE_URL}/organizzatori/${organizer.id}`,
      lastModified: organizer.updated_at
        ? new Date(organizer.updated_at)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...eventRoutes,
    ...organizerRoutes,
  ];
}
