"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Compass,
  LocateFixed,
  MapPin,
  Search,
  Sun,
} from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";

const areaLabels: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

export default function Hero() {
  const [selectedArea, setSelectedArea] = useState("tutta-sardegna");
  const [selectedCity, setSelectedCity] = useState("");

  const availableCities = useMemo(() => {
    const filteredCities =
      selectedArea === "tutta-sardegna"
        ? cities
        : cities.filter(
            (city) => city.area === areaLabels[selectedArea],
          );

    return [...filteredCities].sort((a, b) =>
      a.city.localeCompare(b.city, "it"),
    );
  }, [selectedArea]);

  function handleAreaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedArea(event.target.value);
    setSelectedCity("");
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/concert.png')",
        backgroundPosition: "60% center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,40,84,.68) 0%, rgba(5,75,140,.35) 45%, rgba(0,0,0,.10) 100%)",
        }}
      />

      <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">
          Eventi in tutta la Sardegna
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          Scopri cosa fare oggi in Sardegna
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 sm:text-xl">
          Sagre, concerti, spettacoli, esperienze e attività vicino a te.
        </p>

        <form
          action="/eventi"
          method="GET"
          className="mt-10 grid max-w-6xl gap-3 rounded-3xl bg-white p-3 shadow-2xl md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]"
        >
          <label className="rounded-2xl px-4 py-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 text-[#075EAE]"
              />
              Area
            </span>

            <select
              name="area"
              value={selectedArea}
              onChange={handleAreaChange}
              className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none"
            >
              <option value="tutta-sardegna">Tutta la Sardegna</option>
              <option value="nord-sardegna">Nord Sardegna</option>
              <option value="centro-sardegna">Centro Sardegna</option>
              <option value="sud-sardegna">Sud Sardegna</option>
            </select>
          </label>

          <label className="rounded-2xl border-t border-slate-100 px-4 py-2 md:border-l md:border-t-0">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Building2
                aria-hidden="true"
                className="h-4 w-4 text-[#075EAE]"
              />
              Città
            </span>

            <select
              name="city"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none"
            >
              <option value="">Tutte le città</option>

              {availableCities.map((city) => (
                <option key={city.id} value={city.city}>
                  {city.city} ({city.province})
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-2xl border-t border-slate-100 px-4 py-2 md:border-l md:border-t-0">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Compass
                aria-hidden="true"
                className="h-4 w-4 text-[#075EAE]"
              />
              Categoria
            </span>

            <select
              name="category"
              defaultValue=""
              className="mt-1 w-full bg-transparent text-sm text-slate-600 outline-none"
            >
              <option value="">Tutte le categorie</option>

              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-2xl border-t border-slate-100 px-4 py-2 md:border-l md:border-t-0">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CalendarDays
                aria-hidden="true"
                className="h-4 w-4 text-[#075EAE]"
              />
              Quando?
            </span>

            <select
  name="date"
  defaultValue=""
  className="w-full bg-transparent text-slate-700 outline-none"
>
  <option value="">Tutte le date</option>
  <option value="oggi">Oggi</option>
  <option value="domani">Domani</option>
  <option value="weekend">Questo weekend</option>
  <option value="settimana">Questa settimana</option>
</select>
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-7 py-4 font-bold text-white transition hover:bg-[#E86F00]"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
            Cerca
          </button>
        </form>

        <div className="mt-5 flex max-w-5xl flex-wrap gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <LocateFixed aria-hidden="true" className="h-4 w-4" />
            Vicino a me
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedArea("nord-sardegna");
              setSelectedCity("");
            }}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Compass aria-hidden="true" className="h-4 w-4" />
            Nord Sardegna
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedArea("centro-sardegna");
              setSelectedCity("");
            }}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Centro Sardegna
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedArea("sud-sardegna");
              setSelectedCity("");
            }}
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Sun aria-hidden="true" className="h-4 w-4" />
            Sud Sardegna
          </button>
        </div>
      </div>
    </section>
  );
}