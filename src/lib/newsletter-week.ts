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
import { parseNewsletterCategories } from "@/src/lib/newsletter-categories";
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
import {
  REAL_EMAIL_DISABLED_MESSAGE,
  realEmailDeliveryAllowed,
} from "@/src/lib/notifications/resend-delivery";
import {
  deliverNewsletterBatch,
  keepFirstNewsletterSnapshot,
  NEWSLETTER_BATCH_LIMIT,
  isMissingNewsletterStructure,
  NEWSLETTER_STRUCTURE_MESSAGE,
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
  newsletter_unsub_token: string;
};

export type NewsletterRecipient = NewsletterSubscriber & {
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
  newsletter_unsub_token: string;
  email: string | null;
  email_confirmed: boolean | null;
  recipient_source: "profile" | "subscriber";
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
  simulated?: number;
  dryRun?: boolean;
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
  const preferred = parseNewsletterCategories(category);
  if (
    preferred.length > 0 &&
    preferred.some((slug) => eventMatchesCategoryFilter(event, slug))
  ) {
    score += 18;
  }
  return score;
}

export function pickEventsForGeo(
  events: WeekEventRow[],
  geo: ResolvedGeo,
  category: string | null,
) {
  const ranked = [...events]
    .filter((event) => event.slug && !isLikelyDuplicateTitle(event.title) &&
      (!geo.area || eventArea(event) === geo.area))
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
    return `Corsi e laboratori da scoprire nel ${area} · ${weekLabel}`;
  }
  return `Corsi e laboratori da scoprire in Sardegna · ${weekLabel}`;
}

function getClient(supabase?: SupabaseClient) {
  return supabase ?? createAdminClient();
}

export const NEWSLETTER_LOOKAHEAD_DAYS = 28;

export function newsletterCourseWindow(now = new Date()) {
  const today = romeYmd(now);
  return {
    start: zonedTimeToUtc(today, "00:00:00", ROME_TZ),
    end: zonedTimeToUtc(addDaysYmd(today, NEWSLETTER_LOOKAHEAD_DAYS), "00:00:00", ROME_TZ),
  };
}

export function courseFitsNewsletterWindow(
  event: Pick<WeekEventRow, "start_at" | "end_at">,
  now: Date,
  window = newsletterCourseWindow(now),
) {
  return isPublicEventActive(event.start_at, event.end_at, now) &&
    new Date(event.start_at).getTime() < window.end.getTime();
}

export async function loadWeekEvents(
  now = new Date(),
  supabase?: SupabaseClient,
) {
  const week = getCurrentRomeWeekRange(now);
  const client = getClient(supabase);
  const window = newsletterCourseWindow(now);

  const { data, error } = await client
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, end_at, category, categories, subcategory, is_free, price_from, image_url, is_featured, status, province",
    )
    .eq("status", "published")
    .or(PUBLIC_LEARNING_FILTER)
    .lt("start_at", window.end.toISOString())
    .or(`end_at.gte.${now.toISOString()},and(end_at.is.null,start_at.gte.${window.start.toISOString()})`)
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const events = ((data ?? []) as WeekEventRow[]).filter((event) =>
    isLearningEvent(event) && courseFitsNewsletterWindow(event, now, window),
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

function mapRpcRecipient(row: NewsletterRecipientRow): NewsletterRecipient {
  return {
    id: row.id,
    full_name: row.full_name,
    municipality: row.municipality,
    province: row.province,
    newsletter_city: row.newsletter_city,
    newsletter_category: row.newsletter_category,
    newsletter_unsub_token: String(row.newsletter_unsub_token ?? ""),
    email: row.email?.trim().toLowerCase() || null,
    emailConfirmed: Boolean(row.email_confirmed),
    source: row.recipient_source,
  };
}

/** One database request, including email-only subscribers; no per-user Auth calls. */
export async function loadNewsletterRecipients(client: SupabaseClient) {
  const { data, error } = await client.rpc("newsletter_delivery_recipients");
  if (error) throwNewsletterRpcError(error);
  return ((data ?? []) as NewsletterRecipientRow[]).map(mapRpcRecipient);
}

async function loadRecipientsForSend(sessionClient?: SupabaseClient) {
  const client = sessionClient ?? tryCreateAdminClient();
  if (!client) throw new Error("Per l'invio automatico manca la chiave server Supabase su Vercel.");
  return {
    recipients: await loadNewsletterRecipients(client),
    writeMode: sessionClient ? "rpc" as const : "admin" as const,
    writeClient: client,
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
    skippedReason: eventsCount === 0 ? "Nessun corso pertinente nelle prossime quattro settimane" : undefined,
  };
}

async function sendNewsletterEmail(
  to: string,
  subject: string,
  html: string,
  idempotencyKey: string,
): Promise<"sent" | "skipped"> {
  await sendCampaignEmailViaResend({
    to, subject, html,
    from: CAMPAIGN_FROM_EMAIL,
    replyTo: CAMPAIGN_REPLY_TO,
    idempotencyKey,
  });
  return "sent";
}

function throwNewsletterRpcError(error: { code?: string; message: string }): never {
  if (isMissingNewsletterStructure(error)) throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
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
  if (typeof record?.subject !== "string" || typeof record?.html !== "string" || !record.subject || !record.html) {
    throw new Error(NEWSLETTER_STRUCTURE_MESSAGE);
  }
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
    eventsCount?: number;
  },
) {
  const { error } = await client.rpc("complete_newsletter_delivery", {
    p_recipient_key: input.recipientKey,
    p_week_key: input.weekKey,
    p_status: input.status,
    p_events_count: input.eventsCount ?? 0,
    p_error_message: input.errorMessage ?? null,
  });
  if (error) throwNewsletterRpcError(error);
}

export async function runWeeklyNewsletter(options?: {
  dryRun?: boolean;
  testEmail?: string | null;
  supabase?: SupabaseClient;
}): Promise<WeeklyNewsletterSummary> {
  const dryRun = options?.dryRun === true;
  if (WEEKLY_NEWSLETTER_PAUSED && !dryRun) {
    throw new Error(WEEKLY_NEWSLETTER_PAUSED_MESSAGE);
  }

  if (!dryRun && !realEmailDeliveryAllowed()) {
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
      summary.dryRun = true;
      summary.simulated = preview.eventsCount ? 1 : 0;
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
      recipients: [{ id: testEmail, source: "test", email: testEmail }],
      limit: 1,
      claim: (input) => claimNewsletterDelivery(claimClient, input),
      complete: (input) => completeNewsletterDelivery(claimClient, input),
      perform: async (recipient, idempotencyKey) => {
        const snapshot = await stageNewsletterBody(claimClient, {
          recipientKey: newsletterRecipientKey(recipient.source, recipient.id, recipient.email),
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
  if (dryRun) {
    summary.dryRun = true;
    summary.simulated = recipients.filter((recipient) => recipient.email &&
      recipient.emailConfirmed && composeSubscriberNewsletter({
        subscriber: recipient, events, weekLabel: week.label, siteUrl,
      }).eventsCount > 0).length;
    summary.skipped = recipients.length - summary.simulated;
    return summary;
  }
  const recipientByKey = new Map(recipients.map((recipient) => [
    newsletterRecipientKey(recipient.source, recipient.id, recipient.email), recipient,
  ]));

  const delivery = await deliverNewsletterBatch({
    weekKey: week.weekKey,
    recipients,
    limit: NEWSLETTER_BATCH_LIMIT,
    claim: (input) => claimNewsletterDelivery(writeClient, input),
    complete: (input) => completeNewsletterDelivery(writeClient, input),
    perform: async (recipient, idempotencyKey) => {
      const match = recipientByKey.get(newsletterRecipientKey(recipient.source, recipient.id, recipient.email));
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
        recipientKey: newsletterRecipientKey(match.source, match.id, match.email),
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
      return { status: "sent", eventsCount: preview.eventsCount };
    },
  });

  summary.sent = delivery.sent;
  summary.skipped = delivery.skipped;
  summary.failed = delivery.failed;
  summary.remaining = delivery.remaining;
  summary.errors = delivery.errors;
  return summary;
}
