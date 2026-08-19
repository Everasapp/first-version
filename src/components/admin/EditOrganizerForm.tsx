"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";

import type {
  OrganizerClaimStatus,
  OrganizerDirectoryRow,
} from "@/src/lib/admin/organizer-directory";
import { createClient } from "@/src/lib/supabase/client";

type EditableFields = {
  name: string;
  website: string;
  email: string;
  pec: string;
  phone: string;
  address: string;
  email_cultura: string;
  email_turismo: string;
  email_eventi: string;
  facebook: string;
  instagram: string;
  claim_status: OrganizerClaimStatus;
};

const FIELD_LABELS: { key: keyof Omit<EditableFields, "claim_status">; label: string }[] = [
  { key: "name", label: "Nome" },
  { key: "website", label: "Sito web" },
  { key: "email", label: "Email" },
  { key: "pec", label: "PEC" },
  { key: "phone", label: "Telefono" },
  { key: "address", label: "Indirizzo" },
  { key: "email_cultura", label: "Email Cultura" },
  { key: "email_turismo", label: "Email Turismo" },
  { key: "email_eventi", label: "Email Eventi" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
];

function toFormState(org: OrganizerDirectoryRow): EditableFields {
  return {
    name: org.name ?? "",
    website: org.website ?? "",
    email: org.email ?? "",
    pec: org.pec ?? "",
    phone: org.phone ?? "",
    address: org.address ?? "",
    email_cultura: org.email_cultura ?? "",
    email_turismo: org.email_turismo ?? "",
    email_eventi: org.email_eventi ?? "",
    facebook: org.facebook ?? "",
    instagram: org.instagram ?? "",
    claim_status: org.claim_status === "claimed" ? "claimed" : "unclaimed",
  };
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

const EMAIL_FIELD_KEYS = new Set<keyof EditableFields>([
  "email",
  "pec",
  "email_cultura",
  "email_turismo",
  "email_eventi",
]);

function normalizeEmailList(value: string) {
  const parts = value
    .split(/[;,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join("; ") : null;
}

function isEmailField(key: keyof EditableFields) {
  return EMAIL_FIELD_KEYS.has(key);
}

type EditOrganizerFormProps = {
  organizer: OrganizerDirectoryRow;
};

export default function EditOrganizerForm({ organizer }: EditOrganizerFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<EditableFields>(() => toFormState(organizer));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function patchField<K extends keyof EditableFields>(
    key: K,
    value: EditableFields[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      setErrorMessage("Il nome è obbligatorio.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("organizer_directory")
      .update({
        name,
        website: emptyToNull(form.website),
        email: normalizeEmailList(form.email),
        pec: normalizeEmailList(form.pec),
        phone: emptyToNull(form.phone),
        address: emptyToNull(form.address),
        email_cultura: normalizeEmailList(form.email_cultura),
        email_turismo: normalizeEmailList(form.email_turismo),
        email_eventi: normalizeEmailList(form.email_eventi),
        facebook: emptyToNull(form.facebook),
        instagram: emptyToNull(form.instagram),
        claim_status: form.claim_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organizer.id);

    if (error) {
      setIsSaving(false);
      setErrorMessage(`Salvataggio non riuscito: ${error.message}`);
      return;
    }

    if (name !== organizer.name.trim()) {
      const { error: eventsError } = await supabase
        .from("events")
        .update({
          organizer_display_name: name,
          updated_at: new Date().toISOString(),
        })
        .eq("organizer_directory_id", organizer.id);

      if (eventsError) {
        setIsSaving(false);
        setErrorMessage(
          `Organizzatore salvato, ma il nome non è stato aggiornato sugli eventi: ${eventsError.message}`,
        );
        return;
      }
    }

    setIsSaving(false);
    setSuccessMessage("Modifiche salvate.");
    router.refresh();
  }

  const fieldClassName =
    "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#075EAE] focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSave}
      noValidate
      className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6"
    >
      <div className="space-y-4">
        {FIELD_LABELS.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            {key === "address" ? (
              <textarea
                rows={2}
                value={form[key]}
                onChange={(e) => patchField(key, e.target.value)}
                className={fieldClassName}
              />
            ) : (
              <input
                type="text"
                inputMode={isEmailField(key) ? "email" : "text"}
                value={form[key]}
                onChange={(e) => patchField(key, e.target.value)}
                className={fieldClassName}
                autoComplete="off"
              />
            )}
            {isEmailField(key) ? (
              <p className="mt-1 text-xs text-slate-500">
                Puoi inserire più indirizzi, separati da spazio, virgola o
                punto e virgola.
              </p>
            ) : null}
          </label>
        ))}

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Stato</span>
          <select
            value={form.claim_status}
            onChange={(e) =>
              patchField(
                "claim_status",
                e.target.value === "claimed" ? "claimed" : "unclaimed",
              )
            }
            className={fieldClassName}
          >
            <option value="unclaimed">Non rivendicato</option>
            <option value="claimed">Rivendicato</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#075EAE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#064E91] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="h-4 w-4" />
          )}
          {isSaving ? "Salvataggio…" : "Salva modifiche"}
        </button>

        {successMessage ? (
          <p className="text-sm font-semibold text-emerald-700">{successMessage}</p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="text-sm font-semibold text-red-600">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
