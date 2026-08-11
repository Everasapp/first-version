import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { getProfileForUser } from "@/src/lib/auth";
import type { Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

export async function getAdminApiContext(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; user: User; profile: Profile }
  | { ok: false; response: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Non autenticato" }, { status: 401 }),
    };
  }

  const profile = await getProfileForUser(supabase, user.id);
  if (!profile || profile.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Accesso riservato agli admin" }, { status: 403 }),
    };
  }

  return { ok: true, supabase, user, profile };
}
