import type { CareerChangeDetails } from "@/src/lib/career-change-details";

export default function CareerChangeSections({ details }: { details: CareerChangeDetails }) {
  return <>
    <section id="cambio-carriera" aria-labelledby="cambio-title" className="scroll-mt-28">
      <h2 id="cambio-title" className="text-2xl font-bold text-slate-900">Dal lavoro che fai al lavoro che vuoi fare</h2>
      <p className="mt-3 leading-relaxed text-slate-600">Un’esperienza precedente può aiutarti a partire. Questi sono esempi orientativi: confrontali con ciò che hai effettivamente fatto.</p>
      <dl className="mt-5 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700">
        <div><dt className="font-bold text-slate-900">Esperienze da cui puoi arrivare</dt><dd className="mt-1">{details.previousExperience}</dd></div>
        <div><dt className="font-bold text-slate-900">Competenze che puoi valorizzare</dt><dd className="mt-1">{details.transferable}</dd></div>
        <div><dt className="font-bold text-slate-900">Cosa devi ancora imparare</dt><dd className="mt-1">{details.toLearn}</dd></div>
      </dl>
    </section>
    <section id="prima-candidatura" aria-labelledby="primo-progetto-title" className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50 p-6">
      <h2 id="primo-progetto-title" className="text-2xl font-bold text-slate-900">Il tuo primo progetto: {details.project.title}</h2>
      <dl className="mt-5 space-y-4 leading-relaxed text-slate-700">
        <div><dt className="font-bold text-slate-900">Come organizzarlo</dt><dd>{details.project.task}</dd></div>
        <div><dt className="font-bold text-slate-900">Cosa preparare</dt><dd>{details.project.deliverable}</dd></div>
        <div><dt className="font-bold text-slate-900">Come controllare il risultato</dt><dd>{details.project.check}</dd></div>
      </dl>
      <h3 className="mt-6 font-bold text-slate-900">Come potresti descriverlo nel CV</h3>
      <blockquote className="mt-2 border-l-4 border-[#075EAE] pl-4 leading-relaxed text-slate-700">{details.project.cvExample}</blockquote>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">Usa questo esempio soltanto dopo aver svolto il progetto e adattalo al lavoro effettivo. Una simulazione va presentata come progetto didattico.</p>
    </section>
    <section id="cercare-lavoro" aria-labelledby="cerca-lavoro-title" className="scroll-mt-28">
      <h2 id="cerca-lavoro-title" className="text-2xl font-bold text-slate-900">Come iniziare a cercare lavoro in Sardegna</h2>
      <p className="mt-3 leading-relaxed text-slate-700">{details.contexts}</p>
      <h3 className="mt-5 font-bold text-slate-900">Parole da provare negli annunci</h3>
      <ul className="mt-3 flex flex-wrap gap-2">{details.jobTerms.map(term => <li key={term} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">{term}</li>)}</ul>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">Aggiungi il comune o la provincia e confronta i requisiti di almeno tre annunci recenti. Questi termini non corrispondono a offerte verificate da EVERAS.</p>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold text-slate-900">La domanda da fare prima di candidarti</h3><p className="mt-2 leading-relaxed text-slate-700">{details.employerQuestion}</p></div>
      <p className="mt-4 leading-relaxed text-slate-700">Scegli un annuncio, annota le competenze già dimostrabili e quelle da integrare. Seleziona poi il corso che copre la lacuna concreta, verificandone requisiti e valore del titolo.</p>
    </section>
  </>;
}
