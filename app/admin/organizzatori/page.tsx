import Link from "next/link";

import { requireAdmin } from "@/src/lib/auth";
import type { OrganizerDirectoryRow } from "@/src/lib/admin/organizer-directory";

export const dynamic = "force-dynamic";

function claimLabel(status: string) {
  return status === "claimed" ? "Rivendicato" : "Non rivendicato";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

export default async function AdminOrganizzatoriPage() {
  const { supabase } = await requireAdmin("/admin/organizzatori");

  const { data, error } = await supabase
    .from("organizer_directory")
    .select(
      "id, name, website, email, pec, phone, address, facebook, instagram, email_cultura, email_turismo, email_eventi, claim_status, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile caricare gli organizzatori: ${error.message}`);
  }

  const organizers = (data || []) as OrganizerDirectoryRow[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Organizzatori salvati
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Profili raccolti dalla ricerca contatti. Stato attuale: non
            associati a un account personale.
          </p>
        </div>
        <Link
          href="/admin/ricerca-contatti"
          className="inline-flex items-center justify-center rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
        >
          Nuova ricerca
        </Link>
      </div>

      {organizers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">
            Nessun organizzatore salvato
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Usa la ricerca contatti e conferma con &quot;Salva organizzatore&quot;.
          </p>
          <Link
            href="/admin/ricerca-contatti"
            className="mt-5 inline-flex rounded-xl border border-[#075EAE] px-4 py-2 text-sm font-bold text-[#075EAE]"
          >
            Vai alla ricerca
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Contatti</th>
                <th className="px-4 py-3 font-semibold">Sito</th>
                <th className="px-4 py-3 font-semibold">Stato</th>
                <th className="px-4 py-3 font-semibold">Salvato</th>
                <th className="px-4 py-3 font-semibold">Dettaglio</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((org) => (
                <tr key={org.id} className="border-b border-slate-100 align-top">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {org.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="space-y-1">
                      {org.email ? <p>Email: {org.email}</p> : null}
                      {org.pec ? <p>PEC: {org.pec}</p> : null}
                      {org.phone ? <p>Tel: {org.phone}</p> : null}
                      {!org.email && !org.pec && !org.phone ? (
                        <p className="text-slate-400">—</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {org.website ? (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-[#075EAE] hover:underline"
                      >
                        {org.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        org.claim_status === "claimed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {claimLabel(org.claim_status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {formatDate(org.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/organizzatori/${org.id}`}
                      className="font-semibold text-[#075EAE] hover:underline"
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
