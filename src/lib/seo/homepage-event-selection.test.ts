import { describe, expect, it } from "vitest";

import type { EventCardData } from "@/src/components/home/EventCard";
import {
  HOMEPAGE_SSR_CARDS_PER_SECTION,
  findSameTitleDistinctHomepageEvents,
  selectHomepageEventSections,
  sortHomepageAreaEvents,
} from "@/src/lib/seo/homepage-event-selection";
import { eventsItemListSchema } from "@/src/lib/seo/schema";

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

function makePool(count: number, area: string, prefix: string) {
  return Array.from({ length: count }, (_, i) =>
    card({
      eventId: `${prefix}-${i}`,
      id: `${prefix}-${i}`,
      title: `${prefix} ${i}`,
      area,
      createdAt: `2026-09-${String(30 - (i % 28)).padStart(2, "0")}T10:00:00.000Z`,
      startDate: `2026-10-${String((i % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
    }),
  );
}

describe("selectHomepageEventSections", () => {
  it("1. keeps all unique events available to the carousels", () => {
    const hot = makePool(20, "Nord Sardegna", "hot");
    const all = [
      ...makePool(20, "Nord Sardegna", "nord"),
      ...makePool(20, "Centro Sardegna", "centro"),
      ...makePool(20, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    expect(result.hot).toHaveLength(20);
    expect(result.north).toHaveLength(20);
    expect(result.center).toHaveLength(20);
    expect(result.south).toHaveLength(20);
  });

  it("2. first 6 SSR cards per section", () => {
    const hot = makePool(12, "Nord Sardegna", "hot");
    const all = [
      ...makePool(12, "Nord Sardegna", "nord"),
      ...makePool(12, "Centro Sardegna", "centro"),
      ...makePool(12, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    expect(result.ssrCards).toHaveLength(24);
    expect(result.ssrCards.slice(0, 6).map((e) => e.eventId)).toEqual(
      result.hot.slice(0, HOMEPAGE_SSR_CARDS_PER_SECTION).map((e) => e.eventId),
    );
    expect(result.ssrCards.slice(6, 12).map((e) => e.eventId)).toEqual(
      result.north.slice(0, 6).map((e) => e.eventId),
    );
    expect(result.ssrCards.slice(12, 18).map((e) => e.eventId)).toEqual(
      result.center.slice(0, 6).map((e) => e.eventId),
    );
    expect(result.ssrCards.slice(18, 24).map((e) => e.eventId)).toEqual(
      result.south.slice(0, 6).map((e) => e.eventId),
    );
  });

  it("3. priority Hot → Nord → Centro → Sud", () => {
    const shared = card({
      eventId: "shared",
      id: "shared",
      title: "Shared Hot Nord",
      area: "Nord Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const hotExtra = card({
      eventId: "hot-only",
      id: "hot-only",
      title: "Hot only",
      area: "Centro Sardegna",
      createdAt: "2026-09-27T10:00:00.000Z",
      startDate: "2026-10-02T10:00:00.000Z",
    });
    const nordAlt = card({
      eventId: "nord-alt",
      id: "nord-alt",
      title: "Nord alt",
      area: "Nord Sardegna",
      createdAt: "2026-09-20T10:00:00.000Z",
      startDate: "2026-10-03T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [shared, hotExtra],
      allEvents: [shared, nordAlt],
    });

    expect(result.hot.map((e) => e.eventId)).toEqual(["shared", "hot-only"]);
    expect(result.north.map((e) => e.eventId)).toEqual(["nord-alt"]);
    expect(result.north.some((e) => e.eventId === "shared")).toBe(false);
  });

  it("4. deduplicates by event id", () => {
    const twin = card({
      eventId: "uuid-1",
      id: "slug-a",
      title: "Twin A",
      area: "Nord Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const sameIdDiffSlug = card({
      eventId: "uuid-1",
      id: "slug-b",
      title: "Twin B",
      area: "Centro Sardegna",
      createdAt: "2026-09-27T10:00:00.000Z",
      startDate: "2026-10-02T10:00:00.000Z",
    });
    const centro = card({
      eventId: "centro-1",
      id: "centro-1",
      title: "Centro",
      area: "Centro Sardegna",
      createdAt: "2026-09-26T10:00:00.000Z",
      startDate: "2026-10-03T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [twin],
      allEvents: [twin, sameIdDiffSlug, centro],
    });

    expect(result.hot[0]?.eventId).toBe("uuid-1");
    expect(result.center.map((e) => e.eventId)).toEqual(["centro-1"]);
  });

  it("5. falls back to slug identity", () => {
    const bySlug = card({
      eventId: "",
      id: "only-slug",
      title: "Slug identity",
      area: "Nord Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const sameSlug = card({
      eventId: "other-uuid",
      id: "only-slug",
      title: "Same slug elsewhere",
      area: "Sud Sardegna",
      createdAt: "2026-09-27T10:00:00.000Z",
      startDate: "2026-10-02T10:00:00.000Z",
    });
    const sudAlt = card({
      eventId: "sud-alt",
      id: "sud-alt",
      title: "Sud alt",
      area: "Sud Sardegna",
      createdAt: "2026-09-26T10:00:00.000Z",
      startDate: "2026-10-03T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [bySlug],
      allEvents: [bySlug, sameSlug, sudAlt],
    });

    expect(result.hot[0]?.id).toBe("only-slug");
    expect(result.south.map((e) => e.id)).toEqual(["sud-alt"]);
  });

  it("6. does not dedupe by title alone", () => {
    const a = card({
      eventId: "a",
      id: "a",
      title: "Festa del Mare",
      area: "Nord Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const b = card({
      eventId: "b",
      id: "b",
      title: "Festa del Mare",
      area: "Centro Sardegna",
      createdAt: "2026-09-27T10:00:00.000Z",
      startDate: "2026-10-02T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [a],
      allEvents: [a, b],
    });

    expect(result.hot[0]?.eventId).toBe("a");
    expect(result.center[0]?.eventId).toBe("b");
    expect(findSameTitleDistinctHomepageEvents([...result.hot, ...result.center])).toHaveLength(1);
  });

  it("7. refills after excluding a duplicate", () => {
    const hotFirst = card({
      eventId: "dup",
      id: "dup",
      title: "Dup in hot",
      area: "Nord Sardegna",
      createdAt: "2026-09-29T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const nordOlder = card({
      eventId: "nord-old",
      id: "nord-old",
      title: "Nord older",
      area: "Nord Sardegna",
      createdAt: "2026-09-20T10:00:00.000Z",
      startDate: "2026-10-05T10:00:00.000Z",
    });
    const nordFill = card({
      eventId: "nord-fill",
      id: "nord-fill",
      title: "Nord fill",
      area: "Nord Sardegna",
      createdAt: "2026-09-19T10:00:00.000Z",
      startDate: "2026-10-06T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [hotFirst],
      allEvents: [hotFirst, nordOlder, nordFill],
      maxPerSection: 2,
    });

    expect(result.north.map((e) => e.eventId)).toEqual([
      "nord-old",
      "nord-fill",
    ]);
  });

  it("8. respects territorial area", () => {
    const nord = card({
      eventId: "n1",
      id: "n1",
      title: "Nord",
      area: "Nord Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const centro = card({
      eventId: "c1",
      id: "c1",
      title: "Centro",
      area: "Centro Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const sud = card({
      eventId: "s1",
      id: "s1",
      title: "Sud",
      area: "Sud Sardegna",
      createdAt: "2026-09-28T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });

    const result = selectHomepageEventSections({
      hotCandidates: [],
      allEvents: [nord, centro, sud],
    });

    expect(result.north.every((e) => e.area === "Nord Sardegna")).toBe(true);
    expect(result.center.every((e) => e.area === "Centro Sardegna")).toBe(true);
    expect(result.south.every((e) => e.area === "Sud Sardegna")).toBe(true);
    expect(result.north[0]?.eventId).toBe("n1");
    expect(result.center[0]?.eventId).toBe("c1");
    expect(result.south[0]?.eventId).toBe("s1");
  });

  it("9. short section keeps available events only", () => {
    const result = selectHomepageEventSections({
      hotCandidates: makePool(3, "Nord Sardegna", "hot"),
      allEvents: makePool(2, "Sud Sardegna", "sud"),
    });
    expect(result.hot).toHaveLength(3);
    expect(result.north).toHaveLength(0);
    expect(result.center).toHaveLength(0);
    expect(result.south).toHaveLength(2);
    expect(result.ssrCards).toHaveLength(5);
  });

  it("10. does not mutate inputs", () => {
    const hot = makePool(3, "Nord Sardegna", "hot");
    const all = makePool(3, "Nord Sardegna", "nord");
    const hotCopy = hot.map((e) => ({ ...e }));
    const allCopy = all.map((e) => ({ ...e }));
    selectHomepageEventSections({ hotCandidates: hot, allEvents: all });
    expect(hot).toEqual(hotCopy);
    expect(all).toEqual(allCopy);
  });

  it("11. deterministic order (area sort by createdAt desc)", () => {
    const a = card({
      eventId: "older",
      id: "older",
      title: "Older",
      area: "Nord Sardegna",
      createdAt: "2026-09-10T10:00:00.000Z",
      startDate: "2026-10-01T10:00:00.000Z",
    });
    const b = card({
      eventId: "newer",
      id: "newer",
      title: "Newer",
      area: "Nord Sardegna",
      createdAt: "2026-09-20T10:00:00.000Z",
      startDate: "2026-10-05T10:00:00.000Z",
    });
    const sorted = sortHomepageAreaEvents([a, b]);
    expect(sorted.map((e) => e.eventId)).toEqual(["newer", "older"]);

    const first = selectHomepageEventSections({
      hotCandidates: [],
      allEvents: [a, b],
    });
    const second = selectHomepageEventSections({
      hotCandidates: [],
      allEvents: [b, a],
    });
    expect(first.north.map((e) => e.eventId)).toEqual(
      second.north.map((e) => e.eventId),
    );
  });

  it("12. ssrCards matches expected DOM order", () => {
    const hot = makePool(8, "Nord Sardegna", "hot");
    const all = [
      ...makePool(8, "Nord Sardegna", "nord"),
      ...makePool(8, "Centro Sardegna", "centro"),
      ...makePool(8, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    const expected = [
      ...result.hot.slice(0, 6),
      ...result.north.slice(0, 6),
      ...result.center.slice(0, 6),
      ...result.south.slice(0, 6),
    ];
    expect(result.ssrCards.map((e) => e.eventId)).toEqual(
      expected.map((e) => e.eventId),
    );
  });

  it("13. ItemList numberOfItems equals SSR cards", () => {
    const hot = makePool(10, "Nord Sardegna", "hot");
    const all = [
      ...makePool(10, "Nord Sardegna", "nord"),
      ...makePool(10, "Centro Sardegna", "centro"),
      ...makePool(10, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    const schema = eventsItemListSchema({
      name: "Eventi in Sardegna",
      path: "/",
      events: result.ssrCards,
      limit: result.ssrCards.length,
    });
    expect(schema?.numberOfItems).toBe(result.ssrCards.length);
    expect(schema?.numberOfItems).toBe(24);
    const elements = schema?.itemListElement as Array<{ name: string; url: string }>;
    expect(elements).toHaveLength(24);
    expect(elements[0]?.name).toBe(result.ssrCards[0]?.title);
    expect(elements[0]?.url).toContain(`/eventi/${result.ssrCards[0]?.id}`);
  });

  it("14. passes the full unique carousel inventory while bounding SSR cards", () => {
    const hot = makePool(20, "Nord Sardegna", "hot");
    const all = [
      ...makePool(20, "Nord Sardegna", "nord"),
      ...makePool(20, "Centro Sardegna", "centro"),
      ...makePool(20, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    const allPassed = [
      ...result.hot,
      ...result.north,
      ...result.center,
      ...result.south,
    ];
    expect(allPassed.length).toBe(80);
    const ids = new Set(allPassed.map((e) => e.eventId));
    expect(ids.size).toBe(80);
    expect(result.ssrCards).toHaveLength(4 * HOMEPAGE_SSR_CARDS_PER_SECTION);
  });

  it("15. area totalCount is real inventory before cap", () => {
    const hot = makePool(5, "Nord Sardegna", "hot");
    const all = [
      ...makePool(25, "Nord Sardegna", "nord"),
      ...makePool(8, "Centro Sardegna", "centro"),
      ...makePool(3, "Sud Sardegna", "sud"),
    ];
    const result = selectHomepageEventSections({
      hotCandidates: hot,
      allEvents: all,
    });
    expect(result.north).toHaveLength(25);
    expect(result.northTotalCount).toBe(25);
    expect(result.centerTotalCount).toBe(8);
    expect(result.southTotalCount).toBe(3);
    expect(result.center).toHaveLength(8);
    expect(result.south).toHaveLength(3);
  });
});
