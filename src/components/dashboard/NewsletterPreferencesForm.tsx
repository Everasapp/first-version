"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import NewsletterPreferenceFields from "@/src/components/newsletter/NewsletterPreferenceFields";
import type { Profile } from "@/src/lib/profile";
import {
  resolveStoredNewsletterPreferences,
  sanitizeNewsletterSelection,
} from "@/src/lib/newsletter-preferences";

type NewsletterPreferencesFormProps = {
  profile: Profile;
};

export default function NewsletterPreferencesForm({
  profile,
}: NewsletterPreferencesFormProps) {
  const router = useRouter();
  const stored = resolveStoredNewsletterPreferences({
    areas: profile.newsletter_areas,
    disciplines: profile.newsletter_disciplines,
    city: profile.newsletter_city,
    category: profile.newsletter_category,
    municipality: profile.municipality,
    province: profile.province,
  });

  const [optIn, setOptIn] = useState(profile.newsletter_opt_in);
  const [areas, setAreas] = useState<string[]>(stored.areas);
  const [disciplines, setDisciplines] = useState<string[]>(stored.disciplines);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (optIn) {
      const selection = sanitizeNewsletterSelection(areas, disciplines);
      if (!selection.ok) {
        setErrorMessage(selection.error);
        return;
      }
    }

    setIsLoading(true);
    const response = await fetch("/api/newsletter/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optIn, areas, disciplines }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;

    if (!response.ok) {
      setErrorMessage(payload?.error || "Salvataggio non riuscito.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      payload?.message ||
        (optIn
          ? "Preferenze salvate. Riceverai la newsletter ogni settimana."
          : "Ti sei disiscritto dalla newsletter."),
    );
    setIsLoading(false);
    router.refresh();
  }

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
            Una email a settimana con i corsi delle zone e delle discipline che scegli.
          </span>
        </span>
      </label>

      {optIn ? (
        <NewsletterPreferenceFields
          areas={areas}
          disciplines={disciplines}
          onAreasChange={setAreas}
          onDisciplinesChange={setDisciplines}
          name="preferences"
        />
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
