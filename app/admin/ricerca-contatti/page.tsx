import OrganizerContactSearch from "@/src/components/admin/OrganizerContactSearch";

export default function RicercaContattiPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Ricerca contatti organizzatore
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Inserisci il sito di un Comune o di un&apos;organizzazione. Everas
        analizza solo pagine pubbliche dello stesso dominio. I dati non vengono
        salvati finché non confermi con &quot;Salva organizzatore&quot;.
      </p>

      <div className="mt-8">
        <OrganizerContactSearch />
      </div>
    </div>
  );
}
