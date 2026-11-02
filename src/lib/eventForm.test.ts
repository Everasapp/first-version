import { describe, expect, it } from "vitest";
import {
  attendanceModeForMunicipality,
  isOnlineMunicipality,
  isValidTicketUrl,
  normalizeTicketUrl,
  parsePrice,
  placeFieldsForSave,
  placeValidationErrors,
} from "./eventForm";

describe("parsePrice", () => {
  it.each(["15", "15,00", "15.00", "187", "€ 15,00", "15,50"])(
    "accepts %s",
    (value) => {
      expect(parsePrice(value)).toBeGreaterThan(0);
    },
  );

  it("keeps the numeric amount", () => {
    expect(parsePrice("15")).toBe(15);
    expect(parsePrice("15,00")).toBe(15);
    expect(parsePrice("15.00")).toBe(15);
    expect(parsePrice("187")).toBe(187);
    expect(parsePrice("1.500,50")).toBe(1500.5);
  });

  it("rejects empty and zero prices", () => {
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("0")).toBeNull();
    expect(parsePrice("0,00")).toBeNull();
  });
});

describe("online attendance", () => {
  it("recognizes only the Online municipality", () => {
    expect(isOnlineMunicipality("Online")).toBe(true);
    expect(isOnlineMunicipality(" Online ")).toBe(true);
    expect(isOnlineMunicipality("online")).toBe(false);
    expect(attendanceModeForMunicipality("Online")).toBe("online");
    expect(attendanceModeForMunicipality("Sassari")).toBe("in_person");
  });

  it("does not require area or city for an online course", () => {
    expect(
      placeValidationErrors({
        attendance: "online",
        area: "",
        city: "",
        venue: "",
      }),
    ).toEqual({});
  });

  it("keeps area and city required for an in-person event", () => {
    expect(
      placeValidationErrors({
        attendance: "in_person",
        area: "",
        city: "",
        venue: "",
      }),
    ).toEqual({
      area: "Seleziona un'area.",
      city: "Seleziona una città.",
      venue: "Inserisci il luogo o l'indirizzo.",
    });
  });

  it("saves an existing online course without inventing a place", () => {
    expect(
      placeFieldsForSave({
        attendance: "online",
        city: "",
        venue: "Online – videolezioni registrate",
        provinceForCity: "CA",
        storedProvince: "",
        storedOnline: true,
      }),
    ).toEqual({
      municipality: "Online",
      province: "",
      location_name: "Online – videolezioni registrate",
      address: "Online – videolezioni registrate",
    });
  });

  it("saves a new in-person event with the selected city", () => {
    expect(
      placeFieldsForSave({
        attendance: "in_person",
        city: "Sassari",
        venue: "Via Roma 1",
        provinceForCity: "SS",
        storedProvince: null,
        storedOnline: false,
      }),
    ).toEqual({
      municipality: "Sassari",
      province: "SS",
      location_name: "Via Roma 1",
      address: "Via Roma 1",
    });
  });
});

describe("enrollment links", () => {
  const movento =
    "https://movento.academy/corso-per-impiegato-accettatore-di-officina/";

  it("accepts an official enrollment page and adds https when missing", () => {
    expect(isValidTicketUrl(movento)).toBe(true);
    expect(
      isValidTicketUrl(
        "movento.academy/corso-per-impiegato-accettatore-di-officina/",
      ),
    ).toBe(true);
    expect(normalizeTicketUrl("movento.academy/iscrizione")).toBe(
      "https://movento.academy/iscrizione",
    );
    expect(normalizeTicketUrl(movento)).toBe(movento);
  });
});
