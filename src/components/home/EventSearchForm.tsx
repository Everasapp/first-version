"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { saveGeoCoords, markGeoDenied } from "@/src/lib/geo-preference";
import { areaToSlug, findNearestCity } from "@/src/utils/nearby-city";

const areaLabels: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

export default function EventSearchForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [geoMessage, setGeoMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (window.location.hash !== "#ricerca") return;

    const el = document.getElementById("ricerca");
    if (!el) return;

    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

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
      "hero-search-form",
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
        saveGeoCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

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
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          markGeoDenied();
        }
        setIsLocating(false);
        setGeoMessage(
          "Non è stato possibile rilevare la posizione. Controlla i permessi del browser.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  const labelClass =
    "flex items-center gap-2 whitespace-nowrap text-sm font-bold text-slate-900";

  const fieldClass =
    "flex min-w-0 flex-col justify-end rounded-2xl border-t border-slate-100 px-4 py-3.5 md:border-l md:border-t-0 md:px-5";

  const firstFieldClass =
    "flex min-w-0 flex-col justify-end rounded-2xl px-4 py-3.5 md:px-5";

  const inputClass =
    "mt-2 w-full min-w-0 bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400";

  return (
    <div id="ricerca" className="scroll-mt-28">
      <div className="mt-8 max-w-7xl">
        <button
          type="button"
          onClick={handleNearMe}
          disabled={isLocating}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#E67E22] px-5 py-3 text-base font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#C96A1A] active:scale-[0.98] disabled:opacity-60"
        >
          <LocateFixed aria-hidden="true" className="h-5 w-5" />
          {isLocating ? "Rilevo posizione…" : "Vicino a me"}
        </button>

        {geoMessage ? (
          <p className="mt-3 text-sm font-medium text-orange-100">{geoMessage}</p>
        ) : null}
      </div>

      <form
        id="hero-search-form"
        action="/eventi"
        method="GET"
        className="mt-4 grid w-full max-w-7xl gap-2 rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 md:grid-cols-2 md:p-5 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-stretch"
      >
        <label className={firstFieldClass}>
          <span className={labelClass}>
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#075EAE]" />
            Cerca per testo
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

        <label className={fieldClass}>
          <span className={labelClass}>
            <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-[#075EAE]" />
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
              className="h-5 w-5 shrink-0 text-[#075EAE]"
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
              className="h-5 w-5 shrink-0 text-[#075EAE]"
            />
            Categoria
          </span>
          <select name="category" className={inputClass}>
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
              className="h-5 w-5 shrink-0 text-[#075EAE]"
            />
            Quando?
          </span>
          <select name="date" className={inputClass}>
            <option value="">Tutte le date</option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
          </select>
        </label>

        <button
          type="submit"
          className="flex min-h-[4.5rem] items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-8 py-5 text-lg font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#C96A1A] xl:min-h-full"
        >
          <Search aria-hidden="true" className="h-6 w-6" />
          Cerca
        </button>
      </form>

      <div className="mt-5 max-w-7xl">
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => router.push("/eventi?area=nord-sardegna")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Compass aria-hidden="true" className="h-4 w-4" />
            Nord Sardegna
          </button>
          <button
            type="button"
            onClick={() => router.push("/eventi?area=centro-sardegna")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Centro Sardegna
          </button>
          <button
            type="button"
            onClick={() => router.push("/eventi?area=sud-sardegna")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Sun aria-hidden="true" className="h-4 w-4" />
            Sud Sardegna
          </button>
        </div>
      </div>
    </div>
  );
}
