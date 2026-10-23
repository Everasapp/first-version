import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import HappeningToday from "@/src/components/home/HappeningToday";
import type { EventCardData } from "@/src/components/home/EventCard";

vi.mock("@/src/components/home/EventCard", () => ({
  default: ({ event }: { event: EventCardData }) => createElement("span", { "data-course": event.id }),
}));

it("keeps SSR and the first render deterministic; randomness is deferred until mounting", () => {
  const events = Array.from({ length: 9 }, (_, i) => ({ id: `course-${i}`, eventId: `uuid-${i}` }) as EventCardData);
  const random = vi.spyOn(Math, "random");
  try {
    const first = renderToStaticMarkup(createElement(HappeningToday, { events }));
    const second = renderToStaticMarkup(createElement(HappeningToday, { events }));
    const ids = (html: string) => [...html.matchAll(/data-course="([^"]+)"/g)].map((match) => match[1]);
    expect(ids(first)).toEqual(events.slice(0, 6).map((event) => event.id));
    expect(ids(second)).toEqual(ids(first));
    expect(random).not.toHaveBeenCalled();
  } finally {
    random.mockRestore();
  }
});
