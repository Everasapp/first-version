import { expect, it } from "vitest";
import { formatEventHoursDetail } from "./formatEventDate";

it("shows the programme period for a series without implying nonstop performances", () => {
  const result = formatEventHoursDetail("2026-10-30T19:30:00Z", "2026-11-01T22:59:00Z", "series");
  expect(result.lines).toEqual(["30 ottobre 2026 – 1 novembre 2026", "Date e orari dei singoli appuntamenti nel programma qui sotto."]);
  expect(result.summary).not.toContain("20:30");
});

it("keeps the exact Rome start time for a single performance", () => {
  expect(formatEventHoursDetail("2026-10-16T19:00:00Z").lines[0]).toContain("21:00");
});
