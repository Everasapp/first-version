import { redirect } from "next/navigation";

import { buildAuthHref } from "@/src/lib/auth-urls";
import {
  PROFILE_SELECT,
  type Profile,
} from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

function isAuthSessionError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("jwt") ||
    normalized.includes("session") ||
    normalized.includes("unauthorized") ||
    normalized.includes("not authenticated")
  );
}

export async function requireUser(redirectTo: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildAuthHref("/accedi", { redirect: redirectTo }));
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
    if (isAuthSessionError(error.message)) {
      await supabase.auth.signOut();
      return null;
    }

    throw new Error(`Impossibile caricare il profilo: ${error.message}`);
  }

  if (!data) return null;

  const row = data as Profile;
  return {
    ...row,
    display_name: row.display_name ?? null,
    interests: Array.isArray(row.interests) ? row.interests : [],
    open_to_meeting: Boolean(row.open_to_meeting),
    show_in_community: row.show_in_community !== false,
  };
}

export async function requireProfile(redirectTo: string) {
  const { supabase, user } = await requireUser(redirectTo);
  const profile = await getProfileForUser(supabase, user.id);

  if (!profile) {
    await supabase.auth.signOut();
    redirect(buildAuthHref("/accedi", { redirect: redirectTo }));
  }

  return { supabase, user, profile };
}

export async function requireAdmin(redirectTo = "/admin") {
  const result = await requireProfile(redirectTo);

  if (result.profile.role !== "admin") {
    redirect("/dashboard");
  }

  return result;
}
