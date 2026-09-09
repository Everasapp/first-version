"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, LoaderCircle, Save } from "lucide-react";

import type { OrganizerDirectoryPublic } from "@/src/lib/organizer-claim";
import { asHttpUrl, getOrganizerDirectoryHref } from "@/src/lib/organizer-page";
import { createClient } from "@/src/lib/supabase/client";

type OrganizerPublicPageFormProps = {
  directory: OrganizerDirectoryPublic;
};

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

function optionalUrlOrEmpty(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!asHttpUrl(trimmed)) {
    throw new Error(`${label}: inserisci un indirizzo web valido.`);
  }
  return asHttpUrl(trimmed) || trimmed;
}

export default function OrganizerPublicPageForm({
  directory,
}: OrganizerPublicPageFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [description, setDescription] = useState(
    directory.public_description ?? "",
  );
  const [website, setWebsite] = useState(directory.website ?? "");
  const [facebook, setFacebook] = useState(directory.facebook ?? "");
  const [instagram, setInstagram] = useState(directory.instagram ?? "");
  const [address, setAddress] = useState(directory.address ?? "");
  const [phone, setPhone] = useState(directory.phone ?? "");
  const [enabled, setEnabled] = useState(directory.public_page_enabled);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const publicHref = directory.slug
    ? `/organizzatori/${directory.slug}`
    : null;
  const liveHref = getOrganizerDirectoryHref({
    slug: directory.slug,
    public_page_enabled: enabled,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    let websiteValue = "";
    let facebookValue = "";
    let instagramValue = "";

    try {
      websiteValue = optionalUrlOrEmpty(website, "Sito web");
      facebookValue = optionalUrlOrEmpty(facebook, "Facebook");
      instagramValue = optionalUrlOrEmpty(instagram, "Instagram");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Controlla i campi inseriti.",
      );
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.rpc("update_organizer_public_page", {
      p_directory_id: directory.id,
      p_website: websiteValue,
      p_facebook: facebookValue,
      p_instagram: instagramValue,
      p_address: address.trim(),
      p_phone: phone.trim(),
      p_description: description.trim(),
      p_enabled: enabled,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      enabled
        ? "Pagina pubblica aggiornata. È visibile su EVERAS."
        : "Modifiche salvate. La pagina resta nascosta finché non la pubblichi.",
    );
    setIsLoading(false);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {publicHref ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Indirizzo della pagina:{" "}
          <span className="font-semibold text-slate-900">
            everas.it{publicHref}
          </span>
          {liveHref ? (
            <>
              {" "}
              ·{" "}
              <Link
                href={liveHref}
                target="_blank"
                className="inline-flex items-center gap-1 font-bold text-[#075EAE] hover:underline"
              >
                Aprila
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              {" "}
              ·{" "}
              <Link
                href={publicHref}
                className="font-bold text-[#075EAE] hover:underline"
              >
                Anteprima
              </Link>
            </>
          )}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="public-description"
          className="text-sm font-semibold text-slate-800"
        >
          Presentazione{" "}
          <span className="font-normal text-slate-500">(opzionale)</span>
        </label>
        <textarea
          id="public-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={2000}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
          placeholder="Chi siete e che tipo di eventi organizzate."
        />
      </div>

      <div>
        <label htmlFor="website" className="text-sm font-semibold text-slate-800">
          Sito web
        </label>
        <input
          id="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className={inputClassName}
          placeholder="https://www.comune.esempio.it"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="facebook"
            className="text-sm font-semibold text-slate-800"
          >
            Facebook
          </label>
          <input
            id="facebook"
            value={facebook}
            onChange={(event) => setFacebook(event.target.value)}
            className={inputClassName}
            placeholder="https://www.facebook.com/..."
          />
        </div>
        <div>
          <label
            htmlFor="instagram"
            className="text-sm font-semibold text-slate-800"
          >
            Instagram
          </label>
          <input
            id="instagram"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
            className={inputClassName}
            placeholder="https://www.instagram.com/..."
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="address" className="text-sm font-semibold text-slate-800">
            Indirizzo
          </label>
          <input
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-slate-800">
            Telefono
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#075EAE] focus:ring-[#075EAE]"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Pubblica la pagina su EVERAS
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            Chi visita un vostro evento potrà aprire la pagina con tutti gli
            appuntamenti organizzati.
          </span>
        </span>
      </label>

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
            Salva pagina
          </>
        )}
      </button>
    </form>
  );
}
