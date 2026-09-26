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
const MAX_BANNER_FILES = 3;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export default function AdvertisingRequestForm({
  pkg,
  pricing,
}: {
  pkg: AdvertisingPackage;
  pricing: ResolvedPackagePricing;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function clearPreviews() {
    for (const url of previewUrls) {
      URL.revokeObjectURL(url);
    }
    setPreviewUrls([]);
  }

  function onFileChange(fileList: FileList | null) {
    setError(null);
    clearPreviews();
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, MAX_BANNER_FILES);
    if (fileList.length > MAX_BANNER_FILES) {
      setError(`Puoi caricare al massimo ${MAX_BANNER_FILES} immagini.`);
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        setError("Formato non consentito. Usa JPG, PNG, WEBP o GIF.");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      if (file.size > MAX_BANNER_BYTES) {
        setError("Ogni banner non deve superare 5 MB.");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
    }

    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      formData.set("package_id", pkg.id);

      // Solo hostname: il server antepone http://
      const websiteInput = formData.get("website_url");
      if (typeof websiteInput === "string") {
        formData.set("website_url", websiteInput.trim());
      }

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
          <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#075EAE]">
            <span className="flex shrink-0 items-center bg-slate-50 px-3 text-sm text-slate-500">
              http://
            </span>
            <input
              name="website_url"
              type="text"
              required
              inputMode="url"
              autoComplete="url"
              placeholder="www.sito.com"
              maxLength={500}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900">Banner</legend>
        <p className="text-sm text-slate-600">
          Carica da 1 a 3 immagini. Formati: JPG, PNG, WEBP o GIF. Max 5 MB
          ciascuna.
        </p>
        <input
          ref={fileRef}
          name="banner"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          multiple
          required
          onChange={(e) => onFileChange(e.target.files)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#075EAE] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {previewUrls.length > 0 ? (
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {previewUrls.map((url, index) => (
              <div
                key={url}
                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              >
                <Image
                  src={url}
                  alt={`Anteprima banner ${index + 1}`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ))}
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
