import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import EventLocationDetails from "@/src/components/events/EventLocationDetails";
import EventContextLinks from "@/src/components/events/EventContextLinks";
import { isOnlineLocation } from "./course-location";
import { courseContextLinks } from "./seo/internal-links";
import { eventSchema } from "./seo/schema";

vi.stubGlobal("React", React);

const remote = {
  title: "Paghe online", municipality: "Online", province: "Online",
  location_name: "Online – aula virtuale in diretta", address: null,
  registrationUrl: "https://example.org/corso",
};
const classroom = {
  ...remote, municipality: "Cagliari", province: "CA",
  location_name: "Aula formativa", address: "Via Roma 1",
};

describe("course participation and location", () => {
  it("shows remote participation and registration, without a map or travel instructions", () => {
    const markup = renderToStaticMarkup(React.createElement(EventLocationDetails, remote));
    expect(markup).toContain("Come partecipare online");
    expect(markup).toContain(remote.registrationUrl);
    expect(markup).not.toMatch(/iframe|google.com\/maps|Come arrivare/);
    expect(markup).toContain("non sostituisce la candidatura");
  });

  it("does not invent an access link if none is published", () => {
    const markup = renderToStaticMarkup(React.createElement(EventLocationDetails, { ...remote, registrationUrl: null }));
    expect(markup).not.toContain("href=");
    expect(markup).toContain("indicazioni dell’organizzatore");
  });

  it("keeps maps for classroom courses and blended courses with a physical address", () => {
    for (const location_name of ["Aula formativa", "Online e in presenza", "Aula virtuale"]) {
      const course = { ...classroom, location_name };
      expect(isOnlineLocation(course)).toBe(false);
      const markup = renderToStaticMarkup(React.createElement(EventLocationDetails, course));
      expect(markup).toContain("Come arrivare");
      expect(markup).toContain("google.com/maps");
      expect(markup).toContain("Via Roma 1");
    }
  });

  it("recognizes explicit virtual locations even if the organizer has a real municipality", () => {
    expect(isOnlineLocation({ municipality: "Quartu Sant’Elena", location_name: remote.location_name })).toBe(true);
    expect(isOnlineLocation({ municipality: "Cagliari", location_name: "Corso con materiali online" })).toBe(false);
    expect(isOnlineLocation({ municipality: " online " })).toBe(true);
  });

  it("keeps online course discovery out of invented geographic event pages", () => {
    const links = courseContextLinks({ municipality: "Quartu Sant’Elena", categorySlug: "risorse-umane", categoryLabel: "Risorse umane", online: true });
    expect(links[0].href).toBe("/imparare-e-fare-in-sardegna?city=Online#ricerca");
    const markup = renderToStaticMarkup(React.createElement(EventContextLinks, { municipality: "Online", isCourse: true, online: true, links }));
    expect(markup).toContain("Altri corsi e percorsi utili");
    expect(markup).not.toMatch(/Eventi a Online|cosa fare a Online|eventi-weekend/);
    expect(courseContextLinks({ municipality: "Santa Teresa Gallura", categorySlug: "lingue", categoryLabel: "Lingue", online: false })[0].href)
      .toContain("city=Santa%20Teresa%20Gallura");
  });

  it("uses a virtual location in structured data and retains physical places for classroom courses", () => {
    const base = { name: "Corso", description: "Programma", startAt: "2026-11-03T09:00:00+01:00", url: "https://example.org/corso", isFree: true };
    const schema = eventSchema({ ...base, city: remote.municipality, locationName: remote.location_name });
    expect(schema.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(schema.location["@type"]).toBe("VirtualLocation");
    expect(schema.location).not.toHaveProperty("address");
    // No private lesson URL is known: never advertise the registration page as a meeting room.
    expect(schema.location).not.toHaveProperty("url");
    const physical = eventSchema({ ...base, city: classroom.municipality, locationName: classroom.location_name, address: classroom.address });
    expect(physical.location["@type"]).toBe("Place");
    expect(physical.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
  });
});
