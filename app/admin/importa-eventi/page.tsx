import EventImportPanel from "@/src/components/admin/EventImportPanel";

export default function ImportaEventiPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Importa eventi
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Analizza una pagina pubblica, verifica i campi e pubblica. Il creatore
        tecnico resta l&apos;account admin; l&apos;organizzatore pubblico è il
        nome/directory indicato.
      </p>

      <div className="mt-8">
        <EventImportPanel />
      </div>
    </div>
  );
}
