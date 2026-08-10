import { redirect } from "next/navigation";

import {
  PROFILE_SELECT,
  type Profile,
} from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

export async function requireUser(redirectTo: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/accedi?redirect=${encodeURIComponent(redirectTo)}`);
  }

  return { supabase, user };
}

export async function getProfileForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare il profilo: ${error.message}`);
  }

  return (data as Profile | null) ?? null;
}

export async function requireProfile(redirectTo: string) {
  const { supabase, user } = await requireUser(redirectTo);
  const profile = await getProfileForUser(supabase, user.id);

  if (!profile) {
    throw new Error("Profilo non trovato. Esci e accedi di nuovo.");
  }

  return { supabase, user, profile };
}
