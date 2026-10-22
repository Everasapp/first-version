import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getEventBucket } from "./dashboardEvents";
import { isPublicEventActive, isPublicEventExpired } from "./eventActive";
import { formatEventDateRange } from "./formatEventDate";
import { WEEKLY_NEWSLETTER_PAUSED } from "./newsletter-availability";
import { scheduleModeUsesEventSchema } from "./eventScheduleMode";
import { VERIFIED_SEASONAL_LISTINGS } from "./verified-seasonal-listings";

const SALSA = "corso-di-salsa-cubana-e-bachata-mtemfmsq";
const COPY = "corso-di-salsa-cubana-e-bachata-altra-copia";
const START = "2026-10-01T08:00:00.000Z";
const DURING = new Date("2026-10-21T10:00:00.000Z");
const LAST_REVIEW_DAY = new Date("2027-01-21T22:30:00.000Z");
const AFTER_REVIEW = new Date("2027-01-22T00:30:00.000Z");

describe("verified seasonal announcements", () => {
  it("keeps only the checked dance listing, not the other copies", () => {
    expect(VERIFIED_SEASONAL_LISTINGS.map((item) => item.slug)).toEqual([SALSA]);
  });

  it("stays visible after the real start while the editorial review is open", () => {
    expect(isPublicEventActive(START, null, DURING, { slug: SALSA })).toBe(true);
    expect(isPublicEventExpired(START, null, LAST_REVIEW_DAY, { slug: SALSA })).toBe(false);
    expect(formatEventDateRange(START, null)).not.toContain("2027");
    expect(scheduleModeUsesEventSchema("container")).toBe(false);
  });

  it("expires when the editorial review lapses", () => {
    expect(isPublicEventExpired(START, null, AFTER_REVIEW, { slug: SALSA })).toBe(true);
  });

  it("does not revive old courses that simply lack an end date", () => {
    expect(isPublicEventExpired(START, null, DURING, { slug: COPY })).toBe(true);
    expect(isPublicEventExpired("2024-05-01T10:00:00.000Z", null, DURING)).toBe(true);
    expect(getEventBucket({
      status: "published",
      start_at: START,
      end_at: null,
      slug: COPY,
    }, DURING.getTime())).toBe("scaduti");
  });

  it("treats a real end date in the past as concluded", () => {
    const ended = "2026-10-10T20:00:00.000Z";
    expect(isPublicEventExpired(START, ended, DURING, { slug: SALSA })).toBe(true);
    expect(getEventBucket({
      status: "published",
      start_at: START,
      end_at: ended,
      slug: SALSA,
    }, DURING.getTime())).toBe("scaduti");
  });

  it("leaves the newsletter paused and this branch deploy disabled", () => {
    expect(WEEKLY_NEWSLETTER_PAUSED).toBe(true);
    const vercel = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8")) as {
      git: { deploymentEnabled: Record<string, boolean> };
      crons: Array<{ path: string }>;
    };
    expect(vercel.git.deploymentEnabled["revision/learning-dance-20261021"]).toBe(false);
    expect(vercel.crons.map((cron) => cron.path)).not.toContain("/api/cron/weekly-newsletter");
  });
});
