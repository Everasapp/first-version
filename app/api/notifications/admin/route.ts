import { NextResponse } from "next/server";

import {
  notifyEventPublished,
  notifyNewOrganizer,
  notifyNewUser,
} from "@/src/lib/notifications/notify";
import type { AdminNotificationType } from "@/src/lib/notifications/types";
import { PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

type RequestBody = {
  type?: AdminNotificationType;
  userId?: string;
  eventId?: string;
};

function isRecentIso(value: string | undefined, maxAgeMs: number) {
  if (!value) return false;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;
  return Date.now() - time <= maxAgeMs;
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const type = body.type;
  if (!type) {
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (type === "user_registered") {
      let name = "";
      let email = "";
      let registeredAt = new Date().toISOString();

      if (user) {
        email = user.email ?? "";
        name =
          (typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : "") || email;
        registeredAt = user.created_at ?? registeredAt;
      } else if (body.userId) {
        let admin;
        try {
          admin = createAdminClient();
        } catch (error) {
          console.error(
            "[notifications] Admin client non disponibile per user_registered:",
            error,
          );
          return NextResponse.json({ ok: true });
        }
        const { data, error } = await admin.auth.admin.getUserById(body.userId);
        if (error || !data.user) {
          return NextResponse.json({ ok: true });
        }
        if (!isRecentIso(data.user.created_at, 10 * 60 * 1000)) {
          return NextResponse.json({ ok: true });
        }
        email = data.user.email ?? "";
        name =
          (typeof data.user.user_metadata?.full_name === "string"
            ? data.user.user_metadata.full_name
            : "") || email;
        registeredAt = data.user.created_at ?? registeredAt;
      } else {
        return NextResponse.json({ ok: true });
      }

      if (email) {
        await notifyNewUser({ name, email, registeredAt });
      }

      return NextResponse.json({ ok: true });
    }

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    if (type === "organizer_registered") {
      const { data: profile } = await supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("id", user.id)
        .maybeSingle();

      const row = profile as Profile | null;
      if (!row || (row.role !== "organizzatore" && row.role !== "admin")) {
        return NextResponse.json({ ok: true });
      }

      await notifyNewOrganizer({
        name:
          row.business_name?.trim() ||
          row.full_name?.trim() ||
          user.email ||
          "Organizzatore",
        email: user.email ?? "",
        role: row.role,
        registeredAt: row.organizer_since || row.updated_at || row.created_at,
      });

      return NextResponse.json({ ok: true });
    }

    if (type === "event_published") {
      const eventId = body.eventId?.trim();
      if (!eventId) {
        return NextResponse.json({ ok: true });
      }

      const { data: publisherProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      // Nessuna email se pubblica l'admin (solo organizzatori esterni).
      if (publisherProfile?.role === "admin") {
        return NextResponse.json({ ok: true });
      }

      const { data: event } = await supabase
        .from("events")
        .select(
          "id, title, slug, municipality, start_at, category, status, organizer_id, organizer_display_name",
        )
        .eq("id", eventId)
        .maybeSingle();

      if (!event || event.status !== "published") {
        return NextResponse.json({ ok: true });
      }

      if (event.organizer_id !== user.id) {
        return NextResponse.json({ ok: true });
      }

      const { data: organizerProfile } = await supabase
        .from("profiles")
        .select("full_name, business_name")
        .eq("id", event.organizer_id)
        .maybeSingle();

      const organizerName =
        event.organizer_display_name?.trim() ||
        organizerProfile?.business_name?.trim() ||
        organizerProfile?.full_name?.trim() ||
        "Organizzatore";

      await notifyEventPublished({
        title: event.title,
        organizer: organizerName,
        municipality: event.municipality,
        startAt: event.start_at,
        category: event.category,
        slug: event.slug,
      });
    }
  } catch (error) {
    console.error("[notifications] API admin notification error:", error);
  }

  return NextResponse.json({ ok: true });
}
