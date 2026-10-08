import { NextResponse } from "next/server";

import { revalidatePublishedEvents } from "@/src/lib/seo/revalidate-published-events";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let eventId = "";
  try {
    const body = (await request.json()) as { eventId?: unknown };
    eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  if (!eventId) {
    return NextResponse.json({ error: "ID evento mancante" }, { status: 400 });
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return NextResponse.json({ error: eventError.message }, { status: 500 });
  }

  if (!event) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  const isOwner = event.organizer_id === user.id;
  let isAdmin = false;
  if (!isOwner) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
  }

  revalidatePublishedEvents();
  return NextResponse.json({ ok: true });
}
