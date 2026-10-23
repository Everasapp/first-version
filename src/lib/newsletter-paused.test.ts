import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WEEKLY_NEWSLETTER_PAUSED } from "./newsletter-availability";

describe("newsletter scheduled delivery", () => {
  it("enables weekly newsletter delivery", () => {
    expect(WEEKLY_NEWSLETTER_PAUSED).toBe(false);
  });
  it("uses two Monday UTC slots for Italian seasonal time", () => {
    const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"));
    const schedules = config.crons.filter((j: {path:string}) => j.path === "/api/cron/weekly-newsletter").map((j: {schedule:string}) => j.schedule).sort();
    expect(schedules).toEqual(["0 7 * * 1", "0 8 * * 1"]);
    expect(config.crons.some((j: {path:string}) => j.path === "/api/cron/expire-advertising")).toBe(true);
  });
});
