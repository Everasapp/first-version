import { describe, expect, it } from "vitest";
import { cities, isSulcisCity } from "@/src/data/cities";
import { containsPlaceName, matchEventCity } from "./event-place-match";

describe("event locality matching", () => {
  it("does not turn tourism or artist text into Uri", () => {
    expect(matchEventCity("Sardegna Turismo, itinerari culturali")).toBeNull();
    expect(matchEventCity("Nuracque a Nurachi — Sardegna Turismo")).toEqual({ city: "Nurachi", province: "OR" });
    expect(matchEventCity("Concerto a Uri")).toEqual({ city: "Uri", province: "SS" });
  });

  it("uses Cagliari rather than the street name Carloforte", () => {
    expect(matchEventCity("Jazzino, Via Carloforte 74, 09123 Cagliari")).toEqual({ city: "Cagliari", province: "CA" });
    expect(matchEventCity("Concerto a Carloforte")).toEqual({ city: "Carloforte", province: "SU" });
    expect(matchEventCity("Via Carloforte 74")).toBeNull();
  });

  it("preserves full town names and normalized accents and apostrophes", () => {
    expect(matchEventCity("Piazza IV Novembre, San Giovanni Suergiu")).toEqual({ city: "San Giovanni Suergiu", province: "SU" });
    expect(matchEventCity("TORTOLI — centro storico")).toEqual({ city: "Tortolì", province: "NU" });
    expect(matchEventCity("Sant’Antioco")).toEqual({ city: "Sant'Antioco", province: "SU" });
    expect(containsPlaceName("località Arbatax", "Arbatax")).toBe(true);
    expect(containsPlaceName("Parco Asinaraggio", "Asinara")).toBe(false);
  });

  it("keeps new town filters addressable without duplicate IDs", () => {
    expect(new Set(cities.map((city) => city.id)).size).toBe(cities.length);
    for (const name of ["Nurachi", "San Giovanni Suergiu", "Seui", "Domusnovas"]) {
      expect(cities.filter((city) => city.city === name)).toHaveLength(1);
    }
    expect(isSulcisCity("San Giovanni Suergiu")).toBe(true);
    expect(isSulcisCity("Domusnovas")).toBe(true);
  });
});
