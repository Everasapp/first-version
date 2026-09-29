import { describe, expect, it } from "vitest";

import type { EventCardData } from "@/src/components/home/EventCard";
import {
  HUB_MAX_SSR_CARDS,
  HUB_SECTION_LIMITS,
  compareHubEvents,
  findSameTitleDistinctEvents,
  selectEventiSardegnaHubCards,
  sortHubEvents,
} from "@/src/lib/seo/hub-event-selection";
import { eventsItemListSchema } from "@/src/lib/seo/schema";
import { romeDayRange } from "@/src/lib/seo/rome-time";

const TODAY = romeDayRange("2026-09-29");
const WEEKEND = {
  start: romeDayRange("2026-10-02").start,
  end: romeDayRange("2026-10-04").end,
};

function card(
  overrides: Partial<EventCardData> &
    Pick<EventCardData, "eventId" | "id" | "title" | "startDate">,
): EventCardData {
  return {
    category: "Arte e cultura",
    date: "29 set 2026",
    location: "Cagliari",
    municipality: "Cagliari",
    imageUrl: "/images/concert.webp",
    isFree: false,
    scheduleMode: "single",
    ...overrides,
  };
}

function select(events: EventCardData[]) {
  return selectEventiSardegnaHubCards({
    events,
    todayRange: TODAY,
    weekendRange: WEEKEND,
    isSagre: (event) =>
      (event.categories ?? [event.category]).some((label) =>
        /sagre|celebrazioni/i.test(label),
      ),
    isConcerti: (event) =>
      (event.categories ?? [event.category]).some((label) =>
        /musica|concerti/i.test(label),
      ),
  });
}

describe("selectEventiSardegnaHubCards", () => {
  it("1–2. respects section caps and total max 39", () => {
    const events: EventCardData[] = [];
    for (let i = 0; i < 40; i += 1) {
      events.push(
        card({
          eventId: `today-${i}`,
          id: `today-${i}`,
          title: `Oggi ${i}`,
          startDate: "2026-09-29T10:00:00.000Z",
          endDate: "2026-09-29T18:00:00.000Z",
        }),
      );
    }
    for (let i = 0; i < 40; i += 1) {
      events.push(
        card({
          eventId: `week-${i}`,
          id: `week-${i}`,
          title: `Weekend ${i}`,
          startDate: "2026-10-03T10:00:00.000Z",
          endDate: "2026-10-03T18:00:00.000Z",
        }),
      );
    }
    for (let i = 0; i < 20; i += 1) {
      events.push(
        card({
          eventId: `sagra-${i}`,
          id: `sagra-${i}`,
          title: `Sagra ${i}`,
          category: "Sagre e tradizioni",
          categories: ["Sagre e tradizioni"],
          startDate: "2026-10-20T10:00:00.000Z",
        }),
      );
    }
    for (let i = 0; i < 20; i += 1) {
      events.push(
        card({
          eventId: `concerto-${i}`,
          id: `concerto-${i}`,
          title: `Concerto ${i}`,
          category: "Musica e spettacoli",
          categories: ["Musica e spettacoli"],
          startDate: "2026-10-21T20:00:00.000Z",
        }),
      );
    }
    for (let i = 0; i < 20; i += 1) {
      events.push(
        card({
          eventId: `free-${i}`,
          id: `free-${i}`,
          title: `Gratis ${i}`,
          isFree: true,
          startDate: "2026-10-22T10:00:00.000Z",
        }),
      );
    }
    for (let i = 0; i < 20; i += 1) {
      events.push(
        card({
          eventId: `other-${i}`,
          id: `other-${i}`,
          title: `Altro ${i}`,
          startDate: "2026-11-01T10:00:00.000Z",
        }),
      );
    }

    const result = select(events);
    const byId = Object.fromEntries(
      result.sections.map((section) => [section.id, section.events.length]),
    );

    expect(byId.oggi).toBe(HUB_SECTION_LIMITS.oggi);
    expect(byId.weekend).toBe(HUB_SECTION_LIMITS.weekend);
    expect(byId.sagre).toBe(HUB_SECTION_LIMITS.sagre);
    expect(byId.concerti).toBe(HUB_SECTION_LIMITS.concerti);
    expect(byId.gratuiti).toBe(HUB_SECTION_LIMITS.gratuiti);
    expect(byId.prossimi).toBe(HUB_SECTION_LIMITS.prossimi);
    expect(result.ssrCards.length).toBeLessThanOrEqual(HUB_MAX_SSR_CARDS);
    expect(result.ssrCards.length).toBe(39);
  });

  it("3–5. section priority + dedupe by id and slug fallback", () => {
    const sharedToday = card({
      eventId: "shared-1",
      id: "shared-slug",
      title: "Condiviso oggi",
      startDate: "2026-09-29T10:00:00.000Z",
      endDate: "2026-10-03T18:00:00.000Z",
      category: "Sagre e tradizioni",
      categories: ["Sagre e tradizioni"],
      isFree: true,
    });
    const weekendOnly = card({
      eventId: "week-only",
      id: "week-only",
      title: "Solo weekend",
      startDate: "2026-10-03T10:00:00.000Z",
    });
    const sagra = card({
      eventId: "sagra-1",
      id: "sagra-1",
      title: "Sagra dopo",
      category: "Sagre e tradizioni",
      categories: ["Sagre e tradizioni"],
      startDate: "2026-10-15T10:00:00.000Z",
    });
    const slugOnly = card({
      eventId: "",
      id: "slug-identity",
      title: "Identità slug",
      startDate: "2026-10-16T10:00:00.000Z",
      category: "Musica e spettacoli",
      categories: ["Musica e spettacoli"],
    });
    const slugDup = card({
      eventId: "other-id",
      id: "slug-identity",
      title: "Stesso slug diverso id",
      startDate: "2026-10-17T10:00:00.000Z",
      category: "Musica e spettacoli",
      categories: ["Musica e spettacoli"],
    });

    const result = select([
      sharedToday,
      weekendOnly,
      sagra,
      slugOnly,
      slugDup,
    ]);
    const ids = result.ssrCards.map((event) => event.eventId || event.id);

    expect(result.sections[0]?.id).toBe("oggi");
    expect(result.sections[0]?.events.some((e) => e.eventId === "shared-1")).toBe(
      true,
    );
    expect(
      result.ssrCards.filter((e) => e.eventId === "shared-1").length,
    ).toBe(1);
    expect(ids.filter((id) => id === "slug-identity").length).toBe(1);
  });

  it("6. does not dedupe solely by title", () => {
    const a = card({
      eventId: "a1",
      id: "slug-a",
      title: "Oktoberfest Sassari 2026",
      startDate: "2026-10-20T18:00:00.000Z",
      category: "Musica e spettacoli",
      categories: ["Musica e spettacoli"],
    });
    const b = card({
      eventId: "b2",
      id: "slug-b",
      title: "Oktoberfest Sassari 2026",
      startDate: "2026-10-21T18:00:00.000Z",
      category: "Musica e spettacoli",
      categories: ["Musica e spettacoli"],
    });
    const result = select([a, b]);
    const concerti = result.sections.find((s) => s.id === "concerti")?.events ?? [];
    expect(concerti.map((e) => e.eventId).sort()).toEqual(["a1", "b2"]);
    expect(findSameTitleDistinctEvents([a, b])).toHaveLength(1);
  });

  it("7–8. excludes container from hub cards; keeps series outside daily windows", () => {
    const container = card({
      eventId: "aib-master",
      id: "autunno-in-barbagia-2026-mt0ahz26",
      title: "Autunno in Barbagia 2026",
      scheduleMode: "container",
      category: "Sagre e tradizioni",
      categories: ["Sagre e tradizioni"],
      startDate: "2026-09-05T06:00:00.000Z",
      endDate: "2026-12-13T22:00:00.000Z",
    });
    const seriesLater = card({
      eventId: "series-1",
      id: "series-later",
      title: "Rassegna autunnale",
      scheduleMode: "series",
      category: "Musica e spettacoli",
      categories: ["Musica e spettacoli"],
      startDate: "2026-10-20T18:00:00.000Z",
      endDate: "2026-11-20T22:00:00.000Z",
    });
    const continuousToday = card({
      eventId: "show-1",
      id: "show-1",
      title: "Mostra continua",
      scheduleMode: "continuous",
      startDate: "2026-09-01T08:00:00.000Z",
      endDate: "2026-10-15T18:00:00.000Z",
    });

    const result = select([container, seriesLater, continuousToday]);
    expect(
      result.ssrCards.some((e) => e.eventId === "aib-master"),
    ).toBe(false);
    expect(
      result.ssrCards.some((e) => e.eventId === "series-1"),
    ).toBe(true);
    expect(
      result.sections
        .find((s) => s.id === "oggi")
        ?.events.some((e) => e.eventId === "show-1"),
    ).toBe(true);
  });

  it("9. deterministic order by start, title, slug", () => {
    const events = [
      card({
        eventId: "2",
        id: "b-slug",
        title: "Beta",
        startDate: "2026-10-20T10:00:00.000Z",
      }),
      card({
        eventId: "1",
        id: "a-slug",
        title: "Alpha",
        startDate: "2026-10-20T10:00:00.000Z",
      }),
      card({
        eventId: "3",
        id: "c-slug",
        title: "Alpha",
        startDate: "2026-10-19T10:00:00.000Z",
      }),
    ];
    const sorted = sortHubEvents(events);
    expect(sorted.map((e) => e.id)).toEqual(["c-slug", "a-slug", "b-slug"]);
    expect(compareHubEvents(events[0], events[1])).toBeGreaterThan(0);
  });

  it("10. ItemList matches SSR cards exactly", () => {
    const events = [
      card({
        eventId: "t1",
        id: "t1",
        title: "Oggi uno",
        startDate: "2026-09-29T10:00:00.000Z",
      }),
      card({
        eventId: "w1",
        id: "w1",
        title: "Weekend uno",
        startDate: "2026-10-03T10:00:00.000Z",
      }),
      card({
        eventId: "s1",
        id: "s1",
        title: "Sagra uno",
        category: "Sagre e tradizioni",
        categories: ["Sagre e tradizioni"],
        startDate: "2026-10-20T10:00:00.000Z",
      }),
    ];
    const result = select(events);
    const schema = eventsItemListSchema({
      name: "Eventi in Sardegna",
      path: "/eventi-sardegna",
      events: result.ssrCards,
      limit: result.ssrCards.length,
    });
    expect(schema?.numberOfItems).toBe(result.ssrCards.length);
    const elements = schema!.itemListElement as Array<{
      name: string;
      url: string;
    }>;
    expect(elements.map((item) => item.name)).toEqual(
      result.ssrCards.map((event) => event.title),
    );
    expect(elements.map((item) => item.url)).toEqual(
      result.ssrCards.map((event) => `https://www.everas.it/eventi/${event.id}`),
    );
  });

  it("11. does not mutate input arrays", () => {
    const events = [
      card({
        eventId: "t1",
        id: "t1",
        title: "Oggi",
        startDate: "2026-09-29T10:00:00.000Z",
      }),
      card({
        eventId: "later",
        id: "later",
        title: "Dopo",
        startDate: "2026-11-01T10:00:00.000Z",
      }),
    ];
    const frozen = events.map((event) => ({ ...event }));
    select(events);
    expect(events).toEqual(frozen);
  });

  it("12. keeps sections with fewer events than the cap", () => {
    const events = [
      card({
        eventId: "t1",
        id: "t1",
        title: "Solo uno oggi",
        startDate: "2026-09-29T10:00:00.000Z",
      }),
    ];
    const result = select(events);
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]?.id).toBe("oggi");
    expect(result.sections[0]?.events).toHaveLength(1);
    expect(result.ssrCards).toHaveLength(1);
  });
});
