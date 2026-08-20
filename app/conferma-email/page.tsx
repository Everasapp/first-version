"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

function safeNext(value: string | null) {
  if (!value) {
    return "/dashboard";
  }

  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("://")) {
    return value;
  }

  try {
    const url = new URL(value);
    const nested = url.searchParams.get("next");
    if (nested?.startsWith("/") && !nested.startsWith("//")) {
      return nested;
    }
  } catch {
    // ignore
  }

  return "/dashboard";
}

const OTP_TYPES: EmailOtpType[] = ["signup", "email", "magiclink"];

function ConfermaEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const tokenHash = searchParams.get("token_hash") ?? "";
  const typeHint = (searchParams.get("type") as EmailOtpType | null) ?? "";
  const nextPath = safeNext(searchParams.get("next"));
  const confirmationUrl = searchParams.get("confirmation_url") ?? "";
  const canConfirm = Boolean(tokenHash || confirmationUrl);

  function handleConfirm() {
    setErrorMessage("");

    startTransition(async () => {
      if (confirmationUrl) {
        window.location.href = confirmationUrl;
        return;
      }

      if (!tokenHash) {
        setErrorMessage(
          "Link incompleto. Apri di nuovo il messaggio di conferma oppure registrati di nuovo.",
        );
        return;
      }

      const supabase = createClient();
      const typesToTry = typeHint
        ? [typeHint, ...OTP_TYPES.filter((item) => item !== typeHint)]
        : OTP_TYPES;

      let lastError = "";

      for (const type of typesToTry) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (!error) {
          router.replace(nextPath);
          router.refresh();
          return;
        }

        lastError = error.message;
      }

      setErrorMessage(
        lastError.toLowerCase().includes("expired") ||
          lastError.toLowerCase().includes("invalid")
          ? "Questo link non è più valido (già usato o scaduto). Se la registrazione risulta completata, non serve riprovare: vai su Accedi con email e password."
          : lastError,
      );
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-9">
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

      <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
        Attivazione account
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">
        Conferma la tua email
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Per sicurezza, tocca il pulsante qui sotto. Così evitiamo che il link
        venga invalidato automaticamente dal tuo client di posta.
      </p>

      {errorMessage ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!canConfirm || isPending}
        className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Conferma in corso...
          </>
        ) : (
          "Conferma email"
        )}
      </button>

      {!canConfirm ? (
        <p className="mt-4 text-sm text-slate-500">
          Link non valido. Torna alla{" "}
          <Link
            href="/registrati"
            className="font-semibold text-[#075EAE] hover:underline"
          >
            registrazione
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-8 border-t border-slate-200 pt-6">
        <Link
          href="/accedi"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-[#075EAE] bg-white px-5 text-sm font-bold text-[#075EAE] transition hover:bg-[#075EAE] hover:text-white"
        >
          Vai ad Accedi
        </Link>
      </div>
    </div>
  );
}

export default function ConfermaEmailPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-9 text-center text-slate-600 shadow-sm">
              Caricamento...
            </div>
          }
        >
          <ConfermaEmailContent />
        </Suspense>
      </div>
    </main>
  );
}
