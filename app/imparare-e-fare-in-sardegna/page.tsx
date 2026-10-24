import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { learningDisciplines } from "@/src/data/learning-disciplines";
import { learningSeoPages } from "@/src/lib/seo/learning-pages";
import Header from "@/src/components/home/Header";
import EventCard from "@/src/components/home/EventCard";
import JsonLd from "@/src/components/seo/JsonLd";
import { LEARNING_AREAS, LEARNING_FORMATS, LEARNING_PATH, LEARNING_TOPICS, learningAreaForTopic } from "@/src/lib/learning-courses";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

const title = "Imparare e fare in Sardegna";
const heroAlt = "Scena illustrativa di apprendimento: ceramica, pittura e competenze digitali in un laboratorio sul paesaggio sardo";
const ogImage = { url: absoluteUrl("/images/learning/imparare-sardegna-og.jpg"), width: 1200, height: 630, alt: heroAlt };

const description = "Formazione per il lavoro oppure corsi, workshop ed esperienze per arricchirti: trova il tuo percorso in Sardegna e confronta programmi, costi e requisiti.";

const pageMetadata: Metadata = {
  title, description, alternates: { canonical: LEARNING_PATH },
  openGraph: { title: `${title} | EVERAS`, description, url: LEARNING_PATH, type: "website", images: [ogImage] },
  twitter: { card: "summary_large_image", title: `${title} | EVERAS`, description, images: [ogImage.url] },
};

type LearningPageProps = {
  searchParams: Promise<{ area?: string; city?: string; q?: string; disciplina?: string }>;
};
const areas: Record<string, string> = {
  "nord-sardegna": "Nord Sardegna",
  "centro-sardegna": "Centro Sardegna",
  "sud-sardegna": "Sud Sardegna",
};

function readLearningSearch(params: {
  area?: string;
  city?: string;
  q?: string;
  disciplina?: string;
}) {
  const selectedDiscipline = learningDisciplines.find((item) => item.slug === params.disciplina) ?? null;
  const selectedArea = typeof params.area === "string" && areas[params.area] ? params.area : "";
  const selectedCity = typeof params.city === "string" ? params.city.trim() : "";
  const query = typeof params.q === "string" ? params.q.trim() : "";
  return {
    selectedDiscipline,
    selectedArea,
    selectedCity,
    query,
    isFilteredSearch: Boolean(selectedDiscipline || selectedArea || selectedCity || query),
  };
}

export async function generateMetadata({ searchParams }: LearningPageProps): Promise<Metadata> {
  const search = readLearningSearch(await searchParams);
  if (!search.isFilteredSearch) return pageMetadata;
  return { ...pageMetadata, robots: { index: false, follow: true } };
}

export default async function LearningPage({ searchParams }: LearningPageProps) {
  const search = readLearningSearch(await searchParams);
  const { selectedDiscipline, selectedArea, selectedCity, query, isFilteredSearch } = search;
  const { events: matchedEvents, error } = await loadFilteredPublishedEvents({
    learningOnly: true,
    categorySlug: selectedDiscipline?.slug,
    areaLabel: selectedArea ? areas[selectedArea] : undefined,
    city: selectedCity || undefined,
  });
  const needle = query.toLocaleLowerCase("it");
  const events = needle
    ? matchedEvents.filter((event) =>
        `${event.title} ${event.municipality ?? ""} ${event.location}`
          .toLocaleLowerCase("it")
          .includes(needle),
      )
    : matchedEvents;
  if (isFilteredSearch) {
    const searchTitle = selectedDiscipline
      ? selectedDiscipline.slug === "benessere-movimento"
        ? selectedDiscipline.name
        : `Corsi di ${selectedDiscipline.name.toLocaleLowerCase("it")}`
      : "Risultati della ricerca corsi";
    const context = [
      selectedCity,
      selectedArea ? areas[selectedArea] : "",
      query ? `Ricerca: ${query}` : "",
    ].filter(Boolean).join(" · ");
    return <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-12">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{searchTitle}</h1>
          <p className="mt-3 text-slate-600">
            {error ? "Il catalogo non è disponibile in questo momento." : `${events.length} ${events.length === 1 ? "corso trovato" : "corsi trovati"}`}
            {context ? ` · ${context}` : ""}
          </p>
          {error ? <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-white p-5">Riprova tra poco.</p>
            : events.length > 0
              ? <section aria-label="Corsi trovati" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => <EventCard key={event.eventId} event={event} />)}
                </section>
              : <p className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-700">Non ci sono corsi che corrispondono a questi filtri. Prova un’altra disciplina o una zona diversa.</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <details className="w-full" open={events.length === 0}>
              <summary className="inline-flex cursor-pointer list-none rounded-full bg-[#075EAE] px-5 py-3 text-sm font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">Modifica la ricerca</summary>
              <form action={LEARNING_PATH} method="get" className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-5">
                <label className="text-sm font-semibold text-slate-900">Zona
                  <select name="area" defaultValue={selectedArea} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    <option value="">Tutte le zone</option>
                    {Object.entries(areas).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-900">Comune
                  <input name="city" defaultValue={selectedCity} placeholder="Es. Sassari" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </label>
                <label className="text-sm font-semibold text-slate-900">Disciplina
                  <select name="disciplina" defaultValue={selectedDiscipline?.slug ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    <option value="">Tutte le discipline</option>
                    {learningDisciplines.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-900">Cosa vuoi imparare?
                  <input name="q" defaultValue={query} placeholder="Es. ceramica o inglese" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2" />
                </label>
                <div className="flex items-end">
                  <button type="submit" className="min-h-11 rounded-xl bg-[#075EAE] px-5 py-2 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">Cerca corsi</button>
                </div>
              </form>
            </details>
            <Link href={LEARNING_PATH} className="rounded-full border border-[#075EAE] bg-white px-5 py-3 text-sm font-bold text-[#075EAE]">Tutti i corsi</Link>
          </div>
        </div>
      </main>
    </>;
  }

  return <>
    <Header />
    <JsonLd data={collectionPageSchema({ name: title, description, url: absoluteUrl(LEARNING_PATH) })} />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: title, path: LEARNING_PATH }])} />
    <main className="bg-slate-50 pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <Image src="/images/learning/imparare-sardegna-hero.webp" alt={heroAlt} width={1200} height={630} unoptimized preload className="mb-8 aspect-[1200/630] w-full rounded-2xl object-cover" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#075EAE]">Un interesse, una nuova possibilità</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black text-slate-900 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Scegli cosa vuoi ottenere: acquisire competenze per il lavoro oppure vivere un’esperienza che ti arricchisce. Due percorsi per trovare corsi, seminari, workshop e laboratori in Sardegna, confrontando programmi, impegno richiesto e modalità di partecipazione.</p>
          <nav aria-label="Percorsi di apprendimento" className="mt-8 grid gap-4 md:grid-cols-2">
            {LEARNING_AREAS.map((area) => <Link key={area.key} href={`#${area.anchor}`} className="rounded-2xl border border-slate-200 p-5 hover:border-[#075EAE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">
              <h2 className="text-2xl font-bold text-[#075EAE]">{area.title} →</h2><p className="mt-2 font-semibold text-slate-900">{area.subtitle}</p><p className="mt-2 text-sm leading-relaxed text-slate-600">{area.description}</p>
            </Link>)}
          </nav>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <form id="ricerca" action={LEARNING_PATH} method="get" aria-label="Cerca formazione, corsi e workshop" className="my-8 grid scroll-mt-24 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm font-semibold text-slate-900">Zona
            <select name="area" defaultValue={selectedArea} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
              <option value="">Tutte le zone</option>
              {Object.entries(areas).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900">Comune
            <input name="city" defaultValue={selectedCity} placeholder="Es. Sassari" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-slate-900">Disciplina
            <select name="disciplina" defaultValue={selectedDiscipline?.slug ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
              <option value="">Tutte le discipline</option>
              {learningDisciplines.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-900">Cosa vuoi imparare?
            <input name="q" defaultValue={query} placeholder="Es. ceramica o inglese" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <div className="flex items-end gap-3">
            <button type="submit" className="min-h-11 rounded-xl bg-[#075EAE] px-5 py-2 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">Cerca</button>
            {selectedArea || selectedCity || query || selectedDiscipline ? <Link href={`${LEARNING_PATH}#ricerca`} className="py-3 text-sm font-semibold text-[#075EAE] underline">Azzera filtri</Link> : null}
          </div>
        </form>
        <nav aria-label="Esplora corsi per argomento e città" className="my-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Trova corsi per città, disciplina o obiettivo</h2>
          <p className="mt-2 max-w-3xl text-slate-600">Esplora percorsi dedicati a formazione professionale, corsi gratuiti, lingue, creatività e attività per bambini.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {learningSeoPages.map((page) => <Link key={page.slug} href={`/corsi/${page.slug}`} className="rounded-full border border-slate-300 px-4 py-2 font-semibold text-[#075EAE] hover:border-[#075EAE]">{page.title}</Link>)}
          </div>
        </nav>
        <section aria-labelledby="scegliere-corso" className="my-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="scegliere-corso" className="text-2xl font-bold text-slate-900">Prima di scegliere</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <div><h3 className="font-bold">Quanto tempo puoi dedicare?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Un incontro permette di sperimentare; un ciclo richiede continuità. Controlla tutte le date e considera anche il tempo degli spostamenti e degli esercizi.</p></div>
            <div><h3 className="font-bold">Qual è il costo completo?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Confronta l’intero percorso, non soltanto la tariffa oraria. Cerca iscrizione, tessera, materiali, software ed eventuali esami. “Gratuito” può essere riservato a chi possiede determinati requisiti.</p></div>
            <div><h3 className="font-bold">Cosa farai durante le lezioni?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Guarda il programma e il livello richiesto. Chiedi quanta pratica è prevista e cosa saprai fare al termine: un oggetto, un progetto o una nuova abilità da esercitare.</p></div>
          </div>
        </section>
        <details className="my-8 rounded-2xl border border-slate-200 bg-white p-6">
          <summary className="cursor-pointer text-lg font-bold text-[#075EAE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Corso, workshop o seminario: quale formato cerchi?</summary>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">La macroarea descrive il tuo obiettivo; il formato indica come si svolge l’attività. Un workshop o un laboratorio può avere finalità professionali oppure essere un’esperienza per passione. Programma e destinatari aiutano a scegliere.</p>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_FORMATS.map((format) => <div key={format.title}><dt className="font-bold text-slate-900">{format.title}</dt><dd className="mt-2 text-sm leading-relaxed text-slate-600">{format.description}</dd></div>)}
          </dl>
        </details>
        {error ? <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5">Il catalogo non è disponibile in questo momento. Riprova tra poco.</p> : LEARNING_AREAS.map((area) => {
          const topics = LEARNING_TOPICS.filter((topic) => topic.area === area.key);
          const hasCourses = events.some((event) => learningAreaForTopic(event.learningTopic) === area.key);
          return <section key={area.key} id={area.anchor} aria-labelledby={`${area.anchor}-title`} className="scroll-mt-24 border-t border-slate-200 py-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#075EAE]">{area.subtitle}</p>
            <h2 id={`${area.anchor}-title`} className="mt-2 text-3xl font-black text-slate-900">{area.title}</h2>
            <p className="mt-3 max-w-4xl text-lg leading-relaxed text-slate-600">{area.description}</p>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">{area.formats}</p>
            {!hasCourses ? <p className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Nessuna proposta corrisponde alla ricerca in questa macroarea. Prova un’altra zona o modifica i filtri.</p> : null}
            {topics.map((topic) => {
              const courses = events.filter((event) => event.learningTopic === topic.key);
              return <section key={topic.key} id={topic.anchor} aria-labelledby={`${topic.anchor}-title`} className="scroll-mt-24">
                {courses.length ? <>
                  <h3 id={`${topic.anchor}-title`} className="mt-8 text-2xl font-bold text-slate-900">{topic.title}</h3>
                  <p className="mt-3 max-w-4xl leading-relaxed text-slate-600">{topic.advice}</p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((event) => <EventCard key={event.eventId} event={event} />)}</div>
                </> : <span id={`${topic.anchor}-title`} className="sr-only">{topic.title}: nessuna proposta pubblicata</span>}
              </section>;
            })}
          </section>;
        })}
        <section className="mt-8 rounded-2xl bg-[#075EAE] p-6 text-white">
          <h2 className="text-2xl font-bold">Organizzi un corso o un laboratorio?</h2>
          <p className="mt-2 max-w-3xl leading-relaxed">Segnalaci programma, date, sede, costo completo e modalità di iscrizione. EVERAS raccoglie le informazioni dalle fonti degli organizzatori: iscrizione e conferma del posto avvengono direttamente con loro.</p>
          <Link href="/per-gli-organizzatori" prefetch={false} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-white px-5 py-3 font-bold text-[#075EAE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Proponi un corso o laboratorio</Link>
        </section>
      </div>
    </main>
  </>;
}
