import Link from "next/link";

import NewCampaignForm from "@/src/components/admin/NewCampaignForm";
import { requireAdmin } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminNuovaCampagnaPage() {
  await requireAdmin("/admin/campagne/nuova");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link
        href="/admin/campagne"
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        ← Torna alle campagne
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        Nuova campagna
      </h1>
      <p className="mt-2 text-slate-600">
        Compila oggetto e messaggio, importa i destinatari e invia via Resend.
      </p>

      <NewCampaignForm />
    </div>
  );
}
