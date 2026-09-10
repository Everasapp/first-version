import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { cities } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import { eventCategorySlugs } from "@/src/lib/event-categories";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { cityToSlug, cityCategoryEventsPath } from "@/src/lib/seo/paths";
import { upcomingCalendarMonths } from "@/src/lib/seo/calendar";
import { FESTIVAL_HUBS } from "@/src/lib/seo/festival-hubs";
import { upcomingWeekends } from "@/src/lib/seo/weekends";

const SITE_URL = "https://www.everas.it";

const CATEGORY_SLUGS = categories.map((category) => category.slug);

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
      url: `${SITE_URL}/eventi-oggi`,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/eventi-domani`,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/eventi-weekend`,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/eventi-sardegna`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    ...upcomingCalendarMonths(8).map((month) => ({
      url: `${SITE_URL}${month.path}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...FESTIVAL_HUBS.map((hub) => ({
      url: `${SITE_URL}${hub.path}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...upcomingWeekends(10).map((weekend) => ({
      url: `${SITE_URL}${weekend.path}`,
      changeFrequency: "daily" as const,
      priority: 0.82,
    })),
    {
      url: `${SITE_URL}/categorie`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contatti`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/segnala-evento`,
      changeFrequency: "monthly",
      priority: 0.6,
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
    url: `${SITE_URL}/eventi/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  const base = [...staticRoutes, ...categoryRoutes];

  try {
    const supabase = getSupabase();

    if (!supabase) {
      return base;
    }

    const [
      { data: events, error: eventsError },
      { data: organizers, error: organizersError },
      { data: directoryPages, error: directoryError },
    ] = await Promise.all([
      supabase
        .from("events")
        .select("slug, updated_at, start_at, end_at, municipality, category, categories")
        .eq("status", "published")
        .not("slug", "is", null)
        .order("start_at", { ascending: false })
        .limit(5000),
      supabase
        .from("profiles")
        .select("id, updated_at")
        .in("role", ["organizzatore", "admin"])
        .limit(2000),
      supabase
        .from("organizer_directory_public")
        .select("slug, claimed_by_profile_id")
        .eq("public_page_enabled", true)
        .not("slug", "is", null)
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

    if (directoryError) {
      console.error(
        "Sitemap organizer pages query failed:",
        directoryError.message,
      );
    }

    const claimedProfileIds = new Set(
      (directoryPages ?? [])
        .map((row) =>
          typeof row.claimed_by_profile_id === "string"
            ? row.claimed_by_profile_id
            : "",
        )
        .filter(Boolean),
    );

    const reserved = new Set([
      ...CATEGORY_SLUGS,
      ...cities.map((city) => cityToSlug(city.city)),
    ]);
    const knownCitySlugs = new Set(cities.map((city) => cityToSlug(city.city)));

    const upcomingEvents = (events ?? []).filter(
      (event) =>
        typeof event.start_at === "string" &&
        isPublicEventActive(event.start_at, event.end_at),
    );

    const eventRoutes: MetadataRoute.Sitemap = upcomingEvents
      .filter(
        (event) =>
          typeof event.slug === "string" &&
          event.slug.length > 0 &&
          !reserved.has(event.slug),
      )
      .map((event) => ({
        url: `${SITE_URL}/eventi/${event.slug}`,
        lastModified: toLastModified(event.updated_at || event.start_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const citiesWithUpcoming = new Set<string>();
    const cityCategoryPaths = new Set<string>();
    for (const event of upcomingEvents) {
      const municipality =
        typeof event.municipality === "string" ? event.municipality.trim() : "";
      if (!municipality) continue;

      const citySlug = cityToSlug(municipality);
      if (!citySlug || !knownCitySlugs.has(citySlug)) continue;
      citiesWithUpcoming.add(citySlug);

      for (const categorySlug of eventCategorySlugs(event)) {
        if (
          !categorySlug ||
          knownCitySlugs.has(categorySlug) ||
          !CATEGORY_SLUGS.includes(categorySlug)
        ) {
          continue;
        }
        cityCategoryPaths.add(cityCategoryEventsPath(municipality, categorySlug));
      }
    }

    const cityRoutes: MetadataRoute.Sitemap = [...citiesWithUpcoming].map(
      (slug) => ({
        url: `${SITE_URL}/eventi/${slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }),
    );

    const cityCategoryRoutes: MetadataRoute.Sitemap = [...cityCategoryPaths].map(
      (path) => ({
        url: `${SITE_URL}${path}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }),
    );

    const organizerRoutes: MetadataRoute.Sitemap = (organizers ?? [])
      .filter((organizer) => !claimedProfileIds.has(organizer.id))
      .map((organizer) => ({
        url: `${SITE_URL}/organizzatori/${organizer.id}`,
        lastModified: toLastModified(organizer.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    const directoryRoutes: MetadataRoute.Sitemap = (directoryPages ?? [])
      .filter((row) => typeof row.slug === "string" && row.slug.length > 0)
      .map((row) => ({
        url: `${SITE_URL}/organizzatori/${row.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [
      ...base,
      ...cityRoutes,
      ...eventRoutes,
      ...cityCategoryRoutes,
      ...organizerRoutes,
      ...directoryRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return base;
  }
}
