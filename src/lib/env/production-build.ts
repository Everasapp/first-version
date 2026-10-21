/**
 * Values inlined into the production bundle. A Vercel production build must
 * stop if they are missing; otherwise the site ships with empty configuration.
 */
export const PRODUCTION_BUILD_REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

/**
 * Read when a request runs. Their absence must not fail the production build.
 */
export const RUNTIME_ONLY_ENV = [
  "CRON_SECRET",
  "RESEND_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
] as const;

export function assertProductionBuildConfig(
  env: Record<string, string | undefined> = process.env,
) {
  if (env.VERCEL_ENV !== "production") return;

  const missing = PRODUCTION_BUILD_REQUIRED.filter((name) => !env[name]?.trim());
  if (missing.length === 0) return;

  throw new Error(
    `Configurazione di produzione mancante: ${missing.join(", ")}. La build è stata interrotta.`,
  );
}
