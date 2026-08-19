import EventImportPanel from "@/src/components/admin/EventImportPanel";
import { requireAdmin } from "@/src/lib/auth";

export default async function ImportaEventiPage() {
  const { profile } = await requireAdmin("/admin/importa-eventi");
  const creatorName = profile.full_name?.trim() || "Everas Admin";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Importa eventi
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Analizza una pagina pubblica, verifica i campi e pubblica. Se incolli
        un elenco comunale, l&apos;elenco resta aperto: importi un evento e
        passi al successivo senza rianalizzare la pagina.
      </p>

      <div className="mt-8">
        <EventImportPanel creatorName={creatorName} />
      </div>
    </div>
  );
}
