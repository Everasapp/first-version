export const ANALYTICS_CONSENT_COOKIE = "everas_analytics_consent_v1";
export const ANALYTICS_CONSENT_EVENT = "everas:analytics-consent-changed";
export const OPEN_ANALYTICS_CONSENT_EVENT = "everas:open-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

export function readAnalyticsConsent(cookies: string): AnalyticsConsent | null {
  const value = cookies.split(";").map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.slice(ANALYTICS_CONSENT_COOKIE.length + 1);
  return value === "granted" || value === "denied" ? value : null;
}

let sessionConsent: AnalyticsConsent | null = null;

export function getBrowserAnalyticsConsent() {
  try { return readAnalyticsConsent(document.cookie) ?? sessionConsent; }
  catch { return sessionConsent; }
}

type ConsentWindow = {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export function updateAnalyticsConsent(
  choice: AnalyticsConsent,
  target: ConsentWindow = window as ConsentWindow,
) {
  const signals = {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  if (typeof target.gtag === "function") {
    target.gtag("consent", "update", signals);
  } else {
    target.dataLayer = target.dataLayer || [];
    // The Next.js Google SDK also queues commands as arrays.
    target.dataLayer.push(["consent", "update", signals]);
  }
}

export function clearAnalyticsCookies(doc: Pick<Document, "cookie" | "location">) {
  const names = doc.cookie.split(";").map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const parts = doc.location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, index) => parts.slice(index).join("."))];
  for (const name of names) {
    for (const domain of domains) {
      doc.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function saveAnalyticsConsent(choice: AnalyticsConsent) {
  updateAnalyticsConsent(choice);
  sessionConsent = choice;
  try {
    document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    if (choice === "denied") clearAnalyticsCookies(document);
  } catch {
    // Consent still applies to this document when browser storage is blocked.
  }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}
