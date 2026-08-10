"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import {
  isValidVatNumber,
  normalizeVatNumber,
  type Profile,
} from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

type OrganizerProfileFormProps = {
  profile: Profile;
};

export default function OrganizerProfileForm({
  profile,
}: OrganizerProfileFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [businessName, setBusinessName] = useState(profile.business_name ?? "");
  const [vatNumber, setVatNumber] = useState(profile.vat_number ?? "");
  const [municipality, setMunicipality] = useState(profile.municipality ?? "");
  const [province, setProvince] = useState(profile.province ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedBusiness = businessName.trim();
    const cleanedVat = normalizeVatNumber(vatNumber);

    if (cleanedBusiness.length < 2) {
      setErrorMessage("Inserisci il nome dell’attività (almeno 2 caratteri).");
      return;
    }

    if (!isValidVatNumber(cleanedVat)) {
      setErrorMessage("La partita IVA deve contenere 11 cifre.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        business_name: cleanedBusiness,
        vat_number: cleanedVat || null,
        municipality: municipality.trim() || null,
        province: province.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Profilo aggiornato.");
    setIsLoading(false);
    router.refresh();
  }

  const inputClassName =
    "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="full-name" className="text-sm font-semibold text-slate-800">
          Nome e cognome
        </label>
        <input
          id="full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClassName}
          autoComplete="name"
        />
      </div>

      <div>
        <label
          htmlFor="business-name"
          className="text-sm font-semibold text-slate-800"
        >
          Nome dell’attività
        </label>
        <input
          id="business-name"
          required
          minLength={2}
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className={inputClassName}
          autoComplete="organization"
        />
      </div>

      <div>
        <label htmlFor="vat-number" className="text-sm font-semibold text-slate-800">
          Partita IVA{" "}
          <span className="font-normal text-slate-500">(opzionale)</span>
        </label>
        <input
          id="vat-number"
          inputMode="numeric"
          maxLength={11}
          value={vatNumber}
          onChange={(event) =>
            setVatNumber(event.target.value.replace(/[^\d]/g, "").slice(0, 11))
          }
          className={inputClassName}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="municipality"
            className="text-sm font-semibold text-slate-800"
          >
            Comune
          </label>
          <input
            id="municipality"
            value={municipality}
            onChange={(event) => setMunicipality(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="province" className="text-sm font-semibold text-slate-800">
            Provincia
          </label>
          <input
            id="province"
            value={province}
            onChange={(event) => setProvince(event.target.value)}
            className={inputClassName}
            placeholder="Es. SS"
          />
        </div>
      </div>

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
            Salva profilo
          </>
        )}
      </button>
    </form>
  );
}
