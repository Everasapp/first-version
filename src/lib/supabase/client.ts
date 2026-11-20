import { createBrowserClient } from "@supabase/ssr";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  // Supabase clients append /auth/v1 and /rest/v1 themselves.
  // Strip a legacy REST suffix to avoid requests to /rest/v1/auth/v1/token.
  const normalizedUrl = url.trim().replace(/\/(?:rest\/v1)\/?$/i, "").replace(/\/$/, "");
  return { url: normalizedUrl, publishableKey };
}

export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createBrowserClient(url, publishableKey);
}
