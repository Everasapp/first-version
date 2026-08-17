import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    ""
  );
}

export function tryCreateAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = getServiceRoleKey();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createAdminClient() {
  const client = tryCreateAdminClient();
  if (!client) {
    throw new Error(
      "Manca SUPABASE_SERVICE_ROLE_KEY su Vercel. Aggiungila in Project → Settings → Environment Variables.",
    );
  }

  return client;
}
