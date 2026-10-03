import { afterEach, describe, expect, it, vi } from "vitest";
import { extractEventFromUrl } from "./event-page-extractor";

afterEach(() => vi.unstubAllGlobals());

describe("event page extraction", () => {
  it("imports a Jazzino-style JSON-LD event with the right city and Rome time", async () => {
    const event = {
      "@context": "https://schema.org", "@type": "Event", name: "Mina & Mia",
      startDate: "2026-10-31T20:45:00.000Z", endDate: "2026-10-31T20:45:00.000Z",
      description: "Erica Loi rende omaggio a Mina e Mia Martini con una formazione di cinque musicisti. Il concerto si tiene al Jazzino di Cagliari e comprende un repertorio dedicato alle due interpreti della musica italiana.",
      location: { "@type": "Place", name: "Jazzino", address: "Via Carloforte 74, 09123 Cagliari" },
      image: "https://example.org/concerto.jpg",
    };
    const html = `<html><head><title>Mina & Mia | Jazzino</title><script type="application/ld+json">${JSON.stringify(event)}</script></head><body><h1>Mina & Mia</h1><p>${event.description}</p><!-- ${"Page layout ".repeat(250)} --></body></html>`;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(html, { headers: { "content-type": "text/html" } })));
    const result = await extractEventFromUrl("https://example.org/concerto");
    expect(result.ok, JSON.stringify(result)).toBe(true);
    expect(result.draft?.municipality.value).toBe("Cagliari");
    expect(result.draft?.province.value).toBe("CA");
    expect(result.draft?.startDate.value).toBe("2026-10-31");
    expect(result.draft?.startTime.value).toBe("21:45");
    expect(result.draft?.endDate.value).toBeNull();
    expect(result.draft?.endTime.value).toBeNull();
  });

  it("maps an Arbatax venue to Tortolì", async () => {
    const event = { "@type": "Event", name: "Festa della sicurezza a Cala Genovesi", startDate: "2026-10-03T17:00:00+02:00", location: { "@type": "Place", name: "Cala Genovesi, Arbatax" }, description: "Un appuntamento in piazza con attività e incontri per il pubblico, dedicato alla sicurezza e alla prevenzione. Il programma si svolge a Cala Genovesi ad Arbatax e riunisce la comunità con iniziative informative e divulgative." };
    const html = `<html><head><title>Festa della sicurezza</title><script type="application/ld+json">${JSON.stringify(event)}</script></head><body><h1>${event.name}</h1><p>${event.description}</p><!-- ${"Page layout ".repeat(250)} --></body></html>`;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(html, { headers: { "content-type": "text/html" } })));
    const result = await extractEventFromUrl("https://example.org/festa");
    expect(result.ok, JSON.stringify(result)).toBe(true);
    expect(result.draft?.municipality.value).toBe("Tortolì");
    expect(result.draft?.province.value).toBe("NU");
  });
});
