"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import { categories } from "@/src/data/categories";
import {
  communityDisplayName,
  sanitizeInterests,
} from "@/src/lib/community";
import {
  PHOTO_MAX_BYTES,
  isAllowedPhoto,
  isHeicPhoto,
} from "@/src/lib/images/allowedPhoto";
import type { Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/client";

type CommunityProfileFormProps = {
  profile: Profile;
};

export default function CommunityProfileForm({
  profile,
}: CommunityProfileFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [displayName, setDisplayName] = useState(
    profile.display_name ?? communityDisplayName(null, profile.full_name),
  );
  const [interests, setInterests] = useState<string[]>(
    Array.isArray(profile.interests) ? profile.interests : [],
  );
  const [openToMeeting, setOpenToMeeting] = useState(
    Boolean(profile.open_to_meeting),
  );
  const [showInCommunity, setShowInCommunity] = useState(
    profile.show_in_community !== false,
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function toggleInterest(slug: string) {
    setInterests((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= 6) return current;
      return [...current, slug];
    });
  }

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setErrorMessage("");
    setSuccessMessage("");

    if (isHeicPhoto(file)) {
      setErrorMessage(
        "Le foto HEIC dell'iPhone non sono supportate. Esporta in JPG o PNG e riprova.",
      );
      return;
    }

    if (!isAllowedPhoto(file)) {
      setErrorMessage("Usa un file JPG, PNG o WebP.");
      return;
    }

    if (file.size > PHOTO_MAX_BYTES) {
      setErrorMessage("La foto non deve superare 5 MB.");
      return;
    }

    setIsUploading(true);

    try {
      await file.arrayBuffer();
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body,
        credentials: "same-origin",
      });
      const payload = (await response.json().catch(() => ({}))) as {
        publicUrl?: string;
        error?: string;
      };
      if (!response.ok || !payload.publicUrl) {
        setErrorMessage(payload.error || "Caricamento foto non riuscito.");
        return;
      }
      setAvatarUrl(payload.publicUrl);
      setSuccessMessage("Foto aggiornata.");
      router.refresh();
    } catch {
      setErrorMessage(
        "Non è stato possibile leggere o caricare la foto. Prova un JPG o PNG più piccolo.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedName = displayName.trim();
    if (cleanedName.length < 2) {
      setErrorMessage("Scegli un nome visibile di almeno 2 caratteri.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: cleanedName,
        interests: sanitizeInterests(interests),
        open_to_meeting: openToMeeting,
        show_in_community: showInCommunity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Profilo community salvato.");
    setIsLoading(false);
    router.refresh();
  }

  const inputClassName =
    "mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#075EAE] text-xl font-bold text-white">
            {displayName.trim().slice(0, 1).toUpperCase() || "E"}
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]">
          {isUploading ? "Caricamento…" : "Carica una foto"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => {
              const picked = event.target.files?.[0];
              event.target.value = "";
              void handlePhoto(picked);
            }}
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700" role="status">
          {successMessage}
        </p>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="display-name" className="text-sm font-semibold text-slate-800">
          Nome visibile
        </label>
        <input
          id="display-name"
          value={displayName}
          maxLength={40}
          onChange={(event) => setDisplayName(event.target.value)}
          className={inputClassName}
          autoComplete="nickname"
        />
        <p className="mt-2 text-xs text-slate-500">
          Compare solo a chi è iscritto, sulle pagine evento. Non mostriamo
          email o telefono.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">
          Interessi{" "}
          <span className="font-normal text-slate-500">(fino a 6)</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = interests.includes(category.slug);
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => toggleInterest(category.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  selected
                    ? "bg-[#075EAE] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={openToMeeting}
          onChange={(event) => setOpenToMeeting(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E67E22] focus:ring-[#E67E22]"
        />
        <span>
          <span className="block text-sm font-bold text-slate-800">
            Aperto/a a conoscere persone nuove
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            Impostazione facoltativa. Puoi cambiarla anche su ogni singolo
            evento.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <input
          type="checkbox"
          checked={showInCommunity}
          onChange={(event) => setShowInCommunity(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#E67E22] focus:ring-[#E67E22]"
        />
        <span>
          <span className="block text-sm font-bold text-slate-800">
            Mostra il mio nome tra chi ci va
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            Se lo togli, conti comunque nel totale ma non compari nell’elenco.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 font-bold text-white transition hover:bg-[#C96A1A] disabled:opacity-60"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : (
          <Save aria-hidden="true" className="h-5 w-5" />
        )}
        Salva
      </button>
    </form>
    </div>
  );
}
