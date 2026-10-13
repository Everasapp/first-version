import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/home/Header";
import EventCard from "@/src/components/home/EventCard";
import JsonLd from "@/src/components/seo/JsonLd";
import { LEARNING_PATH, LEARNING_TOPICS } from "@/src/lib/learning-courses";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

const title = "Imparare e fare in Sardegna";
const description = "Corsi e laboratori in Sardegna: arti, competenze professionali e digitali, inglese e altre lingue. Confronta programmi, costi e requisiti.";

export const metadata: Metadata = {
  title, description, alternates: { canonical: LEARNING_PATH },
  openGraph: { title: `${title} | EVERAS`, description, url: LEARNING_PATH, type: "website" },
};

export default async function LearningPage() {
  const { events, error } = await loadFilteredPublishedEvents({ learningOnly: true });
  return <>
    <Header />
    <JsonLd data={collectionPageSchema({ name: title, description, url: absoluteUrl(LEARNING_PATH) })} />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: title, path: LEARNING_PATH }])} />
    <main className="bg-slate-50 pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#075EAE]">Un interesse, una nuova possibilità</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black text-slate-900 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Dedica tempo a qualcosa che vuoi imparare. Trova un laboratorio creativo, esercita una lingua o scegli una competenza da portare nel tuo lavoro: qui puoi confrontare percorsi, impegno richiesto e modalità di partecipazione.</p>
          <nav aria-label="Percorsi di apprendimento" className="mt-8 grid gap-4 md:grid-cols-3">
            {LEARNING_TOPICS.map((topic) => <Link key={topic.key} href={`#${topic.anchor}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#075EAE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">
              <h2 className="text-xl font-bold text-[#075EAE]">{topic.title} →</h2><p className="mt-2 text-sm text-slate-600">{topic.description}</p>
            </Link>)}
          </nav>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <section aria-labelledby="scegliere-corso" className="my-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="scegliere-corso" className="text-2xl font-bold text-slate-900">Prima di scegliere</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div><h3 className="font-bold">Quanto tempo puoi dedicare?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Un incontro permette di sperimentare; un ciclo richiede continuità. Controlla tutte le date e considera anche il tempo degli spostamenti e degli esercizi.</p></div>
            <div><h3 className="font-bold">Qual è il costo completo?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Confronta l’intero percorso, non soltanto la tariffa oraria. Cerca iscrizione, tessera, materiali, software ed eventuali esami. “Gratuito” può essere riservato a chi possiede determinati requisiti.</p></div>
            <div><h3 className="font-bold">Cosa farai durante le lezioni?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Guarda il programma e il livello richiesto. Chiedi quanta pratica è prevista e cosa saprai fare al termine: un oggetto, un progetto o una nuova abilità da esercitare.</p></div>
          </div>
        </section>
        {error ? <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5">Il catalogo non è disponibile in questo momento. Riprova tra poco.</p> : LEARNING_TOPICS.map((topic) => {
          const courses = events.filter((event) => event.learningTopic === topic.key);
          return <section key={topic.key} id={topic.anchor} aria-labelledby={`${topic.anchor}-title`} className="scroll-mt-24 py-8">
            <h2 id={`${topic.anchor}-title`} className="text-3xl font-black text-slate-900">{topic.title}</h2>
            <p className="mt-3 max-w-4xl leading-relaxed text-slate-600">{topic.advice}</p>
            {courses.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((event) => <EventCard key={event.eventId} event={event} />)}</div> : <p className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Non ci sono ancora corsi pubblicati con informazioni complete in questo percorso.</p>}
          </section>;
        })}
        <section className="mt-8 rounded-2xl bg-[#075EAE] p-6 text-white">
          <h2 className="text-2xl font-bold">Organizzi un corso o un laboratorio?</h2>
          <p className="mt-2 max-w-3xl leading-relaxed">Segnalaci programma, date, sede, costo completo e modalità di iscrizione. EVERAS raccoglie le informazioni dalle fonti degli organizzatori: iscrizione e conferma del posto avvengono direttamente con loro.</p>
          <Link href="/segnala-evento" prefetch={false} className="mt-4 inline-flex rounded-full bg-white px-5 py-3 font-bold text-[#075EAE]">Segnala un corso</Link>
        </section>
      </div>
    </main>
  </>;
}
