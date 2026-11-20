import { createClient } from "@supabase/supabase-js";

/** Anonymous server reads only: never attach request cookies to shared caches. */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  // The SDK appends /rest/v1 itself. Accept a URL copied from the REST API
  // settings without accidentally requesting /rest/v1/rest/v1/events.
  const supabaseUrl = new URL(url).origin;

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
