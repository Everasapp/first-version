import Link from "next/link";

import DeleteOrganizerButton from "@/src/components/admin/DeleteOrganizerButton";
import DeleteUnusedOrganizersButton from "@/src/components/admin/DeleteUnusedOrganizersButton";
import ExportEmailsPanel from "@/src/components/admin/ExportEmailsPanel";
import { requireAdmin } from "@/src/lib/auth";
import { collectOrganizerEmails } from "@/src/lib/admin/export-emails";
import type { OrganizerDirectoryRow } from "@/src/lib/admin/organizer-directory";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    uso?: string;
  }>;
};

type UsageFilter = "tutti" | "in-uso" | "non-usati";

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

function parseUsageFilter(value: string | undefined): UsageFilter {
  if (value === "in-uso" || value === "non-usati") return value;
  return "tutti";
}

export default async function AdminOrganizzatoriPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const usageFilter = parseUsageFilter(params.uso);
  const { supabase } = await requireAdmin("/admin/organizzatori");

  const [{ data, error }, { data: linkedEvents, error: linkedError }] =
    await Promise.all([
      supabase
        .from("organizer_directory")
        .select(
          "id, name, website, email, pec, phone, address, facebook, instagram, email_cultura, email_turismo, email_eventi, claim_status, created_at, updated_at",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select("organizer_directory_id")
        .not("organizer_directory_id", "is", null),
    ]);

  if (error) {
    throw new Error(`Impossibile caricare gli organizzatori: ${error.message}`);
  }

  if (linkedError) {
    throw new Error(
      `Impossibile verificare gli organizzatori in uso: ${linkedError.message}`,
    );
  }

  const eventCountByOrganizer = new Map<string, number>();
  for (const row of linkedEvents ?? []) {
    const id = row.organizer_directory_id as string | null;
    if (!id) continue;
    eventCountByOrganizer.set(id, (eventCountByOrganizer.get(id) ?? 0) + 1);
  }

  const organizers = ((data || []) as OrganizerDirectoryRow[]).map((org) => ({
    ...org,
    eventCount: eventCountByOrganizer.get(org.id) ?? 0,
  }));

  const inUseCount = organizers.filter((org) => org.eventCount > 0).length;
  const unusedCount = organizers.length - inUseCount;
  const unusedIds = organizers
    .filter((org) => org.eventCount === 0)
    .map((org) => org.id);

  const visibleOrganizers = organizers.filter((org) => {
    if (usageFilter === "in-uso") return org.eventCount > 0;
    if (usageFilter === "non-usati") return org.eventCount === 0;
    return true;
  });

  const exportEmails = collectOrganizerEmails(visibleOrganizers);

  const filterChips: { id: UsageFilter; label: string; count: number }[] = [
    { id: "tutti", label: "Tutti", count: organizers.length },
    { id: "in-uso", label: "In uso", count: inUseCount },
    { id: "non-usati", label: "Non usati", count: unusedCount },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Organizzatori salvati
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Profili creati a mano o dalla ricerca contatti. Quelli «In uso»
            sono collegati ad almeno un evento e non si possono eliminare.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/ricerca-contatti"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
          >
            Nuova ricerca
          </Link>
          <Link
            href="/admin/organizzatori/nuovo"
            className="inline-flex items-center justify-center rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
          >
            Crea organizzatore
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {filterChips.map((chip) => {
          const href =
            chip.id === "tutti"
              ? "/admin/organizzatori"
              : `/admin/organizzatori?uso=${chip.id}`;
          const isActive = usageFilter === chip.id;

          return (
            <Link
              key={chip.id}
              href={href}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                isActive
                  ? "bg-[#075EAE] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
              }`}
            >
              {chip.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? "bg-white/20" : "bg-slate-100 text-slate-600"
                }`}
              >
                {chip.count}
              </span>
            </Link>
          );
        })}

        {usageFilter === "non-usati" ? (
          <div className="ml-auto">
            <DeleteUnusedOrganizersButton unusedIds={unusedIds} />
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <ExportEmailsPanel emails={exportEmails} />
      </div>

      {organizers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">
            Nessun organizzatore salvato
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Crea un profilo a mano oppure usa la ricerca contatti.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              href="/admin/organizzatori/nuovo"
              className="inline-flex rounded-xl bg-[#E67E22] px-4 py-2 text-sm font-bold text-white"
            >
              Crea organizzatore
            </Link>
            <Link
              href="/admin/ricerca-contatti"
              className="inline-flex rounded-xl border border-[#075EAE] px-4 py-2 text-sm font-bold text-[#075EAE]"
            >
              Vai alla ricerca
            </Link>
          </div>
        </div>
      ) : visibleOrganizers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">
            Nessun organizzatore in questo filtro
          </p>
          <Link
            href="/admin/organizzatori"
            className="mt-5 inline-flex rounded-xl border border-[#075EAE] px-4 py-2 text-sm font-bold text-[#075EAE]"
          >
            Mostra tutti
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
                <th className="px-4 py-3 font-semibold">Utilizzo</th>
                <th className="px-4 py-3 font-semibold">Stato</th>
                <th className="px-4 py-3 font-semibold">Salvato</th>
                <th className="px-4 py-3 font-semibold">Dettaglio</th>
                <th className="px-4 py-3 font-semibold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrganizers.map((org) => {
                const inUse = org.eventCount > 0;

                return (
                  <tr
                    key={org.id}
                    className="border-b border-slate-100 align-top"
                  >
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
                          inUse
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {inUse
                          ? `In uso · ${org.eventCount} event${
                              org.eventCount === 1 ? "o" : "i"
                            }`
                          : "Non usato"}
                      </span>
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
                    <td className="px-4 py-3">
                      <DeleteOrganizerButton
                        organizerId={org.id}
                        organizerName={org.name}
                        redirectToList={false}
                        inUse={inUse}
                        eventCount={org.eventCount}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
