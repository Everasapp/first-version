import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { describe, expect, it } from "vitest";
import createNextConfig from "../../../next.config";
import { isLearningEvent } from "@/src/lib/learning-courses";
import { isPublicEventExpired } from "@/src/lib/eventActive";
import { categoryEventsPath } from "@/src/lib/seo/paths";
import { EVENT_SLUG_ALIASES, verifiedEventRedirectSlug } from "@/src/lib/seo/event-slug-aliases";

const nextConfig = createNextConfig(PHASE_DEVELOPMENT_SERVER);

describe("legacy event pages", () => {
  it("keeps a published non-learning card out of the course catalog", () => {
    const concert = { category: "musica-concerti", categories: ["musica-concerti"], subcategory: null };
    const course = { category: "workshop-corsi", subcategory: "imparare-arti" };
    expect(isLearningEvent(concert)).toBe(false);
    expect(isLearningEvent(course)).toBe(true);
  });

  it("marks a concluded event without inventing a new date", () => {
    expect(isPublicEventExpired("2024-06-01T18:00:00.000Z", "2024-06-01T21:00:00.000Z", new Date("2026-10-21T10:00:00.000Z"))).toBe(true);
  });

  it("redirects only a verified duplicate, in one hop", () => {
    expect(verifiedEventRedirectSlug("festa-del-gusto")).toBe("festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5");
    expect(verifiedEventRedirectSlug("festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5")).toBeNull();
    for (const [source, target] of Object.entries(EVENT_SLUG_ALIASES)) {
      expect(target).not.toBe(source);
      expect(EVENT_SLUG_ALIASES[target]).toBeUndefined();
    }
  });

  it("does not invent a redirect for an unknown slug", () => {
    expect(verifiedEventRedirectSlug("concerto-che-non-esiste")).toBeNull();
    expect(verifiedEventRedirectSlug("musica-concerti")).toBeNull();
  });

  it("does not send old hubs or unknown categories into the course catalog", async () => {
    const redirects = await nextConfig.redirects!();
    const sources = redirects.map((redirect) => redirect.source);
    expect(sources).not.toContain("/eventi-oggi");
    expect(sources).not.toContain("/eventi-sardegna/:path*");
    expect(sources).not.toContain("/eventi/spettacoli");
    expect(redirects.some((redirect) => redirect.destination === "/imparare-e-fare-in-sardegna")).toBe(false);
    expect(categoryEventsPath("ceramica")).toContain("/imparare-e-fare-in-sardegna?disciplina=ceramica");
    expect(categoryEventsPath("musica-concerti")).toBe("/eventi/musica-concerti");
  });
});
