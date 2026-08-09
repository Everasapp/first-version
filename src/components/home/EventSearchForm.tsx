"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Compass,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import { areaToSlug, findNearestCity } from "@/src/utils/nearby-city";

const areaLabels: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

type EventSearchFormProps = {
  variant?: "hero" | "page";
  initialQuery?: string;
  initialArea?: string;
  initialCity?: string;
  initialCategory?: string;
  initialDate?: string;
};

export default function EventSearchForm({
  variant = "hero",
  initialQuery = "",
  initialArea = "",
  initialCity = "",
  initialCategory = "",
  initialDate = "",
}: EventSearchFormProps) {
  const router = useRouter();
  const isHero = variant === "hero";

  const [query, setQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState(() => {
    if (!initialArea || initialArea === "tutta-sardegna") {
      return "";
    }

    return initialArea;
  });
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [geoMessage, setGeoMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const availableCities = useMemo(() => {
    const areaLabel =
      selectedArea && selectedArea !== "tutta-sardegna"
        ? areaLabels[selectedArea]
        : undefined;

    const filteredCities = areaLabel
      ? cities.filter((city) => city.area === areaLabel)
      : cities;

    return [...filteredCities].sort((a, b) =>
      a.city.localeCompare(b.city, "it"),
    );
  }, [selectedArea]);

  function handleAreaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedArea(event.target.value);
    setSelectedCity("");
  }

  function buildSearchParams(overrides?: { city?: string; area?: string }) {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    const city = overrides?.city ?? selectedCity;
    const area = overrides?.area ?? selectedArea;

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    if (area) {
      params.set("area", area);
    }

    if (city) {
      params.set("city", city);
    }

    const form = document.getElementById(
      isHero ? "hero-search-form" : "events-search-form",
    ) as HTMLFormElement | null;

    const category =
      (form?.elements.namedItem("category") as HTMLSelectElement | null)
        ?.value ?? "";
    const date =
      (form?.elements.namedItem("date") as HTMLSelectElement | null)?.value ??
      "";

    if (category) {
      params.set("category", category);
    }

    if (date) {
      params.set("date", date);
    }

    return params;
  }

  function handleNearMe() {
    setGeoMessage("");

    if (!navigator.geolocation) {
      setGeoMessage("Il browser non supporta la geolocalizzazione.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestCity(
          position.coords.latitude,
          position.coords.longitude,
        );
        const areaSlug = areaToSlug(nearest.area);

        setSelectedCity(nearest.city);
        setSelectedArea(areaSlug);

        const params = buildSearchParams({
          city: nearest.city,
          area: areaSlug,
        });

        router.push(`/eventi?${params.toString()}`);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setGeoMessage(
          "Non è stato possibile rilevare la posizione. Controlla i permessi del browser.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  const labelClass =
    "flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-slate-900";

  const fieldClass = isHero
    ? "flex min-w-0 flex-col justify-end rounded-2xl border-t border-slate-100 px-4 py-2 md:border-l md:border-t-0"
    : "flex min-w-0 flex-col justify-end rounded-2xl border border-slate-200 px-4 py-3";

  const firstFieldClass = isHero
    ? "flex min-w-0 flex-col justify-end rounded-2xl px-4 py-2 sm:col-span-2 xl:col-span-2"
    : "flex min-w-0 flex-col justify-end rounded-2xl border border-slate-200 px-4 py-3 lg:col-span-full";

  const inputClass =
    "mt-1.5 w-full min-w-0 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400";

  const formClass = isHero
    ? "mt-10 grid max-w-6xl gap-3 rounded-3xl bg-white p-3 shadow-2xl md:grid-cols-2 xl:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_auto] xl:items-end"
    : "mt-8 grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_1fr_auto] xl:items-end";

  return (
    <>
      <form
        id={isHero ? "hero-search-form" : "events-search-form"}
        action="/eventi"
        method="GET"
        className={formClass}
      >
        <label className={firstFieldClass}>
          <span className={labelClass}>
            <Search
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE]"
            />
            {isHero ? "Cerca per testo" : "Testo"}
          </span>
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Es. jazz, sagre, teatro…"
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <label className={isHero ? "flex min-w-0 flex-col justify-end rounded-2xl px-4 py-2" : fieldClass}>
          <span className={labelClass}>
            <MapPin
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE]"
            />
            Area
          </span>
          <select
            name="area"
            value={selectedArea}
            onChange={handleAreaChange}
            className={inputClass}
          >
            <option value="">Tutta la Sardegna</option>
            <option value="nord-sardegna">Nord Sardegna</option>
            <option value="centro-sardegna">Centro Sardegna</option>
            <option value="sud-sardegna">Sud Sardegna</option>
          </select>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <Building2
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE]"
            />
            Città
          </span>
          <select
            name="city"
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className={inputClass}
          >
            <option value="">Tutte le città</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.city}>
                {city.city} ({city.province})
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <Compass
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE]"
            />
            Categoria
          </span>
          <select
            name="category"
            defaultValue={initialCategory}
            className={inputClass}
          >
            <option value="">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <CalendarDays
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE]"
            />
            Quando?
          </span>
          <select
            name="date"
            defaultValue={initialDate}
            className={inputClass}
          >
            <option value="">
              {isHero ? "Tutte le date" : "Qualsiasi data"}
            </option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
          </select>
        </label>

        <button
          type="submit"
          className={
            isHero
              ? "flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-7 py-4 font-bold text-white transition hover:bg-[#E86F00]"
              : "flex min-h-[4.75rem] items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-7 py-4 font-bold text-white transition hover:bg-[#E86F00] sm:col-span-2 lg:col-span-1 xl:min-h-0"
          }
        >
          <Search aria-hidden="true" className="h-5 w-5" />
          Cerca
        </button>
      </form>

      {isHero ? (
        <div className="mt-5 max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleNearMe}
              disabled={isLocating}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
            >
              <LocateFixed aria-hidden="true" className="h-4 w-4" />
              {isLocating ? "Rilevo posizione…" : "Vicino a me"}
            </button>
          </div>

          {geoMessage ? (
            <p className="mt-3 text-sm font-medium text-orange-100">{geoMessage}</p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLocating}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE] disabled:opacity-60"
          >
            <LocateFixed aria-hidden="true" className="h-4 w-4" />
            {isLocating ? "Rilevo posizione…" : "Vicino a me"}
          </button>

          {geoMessage ? (
            <p className="mt-2 text-sm text-red-600">{geoMessage}</p>
          ) : null}
        </div>
      )}
    </>
  );
}
