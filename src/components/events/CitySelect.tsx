"use client";

import { useMemo, useState } from "react";

import {
  filterCitiesByQuery,
  partitionCitiesForSelect,
  type City,
} from "@/src/data/cities";

type CitySelectProps = {
  value: string;
  onChange: (city: string) => void;
  cities: City[];
  emptyLabel?: string;
  name?: string;
  id?: string;
  invalid?: boolean;
  className?: string;
  showSearch?: boolean;
  includeSulcisShortcut?: boolean;
};

function CityOption({ city }: { city: City }) {
  return (
    <option value={city.city}>
      {city.city} ({city.province})
    </option>
  );
}

export default function CitySelect({
  value,
  onChange,
  cities,
  emptyLabel = "Seleziona una città",
  name,
  id,
  invalid = false,
  className,
  showSearch = true,
  includeSulcisShortcut = false,
}: CitySelectProps) {
  const [query, setQuery] = useState("");

  const visibleCities = useMemo(
    () => filterCitiesByQuery(cities, query),
    [cities, query],
  );
  const { sulcis, rest } = useMemo(
    () => partitionCitiesForSelect(visibleCities),
    [visibleCities],
  );
  const showSulcisGroup = sulcis.length > 0 && rest.length > 0;
  const showSulcisShortcut =
    includeSulcisShortcut &&
    sulcis.length > 0 &&
    (!query.trim() || "sulcis".startsWith(query.trim().toLocaleLowerCase("it")));

  return (
    <div className={showSearch ? "mt-2 space-y-2" : undefined}>
      {showSearch ? (
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca città o Sulcis"
          autoComplete="off"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#075EAE]"
        />
      ) : null}

      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        className={className}
      >
        <option value="">{emptyLabel}</option>
        {showSulcisShortcut ? (
          <option value="Sulcis">Sulcis (tutti i comuni)</option>
        ) : null}
        {showSulcisGroup ? (
          <>
            <optgroup label="Sulcis">
              {sulcis.map((city) => (
                <CityOption key={city.id} city={city} />
              ))}
            </optgroup>
            <optgroup label="Altri comuni">
              {rest.map((city) => (
                <CityOption key={city.id} city={city} />
              ))}
            </optgroup>
          </>
        ) : (
          visibleCities.map((city) => (
            <CityOption key={city.id} city={city} />
          ))
        )}
      </select>
    </div>
  );
}
