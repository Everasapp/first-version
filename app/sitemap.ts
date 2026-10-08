import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { cities } from "@/src/data/cities";
import { categories } from "@/src/data/categories";
import {
  eventCategorySlugs,
  eventMatchesCategoryFilter,
} from "@/src/lib/event-categories";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { resolveEventPricing } from "@/src/lib/eventPricing";
import { cityToSlug, cityCategoryEventsPath } from "@/src/lib/seo/paths";
import {
  upcomingCalendarMonths,
  calendarYears,
} from "@/src/lib/seo/calendar";
import {
  CULTURE_HUB_PATH,
  CULTURE_TOWNS,
  isEditorialCultureTown,
} from "@/src/lib/seo/cultura-towns";
import {
  CULTURA_ARTICLES,
  CULTURA_ARTICLES_HUB_PATH,
} from "@/src/lib/seo/cultura-articles";
import {
  CULTURE_AREAS,
  citiesForCultureArea,
  cultureTownPathForCity,
} from "@/src/lib/seo/cultura-areas";
import { FESTIVAL_HUBS } from "@/src/lib/seo/festival-hubs";
import { upcomingWeekends } from "@/src/lib/seo/weekends";
import { getDateRange, getMonthRange, getYearRange } from "@/src/lib/seo/dateRange";
import {
  eventAppearsInRange,
  type EventTemporalContext,
} from "@/src/lib/seo/eventAppearsInRange";
import { latestEventUpdate } from "@/src/lib/seo/last-modified";
import { shouldIndexCityLanding } from "@/src/lib/seo/site";

const SITE_URL = "https://www.everas.it";

const CATEGORY_SLUGS = categories.map((category) => category.slug);

type SitemapEventRow = {
  slug: string | null;
  updated_at?: string | null;
  start_at: string;
  end_at?: string | null;
  schedule_mode?: string | null;
  municipality?: string | null;
  category?: string | null;
  categories?: string[] | null;
  is_free?: boolean | null;
  price_from?: number | string | null;
};

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

function eventOverlapsRange(
  event: Pick<SitemapEventRow, "start_at" | "end_at" | "schedule_mode">,
  range: { start: Date; end: Date },
  context: EventTemporalContext = "general",
) {
  return eventAppearsInRange(
    {
      startAt: event.start_at,
      endAt: event.end_at,
      scheduleMode: event.schedule_mode,
    },
    range,
    context,
  );
}

function getEventArea(municipality: string | null | undefined) {
  if (!municipality) return undefined;
  return cities.find(
    (city) =>
      city.city.toLocaleLowerCase("it") ===
      municipality.toLocaleLowerCase("it"),
  )?.area;
}

function withLastModified(
  route: MetadataRoute.Sitemap[number],
  lastModified: Date | undefined,
): MetadataRoute.Sitemap[number] {
  return lastModified ? { ...route, lastModified } : route;
}

function overlappingEvents(
  events: SitemapEventRow[],
  range: { start: Date; end: Date },
  context: EventTemporalContext = "general",
) {
  return events.filter((event) => eventOverlapsRange(event, range, context));
}

function rollingFloorForRange(
  range: { start: Date; end: Date },
  rollingPageFloor: Date | undefined,
) {
  if (!rollingPageFloor) return undefined;
  const floor = rollingPageFloor.getTime();
  return range.start.getTime() <= floor && floor < range.end.getTime()
    ? rollingPageFloor
    : undefined;
}

/** Evergreen / always-indexable public URLs (no event-count gate). */
function alwaysIndexRoutes(): MetadataRoute.Sitemap {
  return [
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
      url: `${SITE_URL}/eventi-sardegna`,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/eventi-sardegna/sagre`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Festival hubs: index policy left unchanged (FASE 1 P2).
    ...FESTIVAL_HUBS.map((hub) => ({
      url: `${SITE_URL}${hub.path}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    {
      url: `${SITE_URL}${CULTURE_HUB_PATH}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}${CULTURA_ARTICLES_HUB_PATH}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CULTURA_ARTICLES.map((article) => ({
      url: `${SITE_URL}${article.path}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.76,
    })),
    ...CULTURE_AREAS.map((area) => ({
      url: `${SITE_URL}${area.path}`,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    })),
    ...CULTURE_TOWNS.filter(isEditorialCultureTown).map((article) => ({
      url: `${SITE_URL}${article.path}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
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
      url: `${SITE_URL}/chi-siamo`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/pubblicita`,
      changeFrequency: "monthly",
      priority: 0.6,
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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = alwaysIndexRoutes();

  try {
    const supabase = getSupabase();

    if (!supabase) {
      // Without live event data we cannot apply landingRobots(0) gates.
      return base;
    }

    const eventsSelectWithMode =
      "slug, updated_at, start_at, end_at, schedule_mode, municipality, category, categories, is_free, price_from";
    const eventsSelectWithoutMode =
      "slug, updated_at, start_at, end_at, municipality, category, categories, is_free, price_from";

    let eventsResult: {
      data: SitemapEventRow[] | null;
      error: { message: string } | null;
    } = await supabase
      .from("events")
      .select(eventsSelectWithMode)
      .eq("status", "published")
      .not("slug", "is", null)
      .order("start_at", { ascending: false })
      .limit(5000);

    if (
      eventsResult.error &&
      /schedule_mode/i.test(eventsResult.error.message) &&
      /does not exist|schema cache|column/i.test(eventsResult.error.message)
    ) {
      eventsResult = await supabase
        .from("events")
        .select(eventsSelectWithoutMode)
        .eq("status", "published")
        .not("slug", "is", null)
        .order("start_at", { ascending: false })
        .limit(5000);
    }

    const [
      { data: organizers, error: organizersError },
      { data: directoryPages, error: directoryError },
    ] = await Promise.all([
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

    const events = eventsResult.data;
    const eventsError = eventsResult.error;

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

    const rows = (events ?? []) as SitemapEventRow[];
    const upcomingEvents = rows.filter(
      (event) =>
        typeof event.start_at === "string" &&
        isPublicEventActive(event.start_at, event.end_at),
    );
    const rollingPageFloor = getDateRange("oggi")?.start;
    const latestUpcomingUpdate = latestEventUpdate(
      upcomingEvents,
      rollingPageFloor,
    );
    const sagreEvents = upcomingEvents.filter((event) =>
      eventMatchesCategoryFilter(event, "sagre-tradizioni"),
    );
    const baseWithLastModified = base.map((route) => {
      if (
        route.url === SITE_URL ||
        route.url === `${SITE_URL}/eventi` ||
        route.url === `${SITE_URL}/eventi-sardegna`
      ) {
        return withLastModified(route, latestUpcomingUpdate);
      }
      if (route.url === `${SITE_URL}/eventi-sardegna/sagre`) {
        return withLastModified(
          route,
          latestEventUpdate(sagreEvents, rollingPageFloor),
        );
      }
      return route;
    });

    // --- Gated by landingRobots(eventCount > 0) ---
    const dateLandingRoutes: MetadataRoute.Sitemap = [];
    for (const key of ["oggi", "domani", "weekend", "domenica"] as const) {
      const range = getDateRange(key);
      if (!range) continue;
      const context: EventTemporalContext =
        key === "weekend" ? "weekend" : "daily";
      const matching = overlappingEvents(upcomingEvents, range, context);
      if (matching.length === 0) continue;
      const path =
        key === "oggi"
          ? "/eventi-oggi"
          : key === "domani"
            ? "/eventi-domani"
            : key === "weekend"
              ? "/eventi-weekend"
              : "/eventi-domenica";
      dateLandingRoutes.push(
        withLastModified(
          {
            url: `${SITE_URL}${path}`,
            changeFrequency: key === "weekend" ? "daily" : "hourly",
            priority: 0.85,
          },
          latestEventUpdate(matching, rollingPageFloor),
        ),
      );
    }

    const oggiRange = getDateRange("oggi");
    if (oggiRange) {
      const sudOggiEvents = upcomingEvents.filter(
        (event) =>
          getEventArea(event.municipality) === "Sud Sardegna" &&
          eventOverlapsRange(event, oggiRange, "daily"),
      );
      if (sudOggiEvents.length > 0) {
        dateLandingRoutes.push(
          withLastModified(
            {
              url: `${SITE_URL}/eventi-sud-sardegna-oggi`,
              changeFrequency: "hourly",
              priority: 0.82,
            },
            latestEventUpdate(sudOggiEvents, rollingPageFloor),
          ),
        );
      }
    }

    const freeEvents = upcomingEvents.filter((event) =>
      resolveEventPricing(event.is_free ?? false, event.price_from ?? null)
        .isFree,
    );
    const freeRoutes: MetadataRoute.Sitemap =
      freeEvents.length > 0
        ? [
            withLastModified(
              {
                url: `${SITE_URL}/eventi-gratuiti`,
                changeFrequency: "daily",
                priority: 0.8,
              },
              latestEventUpdate(freeEvents, rollingPageFloor),
            ),
          ]
        : [];

    const yearRoutes: MetadataRoute.Sitemap = calendarYears().flatMap((year) => {
      const range = getYearRange(year.year);
      const matching = overlappingEvents(
        upcomingEvents,
        range,
        "general",
      );
      return matching.length > 0
        ? [
            withLastModified(
              {
                url: `${SITE_URL}${year.path}`,
                changeFrequency: "daily" as const,
                priority: 0.9,
              },
              latestEventUpdate(
                matching,
                rollingFloorForRange(range, rollingPageFloor),
              ),
            ),
          ]
        : [];
    });

    const monthRoutes: MetadataRoute.Sitemap = upcomingCalendarMonths(8).flatMap(
      (month) => {
        const range = getMonthRange(month.year, month.monthIndex);
        const matching = overlappingEvents(
          upcomingEvents,
          range,
          "month",
        );
        return matching.length > 0
          ? [
              withLastModified(
                {
                  url: `${SITE_URL}${month.path}`,
                  changeFrequency: "daily" as const,
                  priority: 0.8,
                },
                latestEventUpdate(
                  matching,
                  rollingFloorForRange(range, rollingPageFloor),
                ),
              ),
            ]
          : [];
      },
    );

    const weekendRoutes: MetadataRoute.Sitemap = upcomingWeekends(10).flatMap(
      (weekend) => {
        const range = { start: weekend.start, end: weekend.end };
        const matching = overlappingEvents(
          upcomingEvents,
          range,
          "weekend",
        );
        return matching.length > 0
          ? [
              withLastModified(
                {
                  url: `${SITE_URL}${weekend.path}`,
                  changeFrequency: "daily" as const,
                  priority: 0.82,
                },
                latestEventUpdate(
                  matching,
                  rollingFloorForRange(range, rollingPageFloor),
                ),
              ),
            ]
          : [];
      },
    );

    const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.flatMap(
      (slug) => {
        const matching = upcomingEvents.filter((event) =>
          eventMatchesCategoryFilter(event, slug),
        );
        return matching.length > 0
          ? [
              withLastModified(
                {
                  url: `${SITE_URL}/eventi/${slug}`,
                  changeFrequency: "daily" as const,
                  priority: 0.75,
                },
                latestEventUpdate(matching, rollingPageFloor),
              ),
            ]
          : [];
      },
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
        lastModified: toLastModified(event.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const citiesWithUpcoming = new Set<string>();
    const cityUpcomingCount = new Map<string, number>();
    const cityTotalCount = new Map<string, number>();
    const cityUpcomingEvents = new Map<string, SitemapEventRow[]>();
    const cityCategoryPaths = new Set<string>();
    const cityCategoryEvents = new Map<string, SitemapEventRow[]>();

    for (const event of rows) {
      const municipality =
        typeof event.municipality === "string" ? event.municipality.trim() : "";
      if (!municipality) continue;
      const citySlug = cityToSlug(municipality);
      if (!citySlug || !knownCitySlugs.has(citySlug)) continue;

      cityTotalCount.set(citySlug, (cityTotalCount.get(citySlug) ?? 0) + 1);
      if (
        typeof event.start_at === "string" &&
        isPublicEventActive(event.start_at, event.end_at)
      ) {
        cityUpcomingCount.set(
          citySlug,
          (cityUpcomingCount.get(citySlug) ?? 0) + 1,
        );
        const cityEvents = cityUpcomingEvents.get(citySlug) ?? [];
        cityEvents.push(event);
        cityUpcomingEvents.set(citySlug, cityEvents);
        citiesWithUpcoming.add(citySlug);
      }
    }

    for (const event of upcomingEvents) {
      const municipality =
        typeof event.municipality === "string" ? event.municipality.trim() : "";
      if (!municipality) continue;

      const citySlug = cityToSlug(municipality);
      if (!citySlug || !knownCitySlugs.has(citySlug)) continue;

      for (const categorySlug of eventCategorySlugs(event)) {
        if (
          !categorySlug ||
          knownCitySlugs.has(categorySlug) ||
          !CATEGORY_SLUGS.includes(categorySlug)
        ) {
          continue;
        }
        const path = cityCategoryEventsPath(municipality, categorySlug);
        cityCategoryPaths.add(path);
        const pathEvents = cityCategoryEvents.get(path) ?? [];
        pathEvents.push(event);
        cityCategoryEvents.set(path, pathEvents);
      }
    }

    const cityRoutes: MetadataRoute.Sitemap = [...knownCitySlugs]
      .filter((slug) =>
        shouldIndexCityLanding(
          cityUpcomingCount.get(slug) ?? 0,
          cityTotalCount.get(slug) ?? 0,
        ),
      )
      .map((slug) =>
        withLastModified(
          {
            url: `${SITE_URL}/eventi/${slug}`,
            changeFrequency: "daily" as const,
            priority: 0.8,
          },
          latestEventUpdate(
            cityUpcomingEvents.get(slug) ?? [],
            rollingPageFloor,
          ),
        ),
      );

    // City×category landings use landingRobots(count) — only include when
    // there is at least one upcoming event (path set is built from upcoming).
    const cityCategoryRoutes: MetadataRoute.Sitemap = [
      ...cityCategoryPaths,
    ].map((path) =>
      withLastModified(
        {
          url: `${SITE_URL}${path}`,
          changeFrequency: "daily" as const,
          priority: 0.7,
        },
        latestEventUpdate(
          cityCategoryEvents.get(path) ?? [],
          rollingPageFloor,
        ),
      ),
    );

    const cultureArticleTownSlugs = new Set(
      CULTURE_TOWNS.map((article) => cityToSlug(article.town)),
    );
    // Stubs use landingRobots(events.length) — only towns with upcoming events.
    const cultureStubRoutes: MetadataRoute.Sitemap = CULTURE_AREAS.filter(
      (area) => area.townPagesLive,
    ).flatMap((area) =>
      citiesForCultureArea(area)
        .filter((city) => {
          const slug = cityToSlug(city.city);
          return (
            citiesWithUpcoming.has(slug) && !cultureArticleTownSlugs.has(slug)
          );
        })
        .map((city) => ({
          url: `${SITE_URL}${cultureTownPathForCity(city)}`,
          changeFrequency: "monthly" as const,
          priority: 0.65,
        })),
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
      ...baseWithLastModified,
      ...dateLandingRoutes,
      ...freeRoutes,
      ...yearRoutes,
      ...monthRoutes,
      ...weekendRoutes,
      ...categoryRoutes,
      ...cityRoutes,
      ...eventRoutes,
      ...cityCategoryRoutes,
      ...cultureStubRoutes,
      ...organizerRoutes,
      ...directoryRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return base;
  }
}
