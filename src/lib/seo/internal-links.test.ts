import { describe, expect, it } from "vitest";

import { eventContextLinks } from "@/src/lib/seo/internal-links";

const REFERENCE_DATE = new Date("2026-10-08T12:00:00Z");

describe("eventContextLinks", () => {
  it("links an event to city, category, event month, weekend and main hub", () => {
    expect(
      eventContextLinks(
        {
          municipality: "Santa Maria Coghinas",
          categorySlug: "musica-concerti",
          categoryLabel: "Musica e spettacoli",
          startAt: "2026-10-17T19:00:00+02:00",
        },
        REFERENCE_DATE,
      ),
    ).toEqual([
      {
        href: "/eventi/santa-maria-coghinas",
        label: "Eventi a Santa Maria Coghinas",
      },
      {
        href: "/eventi/musica-concerti",
        label: "Musica e spettacoli in Sardegna",
      },
      {
        href: "/eventi-sardegna/ottobre-2026",
        label: "Eventi Sardegna ottobre 2026",
      },
      {
        href: "/eventi-weekend",
        label: "Eventi Sardegna questo weekend",
      },
      {
        href: "/eventi-sardegna",
        label: "Tutti gli eventi in Sardegna",
      },
    ]);
  });

  it("uses the Europe/Rome civil month at the UTC boundary", () => {
    const links = eventContextLinks(
      {
        municipality: "Cagliari",
        categorySlug: "arte-cultura",
        categoryLabel: "Arte e cultura",
        startAt: "2026-09-30T22:30:00Z",
      },
      REFERENCE_DATE,
    );

    expect(links[2]).toEqual({
      href: "/eventi-sardegna/ottobre-2026",
      label: "Eventi Sardegna ottobre 2026",
    });
  });

  it("omits a month landing when the event date is invalid", () => {
    const links = eventContextLinks(
      {
        municipality: "Nuoro",
        categorySlug: "sagre-tradizioni",
        categoryLabel: "Sagre e tradizioni",
        startAt: "invalid",
      },
      REFERENCE_DATE,
    );

    expect(links).toHaveLength(4);
    expect(links.some((link) => link.href.includes("ottobre-2026"))).toBe(false);
  });

  it("omits unsupported historical month landings", () => {
    const links = eventContextLinks(
      {
        municipality: "Sassari",
        categorySlug: "musica-concerti",
        categoryLabel: "Musica e spettacoli",
        startAt: "2025-08-10T21:00:00+02:00",
      },
      REFERENCE_DATE,
    );

    expect(links).toHaveLength(4);
    expect(links.some((link) => link.href.includes("agosto-2025"))).toBe(false);
  });

  it("does not repeat Sardegna in category labels", () => {
    const links = eventContextLinks(
      {
        municipality: "Selargius",
        categorySlug: "musica-concerti",
        categoryLabel: "Concerti in Sardegna",
        startAt: "2026-10-10T21:00:00+02:00",
      },
      REFERENCE_DATE,
    );

    expect(links[1]?.label).toBe("Concerti in Sardegna");
  });
});
