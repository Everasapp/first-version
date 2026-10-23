"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Mail } from "lucide-react";

import NewsletterPreferenceFields from "@/src/components/newsletter/NewsletterPreferenceFields";
import { sanitizeNewsletterSelection } from "@/src/lib/newsletter-preferences";

export default function HomeNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const selection = sanitizeNewsletterSelection(areas, disciplines);
    if (!selection.ok) {
      setErrorMessage(selection.error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          areas: selection.selection.areas,
          disciplines: selection.selection.disciplines,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setErrorMessage(payload.error || "Iscrizione non riuscita. Riprova.");
        return;
      }

      setSuccessMessage(
        payload.message ||
          "Iscrizione completata. Riceverai la newsletter ogni settimana.",
      );
      setEmail("");
      setAreas([]);
      setDisciplines([]);
    } catch {
      setErrorMessage("Iscrizione non riuscita. Riprova.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#c5d8ec] bg-white/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E67E22] text-white">
          <Mail aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Iscriviti alla newsletter
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Una email a settimana con i corsi delle zone e delle discipline che
            scegli. Senza account.
          </p>
        </div>
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <label className="min-w-0 w-full max-w-72">
            <span className="sr-only">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="La tua email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#c5d8ec] bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#075EAE] focus:ring-2 focus:ring-[#075EAE]/25"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                Iscrizione...
              </>
            ) : (
              "Iscriviti"
            )}
          </button>
        </div>

        {email.trim() ? (
          <NewsletterPreferenceFields
            areas={areas}
            disciplines={disciplines}
            onAreasChange={setAreas}
            onDisciplinesChange={setDisciplines}
          />
        ) : null}

        {errorMessage ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
            {successMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
