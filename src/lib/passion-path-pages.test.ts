import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { EDITORIAL_LEARNING_PATHS, NEW_PASSION_PATHS, PASSION_PATH } from "./editorial-learning-paths";
import { learningDisciplines } from "../data/learning-disciplines";
import EditorialPathCards from "../components/seo/EditorialPathCards";
import PassionIndexPage from "../../app/idee-e-percorsi/per-passione/page";
import PassionGuidePage, { generateMetadata, generateStaticParams } from "../../app/idee-e-percorsi/per-passione/[slug]/page";

vi.mock("@/src/components/home/Header", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
const props = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("passion collection and guides", () => {
  it("lists all guides, preserving the three existing cultural URLs", () => {
    const html = renderToStaticMarkup(createElement(PassionIndexPage));
    expect(html.match(/<article\b/g)).toHaveLength(EDITORIAL_LEARNING_PATHS.length);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const guide of EDITORIAL_LEARNING_PATHS) expect(html).toContain(guide.path);
    expect(html).toContain("/cultura/giuseppe-biasi-pittore-sardegna");
  });
  it("shows new previews on the homepage", () => {
    const html = renderToStaticMarkup(createElement(EditorialPathCards, { featured: true }));
    expect(html.match(/<article\b/g)).toHaveLength(3);
    for (const guide of NEW_PASSION_PATHS.slice(0, 3)) expect(html).toContain(guide.path);
  });
  it.each(generateStaticParams().map(({ slug }) => [slug]))("renders the exercise, existing image and canonical URL for %s", async (slug) => {
    const guide = NEW_PASSION_PATHS.find((guide) => guide.path === `${PASSION_PATH}/${slug}`)!;
    expect(existsSync(path.join(process.cwd(), "public", guide.image.src))).toBe(true);
    const html = renderToStaticMarkup(await PassionGuidePage(props(slug)));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('id="prova-e-approfondisci"');
    expect(html).toContain(guide.image.src);
    expect(html).toContain("disciplina=");
    expect((await generateMetadata(props(slug))).alternates?.canonical).toBe(guide.path);
    for (const link of guide.links) {
      const discipline = new URL(link.href, "https://www.everas.it").searchParams.get("disciplina");
      expect(learningDisciplines.some((item) => item.slug === discipline)).toBe(true);
    }
  });
  it("rejects unknown guide URLs instead of redirecting them to a generic page", async () => {
    await expect(PassionGuidePage(props("inesistente"))).rejects.toThrow("NOT_FOUND");
    await expect(generateMetadata(props("inesistente"))).rejects.toThrow("NOT_FOUND");
  });
});
