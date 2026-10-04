import { describe, expect, it, vi } from "vitest";
import { clearAnalyticsCookies, readAnalyticsConsent, updateAnalyticsConsent } from "./analytics-consent";

describe("Analytics consent choices", () => {
  it("ignores missing, malformed and similarly named consent cookies", () => {
    expect(readAnalyticsConsent("")).toBeNull();
    expect(readAnalyticsConsent("other_everas_analytics_consent_v1=granted")).toBeNull();
    expect(readAnalyticsConsent("everas_analytics_consent_v1=accepted")).toBeNull();
    expect(readAnalyticsConsent("other=x; everas_analytics_consent_v1=granted")).toBe("granted");
    expect(readAnalyticsConsent("everas_analytics_consent_v1=denied; other=x")).toBe("denied");
  });

  it.each(["granted", "denied"] as const)("updates Analytics to %s while all advertising stays denied", (choice) => {
    const gtag = vi.fn();
    updateAnalyticsConsent(choice, { gtag });
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: choice, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    });
  });

  it("queues the choice if the Google script has not initialized yet", () => {
    const target = { dataLayer: [] as unknown[] };
    updateAnalyticsConsent("granted", target);
    expect(Array.from(target.dataLayer[0] as IArguments)).toEqual([
      "consent", "update", {
        analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      },
    ]);
  });

  it("revokes GA cookies at the host and parent domain without deleting login or consent cookies", () => {
    const writes: string[] = [];
    const doc = {
      get cookie() { return "_ga=one; _ga_NBHEHZ5FLD=two; sb-auth-token=login; everas_analytics_consent_v1=denied"; },
      set cookie(value: string) { writes.push(value); },
      location: { hostname: "www.everas.it" },
    };
    clearAnalyticsCookies(doc as Pick<Document, "cookie" | "location">);
    expect(writes).toHaveLength(6);
    expect(writes).toContain("_ga=; Max-Age=0; Path=/; SameSite=Lax; Domain=everas.it");
    expect(writes.every((value) => value.startsWith("_ga") && value.includes("Max-Age=0"))).toBe(true);
  });
});
