import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DECISION_GUIDES, decisionGuideUrl } from "./career-decision-guides";
import Page, { generateMetadata, generateStaticParams } from "../../app/idee-e-percorsi/guide/[slug]/page";
vi.mock("@/src/components/home/Header", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));

describe("decision guides", () => {
  it("generates five unique guide routes", () => {
    expect(generateStaticParams()).toHaveLength(5);
    expect(new Set(generateStaticParams().map(p => p.slug)).size).toBe(5);
  });
  it.each(DECISION_GUIDES)("renders complete, accessible editorial content: $slug", async guide => {
    const props = {params: Promise.resolve({slug: guide.slug})};
    const html = renderToStaticMarkup(await Page(props));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('id="checklist"');
    expect(html).toContain('id="esercizio"');
    expect(html).toContain('/idee-e-percorsi');
    expect(guide.sections).toHaveLength(5);
    expect(guide.sources.length).toBeGreaterThan(0);
    expect((await generateMetadata(props)).alternates?.canonical).toBe(decisionGuideUrl(guide.slug));
    expect(html).not.toContain('undefined');
  });
  it("rejects unknown guides", async () => {
    const props = {params: Promise.resolve({slug: "missing"})};
    await expect(Page(props)).rejects.toThrow("NOT_FOUND");
    await expect(generateMetadata(props)).rejects.toThrow("NOT_FOUND");
  });
});
