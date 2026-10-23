import { describe, expect, it } from "vitest";
import { learningDisciplines } from "@/src/data/learning-disciplines";
import {
  disciplinesFromLegacyCategory,
  MAX_NEWSLETTER_DISCIPLINES,
  NEWSLETTER_ZONES,
  resolveStoredNewsletterPreferences,
  sanitizeNewsletterSelection,
  selectNewsletterCourses,
  type NewsletterCourse,
} from "@/src/lib/newsletter-preferences";

function course(
  id: string,
  municipality: string,
  discipline: string,
  title = `Corso ${id}`,
): NewsletterCourse {
  return {
    id,
    title,
    municipality,
    category: discipline,
    categories: [discipline],
  };
}

const catalog = [
  course("nord-musica", "Sassari", "musica"),
  course("nord-lingue", "Alghero", "lingue"),
  course("centro-cucina", "Nuoro", "cucina"),
  course("sud-pittura", "Cagliari", "pittura-disegno"),
  course("sud-musica", "Cagliari", "musica"),
  course("copia", "Cagliari", "musica", "Copia di corso"),
];

const fiveDisciplines = learningDisciplines.slice(0, 5).map((item) => item.slug);
const sixth = learningDisciplines[5]?.slug ?? "";

describe("newsletter zone and discipline selection", () => {
  it("accepts one, two and three zones", () => {
    expect(sanitizeNewsletterSelection([NEWSLETTER_ZONES[0]], ["musica"]).ok).toBe(true);
    expect(
      sanitizeNewsletterSelection([NEWSLETTER_ZONES[0], NEWSLETTER_ZONES[1]], ["musica"]).ok,
    ).toBe(true);
    const all = sanitizeNewsletterSelection([...NEWSLETTER_ZONES], ["musica"]);
    expect(all.ok).toBe(true);
    if (all.ok) expect(all.selection.areas).toHaveLength(3);
  });

  it("accepts from one to five disciplines and rejects a sixth", () => {
    for (let count = 1; count <= MAX_NEWSLETTER_DISCIPLINES; count += 1) {
      const result = sanitizeNewsletterSelection(
        ["Nord Sardegna"],
        fiveDisciplines.slice(0, count),
      );
      expect(result.ok).toBe(true);
    }
    const tooMany = sanitizeNewsletterSelection(
      ["Nord Sardegna"],
      [...fiveDisciplines, sixth],
    );
    expect(tooMany.ok).toBe(false);
  });

  it("drops duplicate zones and disciplines", () => {
    const result = sanitizeNewsletterSelection(
      ["Nord Sardegna", "Nord Sardegna"],
      ["musica", "musica"],
    );
    expect(result).toEqual({
      ok: true,
      selection: { areas: ["Nord Sardegna"], disciplines: ["musica"] },
    });
  });

  it("allows a later change of the saved preferences", () => {
    const first = sanitizeNewsletterSelection(["Nord Sardegna"], ["musica"]);
    const next = sanitizeNewsletterSelection(
      ["Nord Sardegna", "Sud Sardegna"],
      ["pittura-disegno"],
    );
    expect(first.ok && next.ok).toBe(true);
    if (first.ok && next.ok) {
      expect(next.selection).not.toEqual(first.selection);
    }
  });

  it("converts a stored city and a recognizable category without dropping the subscriber", () => {
    expect(
      resolveStoredNewsletterPreferences({
        city: "Sassari",
        category: "musica-concerti",
      }),
    ).toEqual({ areas: ["Nord Sardegna"], disciplines: ["musica"] });
    expect(disciplinesFromLegacyCategory("arte-cultura")).toEqual([]);
    expect(
      resolveStoredNewsletterPreferences({
        city: "Cagliari",
        category: "",
      }).areas,
    ).toEqual(["Sud Sardegna"]);
    expect(
      resolveStoredNewsletterPreferences({
        city: null,
        municipality: null,
        province: null,
        category: null,
      }),
    ).toEqual({ areas: [...NEWSLETTER_ZONES], disciplines: [] });
  });

  it("keeps courses from every selected zone and discipline, once each", () => {
    const oneZone = selectNewsletterCourses(catalog, ["Nord Sardegna"], ["musica"]);
    expect(oneZone.map((event) => event.id)).toEqual(["nord-musica"]);

    const twoZones = selectNewsletterCourses(
      catalog,
      ["Nord Sardegna", "Sud Sardegna"],
      ["musica", "pittura-disegno"],
    );
    expect(twoZones.map((event) => event.id)).toEqual([
      "nord-musica",
      "sud-pittura",
      "sud-musica",
    ]);

    const threeZones = selectNewsletterCourses(
      catalog,
      [...NEWSLETTER_ZONES],
      ["musica", "cucina", "lingue", "pittura-disegno"],
    );
    expect(new Set(threeZones.map((event) => event.id)).size).toBe(threeZones.length);
    expect(threeZones.map((event) => event.id)).toEqual([
      "nord-musica",
      "nord-lingue",
      "centro-cucina",
      "sud-pittura",
      "sud-musica",
    ]);
  });

  it("does not repeat a course that matches more than one discipline", () => {
    const shared = course("condiviso", "Cagliari", "musica");
    shared.categories = ["musica", "lingue"];
    const selected = selectNewsletterCourses(
      [shared, shared],
      ["Sud Sardegna"],
      ["musica", "lingue"],
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]?.id).toBe("condiviso");
  });

  it("still includes an existing subscriber whose old category has no discipline", () => {
    const preferences = resolveStoredNewsletterPreferences({
      city: "Nuoro",
      category: "arte-cultura",
    });
    const selected = selectNewsletterCourses(catalog, preferences.areas, preferences.disciplines);
    expect(preferences.disciplines).toEqual([]);
    expect(selected.map((event) => event.id)).toEqual(["centro-cucina"]);
  });
});
