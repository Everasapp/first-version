import { afterEach, describe, expect, it, vi } from "vitest";
import { clearAnalyticsCookies, getBrowserAnalyticsConsent, openConsentPreferences } from "./analytics-consent";

afterEach(() => vi.unstubAllGlobals());

describe("CMP Analytics consent", () => {
  it("waits for the CMP and ignores previous banner cookies", () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "everas_analytics_consent_v1=granted" });
    expect(getBrowserAnalyticsConsent()).toBeNull();
  });

  it.each(["granted", "denied"])("uses the CMP Analytics choice %s", (choice) => {
    vi.stubGlobal("window", { __everasAnalyticsConsent: choice });
    expect(getBrowserAnalyticsConsent()).toBe(choice);
  });

  it("opens the certified CMP preferences through its API", () => {
    const tcfapi = vi.fn((command, _version, callback) => {
      if (command === "ping") callback({ gdprApplies: true }, true);
    });
    vi.stubGlobal("window", { __tcfapi: tcfapi });
    expect(openConsentPreferences()).toBe(true);
    expect(tcfapi).toHaveBeenCalledWith("displayConsentUi", 2, expect.any(Function));
    vi.stubGlobal("window", {});
    expect(openConsentPreferences()).toBe(false);
  });

  it("reopens the US preferences using the regional CMP API", () => {
    const uspapi = vi.fn();
    const tcfapi = vi.fn((command, _version, callback) => {
      if (command === "ping") callback({ gdprApplies: false }, true);
    });
    vi.stubGlobal("window", { __tcfapi: tcfapi, __uspapi: uspapi });
    expect(openConsentPreferences()).toBe(true);
    expect(uspapi).toHaveBeenCalledWith("displayUspUi");
    expect(tcfapi).not.toHaveBeenCalledWith("displayConsentUi", 2, expect.any(Function));
  });

  it("keeps the TCF fallback if the regional API is unavailable", () => {
    const tcfapi = vi.fn((command, _version, callback) => {
      if (command === "ping") callback({ gdprApplies: false }, true);
    });
    vi.stubGlobal("window", { __tcfapi: tcfapi });
    expect(openConsentPreferences()).toBe(true);
    expect(tcfapi).toHaveBeenCalledWith("displayConsentUi", 2, expect.any(Function));
    vi.unstubAllGlobals();
    expect(openConsentPreferences()).toBe(false);
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
