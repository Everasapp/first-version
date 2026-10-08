import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ExpiredEventNotice from "@/src/components/events/ExpiredEventNotice";

const BASE_PROPS = {
  municipality: "Sassari",
  cityPath: "/eventi/sassari",
  categoryLabel: "Musica e spettacoli",
  categoryPath: "/eventi/musica-concerti",
};

describe("ExpiredEventNotice", () => {
  it("explains the historical page and links to current stable landings", () => {
    const html = renderToStaticMarkup(
      createElement(ExpiredEventNotice, BASE_PROPS),
    );

    expect(html).toContain("Questo evento è terminato");
    expect(html).toContain('href="/eventi/sassari"');
    expect(html).toContain("Eventi attuali a Sassari");
    expect(html).toContain('href="/eventi/musica-concerti"');
    expect(html).toContain("Musica e spettacoli in Sardegna");
    expect(html).not.toContain("Nuova edizione disponibile");
  });

  it("links a verified newer edition when available", () => {
    const html = renderToStaticMarkup(
      createElement(ExpiredEventNotice, {
        ...BASE_PROPS,
        nextEdition: {
          slug: "festival-2027",
          title: "Festival 2027",
          date: "10 agosto 2027",
        },
      }),
    );

    expect(html).toContain("Nuova edizione disponibile");
    expect(html).toContain('href="/eventi/festival-2027"');
    expect(html).toContain("10 agosto 2027");
  });

  it("does not repeat Sardegna in an existing category label", () => {
    const html = renderToStaticMarkup(
      createElement(ExpiredEventNotice, {
        ...BASE_PROPS,
        categoryLabel: "Concerti in Sardegna",
      }),
    );

    expect(html).toContain("Concerti in Sardegna");
    expect(html).not.toContain("Concerti in Sardegna in Sardegna");
  });
});
