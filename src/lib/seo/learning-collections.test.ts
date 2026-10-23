import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { findLearningSeoPage, learningCollectionMonth, matchesLearningSeoPage } from "./learning-pages";
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
  it("combines English discipline and northern location without including unrelated courses", () => {
    const page = findLearningSeoPage("inglese-nord-sardegna")!;
    const english = { ...card, title: "Inglese base", category: "Lingue" };
    expect(matchesLearningSeoPage(english, page, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...english, municipality: "Online" }, page, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...english, title: "Spagnolo base" }, page, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...english, category: "Turismo", title: "Booking con inglese" }, page, now)).toBe(false);
  });
  it("keeps central, southern and Olbia collections geographically distinct", () => {
    for (const [slug, inside, outside] of [["centro-sardegna", "Nuoro", "Cagliari"], ["sud-sardegna", "Cagliari", "Sassari"], ["olbia", "Olbia", "Sassari"]]) {
      const page = findLearningSeoPage(slug)!;
      expect(matchesLearningSeoPage({ title: "Corso", municipality: inside }, page, now)).toBe(true);
      expect(matchesLearningSeoPage({ title: "Corso", municipality: outside }, page, now)).toBe(false);
    }
  });
  it("selects the administrative discipline in Formazione and links to the existing career guide", () => {
    const page = findLearningSeoPage("amministrazione-contabilita")!;
    const event = { ...card, category: "Amministrazione e contabilità", learningTopic: "imparare-professioni" };
    expect(matchesLearningSeoPage(event, page, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...event, category: "Lingue" }, page, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...event, learningTopic: "imparare-arti" }, page, now)).toBe(false);
    expect(page.relatedPath?.href).toBe("/idee-e-percorsi/diventare-addetto-amministrativo-contabile");
  });
  it("uses the course start, not its end, to group upcoming starts by month", () => {
    const october = findLearningSeoPage("in-partenza-questo-mese", now)!;
    const november = findLearningSeoPage("in-partenza-prossimo-mese", now)!;
    expect(matchesLearningSeoPage(card, november, now)).toBe(true);
    expect(matchesLearningSeoPage(card, october, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...card, startDate: "2026-10-28T09:00:00Z" }, october, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...card, startDate: "2026-10-01T09:00:00Z" }, october, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...card, startDate: "", scheduleMode: "enrollment" }, november, now)).toBe(false);
    expect(matchesLearningSeoPage({ ...card, startDate: "not-a-date" }, november, now)).toBe(false);
  });
  it("uses Rome midnight for both month boundaries and current-day inclusion", () => {
    const october = findLearningSeoPage("in-partenza-questo-mese", now)!;
    const november = findLearningSeoPage("in-partenza-prossimo-mese", now)!;
    expect(matchesLearningSeoPage({ ...card, startDate: "2026-10-31T23:15:00Z" }, november, now)).toBe(true);
    expect(matchesLearningSeoPage({ ...card, startDate: "2026-10-31T23:15:00Z" }, october, now)).toBe(false);
    const romeNovember = new Date("2026-10-31T23:30:00Z");
    expect(learningCollectionMonth(0, romeNovember).key).toBe("2026-11");
    expect(findLearningSeoPage("in-partenza-questo-mese", romeNovember)?.title).toContain("novembre 2026");
  });
  it("rolls month and year without requiring a new page or deploy", () => {
    const december = new Date("2026-12-20T12:00:00Z");
    expect(learningCollectionMonth(1, december)).toEqual({ key: "2027-01", label: "gennaio 2027" });
    const page = findLearningSeoPage("in-partenza-prossimo-mese", december)!;
    expect(page.title).toContain("gennaio 2027");
    expect(matchesLearningSeoPage({ ...card, startDate: "2027-01-10T10:00:00Z" }, page, december)).toBe(true);
    expect(matchesLearningSeoPage(card, page, december)).toBe(false);
  });
  it("renders month-specific metadata and orders the original course links chronologically", async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    loader.mockResolvedValue({ events: [card, { ...card, id: "early-course", eventId: "early", title: "Early course", startDate: "2026-11-02T09:00:00Z" }], error: null });
    const params = Promise.resolve({ slug: "in-partenza-prossimo-mese" });
    const metadata = await generateMetadata({ params });
    expect(metadata.title).toBe("Corsi in partenza a novembre 2026");
    expect(metadata.alternates?.canonical).toBe("/corsi/in-partenza-prossimo-mese");
    const html = renderToStaticMarkup(await LearningSeoLanding({ params }));
    expect(html.indexOf("/eventi/early-course")).toBeLessThan(html.indexOf(`/eventi/${slug}`));
    expect(html).toContain("Questo mese");
    expect(html).toContain("Il prossimo mese");
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
