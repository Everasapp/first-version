export const ANALYTICS_CONSENT_EVENT = "everas:analytics-consent-changed";
export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    __everasAnalyticsConsent?: AnalyticsConsent | null;
    __tcfapi?: (command: string, version: number, callback: (data: unknown, success: boolean) => void) => void;
    __uspapi?: (command: string) => void;
  }
}

export function getBrowserAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const choice = window.__everasAnalyticsConsent;
  return choice === "granted" || choice === "denied" ? choice : null;
}

export function openConsentPreferences(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.__tcfapi !== "function") return false;
  const tcfapi = window.__tcfapi;
  tcfapi("ping", 2, (data, success) => {
    const gdprApplies = data && typeof data === "object" && "gdprApplies" in data
      ? data.gdprApplies : undefined;
    if (success && gdprApplies === false && typeof window.__uspapi === "function") {
      window.__uspapi("displayUspUi");
    } else {
      tcfapi("displayConsentUi", 2, () => {});
    }
  });
  return true;
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
