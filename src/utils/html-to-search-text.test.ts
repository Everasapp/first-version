import { describe, expect, it } from "vitest";

import { htmlToSearchText } from "@/src/utils/html-to-search-text";
import {
  areaToSlug,
  eventMatchesQuery,
  findNearestCity,
} from "@/src/utils/nearby-city";

const categoryNameBySlug = new Map<string, string>([
  ["musica-concerti", "Musica e spettacoli"],
  ["sagre-tradizioni", "Sagre e tradizioni"],
]);

function event(
  overrides: Partial<{
    title: string;
    description: string | null;
    category: string | null;
    categories: string[] | null;
    municipality: string | null;
    location_name: string | null;
  }> = {},
) {
  return {
    title: "Concerto a Sassari",
    description: null as string | null,
    category: "musica-concerti",
    categories: ["musica-concerti"] as string[] | null,
    municipality: "Sassari",
    location_name: "Teatro Civico",
    ...overrides,
  };
}

describe("htmlToSearchText", () => {
  it("1. plain text without HTML", () => {
    expect(htmlToSearchText("Sagra del pane a Bonorva")).toBe(
      "Sagra del pane a Bonorva",
    );
  });

  it("2. nested paragraphs and tags", () => {
    expect(
      htmlToSearchText(
        "<p>Il <strong>festival</strong> torna a <em>Tempio</em>.</p><p>Ingresso libero.</p>",
      ),
    ).toBe("Il festival torna a Tempio. Ingresso libero.");
  });

  it("3. br tags become separators", () => {
    expect(htmlToSearchText("Nord<br>Centro<br/>Sud")).toBe(
      "Nord Centro Sud",
    );
  });

  it("4. lists", () => {
    expect(
      htmlToSearchText(
        "<ul><li>Musica</li><li>Cibo tipico</li><li>Ballu tundu</li></ul>",
      ),
    ).toBe("Musica Cibo tipico Ballu tundu");
  });

  it("5. strips script and style content", () => {
    expect(
      htmlToSearchText(
        "<p>Visibile</p><script>alert('x')</script><style>.x{color:red}</style><p>Ok</p>",
      ),
    ).toBe("Visibile Ok");
  });

  it("6. common named entities", () => {
    expect(
      htmlToSearchText(
        "Cagliari&nbsp;&amp;&nbsp;&quot;Poetto&quot; &#39;sera&#39; &apos;festa&apos; 3&lt;5 &gt;2",
      ),
    ).toBe('Cagliari & "Poetto" \'sera\' \'festa\' 3<5 >2');
  });

  it("7. decimal and hex numeric entities", () => {
    expect(htmlToSearchText("Caf&#233; &#x1F3B5;")).toBe("Café 🎵");
  });

  it("8. collapses spaces and newlines", () => {
    expect(
      htmlToSearchText("<p>Uno</p>\n\n<p>  Due   \t Tre</p>"),
    ).toBe("Uno Due Tre");
  });

  it("9. empty, null and undefined", () => {
    expect(htmlToSearchText("")).toBe("");
    expect(htmlToSearchText("   ")).toBe("");
    expect(htmlToSearchText(null)).toBe("");
    expect(htmlToSearchText(undefined)).toBe("");
  });

  it("10. representative malformed markup", () => {
    expect(
      htmlToSearchText(
        "<p>Aperitivo a <b>Olbia<div>marina</b> aperta</p>",
      ),
    ).toContain("Aperitivo a Olbia");
    expect(
      htmlToSearchText("<p>Aperitivo a <b>Olbia<div>marina</b> aperta</p>"),
    ).toContain("marina");
  });

  it("real Everas-like description with city only in HTML body", () => {
    const html = `
      <p>Una serata di musica dal vivo nel cuore di <strong>Alghero</strong>.</p>
      <p>Info: biglietti sul posto.&nbsp;Inizio ore 21.</p>
    `;
    const text = htmlToSearchText(html);
    expect(text.toLocaleLowerCase("it")).toContain("alghero");
    expect(text).toContain("biglietti sul posto.");
    expect(text).not.toMatch(/<[^>]+>/);
  });
});

describe("eventMatchesQuery with htmlToSearchText", () => {
  it("11. matches city name found only in HTML description", () => {
    const row = event({
      title: "Serata jazz",
      municipality: "Cagliari",
      description:
        "<p>Ospite speciale dal porto di <em>Portoscuso</em>.</p>",
    });
    expect(eventMatchesQuery(row, "Portoscuso", categoryNameBySlug)).toBe(
      true,
    );
  });

  it("12. matches search term split across tags", () => {
    const row = event({
      title: "Festa",
      description: "<p>Ballu <strong>tundu</strong> in piazza</p>",
    });
    expect(eventMatchesQuery(row, "ballu tundu", categoryNameBySlug)).toBe(
      true,
    );
  });

  it("13. title, city and description matching unchanged", () => {
    const row = event({
      title: "Genera Festival Sassari",
      municipality: "Sassari",
      description: "<p>Cinque giorni tra Sassari e Alghero.</p>",
    });
    expect(eventMatchesQuery(row, "Genera", categoryNameBySlug)).toBe(true);
    expect(eventMatchesQuery(row, "Sassari", categoryNameBySlug)).toBe(true);
    expect(eventMatchesQuery(row, "Alghero", categoryNameBySlug)).toBe(true);
    expect(eventMatchesQuery(row, "Nuoro", categoryNameBySlug)).toBe(false);
  });

  it("14. event without description still matches title/city", () => {
    const row = event({ description: null });
    expect(eventMatchesQuery(row, "Sassari", categoryNameBySlug)).toBe(true);
    expect(eventMatchesQuery(row, "Concerto", categoryNameBySlug)).toBe(true);
    expect(eventMatchesQuery(row, "inesistente", categoryNameBySlug)).toBe(
      false,
    );
  });

  it("15. does not mutate input events", () => {
    const row = event({
      description: "<p>Mostra a <b>Nuoro</b></p>",
    });
    const snapshot = structuredClone(row);
    eventMatchesQuery(row, "Nuoro", categoryNameBySlug);
    expect(row).toEqual(snapshot);
  });
});

describe("findNearestCity (Vicino a me)", () => {
  it("resolves Sassari coordinates to Nord", () => {
    const nearest = findNearestCity(40.7259, 8.5557);
    expect(nearest.city.toLocaleLowerCase("it")).toContain("sassari");
    expect(areaToSlug(nearest.area)).toBe("nord-sardegna");
  });

  it("resolves Cagliari coordinates to Sud", () => {
    const nearest = findNearestCity(39.2238, 9.1217);
    expect(nearest.city.toLocaleLowerCase("it")).toContain("cagliari");
    expect(areaToSlug(nearest.area)).toBe("sud-sardegna");
  });
});
