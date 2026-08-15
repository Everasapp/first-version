import Link from "next/link";
import { notFound } from "next/navigation";

import DeleteOrganizerButton from "@/src/components/admin/DeleteOrganizerButton";
import EditOrganizerForm from "@/src/components/admin/EditOrganizerForm";
import { requireAdmin } from "@/src/lib/auth";
import type { OrganizerDirectoryRow } from "@/src/lib/admin/organizer-directory";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function claimLabel(status: string) {
  return status === "claimed" ? "Rivendicato" : "Non rivendicato";
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

  const { count: eventCount, error: countError } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("organizer_directory_id", org.id);

  if (countError) {
    throw new Error(countError.message);
  }

  const linkedEvents = eventCount ?? 0;
  const inUse = linkedEvents > 0;

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
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                org.claim_status === "claimed"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {claimLabel(org.claim_status)}
            </span>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                inUse
                  ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {inUse
                ? `In uso · ${linkedEvents} event${linkedEvents === 1 ? "o" : "i"}`
                : "Non usato"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/ricerca-contatti"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
          >
            Nuova ricerca
          </Link>
          <DeleteOrganizerButton
            organizerId={org.id}
            organizerName={org.name}
            inUse={inUse}
            eventCount={linkedEvents}
          />
        </div>
      </div>

      <EditOrganizerForm organizer={org} />
    </div>
  );
}
