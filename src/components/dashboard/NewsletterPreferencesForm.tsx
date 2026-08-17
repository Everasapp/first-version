"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import type { Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

type NewsletterPreferencesFormProps = {
  profile: Profile;
};

export default function NewsletterPreferencesForm({
  profile,
}: NewsletterPreferencesFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.city.localeCompare(b.city, "it")),
    [],
  );

  const [optIn, setOptIn] = useState(profile.newsletter_opt_in);
  const [city, setCity] = useState(profile.newsletter_city ?? "");
  const [category, setCategory] = useState(profile.newsletter_category ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (optIn && (!city || !category)) {
      setErrorMessage("Scegli città e categoria preferita.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        newsletter_opt_in: optIn,
        newsletter_city: optIn ? city : null,
        newsletter_category: optIn ? category : null,
        newsletter_opted_at: optIn ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      optIn
        ? "Preferenze salvate. Riceverai la newsletter ogni settimana."
        : "Ti sei disiscritto dalla newsletter.",
    );
    setIsLoading(false);
    router.refresh();
  }

  const inputClassName =
    "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(event) => setOptIn(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E67E22] focus:ring-[#E67E22]"
        />
        <span>
          <span className="block text-sm font-bold text-slate-800">
            Newsletter settimanale
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            Eventi della tua area geografica, con priorità a città e categoria.
          </span>
        </span>
      </label>

      {optIn ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="newsletter-city"
              className="text-sm font-semibold text-slate-800"
            >
              Città
            </label>
            <select
              id="newsletter-city"
              required={optIn}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClassName}
            >
              <option value="">Seleziona città</option>
              {sortedCities.map((item) => (
                <option key={item.id} value={item.city}>
                  {item.city} ({item.province})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="newsletter-category"
              className="text-sm font-semibold text-slate-800"
            >
              Categoria
            </label>
            <select
              id="newsletter-category"
              required={optIn}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClassName}
            >
              <option value="">Seleziona categoria</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-6 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Salvataggio...
          </>
        ) : (
          <>
            <Save aria-hidden="true" className="h-5 w-5" />
            Salva preferenze
          </>
        )}
      </button>
    </form>
  );
}
