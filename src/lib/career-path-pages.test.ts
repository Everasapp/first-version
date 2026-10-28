import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CAREER_LEARNING_PATHS, careerPathUrl } from "./career-learning-paths";
import { loadHomeEventRows } from "./home/load-events";
import CareerPathPage, { generateMetadata, generateStaticParams } from "../../app/idee-e-percorsi/[slug]/page";
import CareerPathCards from "../components/seo/CareerPathCards";
import IdeasPage from "../../app/idee-e-percorsi/page";

vi.mock("./home/load-events", () => ({ loadHomeEventRows: vi.fn() }));
vi.mock("@/src/components/home/Header", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));

const loadRows = vi.mocked(loadHomeEventRows);
const path = CAREER_LEARNING_PATHS[0];
const props = (slug: string) => ({ params: Promise.resolve({ slug }) });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-23T12:00:00Z"));
  loadRows.mockReset().mockResolvedValue({ rows: [], error: null });
});
afterEach(() => vi.useRealTimers());

describe("career guide routes", () => {
  it("rejects an unknown guide before touching the catalogue", async () => {
    await expect(CareerPathPage(props("not-a-guide"))).rejects.toThrow("NOT_FOUND");
    await expect(generateMetadata(props("not-a-guide"))).rejects.toThrow("NOT_FOUND");
    expect(loadRows).not.toHaveBeenCalled();
  });
  it("has unique route params and canonical URLs", async () => {
    const params = generateStaticParams();
    expect(new Set(params.map((p) => p.slug)).size).toBe(CAREER_LEARNING_PATHS.length);
    for (const { slug } of params) {
      expect((await generateMetadata(props(slug))).alternates?.canonical).toBe(careerPathUrl(slug));
    }
    expect(loadRows).not.toHaveBeenCalled();
  });
  it.each(CAREER_LEARNING_PATHS.map((path) => [path.slug]))("renders an evergreen guide with one H1 and course fallback: %s", async (slug) => {
    const html = renderToStaticMarkup(await CareerPathPage(props(slug)));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain("Al momento non ci sono corsi");
    expect(html).toContain('id="progetto"');
    expect(html).toContain('id="cambio-carriera"');
    expect(html).toContain('id="prima-candidatura"');
    expect(html).toContain('id="cercare-lavoro"');
    expect(html).toContain('id="fonti-title"');
    expect(loadRows).toHaveBeenCalledTimes(1);
  });
  it("distinguishes a catalogue failure from no upcoming editions", async () => {
    loadRows.mockResolvedValue({ rows: [], error: { message: "service unavailable" } });
    const html = renderToStaticMarkup(await CareerPathPage(props(path.slug)));
    expect(html).toContain("temporaneamente non disponibili");
    expect(html).not.toContain("Al momento non ci sono corsi");
    expect(html).not.toContain("service unavailable");
  });
  it("renders a real course link, current price and editorial coverage", async () => {
    loadRows.mockResolvedValue({ rows: [{ id: "test", slug: path.courses[0].slug, title: "Edizione di prova", category: "amministrazione-contabilita", province: null, municipality: "Online", location_name: null, start_at: "2026-11-02T08:00:00Z", end_at: null, image_url: null, is_free: true, price_from: 150, is_featured: false }], error: null });
    const html = renderToStaticMarkup(await CareerPathPage(props(path.slug)));
    expect(html).toContain(`/eventi/${path.courses[0].slug}`);
    expect(html).toContain("Da €150,00");
    expect(html).toContain("Cosa può coprire");
    expect(html).not.toContain("Al momento non ci sono corsi");
  });
  it("retains the three cultural guides on the index alongside the six career guides", () => {
    const html = renderToStaticMarkup(createElement(IdeasPage));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const path of CAREER_LEARNING_PATHS) expect(html).toContain(careerPathUrl(path.slug));
    expect(html).toContain("/cultura-sarda/nord-sardegna/sassari");
    expect(html).toContain("/cultura/giuseppe-biasi-pittore-sardegna");
    expect(html).toContain("/cultura/artigianato-sardo");
    expect(loadRows).not.toHaveBeenCalled();
  });
  it("shows all career paths in the homepage carousel", () => {
    const html = renderToStaticMarkup(createElement(CareerPathCards, { featured: true }));
    expect(html.match(/<article\b/g)).toHaveLength(CAREER_LEARNING_PATHS.length);
    expect(loadRows).not.toHaveBeenCalled();
  });
});
