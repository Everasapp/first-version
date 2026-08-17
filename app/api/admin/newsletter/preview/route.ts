import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  composeSubscriberNewsletter,
  loadWeekEvents,
} from "@/src/lib/newsletter-week";
import { getSiteUrl } from "@/src/lib/notifications/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRESETS = {
  nord: { city: "Sassari", province: "SS" },
  centro: { city: "Nuoro", province: "NU" },
  sud: { city: "Cagliari", province: "CA" },
} as const;

export async function GET(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const area = new URL(request.url).searchParams.get("area");
  const preset =
    area === "nord" || area === "centro" || area === "sud"
      ? PRESETS[area]
      : null;

  if (!preset) {
    return NextResponse.json(
      { ok: false, error: "Area non valida" },
      { status: 400 },
    );
  }

  try {
    const { week, events } = await loadWeekEvents(new Date(), auth.supabase);
    const preview = composeSubscriberNewsletter({
      subscriber: {
        id: `preview-${area}`,
        full_name: "Marina",
        municipality: preset.city,
        province: preset.province,
        newsletter_city: preset.city,
        newsletter_category: null,
        newsletter_unsub_token: "preview",
      },
      events,
      weekLabel: week.label,
      siteUrl: getSiteUrl(),
    });

    return NextResponse.json({
      ok: true,
      subject: preview.subject,
      eventsCount: preview.eventsCount,
      html: preview.html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
