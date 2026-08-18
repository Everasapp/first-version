"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildAuthHref,
  parseSafeRedirectPath,
  parseSignupEmail,
} from "@/src/lib/auth-urls";
import { markEverasAccountKnown } from "@/src/lib/auth-preference";
import { createClient } from "@/src/lib/supabase/client";

type AccediPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    email?: string | string[];
    error?: string | string[];
  }>;
};

export default function AccediPage({ searchParams }: AccediPageProps) {
  const params = use(searchParams);
  const redirectPath = parseSafeRedirectPath(params.redirect);
  const initialEmail = parseSignupEmail(params.email);
  const router = useRouter();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    (Array.isArray(params.error) ? params.error[0] : params.error) === "conferma"
      ? "Il link di conferma non è valido o è scaduto. Richiedi una nuova email di conferma oppure registrati di nuovo."
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const registerHref = buildAuthHref("/registrati", {
    redirect: redirectPath,
    email,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(
        error.message === "Invalid login credentials"
          ? "Email o password non corretti. Se ti sei appena registrato, conferma prima la tua email."
          : error.message,
      );

      setIsLoading(false);
      return;
    }

    markEverasAccountKnown();
    router.push(redirectPath);
    router.refresh();
  }

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
  src="/images/everas-logo-v2.webp"
  alt="EVERAS"
  width={144}
  height={53}
  priority
  className="h-auto w-[144px]"
/>
</Link>

            <h1 className="mt-7 text-3xl font-bold text-slate-900">
              Accedi
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {redirectPath.startsWith("/rivendica/")
                ? "Accedi per rivendicare il profilo organizzatore."
                : "Accedi al tuo account per pubblicare e gestire i tuoi eventi."}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Inserisci la password"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#075EAE] px-5 font-bold text-white transition hover:bg-[#064d8e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Non hai ancora un account?{" "}
            <Link
              href={registerHref}
              className="font-bold text-[#075EAE] hover:underline"
            >
              Registrati
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