import { describe, expect, it } from "vitest";

import type { EventCardData } from "@/src/components/home/EventCard";
import { sortEventsForPeriod } from "@/src/lib/seo/event-period-relevance";
import { romeDayRange, romeMonthRange } from "@/src/lib/seo/rome-time";

function event(
  id: string,
  startDate: string,
  scheduleMode: EventCardData["scheduleMode"] = "single",
  endDate?: string,
): EventCardData {
  return {
    id,
    eventId: id,
    title: id,
    category: "Evento",
    date: startDate,
    startDate,
    endDate,
    scheduleMode,
    location: "Sardegna",
    imageUrl: "/images/concert.webp",
    isFree: true,
  };
}

describe("sortEventsForPeriod", () => {
  it("puts events starting today before an older continuous event", () => {
    const range = romeDayRange("2026-10-08");
    const ongoing = event(
      "mostra-in-corso",
      "2026-04-01T10:00:00+02:00",
      "continuous",
      "2026-10-31T20:00:00+01:00",
    );
    const tonight = event("concerto-oggi", "2026-10-08T21:00:00+02:00");

    expect(sortEventsForPeriod([ongoing, tonight], range).map((item) => item.id)).toEqual([
      "concerto-oggi",
      "mostra-in-corso",
    ]);
  });

  it("orders starts inside a weekend chronologically", () => {
    const range = {
      start: new Date("2026-10-08T22:00:00.000Z"),
      end: new Date("2026-10-11T22:00:00.000Z"),
    };
    const sunday = event("domenica", "2026-10-11T18:00:00+02:00");
    const saturday = event("sabato", "2026-10-10T18:00:00+02:00");

    expect(sortEventsForPeriod([sunday, saturday], range).map((item) => item.id)).toEqual([
      "sabato",
      "domenica",
    ]);
  });

  it("keeps month starts ahead of long-running series and containers", () => {
    const range = romeMonthRange(2026, 9);
    const container = event(
      "stagione",
      "2026-04-01T10:00:00+02:00",
      "container",
      "2026-12-31T22:00:00+01:00",
    );
    const series = event(
      "rassegna",
      "2026-07-01T10:00:00+02:00",
      "series",
      "2026-11-30T22:00:00+01:00",
    );
    const october = event("ottobre", "2026-10-03T20:00:00+02:00");

    expect(
      sortEventsForPeriod([container, series, october], range).map((item) => item.id),
    ).toEqual(["ottobre", "rassegna", "stagione"]);
  });

  it("uses schedule mode and deterministic text keys for ties", () => {
    const range = romeDayRange("2026-10-08");
    const continuous = event(
      "b",
      "2026-10-08T18:00:00+02:00",
      "continuous",
      "2026-10-09T18:00:00+02:00",
    );
    const singleB = event("b-single", "2026-10-08T18:00:00+02:00");
    singleB.title = "Zeta";
    const singleA = event("a-single", "2026-10-08T18:00:00+02:00");
    singleA.title = "Alfa";

    expect(
      sortEventsForPeriod([continuous, singleB, singleA], range).map((item) => item.id),
    ).toEqual(["a-single", "b-single", "b"]);
  });

  it("does not mutate the input array", () => {
    const range = romeDayRange("2026-10-08");
    const source = [
      event("late", "2026-10-08T21:00:00+02:00"),
      event("early", "2026-10-08T09:00:00+02:00"),
    ];

    expect(sortEventsForPeriod(source, range).map((item) => item.id)).toEqual([
      "early",
      "late",
    ]);
    expect(source.map((item) => item.id)).toEqual(["late", "early"]);
  });
});
