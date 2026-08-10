"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LoaderCircle } from "lucide-react";

import {
  isValidVatNumber,
  normalizeVatNumber,
} from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

type BecomeOrganizerFormProps = {
  nextPath: string;
  initialBusinessName?: string;
  initialVatNumber?: string;
};

export default function BecomeOrganizerForm({
  nextPath,
  initialBusinessName = "",
  initialVatNumber = "",
}: BecomeOrganizerFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [vatNumber, setVatNumber] = useState(initialVatNumber);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const cleanedName = businessName.trim();
    const cleanedVat = normalizeVatNumber(vatNumber);

    if (cleanedName.length < 2) {
      setErrorMessage("Inserisci il nome dell’attività (almeno 2 caratteri).");
      return;
    }

    if (!isValidVatNumber(cleanedVat)) {
      setErrorMessage("La partita IVA deve contenere 11 cifre.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.rpc("become_organizer", {
      p_business_name: cleanedName,
      p_vat_number: cleanedVat || null,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  const inputClassName =
    "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="business-name"
          className="text-sm font-semibold text-slate-800"
        >
          Nome dell’attività o dell’organizzatore
        </label>
        <input
          id="business-name"
          name="businessName"
          type="text"
          required
          minLength={2}
          maxLength={120}
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className={inputClassName}
          placeholder="Es. Associazione Mare Aperto"
          autoComplete="organization"
        />
      </div>

      <div>
        <label
          htmlFor="vat-number"
          className="text-sm font-semibold text-slate-800"
        >
          Partita IVA{" "}
          <span className="font-normal text-slate-500">(opzionale)</span>
        </label>
        <input
          id="vat-number"
          name="vatNumber"
          type="text"
          inputMode="numeric"
          maxLength={11}
          value={vatNumber}
          onChange={(event) =>
            setVatNumber(event.target.value.replace(/[^\d]/g, "").slice(0, 11))
          }
          className={inputClassName}
          placeholder="11 cifre, se ce l’hai"
          autoComplete="off"
        />
        <p className="mt-2 text-sm text-slate-500">
          Serve se pubblichi come attività con partita IVA. Puoi aggiungerla
          anche più avanti.
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Attivazione in corso...
          </>
        ) : (
          <>
            <Building2 aria-hidden="true" className="h-5 w-5" />
            Diventa organizzatore
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        Resta comunque un utente Everas: preferiti e altre funzioni restano sul
        tuo stesso account.{" "}
        <Link href="/dashboard" className="font-semibold text-[#075EAE] hover:underline">
          Torna alla dashboard
        </Link>
      </p>
    </form>
  );
}
