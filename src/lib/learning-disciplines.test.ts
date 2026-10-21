import { describe, expect, it } from "vitest";
import { categories } from "@/src/data/categories";
import { disciplinesForArea, isLearningDiscipline, retainDisciplinesForArea } from "@/src/data/learning-disciplines";
import { REVIEWED_COURSE_DISCIPLINES } from "@/src/data/reviewed-course-disciplines";
import { eventCategorySlugs, eventMatchesCategoryFilter, resolveCategoryLabels } from "./event-categories";
import { learningCardLabels } from "./learning-card-labels";
import { findCategoryBySlug } from "./seo/paths";

const ceramic = {
  slug: "ceramica-base-santa-teresa-gallura-2026-11-10",
  category: "workshop-corsi",
  categories: ["workshop-corsi"],
  subcategory: "imparare-arti",
};

describe("learning disciplines", () => {
  it("offers subjects rather than general events or course formats", () => {
    const slugs = categories.map((category) => category.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const retired of ["musica-concerti", "sagre-tradizioni", "fiere-mercatini", "workshop-corsi", "celebrazioni"]) {
      expect(slugs).not.toContain(retired);
    }
    expect(slugs).toContain("sicurezza-lavoro");
    expect(slugs).toContain("ceramica");
    expect(slugs).toContain("amministrazione-contabilita");
  });
  it("assigns a reviewed discipline to every one of the 41 published course URLs", () => {
    expect(Object.keys(REVIEWED_COURSE_DISCIPLINES)).toHaveLength(41);
    for (const [slug, disciplines] of Object.entries(REVIEWED_COURSE_DISCIPLINES)) {
      expect(disciplines.every(isLearningDiscipline)).toBe(true);
      expect(eventCategorySlugs({ slug, category: "workshop-corsi" })).toEqual(disciplines);
    }
  });
  it("resolves generic stored course tags and filters them without a database migration", () => {
    expect(resolveCategoryLabels(ceramic)).toEqual(["Ceramica"]);
    expect(eventMatchesCategoryFilter(ceramic, "ceramica")).toBe(true);
    expect(eventMatchesCategoryFilter(ceramic, "workshop-corsi")).toBe(true);
    expect(eventMatchesCategoryFilter(ceramic, "sicurezza-lavoro")).toBe(false);
    expect(resolveCategoryLabels({ slug: "contabilita-base-enti-locali-anci-tramatza-2026-11-05", category: "workshop-corsi" })).toEqual(["Amministrazione e contabilità"]);
  });
  it("keeps an editor's explicit subject ahead of the compatibility classification", () => {
    expect(eventCategorySlugs({ ...ceramic, categories: ["pittura-disegno", "workshop-corsi"] })).toEqual(["pittura-disegno"]);
  });
  it("keeps ceramics in enrichment and removes incompatible subjects when the purpose changes", () => {
    expect(disciplinesForArea("formazione").some((item) => item.slug === "ceramica")).toBe(false);
    expect(disciplinesForArea("corsi-workshop").some((item) => item.slug === "ceramica")).toBe(true);
    expect(retainDisciplinesForArea(["ceramica", "lingue"], "formazione")).toEqual(["lingue"]);
  });
  it("shows the macroarea and the actual subject without generic repetition", () => {
    expect(learningCardLabels({ learningTopic: "imparare-professioni", category: "Sicurezza sul lavoro", categories: ["Sicurezza sul lavoro"] })).toEqual(["Formazione", "Sicurezza sul lavoro"]);
    expect(learningCardLabels({ learningTopic: "imparare-professioni", category: "Workshop e corsi" })).toEqual(["Formazione"]);
    expect(learningCardLabels({ learningTopic: "imparare-arti", category: "Ceramica" })).toEqual(["Corsi e workshop", "Ceramica"]);
  });
  it("does not guess a discipline for an unreviewed course or prototype property", () => {
    expect(resolveCategoryLabels({ category: "workshop-corsi", subcategory: "imparare-professioni" })).toEqual(["Formazione"]);
    expect(eventCategorySlugs({ slug: "toString", category: "workshop-corsi" })).toEqual(["workshop-corsi"]);
  });
  it("keeps historical event labels and reserved URLs available", () => {
    expect(resolveCategoryLabels({ category: "musica-concerti" })).toEqual(["Musica e spettacoli"]);
    expect(findCategoryBySlug("musica-concerti")?.name).toBe("Musica e spettacoli");
    expect(findCategoryBySlug("ceramica")?.name).toBe("Ceramica");
  });
});
