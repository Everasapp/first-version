import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import { notFound } from "next/navigation";
import Header from "@/src/components/home/Header";
import EditorialLearningSection from "@/src/components/seo/EditorialLearningSection";
import JsonLd from "@/src/components/seo/JsonLd";
import { IDEAS_PATH, NEW_PASSION_PATHS, PASSION_PATH } from "@/src/lib/editorial-learning-paths";
import { breadcrumbListSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
const findGuide = (slug: string) => NEW_PASSION_PATHS.find((path) => path.path === `${PASSION_PATH}/${slug}`);

export function generateStaticParams() {
  return NEW_PASSION_PATHS.map((path) => ({ slug: path.path.split("/").at(-1)! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  return {
    title: guide.title, description: guide.summary, alternates: { canonical: guide.path },
    openGraph: { title: guide.title, description: guide.summary, url: guide.path, type: "article", images: [{ url: guide.image.src, width: 1200, height: 900, alt: guide.image.alt }] },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.summary, images: [guide.image.src] },
  };
}

export default async function PassionGuidePage({ params }: Props) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();
  const wellnessCourses = guide.path.endsWith("/stretching-relax-preghiera")
    ? (await loadFilteredPublishedEvents({ categorySlug: "benessere-movimento", learningOnly: true })).events
    : [];
  return <>
    <Header />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: "Idee e percorsi", path: IDEAS_PATH }, { name: "Per passione", path: PASSION_PATH }, { name: guide.title, path: guide.path }])} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.summary, dateModified: "2026-10-23", author: { "@type": "Organization", name: "EVERAS", url: absoluteUrl("/") }, mainEntityOfPage: absoluteUrl(guide.path), image: absoluteUrl(guide.image.src) }} />
    <main className="bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <Link href={PASSION_PATH} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">← Tutti i percorsi per passione</Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[#075EAE]">{guide.category}</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">{guide.summary}</p>
          <a href="#prova-e-approfondisci" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Prova l’esercizio e scegli un corso</a>
        </div>
      </header>
      <article className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <Image src={guide.image.src} alt={guide.image.alt} width={800} height={533} unoptimized className="aspect-[3/2] w-full rounded-2xl border border-slate-200 object-cover" />
        <div className="mt-10 space-y-8">{guide.body?.map((section) => <section key={section.title}><h2 className="text-2xl font-bold text-slate-900">{section.title}</h2><p className="mt-3 leading-relaxed text-slate-700">{section.text}</p></section>)}</div>
        <EditorialLearningSection path={guide} wellnessCourses={wellnessCourses} />
        <section aria-labelledby="note-title" className="mt-10 border-t border-slate-200 pt-6">
          <h2 id="note-title" className="text-xl font-bold text-slate-900">Per continuare a esplorare</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Percorso ed esercizi originali di EVERAS. I riferimenti culturali sono spunti di osservazione: non indicano corsi attivi o appuntamenti organizzati dai musei citati.</p>
          {guide.sources ? <ul className="mt-4 space-y-2">{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-[#075EAE] underline">{source.label} ↗</a></li>)}</ul> : null}
          <Link href={PASSION_PATH} prefetch={false} className="mt-5 inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Scegli un altro percorso per passione →</Link>
        </section>
      </article>
    </main>
  </>;
}
