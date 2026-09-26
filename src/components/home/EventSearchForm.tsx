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
import CitySelect from "@/src/components/events/CitySelect";
import { saveGeoCoords, markGeoDenied } from "@/src/lib/geo-preference";
import {
  formatSearchDateLabel,
  isPreciseDateFilter,
} from "@/src/lib/seo/dateRange";
import { areaToSlug, findNearestCity } from "@/src/utils/nearby-city";

const areaLabels: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

const DATE_PRESETS = new Set(["oggi", "domani", "weekend", "settimana"]);

function todayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type AccordionKey = "area" | "city" | "category" | "date" | "text" | null;

function AccordionRow({
  id,
  icon,
  title,
  summary,
  isOpen,
  onToggle,
  children,
}: {
  id: Exclude<AccordionKey, null>;
  icon: ReactNode;
  title: string;
  summary: string;
  isOpen: boolean;
  onToggle: (id: Exclude<AccordionKey, null>) => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2.5 px-1 py-2 text-left"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#075EAE]/10 text-[#075EAE]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-900">
            {summary}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? <div className="pb-2.5 pl-10 pr-1">{children}</div> : null}
    </div>
  );
}

export default function EventSearchForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [openPanel, setOpenPanel] = useState<AccordionKey>(null);
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

  const dateSummary =
    formatSearchDateLabel(selectedDate) || "Tutte le date";
  const presetDateValue = DATE_PRESETS.has(selectedDate)
    ? selectedDate
    : isPreciseDateFilter(selectedDate)
      ? "__specifica__"
      : "";
  const preciseDateValue = isPreciseDateFilter(selectedDate)
    ? selectedDate
    : "";
  const showPrecisePicker =
    presetDateValue === "__specifica__" || Boolean(preciseDateValue);
  const minDate = todayIsoDate();

  function togglePanel(key: Exclude<AccordionKey, null>) {
    setOpenPanel((current) => (current === key ? null : key));
  }

  function handlePresetDateChange(value: string) {
    if (value === "__specifica__") {
      setSelectedDate(preciseDateValue || minDate);
      return;
    }
    setSelectedDate(value);
  }

  function handlePreciseDateChange(value: string) {
    setSelectedDate(value);
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
    "flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-slate-900";

  const fieldClass =
    "flex min-w-0 flex-col justify-end rounded-xl border-t border-slate-100 px-2.5 py-1.5 md:border-l md:border-t-0 md:px-3";

  const firstFieldClass =
    "flex min-w-0 flex-col justify-end rounded-xl px-2.5 py-1.5 md:px-3";

  const inputClass =
    "mt-0.5 w-full min-w-0 bg-transparent text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-xs";

  return (
    <div id="ricerca" className="scroll-mt-24 sm:scroll-mt-28">
      <div className="mt-5 min-w-0 max-w-7xl sm:mt-6">
        <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto pb-1 touch-pan-x sm:gap-1.5">
          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLocating}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E67E22] px-2 py-1 text-[10px] font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#C96A1A] active:scale-[0.98] disabled:opacity-60 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]"
          >
            <LocateFixed aria-hidden="true" className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {isLocating ? "Rilevo posizione…" : "Vicino a me"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/eventi?area=nord-sardegna")}
            className="flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]"
          >
            <Compass aria-hidden="true" className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Nord Sardegna
          </button>
          <button
            type="button"
            onClick={() => router.push("/eventi?area=centro-sardegna")}
            className="flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]"
          >
            <MapPin aria-hidden="true" className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Centro Sardegna
          </button>
          <button
            type="button"
            onClick={() => router.push("/eventi?area=sud-sardegna")}
            className="flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]"
          >
            <Sun aria-hidden="true" className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Sud Sardegna
          </button>
        </div>

        {geoMessage ? (
          <p className="mt-1 text-[10px] font-medium text-orange-100 sm:text-[11px]">{geoMessage}</p>
        ) : null}
      </div>

      {/* Mobile: tendine progressive */}
      <form
        id="hero-search-form"
        action="/eventi"
        method="GET"
        className="mt-2 w-full max-w-7xl rounded-xl border border-white/80 bg-white p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 sm:mt-2.5 sm:rounded-2xl sm:p-2.5 md:hidden"
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
          icon={<MapPin aria-hidden="true" className="h-3.5 w-3.5" />}
          isOpen={openPanel === "area"}
          onToggle={togglePanel}
        >
          <select
            value={selectedArea}
            onChange={(event) => {
              setSelectedArea(event.target.value);
              setSelectedCity("");
              setOpenPanel("city");
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
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
          icon={<Building2 aria-hidden="true" className="h-3.5 w-3.5" />}
          isOpen={openPanel === "city"}
          onToggle={togglePanel}
        >
          <CitySelect
            value={selectedCity}
            onChange={(nextCity) => {
              setSelectedCity(nextCity);
              setOpenPanel("category");
            }}
            cities={availableCities}
            emptyLabel="Tutte le città"
            includeSulcisShortcut
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
          />
        </AccordionRow>

        <AccordionRow
          id="category"
          title="Categoria"
          summary={categoryLabel || "Tutte le categorie"}
          icon={<Compass aria-hidden="true" className="h-3.5 w-3.5" />}
          isOpen={openPanel === "category"}
          onToggle={togglePanel}
        >
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setOpenPanel("date");
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
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
          summary={dateSummary}
          icon={<CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />}
          isOpen={openPanel === "date"}
          onToggle={togglePanel}
        >
          <div className="space-y-2">
            <select
              value={presetDateValue}
              onChange={(event) => {
                handlePresetDateChange(event.target.value);
                if (
                  event.target.value &&
                  event.target.value !== "__specifica__"
                ) {
                  setOpenPanel("text");
                }
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
            >
              <option value="">Tutte le date</option>
              <option value="oggi">Oggi</option>
              <option value="domani">Domani</option>
              <option value="weekend">Questo weekend</option>
              <option value="settimana">Questa settimana</option>
              <option value="__specifica__">Scegli una data…</option>
            </select>
            {showPrecisePicker ? (
              <label className="block">
                <span className="mb-1 block text-[9px] font-semibold text-slate-500">
                  Data precisa
                </span>
                <input
                  type="date"
                  value={preciseDateValue || minDate}
                  min={minDate}
                  onChange={(event) => {
                    handlePreciseDateChange(event.target.value);
                    if (event.target.value) setOpenPanel("text");
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
                />
              </label>
            ) : null}
          </div>
        </AccordionRow>

        <AccordionRow
          id="text"
          title="Testo"
          summary={query.trim() || "Parola chiave (opzionale)"}
          icon={<Search aria-hidden="true" className="h-3.5 w-3.5" />}
          isOpen={openPanel === "text"}
          onToggle={togglePanel}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Es. jazz, sagre, teatro…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#075EAE]"
            autoComplete="off"
          />
        </AccordionRow>

        <button
          type="submit"
          className="mt-1.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#E67E22] text-[11px] font-bold text-white transition hover:bg-[#C96A1A] sm:text-xs"
        >
          <Search aria-hidden="true" className="h-3.5 w-3.5" />
          Cerca
        </button>
      </form>

      {/* Desktop / tablet: layout completo */}
      <form
        action="/eventi"
        method="GET"
        className="mt-2.5 hidden w-full max-w-7xl gap-1 rounded-2xl border border-white/80 bg-white p-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 md:grid md:grid-cols-2 md:p-2.5 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-stretch"
      >
        <label className={firstFieldClass}>
          <span className={labelClass}>
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#075EAE]" />
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
              className="h-3.5 w-3.5 shrink-0 text-[#075EAE]"
            />
            Città
          </span>
          <CitySelect
            name="city"
            value={selectedCity}
            onChange={setSelectedCity}
            cities={availableCities}
            emptyLabel="Tutte le città"
            showSearch={false}
            includeSulcisShortcut
            className={inputClass}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <Compass
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-[#075EAE]"
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
              className="h-3.5 w-3.5 shrink-0 text-[#075EAE]"
            />
            Quando?
          </span>
          <input type="hidden" name="date" value={selectedDate} />
          <select
            value={presetDateValue}
            onChange={(event) => handlePresetDateChange(event.target.value)}
            className={inputClass}
          >
            <option value="">Tutte le date</option>
            <option value="oggi">Oggi</option>
            <option value="domani">Domani</option>
            <option value="weekend">Questo weekend</option>
            <option value="settimana">Questa settimana</option>
            <option value="__specifica__">Scegli una data…</option>
          </select>
          {showPrecisePicker ? (
            <input
              type="date"
              value={preciseDateValue || minDate}
              min={minDate}
              onChange={(event) => handlePreciseDateChange(event.target.value)}
              aria-label="Data precisa"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 outline-none focus:border-[#075EAE]"
            />
          ) : null}
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>
            <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#075EAE]" />
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
          className="flex min-h-[2.5rem] items-center justify-center gap-1.5 rounded-xl bg-[#E67E22] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#C96A1A] xl:min-h-full"
        >
          <Search aria-hidden="true" className="h-3.5 w-3.5" />
          Cerca
        </button>
      </form>
    </div>
  );
}
