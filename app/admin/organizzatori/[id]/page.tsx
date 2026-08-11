import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/src/lib/auth";
import type { OrganizerDirectoryRow } from "@/src/lib/admin/organizer-directory";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function claimLabel(status: string) {
  return status === "claimed" ? "Rivendicato" : "Non rivendicato";
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">
        {value ? (
          value.startsWith("http") ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[#075EAE] hover:underline"
            >
              {value}
            </a>
          ) : (
            <span className="break-words">{value}</span>
          )
        ) : (
          <span className="text-slate-400">Non presente</span>
        )}
      </dd>
    </div>
  );
}

export default async function AdminOrganizzatoreDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin(`/admin/organizzatori/${id}`);

  const { data, error } = await supabase
    .from("organizer_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const org = data as OrganizerDirectoryRow;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link
        href="/admin/organizzatori"
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        ← Torna all&apos;elenco
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {org.name}
          </h1>
          <p className="mt-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                org.claim_status === "claimed"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {claimLabel(org.claim_status)}
            </span>
          </p>
        </div>
        <Link
          href="/admin/ricerca-contatti"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
        >
          Nuova ricerca
        </Link>
      </div>

      <dl className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-2 shadow-sm">
        <Row label="Sito web" value={org.website} />
        <Row label="Email" value={org.email} />
        <Row label="PEC" value={org.pec} />
        <Row label="Telefono" value={org.phone} />
        <Row label="Indirizzo" value={org.address} />
        <Row label="Email Cultura" value={org.email_cultura} />
        <Row label="Email Turismo" value={org.email_turismo} />
        <Row label="Email Eventi" value={org.email_eventi} />
        <Row label="Facebook" value={org.facebook} />
        <Row label="Instagram" value={org.instagram} />
      </dl>
    </div>
  );
}
