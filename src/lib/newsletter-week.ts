import type { SupabaseClient } from "@supabase/supabase-js";

import {
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
  sendCampaignEmailViaResend,
  sleep,
} from "@/src/lib/admin/email-campaigns";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { eventMatchesCategoryFilter } from "@/src/lib/event-categories";
import { findCityByName } from "@/src/utils/nearby-city";
import {
  type GeoArea,
  type ResolvedGeo,
  resolveGeoPreference,
} from "@/src/lib/geo-area";
import {
  buildNewsletterHtml,
  formatWeekRangeLabel,
  type NewsletterEvent,
} from "@/src/lib/newsletter";
import { getSiteUrl } from "@/src/lib/notifications/config";
import { createAdminClient, tryCreateAdminClient } from "@/src/lib/supabase/admin";

const ROME_TZ = "Europe/Rome";
const MAX_EVENTS = 8;
const MAX_NEARBY = 3;

export type NewsletterSubscriber = {
  id: string;
  full_name: string | null;
  municipality: string | null;
  province: string | null;
  newsletter_city: string | null;
  newsletter_category: string | null;
  newsletter_unsub_token: string;
};

export type NewsletterPreview = {
  userId: string;
  fullName: string | null;
  email: string | null;
  geo: ResolvedGeo;
  category: string | null;
  subject: string;
  html: string;
  eventsCount: number;
  skippedReason?: string;
};

export type WeeklyNewsletterSummary = {
  weekLabel: string;
  subscribers: number;
  sent: number;
  skipped: number;
  failed: number;
  eventsInWeek: number;
  errors: Array<{ userId: string; error: string }>;
};

type WeekEventRow = NewsletterEvent & {
  slug: string | null;
  status: string;
  province?: string | null;
};

function romeYmd(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function romeWeekdayIndex(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: ROME_TZ,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

function addDaysYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
}

function zonedTimeToUtc(ymd: string, time: string, timeZone: string) {
  const utcGuess = new Date(`${ymd}T${time}Z`);
  const inZone = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .format(utcGuess)
    .replace(" ", "T");
  const zoneAsUtc = new Date(`${inZone}Z`);
  return new Date(utcGuess.getTime() - (zoneAsUtc.getTime() - utcGuess.getTime()));
}

export function getCurrentRomeWeekRange(now = new Date()) {
  const today = romeYmd(now);
  const weekday = romeWeekdayIndex(now);
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const monday = addDaysYmd(today, -daysFromMonday);
  const nextMonday = addDaysYmd(monday, 7);
  const start = zonedTimeToUtc(monday, "00:00:00", ROME_TZ);
  const end = zonedTimeToUtc(nextMonday, "00:00:00", ROME_TZ);
  return {
    start,
    end,
    label: formatWeekRangeLabel(start, end),
  };
}

function eventArea(event: Pick<WeekEventRow, "municipality" | "province">): GeoArea | null {
  return (
    findCityByName(event.municipality)?.area ??
    resolveGeoPreference({ province: event.province }).area
  );
}

function sameCity(eventCity: string | null | undefined, userCity: string | null) {
  if (!eventCity || !userCity) return false;
  return (
    eventCity.toLocaleLowerCase("it").trim() ===
    userCity.toLocaleLowerCase("it").trim()
  );
}

function isLikelyDuplicateTitle(title: string) {
  return /^copia di\b/i.test(title.trim());
}

function rankEvent(
  event: WeekEventRow,
  geo: ResolvedGeo,
  category: string | null,
) {
  let score = 0;
  if (sameCity(event.municipality, geo.city)) score += 100;
  if (geo.area && eventArea(event) === geo.area) score += 40;
  if (event.is_featured) score += 12;
  if (category && eventMatchesCategoryFilter(event, category)) score += 18;
  return score;
}

export function pickEventsForGeo(
  events: WeekEventRow[],
  geo: ResolvedGeo,
  category: string | null,
) {
  const ranked = [...events]
    .filter((event) => event.slug && !isLikelyDuplicateTitle(event.title))
    .sort((a, b) => {
      const scoreDiff = rankEvent(b, geo, category) - rankEvent(a, geo, category);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    });

  const nearby: NewsletterEvent[] = [];
  const rest: NewsletterEvent[] = [];

  for (const event of ranked) {
    if (nearby.length + rest.length >= MAX_EVENTS) break;
    if (sameCity(event.municipality, geo.city) && nearby.length < MAX_NEARBY) {
      nearby.push(event);
      continue;
    }
    rest.push(event);
  }

  return { nearbyEvents: nearby, areaEvents: rest };
}

export function buildNewsletterSubject(area: GeoArea | null, weekLabel: string) {
  if (area) {
    return `Cosa fare questa settimana nel ${area} · ${weekLabel}`;
  }
  return `Cosa fare questa settimana in Sardegna · ${weekLabel}`;
}

function getClient(supabase?: SupabaseClient) {
  return supabase ?? createAdminClient();
}

function eventOverlapsWeek(
  event: Pick<WeekEventRow, "start_at" | "end_at">,
  weekStart: Date,
  weekEnd: Date,
  now: Date,
) {
  if (!isPublicEventActive(event.start_at, event.end_at, now)) {
    return false;
  }

  const start = new Date(event.start_at).getTime();
  const end = event.end_at ? new Date(event.end_at).getTime() : start;
  return start < weekEnd.getTime() && end >= weekStart.getTime();
}

export async function loadWeekEvents(
  now = new Date(),
  supabase?: SupabaseClient,
) {
  const week = getCurrentRomeWeekRange(now);
  const client = getClient(supabase);

  const { data, error } = await client
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, end_at, category, categories, is_free, price_from, image_url, is_featured, status, province",
    )
    .eq("status", "published")
    .lt("start_at", week.end.toISOString())
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const events = ((data ?? []) as WeekEventRow[]).filter((event) =>
    eventOverlapsWeek(event, week.start, week.end, now),
  );

  return { week, events };
}

export async function loadNewsletterSubscribers(supabase?: SupabaseClient) {
  const client = getClient(supabase);
  const { data, error } = await client
    .from("profiles")
    .select(
      "id, full_name, municipality, province, newsletter_city, newsletter_category, newsletter_unsub_token",
    )
    .eq("newsletter_opt_in", true);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as NewsletterSubscriber[];
}

export function composeSubscriberNewsletter({
  subscriber,
  email,
  events,
  weekLabel,
  siteUrl = getSiteUrl(),
}: {
  subscriber: NewsletterSubscriber;
  email?: string | null;
  events: WeekEventRow[];
  weekLabel: string;
  siteUrl?: string;
}): NewsletterPreview {
  const geo = resolveGeoPreference({
    newsletterCity: subscriber.newsletter_city,
    municipality: subscriber.municipality,
    province: subscriber.province,
  });
  const { nearbyEvents, areaEvents } = pickEventsForGeo(
    events,
    geo,
    subscriber.newsletter_category,
  );
  const eventsCount = nearbyEvents.length + areaEvents.length;
  const html = buildNewsletterHtml({
    fullName: subscriber.full_name,
    city: geo.city,
    area: geo.area,
    category: subscriber.newsletter_category,
    weekLabel,
    nearbyEvents,
    areaEvents,
    siteUrl,
    unsubToken: subscriber.newsletter_unsub_token,
  });

  return {
    userId: subscriber.id,
    fullName: subscriber.full_name,
    email: email ?? null,
    geo,
    category: subscriber.newsletter_category,
    subject: buildNewsletterSubject(geo.area, weekLabel),
    html,
    eventsCount,
    skippedReason: eventsCount === 0 ? "Nessun evento in settimana" : undefined,
  };
}

async function sendNewsletterEmail(to: string, subject: string, html: string) {
  await sendCampaignEmailViaResend({
    to,
    subject,
    html,
    from: CAMPAIGN_FROM_EMAIL,
    replyTo: CAMPAIGN_REPLY_TO,
  });
}

export async function runWeeklyNewsletter(options?: {
  dryRun?: boolean;
  testEmail?: string | null;
  supabase?: SupabaseClient;
}): Promise<WeeklyNewsletterSummary> {
  const dryRun = Boolean(options?.dryRun);
  const testEmail = options?.testEmail?.trim().toLowerCase() || null;
  const sessionClient = options?.supabase;
  const { week, events } = await loadWeekEvents(new Date(), sessionClient);
  const siteUrl = getSiteUrl();

  const summary: WeeklyNewsletterSummary = {
    weekLabel: week.label,
    subscribers: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    eventsInWeek: events.length,
    errors: [],
  };

  if (testEmail) {
    const preview = composeSubscriberNewsletter({
      subscriber: {
        id: "test",
        full_name: "Marina",
        municipality: "Sassari",
        province: "SS",
        newsletter_city: "Sassari",
        newsletter_category: null,
        newsletter_unsub_token: "preview",
      },
      email: testEmail,
      events,
      weekLabel: week.label,
      siteUrl,
    });

    if (!dryRun) {
      await sendNewsletterEmail(
        testEmail,
        `[TEST] ${preview.subject}`,
        preview.html,
      );
    }
    summary.sent = 1;
    return summary;
  }

  const subscribers = await loadNewsletterSubscribers(sessionClient);
  summary.subscribers = subscribers.length;

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    throw new Error(
      "Per inviare a tutti gli iscritti manca SUPABASE_SERVICE_ROLE_KEY su Vercel.",
    );
  }

  for (const subscriber of subscribers) {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(subscriber.id);

      if (userError || !userData.user?.email) {
        throw new Error(userError?.message || "Email utente non trovata");
      }

      if (!userData.user.email_confirmed_at) {
        if (!dryRun) {
          await supabase.from("newsletter_sends").insert({
            user_id: subscriber.id,
            events_count: 0,
            status: "skipped",
            error_message: "Email non confermata",
          });
        }
        summary.skipped += 1;
        continue;
      }

      const preview = composeSubscriberNewsletter({
        subscriber,
        email: userData.user.email,
        events,
        weekLabel: week.label,
        siteUrl,
      });

      if (preview.eventsCount === 0) {
        if (!dryRun) {
          await supabase.from("newsletter_sends").insert({
            user_id: subscriber.id,
            events_count: 0,
            status: "skipped",
            error_message: preview.skippedReason,
          });
        }
        summary.skipped += 1;
        continue;
      }

      if (!dryRun) {
        await sendNewsletterEmail(
          userData.user.email,
          preview.subject,
          preview.html,
        );
        await supabase.from("newsletter_sends").insert({
          user_id: subscriber.id,
          events_count: preview.eventsCount,
          status: "sent",
        });
        await supabase
          .from("profiles")
          .update({
            newsletter_last_sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscriber.id);
        await sleep(120);
      }

      summary.sent += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Errore sconosciuto";
      summary.failed += 1;
      summary.errors.push({ userId: subscriber.id, error: message });

      if (!dryRun) {
        await supabase.from("newsletter_sends").insert({
          user_id: subscriber.id,
          events_count: 0,
          status: "failed",
          error_message: message,
        });
      }
    }
  }

  return summary;
}
