import {
  WEEKLY_NEWSLETTER_PAUSED,
  WEEKLY_NEWSLETTER_PAUSED_MESSAGE,
} from "@/src/lib/newsletter-availability";
import { isLearningEvent, PUBLIC_LEARNING_FILTER } from "@/src/lib/learning-courses";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  CAMPAIGN_FROM_EMAIL,
  CAMPAIGN_REPLY_TO,
  sendCampaignEmailViaResend,
  sleep,
} from "@/src/lib/admin/email-campaigns";
import { isPublicEventActive } from "@/src/lib/eventActive";
import { eventMatchesCategoryFilter } from "@/src/lib/event-categories";
import {
  formatDisciplineList,
  resolveStoredNewsletterPreferences,
  selectNewsletterCourses,
} from "@/src/lib/newsletter-preferences";
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
import {
  REAL_EMAIL_DISABLED_MESSAGE,
  realEmailDeliveryAllowed,
} from "@/src/lib/notifications/resend-delivery";
import {
  deliverNewsletterBatch,
  keepFirstNewsletterSnapshot,
  NEWSLETTER_BATCH_LIMIT,
  newsletterRecipientKey,
  type NewsletterDeliverySource,
} from "@/src/lib/newsletter-delivery";
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
  newsletter_areas?: string[] | null;
  newsletter_disciplines?: string[] | null;
  newsletter_unsub_token: string;
};

type NewsletterRecipient = NewsletterSubscriber & {
  email: string | null;
  emailConfirmed: boolean;
  source: NewsletterDeliverySource;
};

type NewsletterRecipientRow = {
  id: string;
  full_name: string | null;
  municipality: string | null;
  province: string | null;
  newsletter_city: string | null;
  newsletter_category: string | null;
  newsletter_areas?: string[] | null;
  newsletter_disciplines?: string[] | null;
  newsletter_unsub_token: string;
  email: string | null;
  email_confirmed: boolean | null;
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
  remaining: number;
  errors: Array<{ userId: string; error: string }>;
};

type WeekEventRow = NewsletterEvent & {
  slug: string | null;
  status: string;
  created_at?: string | null;
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
    weekKey: monday,
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
  const preferred = (category ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (
    preferred.length > 0 &&
    preferred.some((slug) => eventMatchesCategoryFilter(event, slug))
  ) {
    score += 18;
  }
  // Recently added courses have a modest advantage without overriding locality.
  if (event.created_at) {
    const ageDays = (Date.now() - new Date(event.created_at).getTime()) / 86400000;
    if (ageDays >= 0 && ageDays <= 14) score += 16;
    else if (ageDays > 14 && ageDays <= 30) score += 8;
  }
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

export function buildNewsletterSubject(
  area: GeoArea | null,
  weekLabel: string,
  areas?: readonly string[] | null,
) {
  if (areas && areas.length > 1) {
    return `Nuovi corsi e opportunità di formazione nelle tue zone · ${weekLabel}`;
  }
  if (area) {
    return `Nuovi corsi e opportunità di formazione nel ${area} · ${weekLabel}`;
  }
  return `Nuovi corsi e opportunità di formazione in Sardegna · ${weekLabel}`;
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
  // Rolling 30-day window, not only the current calendar week.
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const week = {
    start: now,
    end,
    label: formatWeekRangeLabel(now, end),
    weekKey: getCurrentRomeWeekRange(now).weekKey,
  };
  const client = getClient(supabase);

  const { data, error } = await client
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, end_at, category, categories, subcategory, is_free, price_from, image_url, is_featured, status, province, created_at",
    )
    .eq("status", "published")
    .or(PUBLIC_LEARNING_FILTER)
    .gte("start_at", now.toISOString())
    .lt("start_at", end.toISOString())
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);

  const events = ((data ?? []) as WeekEventRow[]).filter((event) =>
    isLearningEvent(event) && !isLikelyDuplicateTitle(event.title),
  );

  return { week, events };
}

export async function loadNewsletterSubscribers(supabase?: SupabaseClient) {
  const client = getClient(supabase);
  const { data, error } = await client
    .from("profiles")
    .select(
      "id, full_name, municipality, province, newsletter_city, newsletter_category, newsletter_areas, newsletter_disciplines, newsletter_unsub_token",
    )
    .eq("newsletter_opt_in", true);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as NewsletterSubscriber[];
}

type EmailOnlySubscriberRow = {
  id: string;
  email: string;
  city: string;
  category: string;
  areas?: string[] | null;
  disciplines?: string[] | null;
  unsub_token: string;
};

async function loadEmailOnlySubscribers(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, city, category, areas, disciplines, unsub_token")
    .eq("opt_in", true);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as EmailOnlySubscriberRow[];
}

function mapRpcRecipient(row: NewsletterRecipientRow): NewsletterRecipient {
  return {
    id: row.id,
    full_name: row.full_name,
    municipality: row.municipality,
    province: row.province,
    newsletter_city: row.newsletter_city,
    newsletter_category: row.newsletter_category,
    newsletter_areas: row.newsletter_areas ?? [],
    newsletter_disciplines: row.newsletter_disciplines ?? [],
    newsletter_unsub_token: String(row.newsletter_unsub_token ?? ""),
    email: row.email?.trim() || null,
    emailConfirmed: Boolean(row.email_confirmed),
    source: "profile",
  };
}

function dedupeRecipientsByEmail(recipients: NewsletterRecipient[]) {
  const seen = new Set<string>();
  const result: NewsletterRecipient[] = [];

  for (const recipient of recipients) {
    const email = recipient.email?.trim().toLowerCase();
    if (email) {
      if (seen.has(email)) continue;
      seen.add(email);
    }
    result.push(recipient);
  }

  return result;
}

async function loadRecipientsForSend(sessionClient?: SupabaseClient): Promise<{
  recipients: NewsletterRecipient[];
  writeMode: "rpc" | "admin";
  writeClient: SupabaseClient;
}> {
  if (sessionClient) {
    const { data, error } = await sessionClient.rpc("admin_newsletter_recipients");
    if (error) {
      throw new Error(error.message);
    }

    return {
      recipients: ((data ?? []) as NewsletterRecipientRow[]).map(mapRpcRecipient),
      writeMode: "rpc",
      writeClient: sessionClient,
    };
  }

  const admin = tryCreateAdminClient();
  if (!admin) {
    throw new Error(
      "Per l'invio automatico manca SUPABASE_SERVICE_ROLE_KEY su Vercel.",
    );
  }

  const [profileSubscribers, emailSubscribers] = await Promise.all([
    loadNewsletterSubscribers(admin),
    loadEmailOnlySubscribers(admin),
  ]);

  const recipients: NewsletterRecipient[] = [];
  const profileEmails = new Set<string>();

  for (const subscriber of profileSubscribers) {
    const { data: userData, error: userError } =
      await admin.auth.admin.getUserById(subscriber.id);

    if (userError) {
      recipients.push({
        ...subscriber,
        email: null,
        emailConfirmed: false,
        source: "profile",
      });
      continue;
    }

    const email = userData.user?.email?.trim().toLowerCase() || null;
    if (email) profileEmails.add(email);

    recipients.push({
      ...subscriber,
      email: userData.user?.email ?? null,
      emailConfirmed: Boolean(userData.user?.email_confirmed_at),
      source: "profile",
    });
  }

  for (const subscriber of emailSubscribers) {
    const email = subscriber.email.trim().toLowerCase();
    if (profileEmails.has(email)) continue;

    recipients.push({
      id: subscriber.id,
      full_name: null,
      municipality: subscriber.city,
      province: null,
      newsletter_city: subscriber.city,
      newsletter_category: subscriber.category,
      newsletter_areas: subscriber.areas ?? [],
      newsletter_disciplines: subscriber.disciplines ?? [],
      newsletter_unsub_token: subscriber.unsub_token,
      email: subscriber.email,
      emailConfirmed: true,
      source: "subscriber",
    });
  }

  return {
    recipients: dedupeRecipientsByEmail(recipients),
    writeMode: "admin",
    writeClient: admin,
  };
}

async function recordNewsletterSend(
  client: SupabaseClient,
  mode: "rpc" | "admin",
  payload: {
    userId: string;
    eventsCount: number;
    status: "sent" | "skipped" | "failed";
    errorMessage?: string | null;
  },
) {
  if (mode === "rpc") {
    const { error } = await client.rpc("admin_record_newsletter_send", {
      p_user_id: payload.userId,
      p_events_count: payload.eventsCount,
      p_status: payload.status,
      p_error_message: payload.errorMessage ?? null,
    });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const { data: profileRow } = await client
    .from("profiles")
    .select("id")
    .eq("id", payload.userId)
    .maybeSingle();

  if (profileRow) {
    const { error: insertError } = await client.from("newsletter_sends").insert({
      user_id: payload.userId,
      events_count: payload.eventsCount,
      status: payload.status,
      error_message: payload.errorMessage ?? null,
    });
    if (insertError) {
      throw new Error(insertError.message);
    }

    if (payload.status === "sent") {
      const { error: updateError } = await client
        .from("profiles")
        .update({
          newsletter_last_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.userId);
      if (updateError) {
        throw new Error(updateError.message);
      }
    }
    return;
  }

  const { error: insertError } = await client.from("newsletter_sends").insert({
    subscriber_id: payload.userId,
    events_count: payload.eventsCount,
    status: payload.status,
    error_message: payload.errorMessage ?? null,
  });
  if (insertError) {
    throw new Error(insertError.message);
  }

  if (payload.status === "sent") {
    const { error: updateError } = await client
      .from("newsletter_subscribers")
      .update({
        last_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.userId);
    if (updateError) {
      throw new Error(updateError.message);
    }
  }
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
  const preferences = resolveStoredNewsletterPreferences({
    areas: subscriber.newsletter_areas,
    disciplines: subscriber.newsletter_disciplines,
    city: subscriber.newsletter_city,
    category: subscriber.newsletter_category,
    municipality: subscriber.municipality,
    province: subscriber.province,
  });
  const geo = resolveGeoPreference({
    newsletterCity: subscriber.newsletter_city,
    municipality: subscriber.municipality,
    province: subscriber.province,
  });
  const matching = selectNewsletterCourses(events, preferences.areas, preferences.disciplines);
  const { nearbyEvents, areaEvents } = pickEventsForGeo(
    matching,
    geo,
    preferences.disciplines.join(","),
  );
  const eventsCount = nearbyEvents.length + areaEvents.length;
  const primaryArea = preferences.areas.length === 1 ? preferences.areas[0] : geo.area;
  const html = buildNewsletterHtml({
    fullName: subscriber.full_name,
    city: geo.city,
    area: primaryArea,
    areas: preferences.areas,
    category: preferences.disciplines.join(","),
    disciplineLabel: formatDisciplineList(preferences.disciplines),
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
    category: preferences.disciplines.join(","),
    subject: buildNewsletterSubject(primaryArea, weekLabel, preferences.areas),
    html,
    eventsCount,
    skippedReason: eventsCount === 0 ? "Nessun evento in settimana" : undefined,
  };
}

async function sendNewsletterEmail(
  to: string,
  subject: string,
  html: string,
  idempotencyKey: string,
): Promise<"sent" | "skipped"> {
  try {
    await sendCampaignEmailViaResend({
      to,
      subject,
      html,
      from: CAMPAIGN_FROM_EMAIL,
      replyTo: CAMPAIGN_REPLY_TO,
      idempotencyKey,
    });
    return "sent";
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/idempoten/i.test(message)) return "skipped";
    throw error;
  }
}

function throwNewsletterRpcError(error: { code?: string; message: string }): never {
  const wrapped = new Error(error.message) as Error & { code?: string };
  wrapped.code = error.code;
  throw wrapped;
}

async function claimNewsletterDelivery(
  client: SupabaseClient,
  input: { recipientKey: string; weekKey: string; idempotencyKey: string },
) {
  const { data, error } = await client.rpc("claim_newsletter_delivery", {
    p_recipient_key: input.recipientKey,
    p_week_key: input.weekKey,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) throwNewsletterRpcError(error);
  return data;
}

async function stageNewsletterBody(
  client: SupabaseClient,
  input: {
    recipientKey: string;
    weekKey: string;
    subject: string;
    html: string;
  },
) {
  const { data, error } = await client.rpc("stage_newsletter_body", {
    p_recipient_key: input.recipientKey,
    p_week_key: input.weekKey,
    p_subject: input.subject,
    p_html: input.html,
  });
  if (error) throwNewsletterRpcError(error);
  const record =
    data && typeof data === "object"
      ? (data as { subject?: unknown; html?: unknown })
      : null;
  return keepFirstNewsletterSnapshot(
    {
      subject: typeof record?.subject === "string" ? record.subject : null,
      html: typeof record?.html === "string" ? record.html : null,
    },
    { subject: input.subject, html: input.html },
  );
}

async function completeNewsletterDelivery(
  client: SupabaseClient,
  input: {
    recipientKey: string;
    weekKey: string;
    status: "sent" | "skipped" | "failed";
    errorMessage?: string;
  },
) {
  const { error } = await client.rpc("complete_newsletter_delivery", {
    p_recipient_key: input.recipientKey,
    p_week_key: input.weekKey,
    p_status: input.status,
    p_events_count: 0,
    p_error_message: input.errorMessage ?? null,
  });
  if (error) throwNewsletterRpcError(error);
}

export async function runWeeklyNewsletter(options?: {
  dryRun?: boolean;
  testEmail?: string | null;
  supabase?: SupabaseClient;
}): Promise<WeeklyNewsletterSummary> {
  if (WEEKLY_NEWSLETTER_PAUSED) {
    throw new Error(WEEKLY_NEWSLETTER_PAUSED_MESSAGE);
  }

  if (!realEmailDeliveryAllowed()) {
    return {
      weekLabel: "",
      subscribers: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
      eventsInWeek: 0,
      remaining: 0,
      errors: [{ userId: "", error: REAL_EMAIL_DISABLED_MESSAGE }],
    };
  }

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
    remaining: 0,
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

    if (dryRun) {
      summary.sent = 1;
      return summary;
    }

    const claimClient = sessionClient ?? tryCreateAdminClient();
    if (!claimClient) {
      throw new Error(
        "Per l'invio automatico manca SUPABASE_SERVICE_ROLE_KEY su Vercel.",
      );
    }

    const delivery = await deliverNewsletterBatch({
      weekKey: week.weekKey,
      recipients: [{ id: testEmail, source: "test" }],
      limit: 1,
      claim: (input) => claimNewsletterDelivery(claimClient, input),
      complete: (input) => completeNewsletterDelivery(claimClient, input),
      perform: async (recipient, idempotencyKey) => {
        const snapshot = await stageNewsletterBody(claimClient, {
          recipientKey: newsletterRecipientKey(recipient.source, recipient.id),
          weekKey: week.weekKey,
          subject: `[TEST] ${preview.subject}`,
          html: preview.html,
        });
        return sendNewsletterEmail(
          testEmail,
          snapshot.subject,
          snapshot.html,
          idempotencyKey,
        );
      },
    });
    summary.sent = delivery.sent;
    summary.skipped = delivery.skipped;
    summary.failed = delivery.failed;
    summary.errors = delivery.errors;
    return summary;
  }

  const { recipients, writeMode, writeClient } =
    await loadRecipientsForSend(sessionClient);
  summary.subscribers = recipients.length;

  const delivery = await deliverNewsletterBatch({
    weekKey: week.weekKey,
    recipients,
    limit: NEWSLETTER_BATCH_LIMIT,
    claim: (input) => claimNewsletterDelivery(writeClient, input),
    complete: (input) => completeNewsletterDelivery(writeClient, input),
    perform: async (recipient, idempotencyKey) => {
      const match = recipients.find(
        (item) => item.id === recipient.id && item.source === recipient.source,
      );
      if (!match?.email) {
        throw new Error("Email utente non trovata");
      }
      if (!match.emailConfirmed) {
        await recordNewsletterSend(writeClient, writeMode, {
          userId: match.id,
          eventsCount: 0,
          status: "skipped",
          errorMessage: "Email non confermata",
        });
        return "skipped";
      }

      const preview = composeSubscriberNewsletter({
        subscriber: match,
        email: match.email,
        events,
        weekLabel: week.label,
        siteUrl,
      });
      if (preview.eventsCount === 0) {
        await recordNewsletterSend(writeClient, writeMode, {
          userId: match.id,
          eventsCount: 0,
          status: "skipped",
          errorMessage: preview.skippedReason,
        });
        return "skipped";
      }

      const snapshot = await stageNewsletterBody(writeClient, {
        recipientKey: newsletterRecipientKey(match.source, match.id),
        weekKey: week.weekKey,
        subject: preview.subject,
        html: preview.html,
      });
      const outcome = await sendNewsletterEmail(
        match.email,
        snapshot.subject,
        snapshot.html,
        idempotencyKey,
      );
      if (outcome === "skipped") return "skipped";
      await recordNewsletterSend(writeClient, writeMode, {
        userId: match.id,
        eventsCount: preview.eventsCount,
        status: "sent",
      });
      await sleep(120);
      return "sent";
    },
  });

  summary.sent = delivery.sent;
  summary.skipped = delivery.skipped;
  summary.failed = delivery.failed;
  summary.remaining = delivery.remaining;
  summary.errors = delivery.errors;
  return summary;
}
