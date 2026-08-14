"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronDown,
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

const dateLabels: Record<string, string> = {
  oggi: "Oggi",
  domani: "Domani",
  weekend: "Questo weekend",
  settimana: "Questa settimana",
};

type AccordionKey = "area" | "city" | "category" | "date" | "text" | null;

export default function EventSearchForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [openPanel, setOpenPanel] = useState<AccordionKey>("area");
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

  const categoryLabel =
    categories.find((category) => category.slug === selectedCategory)?.name ??
    "";

  function togglePanel(key: AccordionKey) {
    setOpenPanel((current) => (current === key ? null : key));
  }

  function buildSearchParams(overrides?: { city?: string; area?: string }) {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    const city = overrides?.city ?? selectedCity;
    const area = overrides?.area ?? selectedArea;

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (area) params.set("area", area);
    if (city) params.set("city", city);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDate) params.set("date", selectedDate);

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
        setOpenPanel("category");

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

  function AccordionRow({
    id,
    icon,
    title,
    summary,
    children,
  }: {
    id: Exclude<AccordionKey, null>;
    icon: ReactNode;
    title: string;
    summary: string;
    children: ReactNode;
  }) {
    const isOpen = openPanel === id;

    return (
      <div className="border-b border-slate-100 last:border-b-0">
        <button
          type="button"
          onClick={() => togglePanel(id)}
          aria-expanded={isOpen}
          className="flex w-full items-center gap-3 px-1 py-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#075EAE]/10 text-[#075EAE]">
            {icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              {title}
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-slate-900">
              {summary}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen ? <div className="pb-3 pl-12 pr-1">{children}</div> : null}
      </div>
    );
  }

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

      {/* Mobile: tendine progressive */}
      <form
        id="hero-search-form"
        action="/eventi"
        method="GET"
        className="mt-3 w-full max-w-7xl rounded-2xl border border-white/80 bg-white p-3 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:mt-4 sm:p-4 md:hidden"
      >
        <input type="hidden" name="area" value={selectedArea} />
        <input type="hidden" name="city" value={selectedCity} />
        <input type="hidden" name="category" value={selectedCategory} />
        <input type="hidden" name="date" value={selectedDate} />
        <input type="hidden" name="q" value={query} />

        <AccordionRow
          id="area"
          title="Area"
          summary={
            selectedArea ? areaLabels[selectedArea] || selectedArea : "Tutta la Sardegna"
          }
          icon={<MapPin aria-hidden="true" className="h-4 w-4" />}
        >
          <select
            value={selectedArea}
            onChange={(event) => {
              setSelectedArea(event.target.value);
              setSelectedCity("");
              setOpenPanel("city");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#075EAE]"
          >
            <option value="">Tutta la Sardegna</option>
            <option value="nord-sardegna">Nord Sardegna</option>
            <option value="centro-sardegna">Centro Sardegna</option>
            <option value="sud-sardegna">Sud Sardegna</option>
          </select>
        </AccordionRow>

        <AccordionRow
          id="city"
          title="Città"
          summary={selectedCity || "Tutte le città"}
          icon={<Building2 aria-hidden="true" className="h-4 w-4" />}
        >
          <select
            value={selectedCity}
            onChange={(event) => {
              setSelectedCity(event.target.value);
              setOpenPanel("category");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#075EAE]"
          >
            <option value="">Tutte le città</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.city}>
                {city.city} ({city.province})
              </option>
            ))}
          </select>
        </AccordionRow>

        <AccordionRow
          id="category"
          title="Categoria"
          summary={categoryLabel || "Tutte le categorie"}
          icon={<Compass aria-hidden="true" className="h-4 w-4" />}
        >
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setOpenPanel("date");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#075EAE]"
          >
            <option value="">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </AccordionRow>

        <AccordionRow
          id="date"
          title="Data"
          summary={
            selectedDate ? dateLabels[selectedDate] || selectedDate : "Tutte le date"
          }
          icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
        >
          <select
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setOpenPanel("text");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#075EAE]"
          >
            <option value="">Tutte le date</option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
          </select>
        </AccordionRow>

        <AccordionRow
          id="text"
          title="Testo"
          summary={query.trim() || "Parola chiave (opzionale)"}
          icon={<Search aria-hidden="true" className="h-4 w-4" />}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Es. jazz, sagre, teatro…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#075EAE]"
            autoComplete="off"
          />
        </AccordionRow>

        <button
          type="submit"
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] text-base font-bold text-white transition hover:bg-[#C96A1A]"
        >
          <Search aria-hidden="true" className="h-5 w-5" />
          Cerca
        </button>
      </form>

      {/* Desktop / tablet: layout completo */}
      <form
        action="/eventi"
        method="GET"
        className="mt-4 hidden w-full max-w-7xl gap-2 rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/5 md:grid md:grid-cols-2 md:p-5 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-stretch"
      >
        <label className={firstFieldClass}>
          <span className={labelClass}>
            <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-[#075EAE]" />
            Area
          </span>
          <select
            name="area"
            value={selectedArea}
            onChange={(event) => {
              setSelectedArea(event.target.value);
              setSelectedCity("");
            }}
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
          <select
            name="category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
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
              className="h-5 w-5 shrink-0 text-[#075EAE]"
            />
            Quando?
          </span>
          <select
            name="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className={inputClass}
          >
            <option value="">Tutte le date</option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
          </select>
        </label>

        <label className={fieldClass}>
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

        <button
          type="submit"
          className="flex min-h-[4.5rem] items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-8 py-5 text-lg font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#C96A1A] xl:min-h-full"
        >
          <Search aria-hidden="true" className="h-6 w-6" />
          Cerca
        </button>
      </form>

      <div className="mt-3 hidden max-w-7xl sm:mt-5 md:block">
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
