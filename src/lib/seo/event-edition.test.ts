import { describe, expect, it } from "vitest";

import {
  eventEditionTitleKey,
  findNextEventEdition,
} from "@/src/lib/seo/event-edition";

const NOW = new Date("2026-10-08T12:00:00Z");

function event(
  overrides: Partial<{
    id: string;
    slug: string | null;
    title: string;
    category: string;
    categories: string[] | null;
    municipality: string;
    start_at: string;
    end_at: string | null;
  }> = {},
) {
  return {
    id: "current",
    slug: "festival-2025",
    title: "Festival del Mare 2025",
    category: "musica-concerti",
    categories: null,
    municipality: "Alghero",
    start_at: "2025-08-10T20:00:00+02:00",
    end_at: "2025-08-10T23:00:00+02:00",
    ...overrides,
  };
}

describe("eventEditionTitleKey", () => {
  it("normalizes years, accents and explicit edition markers", () => {
    expect(eventEditionTitleKey("Fèstival del Mare 2026")).toBe(
      "festival del mare",
    );
    expect(eventEditionTitleKey("Festival del Mare - XIV edizione")).toBe(
      "festival del mare",
    );
    expect(eventEditionTitleKey("Festival del Mare, edizione n. 15")).toBe(
      "festival del mare",
    );
  });
});
describe("findNextEventEdition", () => {
  it("returns the earliest active edition with matching title, city and category", () => {
    const later = event({
      id: "later",
      slug: "festival-2027",
      title: "Festival del Mare 2027",
      start_at: "2027-08-10T20:00:00+02:00",
      end_at: "2027-08-10T23:00:00+02:00",
    });
    const next = event({
      id: "next",
      slug: "festival-2026",
      title: "Festival del Mare - XV edizione",
      start_at: "2026-10-20T20:00:00+02:00",
      end_at: "2026-10-20T23:00:00+02:00",
    });

    expect(findNextEventEdition(event(), [later, next], NOW)?.slug).toBe(
      "festival-2026",
    );
  });

  it("rejects similar events in another city or category", () => {
    const wrongCity = event({
      id: "city",
      slug: "festival-city",
      title: "Festival del Mare 2026",
      municipality: "Cagliari",
      start_at: "2026-10-20T20:00:00+02:00",
    });
    const wrongCategory = event({
      id: "category",
      slug: "festival-category",
      title: "Festival del Mare 2026",
      category: "sport-competizioni",
      start_at: "2026-10-20T20:00:00+02:00",
    });

    expect(
      findNextEventEdition(event(), [wrongCity, wrongCategory], NOW),
    ).toBeNull();
  });

  it("rejects expired, missing-slug and unrelated candidates", () => {
    const expired = event({
      id: "expired",
      slug: "festival-2026-expired",
      title: "Festival del Mare 2026",
      start_at: "2026-09-10T20:00:00+02:00",
      end_at: "2026-09-10T23:00:00+02:00",
    });
    const missingSlug = event({
      id: "missing",
      slug: null,
      title: "Festival del Mare 2027",
      start_at: "2027-09-10T20:00:00+02:00",
    });
    const unrelated = event({
      id: "other",
      slug: "altro-evento",
      title: "Rassegna del Mare 2026",
      start_at: "2026-10-20T20:00:00+02:00",
    });

    expect(
      findNextEventEdition(
        event(),
        [expired, missingSlug, unrelated],
        NOW,
      ),
    ).toBeNull();
  });

  it("does not mutate candidates", () => {
    const candidates = [
      event({
        id: "later",
        slug: "festival-2027",
        title: "Festival del Mare 2027",
        start_at: "2027-08-10T20:00:00+02:00",
      }),
      event({
        id: "next",
        slug: "festival-2026",
        title: "Festival del Mare 2026",
        start_at: "2026-10-20T20:00:00+02:00",
      }),
    ];
    const original = structuredClone(candidates);

    findNextEventEdition(event(), candidates, NOW);

    expect(candidates).toEqual(original);
  });
});

