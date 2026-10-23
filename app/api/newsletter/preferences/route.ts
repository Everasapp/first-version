import { NextResponse } from "next/server";

import { sanitizeNewsletterSelection } from "@/src/lib/newsletter-preferences";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

type PreferencesBody = {
  optIn?: unknown;
  areas?: unknown;
  disciplines?: unknown;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let body: PreferencesBody;
  try {
    body = (await request.json()) as PreferencesBody;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const optIn = body.optIn === true;
  const selection = optIn
    ? sanitizeNewsletterSelection(body.areas, body.disciplines)
    : null;
  if (selection && !selection.ok) {
    return NextResponse.json({ error: selection.error }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({
      newsletter_opt_in: optIn,
      newsletter_areas: selection?.ok ? selection.selection.areas : [],
      newsletter_disciplines: selection?.ok ? selection.selection.disciplines : [],
      newsletter_city: null,
      newsletter_category: selection?.ok
        ? selection.selection.disciplines.join(",")
        : null,
      newsletter_opted_at: optIn ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!updated) {
    return NextResponse.json({ error: "Accesso negato." }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    message: optIn
      ? "Preferenze salvate. Riceverai la newsletter ogni settimana."
      : "Ti sei disiscritto dalla newsletter.",
  });
}
