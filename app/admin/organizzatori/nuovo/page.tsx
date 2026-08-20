import Link from "next/link";

import EditOrganizerForm from "@/src/components/admin/EditOrganizerForm";
import { requireAdmin } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminNuovoOrganizzatorePage() {
  await requireAdmin("/admin/organizzatori/nuovo");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link
        href="/admin/organizzatori"
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        ← Torna all&apos;elenco
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Crea organizzatore
      </h1>
      <p className="mt-2 text-slate-600">
        Inserisci nome e contatti. Il profilo resta non rivendicato finché
        l&apos;organizzatore non lo collega al suo account.
      </p>

      <EditOrganizerForm />
    </div>
  );
}
