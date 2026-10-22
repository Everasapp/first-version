import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/src/components/home/Header";
import EventCard from "@/src/components/home/EventCard";
import JsonLd from "@/src/components/seo/JsonLd";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { findLearningSeoPage, learningSeoPages, matchesLearningSeoPage } from "@/src/lib/seo/learning-pages";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };
const route = (slug: string) => `/corsi/${slug}`;

export async function generateStaticParams() {
  return learningSeoPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findLearningSeoPage(slug);
  if (!page) return {};
  const { events, error } = await loadFilteredPublishedEvents({ learningOnly: true });
  const filtered = events.filter((event) => matchesLearningSeoPage(event, page));
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: route(slug) },
    robots: { index: !error && filtered.length > 0, follow: true },
    openGraph: { title: `${page.title} | EVERAS`, description: page.description, url: route(slug), type: "website" },
  };
}

export default async function LearningSeoLanding({ params }: Props) {
  const { slug } = await params;
  const page = findLearningSeoPage(slug);
  if (!page) notFound();

  const { events, error } = await loadFilteredPublishedEvents({ learningOnly: true });
  const filtered = events.filter((event) => matchesLearningSeoPage(event, page));
  const path = route(page.slug);
  const otherPages = learningSeoPages.filter((item) => item.slug !== page.slug);

  return <>
    <Header />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: "Corsi e formazione", path: "/imparare-e-fare-in-sardegna" }, { name: page.title, path }])} />
    <JsonLd data={collectionPageSchema({ name: page.title, description: page.description, url: absoluteUrl(path) })} />
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Percorso" className="mb-6 text-sm text-slate-600">
          <Link className="underline" href="/">Home</Link> / <Link className="underline" href="/imparare-e-fare-in-sardegna">Corsi e formazione</Link> / {page.title}
        </nav>
        <h1 className="max-w-4xl text-3xl font-black text-slate-900 sm:text-5xl">{page.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">{page.intro}</p>
        <div className="mt-6 max-w-3xl rounded-xl border border-blue-100 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Prima di iscriverti</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{page.advice}</p>
          <p className="mt-2 text-sm text-slate-600">Date, requisiti, prezzi e disponibilità possono cambiare: confermali sempre con l'organizzatore.</p>
        </div>
        <section className="mt-12" aria-labelledby="courses-list-title">
          <h2 id="courses-list-title" className="text-2xl font-bold text-slate-900">Corsi disponibili</h2>
          {error ? <p className="mt-4">Il catalogo non è disponibile al momento.</p>
            : filtered.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((event) => <EventCard key={event.eventId} event={event} />)}</div>
            : <p className="mt-4">Al momento non sono disponibili corsi corrispondenti. Esplora le altre categorie o torna a controllare quando saranno pubblicate nuove opportunità.</p>}
        </section>
        <nav aria-label="Altri percorsi formativi" className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900">Scopri altri corsi</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherPages.map((item) => <Link key={item.slug} href={route(item.slug)} className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-[#075EAE] hover:border-[#075EAE]">{item.title}</Link>)}
          </div>
          <Link href="/imparare-e-fare-in-sardegna" className="mt-7 inline-block font-bold text-[#075EAE] underline">Esplora tutti i corsi e workshop</Link>
        </nav>
      </div>
    </main>
  </>;
}
