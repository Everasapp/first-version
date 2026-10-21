/**
 * Authentication, session refresh, and admin panels still use the Supabase
 * project configured for that deployment. Preview is not fully isolated.
 * Automatic deployment of revision/homepage-learning-handoff-20261021 stays
 * disabled in vercel.json.
 */
const PUBLIC_SITE_URL = "https://www.everas.it";

type Env = Record<string, string | undefined>;

function hostnameOf(value: string) {
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname
      .toLowerCase()
      .replace(/\.$/, "");
  } catch {
    return "";
  }
}

export function isProductionSiteHost(host: string) {
  const normalized = host.toLowerCase().replace(/\.$/, "");
  return normalized === "www.everas.it" || normalized === "everas.it";
}

/**
 * Origin for server-to-server calls and URLs that carry tokens.
 * Production matches the public site. Other environments never fall back to
 * www.everas.it and never read the request Host header.
 */
export function getOperationalOrigin(env: Env = process.env): string | null {
  if (env.VERCEL_ENV === "production") {
    return env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || PUBLIC_SITE_URL;
  }

  const configured = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  if (configured && !isProductionSiteHost(hostnameOf(configured))) {
    return configured;
  }

  const vercelHost = env.VERCEL_URL?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (vercelHost && !isProductionSiteHost(hostnameOf(vercelHost))) {
    return `https://${vercelHost}`;
  }

  return null;
}

export const IMPORT_DISABLED_MESSAGE =
  "Importazione non disponibile fuori produzione.";

export const OUTSIDE_PRODUCTION_MESSAGE =
  "Operazione non disponibile fuori produzione.";

export const PREVIEW_FORM_UNAVAILABLE_MESSAGE =
  "Funzione non disponibile in anteprima";

export function outsideProduction(env: Env = process.env) {
  return env.VERCEL_ENV !== "production";
}

export function importDisabledOutsideProduction(env: Env = process.env) {
  return outsideProduction(env);
}

export function importCronUrl(env: Env = process.env) {
  if (importDisabledOutsideProduction(env)) return null;
  const origin = getOperationalOrigin(env);
  if (!origin) return null;
  return `${origin}/api/cron/discover-events`;
}
