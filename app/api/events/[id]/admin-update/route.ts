import { NextResponse } from "next/server";

import { sanitizeAdminEventUpdate } from "@/src/lib/events/admin-event-update";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

const EVENT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!EVENT_ID.test(id)) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Accesso negato." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  let patch: ReturnType<typeof sanitizeAdminEventUpdate>;
  try {
    patch = sanitizeAdminEventUpdate(body);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Richiesta non valida." },
      { status: 400 },
    );
  }

  const { data: existing, error: readError } = await supabase
    .from("events")
    .select("id, organizer_id, created_by")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("events")
    .update(patch)
    .eq("id", id)
    .select("id, organizer_id, created_by")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Accesso negato." }, { status: 403 });
  }

  if (
    updated.organizer_id !== existing.organizer_id ||
    updated.created_by !== existing.created_by
  ) {
    return NextResponse.json(
      { error: "Salvataggio non riuscito." },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: updated.id });
}
