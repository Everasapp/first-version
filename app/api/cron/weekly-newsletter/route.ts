import { NextResponse } from "next/server";

import {
  buildNewsletterHtml,
  getCategoryLabel,
  type NewsletterEvent,
} from "@/src/lib/newsletter";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Subscriber = {
  id: string;
  full_name: string | null;
  newsletter_city: string | null;
  newsletter_category: string | null;
  newsletter_unsub_token: string;
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://everas.it"
  );
}

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${cronSecret}`;
}

async function sendResendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const from =
    process.env.NEWSLETTER_FROM_EMAIL ||
    "EVERAS <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
}

async function runWeeklyNewsletter() {
  const supabase = createAdminClient();
  const siteUrl = getSiteUrl();
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: subscribersData, error: subscribersError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, newsletter_city, newsletter_category, newsletter_unsub_token",
    )
    .eq("newsletter_opt_in", true);

  if (subscribersError) {
    throw new Error(subscribersError.message);
  }

  const subscribers = (subscribersData ?? []) as Subscriber[];
  const summary = {
    subscribers: subscribers.length,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  for (const subscriber of subscribers) {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(subscriber.id);

      if (userError || !userData.user?.email) {
        throw new Error(userError?.message || "Email utente non trovata");
      }

      if (!userData.user.email_confirmed_at) {
        await supabase.from("newsletter_sends").insert({
          user_id: subscriber.id,
          events_count: 0,
          status: "skipped",
          error_message: "Email non confermata",
        });
        summary.skipped += 1;
        continue;
      }

      let eventsQuery = supabase
        .from("events")
        .select(
          "id, slug, title, municipality, location_name, start_at, category, is_free, price_from",
        )
        .eq("status", "published")
        .gte("start_at", now.toISOString())
        .lte("start_at", weekAhead.toISOString())
        .order("start_at", { ascending: true })
        .limit(12);

      if (subscriber.newsletter_city) {
        eventsQuery = eventsQuery.eq(
          "municipality",
          subscriber.newsletter_city,
        );
      }

      if (subscriber.newsletter_category) {
        const categoryLabel = getCategoryLabel(subscriber.newsletter_category);
        eventsQuery = eventsQuery.in("category", [
          subscriber.newsletter_category,
          categoryLabel,
        ]);
      }

      const { data: eventsData, error: eventsError } = await eventsQuery;

      if (eventsError) {
        throw new Error(eventsError.message);
      }

      const events = (eventsData ?? []) as NewsletterEvent[];

      if (events.length === 0) {
        await supabase.from("newsletter_sends").insert({
          user_id: subscriber.id,
          events_count: 0,
          status: "skipped",
          error_message: "Nessun evento in settimana",
        });
        summary.skipped += 1;
        continue;
      }

      const html = buildNewsletterHtml({
        fullName: subscriber.full_name,
        city: subscriber.newsletter_city,
        category: subscriber.newsletter_category,
        events,
        siteUrl,
        unsubToken: subscriber.newsletter_unsub_token,
      });

      await sendResendEmail({
        to: userData.user.email,
        subject: "La tua settimana di eventi su EVERAS",
        html,
      });

      await supabase.from("newsletter_sends").insert({
        user_id: subscriber.id,
        events_count: events.length,
        status: "sent",
      });

      await supabase
        .from("profiles")
        .update({
          newsletter_last_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscriber.id);

      summary.sent += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Errore sconosciuto";

      await supabase.from("newsletter_sends").insert({
        user_id: subscriber.id,
        events_count: 0,
        status: "failed",
        error_message: message,
      });

      summary.failed += 1;
    }
  }

  return summary;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runWeeklyNewsletter();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
