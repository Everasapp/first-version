import { describe, expect, it } from "vitest";
import { CAREER_CHANGE_DETAILS } from "./career-change-details";
import { CAREER_LEARNING_PATHS } from "./career-learning-paths";

describe("career change editorial coverage", () => {
  it("provides a concrete project and job search guidance for every published path", () => {
    expect(Object.keys(CAREER_CHANGE_DETAILS).sort()).toEqual(CAREER_LEARNING_PATHS.map(p => p.slug).sort());
    for (const path of CAREER_LEARNING_PATHS) {
      const details = CAREER_CHANGE_DETAILS[path.slug];
      expect(details.jobTerms.length).toBeGreaterThanOrEqual(2);
      expect(details.project.task.length).toBeGreaterThan(60);
      expect(details.project.check.length).toBeGreaterThan(30);
      expect(details.project.cvExample.length).toBeGreaterThan(30);
    }
  });
});
