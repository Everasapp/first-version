import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://www.everas.it";

/** Category slugs only — avoid importing React icon modules into the sitemap route. */
const CATEGORY_SLUGS = [
  "musica-concerti",
  "sagre-tradizioni",
  "spettacoli",
  "sport-competizioni",
  "fiere-mercatini",
  "arte-cultura",
  "workshop-corsi",
  "celebrazioni",
  "food-drink",
  "famiglie-bambini",
  "benessere",
  "business-networking",
] as const;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toLastModified(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/eventi`,
      lastModified: new Date(),
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

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/categorie/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const base = [...staticRoutes, ...categoryRoutes];

  try {
    const supabase = getSupabase();

    if (!supabase) {
      return base;
    }

    const [{ data: events, error: eventsError }, { data: organizers, error: organizersError }] =
      await Promise.all([
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

    if (eventsError) {
      console.error("Sitemap events query failed:", eventsError.message);
    }

    if (organizersError) {
      console.error(
        "Sitemap organizers query failed:",
        organizersError.message,
      );
    }

    const eventRoutes: MetadataRoute.Sitemap = (events ?? [])
      .filter((event) => typeof event.slug === "string" && event.slug.length > 0)
      .map((event) => ({
        url: `${SITE_URL}/eventi/${event.slug}`,
        lastModified: toLastModified(event.updated_at || event.start_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const organizerRoutes: MetadataRoute.Sitemap = (organizers ?? []).map(
      (organizer) => ({
        url: `${SITE_URL}/organizzatori/${organizer.id}`,
        lastModified: toLastModified(organizer.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }),
    );

    return [...base, ...eventRoutes, ...organizerRoutes];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return base;
  }
}
