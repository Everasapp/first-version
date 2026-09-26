"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  LAUNCH_CAMPAIGN,
  type AdvertisingPackage,
  type ResolvedPackagePricing,
} from "@/src/lib/ads/advertising-packages";

const MAX_BANNER_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function AdvertisingRequestForm({
  pkg,
  pricing,
}: {
  pkg: AdvertisingPackage;
  pricing: ResolvedPackagePricing;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onFileChange(file: File | null) {
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Formato non consentito. Usa JPG, PNG o WEBP.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      setError("Il banner non deve superare 5 MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("package_id", pkg.id);

      const response = await fetch("/api/advertising/orders", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Invio non riuscito.");
      }

      if (data.redirectTo) {
        router.push(data.redirectTo);
        return;
      }

      throw new Error("Risposta non valida.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invio non riuscito.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-2xl border border-[#E67E22]/30 bg-[#E67E22]/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#C96A1A]">
          Pacchetto selezionato
        </p>
        <p className="mt-2 text-lg font-bold text-slate-900">{pkg.name}</p>
        <p className="mt-1 text-sm text-slate-600">
          {pkg.durationMonths} mesi
        </p>
        <div className="mt-3">
          {pricing.promoApplied ? (
            <>
              <p className="text-sm text-slate-400 line-through">
                €{pricing.listPrice}
              </p>
              <p className="text-2xl font-black text-[#E67E22]">
                €{pricing.finalPrice}
              </p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#C96A1A]">
                {LAUNCH_CAMPAIGN.tagline}
              </p>
            </>
          ) : (
            <p className="text-2xl font-black text-slate-900">
              €{pricing.finalPrice}
            </p>
          )}
        </div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900">
          Dati dell&apos;attività
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nome azienda / attività *
            </span>
            <input
              name="company_name"
              required
              maxLength={200}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Nome referente *
            </span>
            <input
              name="contact_name"
              required
              maxLength={120}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email *
            </span>
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Telefono *
            </span>
            <input
              name="phone"
              type="tel"
              required
              maxLength={40}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900">Indirizzo</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Indirizzo *
            </span>
            <input
              name="address"
              required
              maxLength={250}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              CAP *
            </span>
            <input
              name="postal_code"
              required
              maxLength={12}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Comune *
            </span>
            <input
              name="city"
              required
              maxLength={120}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Provincia *
            </span>
            <input
              name="province"
              required
              maxLength={80}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900">Link</legend>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            URL da collegare al banner *
          </span>
          <input
            name="website_url"
            type="url"
            required
            placeholder="https://"
            maxLength={500}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#075EAE] focus:ring-2"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900">Banner</legend>
        <p className="text-sm text-slate-600">
          Carica il tuo banner. Formati: JPG, PNG, WEBP. Max 5 MB.
        </p>
        <input
          ref={fileRef}
          name="banner"
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          required
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#075EAE] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {previewUrl ? (
          <div className="relative mt-2 aspect-[16/10] max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <Image
              src={previewUrl}
              alt="Anteprima banner"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ) : null}
      </fieldset>

      <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          name="privacy"
          value="on"
          required
          className="mt-0.5"
        />
        <span>
          Ho letto e accetto l&apos;
          <Link
            href="/privacy"
            target="_blank"
            className="font-semibold text-[#075EAE] hover:underline"
          >
            informativa sulla privacy
          </Link>
          .
        </span>
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Invio in corso..." : "Invia richiesta"}
      </button>
    </form>
  );
}
