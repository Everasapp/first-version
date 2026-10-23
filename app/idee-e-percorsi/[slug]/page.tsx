import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/src/components/home/Header";
import CareerCourseList from "@/src/components/seo/CareerCourseList";
import JsonLd from "@/src/components/seo/JsonLd";
import { CAREER_LEARNING_PATHS, CAREER_PATH_REVIEWED, careerPathUrl, findCareerLearningPath } from "@/src/lib/career-learning-paths";
import { selectCareerCourses } from "@/src/lib/career-course-selection";
import { loadHomeEventRows } from "@/src/lib/home/load-events";
import { breadcrumbListSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

export const revalidate = 900;
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CAREER_LEARNING_PATHS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = findCareerLearningPath((await params).slug);
  if (!path) notFound();
  const title = `${path.role}: come formarsi e cambiare lavoro`;
  const url = careerPathUrl(path.slug);
  const image = "/images/learning/imparare-sardegna-og.jpg";
  return {
    title, description: path.summary, alternates: { canonical: url },
    openGraph: { title, description: path.summary, url, type: "article", images: [{ url: image, width: 1200, height: 630, alt: "Formazione e percorsi per imparare in Sardegna" }] },
    twitter: { card: "summary_large_image", title, description: path.summary, images: [image] },
  };
}

function TextList({ items }: { items: string[] }) {
  return <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export default async function CareerPathPage({ params }: Props) {
  const path = findCareerLearningPath((await params).slug);
  if (!path) notFound();
  // Shared published catalogue cache: no per-guide query, auth lookup or client fetch.
  const { rows, error } = await loadHomeEventRows();
  const courses = selectCareerCourses(path, rows);
  return <>
    <Header />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: "Idee e percorsi", path: "/idee-e-percorsi" }, { name: path.role, path: careerPathUrl(path.slug) }])} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: path.role, description: path.summary, dateModified: CAREER_PATH_REVIEWED, author: { "@type": "Organization", name: "EVERAS", url: absoluteUrl("/") }, mainEntityOfPage: absoluteUrl(careerPathUrl(path.slug)), image: absoluteUrl("/images/learning/imparare-sardegna-og.jpg") }} />
    <main className="bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <Link href="/idee-e-percorsi" prefetch={false} className="inline-flex min-h-11 items-center text-sm font-bold text-[#075EAE] underline">← Idee e percorsi</Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[#075EAE]">Cambiare lavoro · Formazione</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">{path.role}: il percorso per cominciare</h1>
          <p className="mt-5 text-xl leading-relaxed text-slate-600">{path.summary}</p>
          <p className="mt-5 leading-relaxed text-slate-700">{path.introduction}</p>
          <p className="mt-4 text-sm text-slate-500">Guida editoriale EVERAS · aggiornata il <time dateTime={CAREER_PATH_REVIEWED}>23 ottobre 2026</time></p>
          <nav aria-label="In questa guida" className="mt-6 flex flex-wrap gap-3">
            <a href="#piano" className="inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Le tappe da seguire</a>
            <a href="#corsi" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 py-3 font-bold text-[#075EAE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Corsi collegati</a>
            <a href="#progetto" className="inline-flex min-h-11 items-center px-3 font-bold text-[#075EAE] underline">Il progetto pratico</a>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-12 px-5 py-10 sm:px-8">
        <section aria-labelledby="partenza-title">
          <h2 id="partenza-title" className="text-2xl font-bold text-slate-900">Da dove parti e cosa puoi valorizzare</h2>
          <p className="mt-4 leading-relaxed text-slate-700">{path.startingPoint}</p>
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-6"><h3 className="font-bold text-slate-900">Prima di iscriverti, fai una prova</h3><p className="mt-2 leading-relaxed text-slate-700">{path.firstExperiment}</p></div>
          <ul aria-label="Competenze del percorso" className="mt-5 flex flex-wrap gap-2">{path.skills.map((skill) => <li key={skill} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{skill}</li>)}</ul>
        </section>
        <section id="piano" aria-labelledby="piano-title" className="scroll-mt-28">
          <h2 id="piano-title" className="text-2xl font-bold text-slate-900">Il piano, una tappa alla volta</h2>
          <p className="mt-3 leading-relaxed text-slate-600">È una proposta di studio EVERAS, da adattare alle tue basi. Passa alla tappa successiva quando riesci a completare la prova. Le tappe non sono altrettanti corsi obbligatori: uno stesso corso può coprirne più di una.</p>
          <ol className="mt-6 space-y-5">{path.steps.map((step, index) => <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[#075EAE]">Tappa {index + 1}</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
            <dl className="mt-4 space-y-4 leading-relaxed text-slate-700">
              <div><dt className="font-bold text-slate-900">Cosa imparare</dt><dd>{step.learn}</dd></div>
              <div><dt className="font-bold text-slate-900">Cosa fare</dt><dd>{step.practice}</dd></div>
              <div><dt className="font-bold text-slate-900">Quando sei pronto a proseguire</dt><dd>{step.check}</dd></div>
            </dl>
          </li>)}</ol>
        </section>
        <section aria-labelledby="tempo-title" className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="tempo-title" className="text-2xl font-bold text-slate-900">Quanto tempo e quali costi prevedere</h2>
          <p className="mt-3 leading-relaxed text-slate-700">Prima di scegliere, confronta ore di lezione, esercitazioni e tempo disponibile. Alcuni corsi collegati si svolgono in diretta a tempo pieno: non sono lezioni da recuperare liberamente la sera. Aggiungi al calendario il lavoro sul progetto e l’eventuale affiancamento; non esiste una durata uguale per tutti.</p>
          <p className="mt-3 leading-relaxed text-slate-700">Controlla nella scheda costo, requisiti di accesso, frequenza minima e materiali. “Gratuito” può prevedere iscrizione e selezione presso un’agenzia per il lavoro. Computer, connessione, licenze, trasporti ed eventuali esami possono richiedere risorse separate: chiedi all’ente cosa è incluso.</p>
        </section>
        <CareerCourseList courses={courses} unavailable={!!error} />
        <section aria-labelledby="integrare-title"><h2 id="integrare-title" className="text-2xl font-bold text-slate-900">Cosa resta da integrare</h2><TextList items={path.gaps} /></section>
        <section id="progetto" aria-labelledby="progetto-title" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="progetto-title" className="text-2xl font-bold text-slate-900">Il progetto da mostrare</h2>
          <p className="mt-3 leading-relaxed text-slate-600">Raccogli prove del lavoro svolto e chiedi un riscontro a un docente o a una persona del settore. Presenta le simulazioni come tali e usa dati inventati o pubblici con condizioni d’uso compatibili.</p>
          <TextList items={path.portfolio} />
        </section>
        <section aria-labelledby="candidatura-title"><h2 id="candidatura-title" className="text-2xl font-bold text-slate-900">Come preparare la candidatura</h2><TextList items={path.applications} /></section>
        <section aria-labelledby="attestati-title"><h2 id="attestati-title" className="text-2xl font-bold text-slate-900">Attestati, qualifiche e obiettivo del percorso</h2><p className="mt-4 leading-relaxed text-slate-700">{path.credentials}</p></section>
        <section aria-labelledby="fonti-title" className="border-t border-slate-200 pt-8">
          <h2 id="fonti-title" className="text-xl font-bold text-slate-900">Fonti e metodo</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Le fonti seguenti aiutano a descrivere le competenze. Tappe, esercizi e associazioni ai corsi sono una proposta editoriale EVERAS, non un programma ufficiale né una promessa di impiego. Le schede dei corsi rimandano ai rispettivi enti per programma e condizioni.</p>
          <ul className="mt-4 space-y-4">{path.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-[#075EAE] underline">{source.label} ↗</a><p className="text-sm leading-relaxed text-slate-600">{source.note}</p></li>)}</ul>
          <Link href="/idee-e-percorsi" prefetch={false} className="mt-6 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Scegli un altro percorso →</Link>
        </section>
      </div>
    </main>
  </>;
}
