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
    "flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-slate-900 sm:gap-2 sm:text-sm";

  const fieldClass =
    "flex min-w-0 flex-col justify-end rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 sm:rounded-2xl md:border-0 md:border-l md:border-slate-100 md:bg-transparent md:px-5 md:py-3.5";

  const inputClass =
    "mt-1.5 w-full min-w-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:mt-2 sm:text-base";

  return (
    <div id="ricerca" className="scroll-mt-24 sm:scroll-mt-28">
      <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-8">
        <button
          type="button"
          onClick={handleNearMe}
          disabled={isLocating}
          className="inline-flex items-center gap-2 rounded-full bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#C96A1A] active:scale-[0.98] disabled:opacity-60 sm:gap-2.5 sm:px-5 sm:py-3 sm:text-base"
        >
          <LocateFixed aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
          {isLocating ? "Rilevo posizione…" : "Vicino a me"}
        </button>

        {geoMessage ? (
          <p className="w-full text-sm font-medium text-orange-100">
            {geoMessage}
          </p>
        ) : null}
      </div>

      <form
        id="hero-search-form"
        action="/eventi"
        method="GET"
        className="mt-3 grid w-full max-w-7xl grid-cols-2 gap-2 rounded-2xl border border-white/80 bg-white p-3 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:mt-4 sm:gap-2 sm:rounded-[1.75rem] sm:p-4 md:grid-cols-2 md:p-5 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-stretch"
      >
        {/* Mobile: area / città / categoria / data prima; testo dopo */}
        <label className={fieldClass}>
          <span className={labelClass}>
            <MapPin
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE] sm:h-5 sm:w-5"
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
              className="h-4 w-4 shrink-0 text-[#075EAE] sm:h-5 sm:w-5"
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
              className="h-4 w-4 shrink-0 text-[#075EAE] sm:h-5 sm:w-5"
            />
            Categoria
          </span>
          <select name="category" className={inputClass}>
            <option value="">Tutte</option>
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
              className="h-4 w-4 shrink-0 text-[#075EAE] sm:h-5 sm:w-5"
            />
            Data
          </span>
          <select name="date" className={inputClass}>
            <option value="">Tutte</option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
          </select>
        </label>

        <label className={`${fieldClass} col-span-2 xl:col-span-1`}>
          <span className={labelClass}>
            <Search
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#075EAE] sm:h-5 sm:w-5"
            />
            Testo
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

        <button
          type="submit"
          className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-6 py-3 text-base font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#C96A1A] sm:min-h-[3.5rem] sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg xl:col-span-1 xl:min-h-full"
        >
          <Search aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
          Cerca
        </button>
      </form>

      <div className="mt-3 hidden max-w-7xl sm:mt-5 sm:block">
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
