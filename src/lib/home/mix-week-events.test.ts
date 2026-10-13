import { expect, it } from "vitest";
import type { EventCardData } from "@/src/components/home/EventCard";
import { mixWeekEvents } from "./mix-week-events";

it("separates a batch of identical course covers without dropping events", () => {
  const events = ["school", "school", "school", "a", "b", "c"].map((imageUrl, i) => ({ id: String(i), imageUrl }) as EventCardData);
  const original = [...events];
  const now = new Date("2026-10-13T15:45:00Z");
  const mixed = mixWeekEvents(events, now);
  expect(new Set(mixed.map(event => event.id)).size).toBe(events.length);
  expect(events).toEqual(original);
  for (let i = 1; i < mixed.length; i += 1) expect(mixed[i].imageUrl).not.toBe(mixed[i - 1].imageUrl);
  expect(mixWeekEvents(events, new Date("2026-10-13T15:59:59Z"))).toEqual(mixed);
});

it("preserves every course even when identical images cannot all be separated", () => {
  const events = ["school", "school", "school", "school", "other"].map((imageUrl, i) => ({ id: String(i), imageUrl }) as EventCardData);
  expect(mixWeekEvents(events, new Date())).toHaveLength(events.length);
  expect(mixWeekEvents([], new Date())).toEqual([]);
});
