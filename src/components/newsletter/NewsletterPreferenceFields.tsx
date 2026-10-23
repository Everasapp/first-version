"use client";

import { learningDisciplines } from "@/src/data/learning-disciplines";
import {
  MAX_NEWSLETTER_DISCIPLINES,
  NEWSLETTER_ZONES,
} from "@/src/lib/newsletter-preferences";

type NewsletterPreferenceFieldsProps = {
  areas: string[];
  disciplines: string[];
  onAreasChange: (areas: string[]) => void;
  onDisciplinesChange: (disciplines: string[]) => void;
  name?: string;
};

function toggle(current: string[], value: string, checked: boolean) {
  if (checked) return current.includes(value) ? current : [...current, value];
  return current.filter((item) => item !== value);
}

export default function NewsletterPreferenceFields({
  areas,
  disciplines,
  onAreasChange,
  onDisciplinesChange,
  name = "newsletter",
}: NewsletterPreferenceFieldsProps) {
  const disciplineLimitReached = disciplines.length >= MAX_NEWSLETTER_DISCIPLINES;

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-bold text-slate-800">Zone</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {NEWSLETTER_ZONES.map((zone) => {
            const checked = areas.includes(zone);
            return (
              <label
                key={zone}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${
                  checked
                    ? "border-[#075EAE] bg-[#075EAE] text-white"
                    : "border-[#c5d8ec] bg-white text-slate-800"
                }`}
              >
                <input
                  type="checkbox"
                  name={`${name}_areas`}
                  value={zone}
                  checked={checked}
                  onChange={(event) =>
                    onAreasChange(toggle(areas, zone, event.target.checked))
                  }
                  className="h-4 w-4 rounded border-white/70 text-[#E67E22] focus:ring-[#E67E22]"
                />
                {zone}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-bold text-slate-800">
          <span>Discipline</span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#075EAE]">
            {disciplines.length}/{MAX_NEWSLETTER_DISCIPLINES} discipline selezionate
          </span>
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {learningDisciplines.map((discipline) => {
            const checked = disciplines.includes(discipline.slug);
            const disabled = disciplineLimitReached && !checked;
            return (
              <label
                key={discipline.slug}
                className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                  checked
                    ? "border-[#075EAE] bg-[#e8f2fb] font-semibold text-[#075EAE]"
                    : "border-[#c5d8ec] bg-white text-slate-700"
                } ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
              >
                <input
                  type="checkbox"
                  name={`${name}_disciplines`}
                  value={discipline.slug}
                  checked={checked}
                  disabled={disabled}
                  onChange={(event) =>
                    onDisciplinesChange(
                      toggle(disciplines, discipline.slug, event.target.checked),
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#075EAE] focus:ring-[#075EAE] disabled:cursor-not-allowed"
                />
                {discipline.name}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
