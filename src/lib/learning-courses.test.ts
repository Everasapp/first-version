import { describe, expect, it } from "vitest";
import { isLearningEvent, learningAreaForTopic } from "./learning-courses";

describe("learning-only public catalog", () => {
  it("excludes ordinary concerts, festivals and other events", () => {
    for (const category of ["musica-concerti", "sagre-tradizioni", "sport-competizioni", "arte-cultura"]) {
      expect(isLearningEvent({ category, categories: [category] })).toBe(false);
    }
  });

  it("requires a reviewed classification even if an old event has a course tag", () => {
    expect(isLearningEvent({ category: "workshop-corsi" })).toBe(false);
    expect(isLearningEvent({ category: "arte-cultura", categories: ["arte-cultura", "workshop-corsi"] })).toBe(false);
    expect(isLearningEvent({ category: "workshop-corsi", subcategory: "imparare-arti" })).toBe(true);
  });

  it("keeps editorial learning classifications without relying on a title", () => {
    expect(isLearningEvent({ category: "arte-cultura", subcategory: "imparare-arti" })).toBe(true);
    expect(isLearningEvent({ category: "business-networking", subcategory: "imparare-impresa" })).toBe(true);
    expect(isLearningEvent({ subcategory: "imparare-non-verificato" })).toBe(false);
  });

  it("keeps ceramics and creative activities out of professional training", () => {
    expect(learningAreaForTopic("imparare-arti")).toBe("corsi-workshop");
  });

  it("distinguishes the purpose of language courses", () => {
    expect(learningAreaForTopic("imparare-lingue")).toBe("corsi-workshop");
    expect(learningAreaForTopic("imparare-lingue-lavoro")).toBe("formazione");
    expect(learningAreaForTopic(null)).toBeUndefined();
  });
});
