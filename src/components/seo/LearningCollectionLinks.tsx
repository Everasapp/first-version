import Link from "next/link";

const collections = [
  { slug: "per-disoccupati", title: "Corsi gratuiti per disoccupati", text: "Confronta i percorsi e verifica con l’ente i requisiti di accesso." },
  { slug: "nord-sardegna", title: "Corsi e workshop nel Nord Sardegna", text: "Trova attività a Sassari, in Gallura e negli altri comuni del Nord." },
  { slug: "iscrizioni-in-scadenza", title: "Iscrizioni in scadenza", text: "Consulta i termini ufficiali verificati nei prossimi 30 giorni." },
  { slug: "in-partenza-prossimo-mese", title: "Corsi in partenza", text: "Organizza il prossimo mese con i corsi che hanno già una data di avvio." },
  { slug: "inglese-nord-sardegna", title: "Inglese nel Nord Sardegna", text: "Confronta livelli, sedi e condizioni dei corsi di lingua inglese." },
  { slug: "amministrazione-contabilita", title: "Lavorare in amministrazione", text: "Scegli i corsi di amministrazione e contabilità e consulta il percorso per cambiare lavoro." },
] as const;

export default function LearningCollectionLinks() {
  return <section aria-labelledby="raccolte-corsi-title" className="border-t border-slate-200 bg-white py-10">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <h2 id="raccolte-corsi-title" className="text-2xl font-bold text-slate-900">Trova il corso per le tue esigenze</h2>
      <p className="mt-3 text-slate-600">Scegli per destinatari, territorio o termine di iscrizione. Ogni raccolta rimanda alle schede aggiornate del catalogo.</p>
      <nav aria-label="Raccolte di corsi" className="mt-6 grid gap-4 md:grid-cols-3">
        {collections.map((item) => <Link key={item.slug} href={`/corsi/${item.slug}`} prefetch={false} className="rounded-2xl border border-slate-200 p-5 transition hover:border-[#075EAE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">
          <h3 className="text-lg font-bold text-[#075EAE]">{item.title} →</h3>
          <p className="mt-3 leading-relaxed text-slate-600">{item.text}</p>
        </Link>)}
      </nav>
    </div>
  </section>;
}
