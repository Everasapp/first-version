"use client";

import { categories } from "@/src/data/categories";
import {
  MAX_EVENT_CATEGORIES,
  toggleCategorySlug,
} from "@/src/lib/event-categories";

type CategoryMultiSelectProps = {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  name?: string;
  id?: string;
};

export default function CategoryMultiSelect({
  value,
  onChange,
  error,
  name = "categories",
  id = "event-categories",
}: CategoryMultiSelectProps) {
  const atMax = value.length >= MAX_EVENT_CATEGORIES;

  return (
    <div>
      <span className="text-sm font-bold text-slate-900">
        Categorie{" "}
        <span className="font-medium text-slate-500">
          (fino a {MAX_EVENT_CATEGORIES})
        </span>
      </span>

      <p className="mt-1 text-xs text-slate-500">
        La prima selezionata è la categoria principale.
      </p>

      <fieldset
        id={id}
        aria-invalid={Boolean(error)}
        className={`mt-2 grid gap-2 rounded-2xl border p-3 sm:grid-cols-2 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      >
        <legend className="sr-only">Seleziona fino a {MAX_EVENT_CATEGORIES} categorie</legend>

        {categories.map((category) => {
          const checked = value.includes(category.slug);
          const disabled = !checked && atMax;

          return (
            <label
              key={category.id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition ${
                checked
                  ? "bg-blue-50 text-slate-900"
                  : disabled
                    ? "cursor-not-allowed text-slate-400"
                    : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={category.slug}
                checked={checked}
                disabled={disabled}
                onChange={() =>
                  onChange(toggleCategorySlug(value, category.slug))
                }
                className="h-4 w-4 rounded border-slate-300 text-[#075EAE] focus:ring-[#075EAE]"
              />
              <span>
                {category.name}
                {checked && value[0] === category.slug ? (
                  <span className="ml-1 text-xs font-semibold text-[#075EAE]">
                    · principale
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </fieldset>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
