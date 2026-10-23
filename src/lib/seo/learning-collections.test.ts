import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { findLearningSeoPage, matchesLearningSeoPage } from "./learning-pages";
import { getCourseDeadline } from "../course-registration-deadlines";
import type { EventCardData } from "@/src/components/home/EventCard";

const loader = vi.hoisted(() => vi.fn());
vi.mock("@/src/lib/seo/loadEvents", () => ({ loadFilteredPublishedEvents: loader }));
vi.mock("@/src/components/home/Header", () => ({ default: () => null }));
vi.mock("@/src/components/home/EventCard", () => ({
  default: ({ event }: { event: EventCardData }) => createElement("a", { href: `/eventi/${event.id}` }, event.title),
}));
import LearningSeoLanding, { generateMetadata } from "@/app/corsi/[slug]/page";

const now = new Date("2026-10-23T12:00:00Z");
const slug = "inglese-base-santa-teresa-gallura-2026-2027";
const closing = findLearningSeoPage("iscrizioni-in-scadenza")!;
const north = findLearningSeoPage("nord-sardegna")!;
const unemployed = findLearningSeoPage("per-disoccupati")!;
const card: EventCardData = {
  id: slug, eventId: "course-uuid", title: "Inglese base", municipality: "Santa Teresa Gallura",
  category: "Lingue", learningTopic: "imparare-lingue", location: "Santa Teresa Gallura",
  date: "11 novembre 2026", startDate: "2026-11-11T16:30:00Z", imageUrl: "/image.png", isFree: false,
};
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

describe("course collections", () => {
  it("recognizes a confirmed deadline without treating the course start as a deadline", () => {
    expect(matchesLearningSeoPage(card, closing, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...card, id: "unverified-course" }, closing, now)).toBe(false);
    expect(getCourseDeadline(slug, now)?.sourceUrl).toContain("comune.santateresagallura");
  });
  it("keeps the registration date inclusive in Rome and excludes it after midnight", () => {
    expect(getCourseDeadline(slug, new Date("2026-10-30T22:59:59.999Z"))).toBeDefined();
    expect(getCourseDeadline(slug, new Date("2026-10-30T23:00:00Z"))).toBeUndefined();
  });
  it("shows only the next 30 days, not distant deadlines", () => {
    expect(getCourseDeadline(slug, new Date("2026-09-01T12:00:00Z"))).toBeUndefined();
  });
  it("uses the city directory for northern locations and excludes online-only and southern courses", () => {
    for (const municipality of ["Sassari", "Olbia", "Alghero", "Santa Teresa Gallura"]) {
      expect(matchesLearningSeoPage({ title: "Corso", municipality }, north, now)).toBe(true);
    }
    for (const municipality of ["Online", "Cagliari", "Nuoro"]) {
      expect(matchesLearningSeoPage({ title: "Corso", municipality }, north, now)).toBe(false);
    }
  });
  it("keeps Sassari as a distinct city collection", () => {
    const city = findLearningSeoPage("sassari")!;
    expect(matchesLearningSeoPage({ title: "Corso", municipality: "Sassari" }, city, now)).toBe(true);
    expect(matchesLearningSeoPage({ title: "Corso", municipality: "Olbia" }, city, now)).toBe(false);
  });
  it("requires free professional training and explicit audience indicators", () => {
    const eligible = { title: "Operatore amministrativo GOL Skill Lab", learningTopic: "imparare-professioni", isFree: true };
    expect(matchesLearningSeoPage(eligible, unemployed, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...eligible, isFree: false }, unemployed, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...eligible, title: "Corso di Excel" }, unemployed, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...eligible, title: "Mongolfiere", learningTopic: "imparare-professioni" }, unemployed, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...eligible, learningTopic: "imparare-arti" }, unemployed, now)).toBe(false);
  });
  it("uses the original course URL and renders official deadline evidence", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    loader.mockResolvedValue({ events: [card, { ...card, id: "unknown", eventId: "other", title: "Excluded course" }], error: null });
    const html = renderToStaticMarkup(await LearningSeoLanding({ params: Promise.resolve({ slug: closing.slug }) }));
    expect(html).toContain(`/eventi/${slug}`);
    expect(html).toContain("Iscrizioni entro il 30 ottobre 2026");
    expect(html).toContain("Orario limite non pubblicato");
    expect(html).toContain(getCourseDeadline(slug, now)!.sourceUrl);
    expect(html).not.toContain("Excluded course");
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(loader).toHaveBeenCalledWith({ learningOnly: true });
  });
  it("marks empty deadline collections noindex and explains that other courses may still accept applications", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-31T10:00:00Z"));
    loader.mockResolvedValue({ events: [card], error: null });
    const params = Promise.resolve({ slug: closing.slug });
    const metadata = await generateMetadata({ params });
    expect(metadata.robots).toEqual({ index: false, follow: true });
    const html = renderToStaticMarkup(await LearningSeoLanding({ params }));
    expect(html).not.toContain(`/eventi/${slug}`);
    expect(html).toContain("Questo non significa che le iscrizioni agli altri corsi siano chiuse");
  });
  it("keeps populated collections indexable with the existing canonical route", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    loader.mockResolvedValue({ events: [card], error: null });
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: closing.slug }) });
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("/corsi/iscrizioni-in-scadenza");
  });
});
