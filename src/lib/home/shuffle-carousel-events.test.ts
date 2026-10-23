import { describe, expect, it } from "vitest";
import type { EventCardData } from "@/src/components/home/EventCard";
import { shuffleCarouselEvents } from "./shuffle-carousel-events";

const cards = (covers: string[]) => covers.map((imageUrl, i) => ({
  id: `slug-${i}`, eventId: `uuid-${i}`, imageUrl, title: `Corso ${i}`, isFavorite: i === 0,
}) as EventCardData);

describe("browser carousel shuffle", () => {
  it("changes the leading course with a fresh random sequence, without mutating catalogue rows", () => {
    const events = cards(["a", "b", "c", "d", "e", "f", "g", "h"]);
    const original = [...events];
    const first = shuffleCarouselEvents(events, () => 0);
    const second = shuffleCarouselEvents(events, () => 0.999);
    expect(first[0].id).not.toBe(second[0].id);
    expect(first.map((event) => event.id).sort()).toEqual(events.map((event) => event.id).sort());
    expect(events).toEqual(original);
    for (const event of first) expect(event).toBe(events.find((row) => row.id === event.id));
  });
  it("does not always lead with the largest group of identical images", () => {
    const events = cards(["other", "school", "school", "school", "school"]);
    expect(shuffleCarouselEvents(events, () => 0.999)[0].imageUrl).toBe("other");
  });
  it("separates adjacent duplicate covers, including URL query variants", () => {
    const events = cards(["school?size=1", "school?size=2", "school#crop", "a", "b", "c"]);
    const mixed = shuffleCarouselEvents(events, () => 0.999);
    for (let i = 1; i < mixed.length; i++) {
      expect(mixed[i].imageUrl.split(/[?#]/)[0]).not.toBe(mixed[i - 1].imageUrl.split(/[?#]/)[0]);
    }
  });
  it("keeps every course when duplicate covers cannot all be separated", () => {
    const events = cards(["school", "school", "school", "school", "other"]);
    const result = shuffleCarouselEvents(events, () => 0);
    expect(new Set(result.map((event) => event.id)).size).toBe(events.length);
  });
  it("handles empty, single and missing-cover lists", () => {
    expect(shuffleCarouselEvents([], () => 0)).toEqual([]);
    const single = cards([""]);
    expect(shuffleCarouselEvents(single, () => 0)).toEqual(single);
    const events = cards(["", "", ""]);
    expect(shuffleCarouselEvents(events, () => 0)).toHaveLength(3);
  });
});
