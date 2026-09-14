"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoaderCircle, Mail } from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";

export default function HomeNewsletterSignup() {
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.city.localeCompare(b.city, "it")),
    [],
  );

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, category }),
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
      setCity("");
      setCategory("");
    } catch {
      setErrorMessage("Iscrizione non riuscita. Riprova.");
    } finally {
      setIsLoading(false);
    }
  }

  const fieldClassName =
    "h-11 w-full rounded-xl border border-white/25 bg-white/95 px-3 text-sm text-slate-900 outline-none transition focus:border-white focus:ring-2 focus:ring-white/40";

  return (
    <div className="mt-6 w-full rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-sm sm:mt-8 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E67E22] text-white">
          <Mail aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white sm:text-lg">
            Iscriviti alla newsletter
          </h2>
          <p className="mt-1 text-sm leading-6 text-blue-50/90">
            Una volta a settimana, eventi vicino a te. Solo email, senza
            account.
          </p>
        </div>
      </div>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="La tua email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClassName}
            />
          </label>

          <label>
            <span className="sr-only">Città</span>
            <select
              required
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={fieldClassName}
            >
              <option value="">Città</option>
              {sortedCities.map((item) => (
                <option key={item.id} value={item.city}>
                  {item.city} ({item.province})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Categoria</span>
            <select
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={fieldClassName}
            >
              <option value="">Categoria</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1 lg:w-auto lg:min-w-[8.5rem]"
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                />
                Iscrizione...
              </>
            ) : (
              "Iscriviti"
            )}
          </button>
        </div>

        {errorMessage ? (
          <p className="rounded-xl bg-red-500/90 px-3 py-2 text-sm font-medium text-white">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl bg-emerald-500/90 px-3 py-2 text-sm font-medium text-white">
            {successMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
