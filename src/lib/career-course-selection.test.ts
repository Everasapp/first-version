import { describe, expect, it } from "vitest";
import { CAREER_LEARNING_PATHS } from "./career-learning-paths";
import { selectCareerCourses } from "./career-course-selection";
import type { HomeEventRow } from "./home/load-events";

const now = Date.parse("2026-10-23T12:00:00Z");
const path = CAREER_LEARNING_PATHS.find((p) => p.slug === "diventare-addetto-paghe-personale")!;
function row(overrides: Partial<HomeEventRow> = {}): HomeEventRow {
  return { id: "course", slug: path.courses[0].slug, title: "Corso pubblicato", category: "risorse-umane", province: null, municipality: "Online", location_name: null, start_at: "2026-10-28T08:00:00Z", end_at: "2026-12-01T12:00:00Z", image_url: null, is_free: true, price_from: 0, is_featured: false, ...overrides };
}

describe("career course selection from the published learning cache", () => {
  it("keeps coverage and sorts alternative editions by start date", () => {
    const later = row({ slug: path.courses[1].slug, start_at: "2026-11-04T08:00:00Z" });
    const result = selectCareerCourses(path, [later, row()], now);
    expect(result.map(({ course }) => course.slug)).toEqual([path.courses[0].slug, path.courses[1].slug]);
    expect(result[0].association).toEqual(path.courses[0]);
  });
  it("does not infer a match from a title or category", () => {
    expect(selectCareerCourses(path, [row({ slug: "unrelated-course", title: "Paghe e contributi" })], now)).toEqual([]);
  });
  it.each([
    { start_at: "2026-10-01T08:00:00Z" },
    { start_at: "2026-10-23T12:00:00Z" },
    { start_at: "invalid" },
    { end_at: "invalid" },
    { end_at: "2026-10-27T12:00:00Z" },
  ])("hides started classes and invalid intervals: %j", (overrides) => {
    expect(selectCareerCourses(path, [row(overrides)], now)).toEqual([]);
  });
  it("allows a future course without an invented end date", () => {
    expect(selectCareerCourses(path, [row({ end_at: null })], now)).toHaveLength(1);
  });
  it("handles removed editions and duplicate cache rows without duplicate cards", () => {
    expect(selectCareerCourses(path, [], now)).toEqual([]);
    expect(selectCareerCourses(path, [row(), row()], now)).toHaveLength(1);
  });
});

it("includes an enrollment course without inventing dates", () => {
 expect(selectCareerCourses(path, [row({schedule_mode: "enrollment", start_at: null, end_at: null})], now)).toHaveLength(1);
});
