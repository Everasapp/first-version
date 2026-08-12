"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import { requestAdminNotification } from "@/src/lib/notifications/client";
import { createClient } from "@/src/lib/supabase/client";

export default function RegistratiPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [newsletterCity, setNewsletterCity] = useState("");
  const [newsletterCategory, setNewsletterCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.city.localeCompare(b.city, "it")),
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("La password deve contenere almeno 8 caratteri.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Le due password non coincidono.");
      return;
    }

    if (newsletterOptIn && (!newsletterCity || !newsletterCategory)) {
      setErrorMessage(
        "Per la newsletter scegli città e categoria preferita.",
      );
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          newsletter_opt_in: newsletterOptIn,
          newsletter_city: newsletterOptIn ? newsletterCity : null,
          newsletter_category: newsletterOptIn ? newsletterCategory : null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setErrorMessage(
        error.message === "User already registered"
          ? "Esiste già un account associato a questa email."
          : error.message,
      );
      setIsLoading(false);
      return;
    }

    if (data.user?.id) {
      requestAdminNotification({
        type: "user_registered",
        userId: data.user.id,
      });
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccessMessage(
      "Registrazione completata. Controlla la tua email, apri il messaggio di EVERAS e tocca «Conferma email» nella pagina che si apre.",
    );
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNewsletterOptIn(false);
    setNewsletterCity("");
    setNewsletterCategory("");
    setIsLoading(false);
  }

  const inputClassName =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center"
              aria-label="Torna alla homepage di EVERAS"
            >
              <Image
                src="/images/everas-logo-v2.png"
                alt="EVERAS"
                width={144}
                height={53}
                priority
                className="h-auto w-[144px]"
              />
            </Link>
            <h1 className="mt-7 text-3xl font-bold text-slate-900">
              Crea il tuo account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Registrati come utente. Se un giorno vorrai pubblicare eventi,
              potrai diventare organizzatore con lo stesso account.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Nome e cognome
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Mario Rossi"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@email.it"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Almeno 8 caratteri"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Conferma password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ripeti la password"
                className={inputClassName}
              />
            </div>

            <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={(event) => setNewsletterOptIn(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E67E22] focus:ring-[#E67E22]"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Voglio la newsletter settimanale
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    Una volta a settimana ricevi eventi per la tua città e la
                    categoria preferita.
                  </span>
                </span>
              </label>

              {newsletterOptIn ? (
                <div className="mt-4 grid gap-4">
                  <div>
                    <label
                      htmlFor="newsletterCity"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Città preferita
                    </label>
                    <select
                      id="newsletterCity"
                      required={newsletterOptIn}
                      value={newsletterCity}
                      onChange={(event) => setNewsletterCity(event.target.value)}
                      className={inputClassName}
                    >
                      <option value="">Seleziona città</option>
                      {sortedCities.map((city) => (
                        <option key={city.id} value={city.city}>
                          {city.city} ({city.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="newsletterCategory"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Categoria preferita
                    </label>
                    <select
                      id="newsletterCategory"
                      required={newsletterOptIn}
                      value={newsletterCategory}
                      onChange={(event) =>
                        setNewsletterCategory(event.target.value)
                      }
                      className={inputClassName}
                    >
                      <option value="">Seleziona categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </fieldset>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              >
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#E67E22] px-5 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Registrazione in corso..." : "Registrati"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Hai già un account?{" "}
            <Link
              href="/accedi"
              className="font-bold text-[#075EAE] hover:underline"
            >
              Accedi
            </Link>
          </p>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-[#075EAE]"
            >
              ← Torna alla homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
