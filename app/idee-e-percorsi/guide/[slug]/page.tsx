import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/src/components/home/Header";
import JsonLd from "@/src/components/seo/JsonLd";
import { DECISION_GUIDES, DECISION_GUIDES_PATH, DECISION_GUIDES_REVIEWED, decisionGuideUrl } from "@/src/lib/career-decision-guides";
import { absoluteUrl } from "@/src/lib/seo/site";
import { breadcrumbListSchema } from "@/src/lib/seo/schema";

type Props = {params: Promise<{slug: string}>};
export const dynamicParams = false;
export function generateStaticParams() { return DECISION_GUIDES.map(({slug}) => ({slug})); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const found = DECISION_GUIDES.find(g => g.slug === slug);
  if (!found) notFound();
  return {title: found.title, description: found.summary, alternates: {canonical: decisionGuideUrl(slug)}, openGraph: {title: found.title, description: found.summary, url: decisionGuideUrl(slug), type: "article", images: ["/images/learning/imparare-sardegna-og.jpg"]}, twitter: {card: "summary_large_image", title: found.title, description: found.summary, images: ["/images/learning/imparare-sardegna-og.jpg"]}};
}
export default async function DecisionGuidePage({params}: Props) {
  const slug = (await params).slug;
  const guide = DECISION_GUIDES.find(g => g.slug === slug);
  if (!guide) notFound();
  return <><Header />
    <JsonLd data={breadcrumbListSchema([{name:"Home",path:"/"},{name:"Idee e percorsi",path:"/idee-e-percorsi"},{name:"Scegliere formazione e lavoro",path:DECISION_GUIDES_PATH},{name:guide.title,path:decisionGuideUrl(slug)}])} />
    <JsonLd data={{"@context":"https://schema.org","@type":"Article",headline:guide.title,description:guide.summary,dateModified:DECISION_GUIDES_REVIEWED,author:{"@type":"Organization",name:"EVERAS",url:absoluteUrl("/")},mainEntityOfPage:absoluteUrl(decisionGuideUrl(slug))}} />
    <main className="bg-slate-50 pb-16"><header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link href={DECISION_GUIDES_PATH} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">← Scegliere formazione e lavoro</Link>
      <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[#075EAE]">Guida pratica · Cambiare lavoro</p>
      <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">{guide.title}</h1>
      <p className="mt-5 text-xl leading-relaxed text-slate-600">{guide.summary}</p>
      <p className="mt-5 leading-relaxed text-slate-700">{guide.introduction}</p>
      <p className="mt-4 text-sm text-slate-500">Guida editoriale EVERAS · aggiornata il <time dateTime={DECISION_GUIDES_REVIEWED}>28 ottobre 2026</time></p>
      <nav aria-label="In questa guida" className="mt-5 flex flex-wrap gap-4"><a href="#checklist" className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">La checklist</a><a href="#esercizio" className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Il prossimo passo</a></nav>
    </div></header>
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-10 sm:px-8">
      {guide.sections.map(section => <section key={section.title}><h2 className="text-2xl font-bold text-slate-900">{section.title}</h2><p className="mt-4 leading-relaxed text-slate-700">{section.text}</p></section>)}
      <section id="checklist" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-2xl font-bold text-slate-900">Prima di decidere: la checklist</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-slate-700">{guide.checklist.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section id="esercizio" className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50 p-6"><h2 className="text-2xl font-bold text-slate-900">Il prossimo passo, in pratica</h2><p className="mt-4 leading-relaxed text-slate-700">{guide.exercise}</p></section>
      <section><h2 className="text-xl font-bold text-slate-900">Fonti e verifica</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Le indicazioni generali sono accompagnate da fonti pubbliche e informazioni dei fornitori. Esempi, esercizi e checklist sono proposte editoriali EVERAS. Requisiti e condizioni dipendono dal singolo percorso: confermali prima dell’iscrizione.</p><ul className="mt-4 space-y-3">{guide.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">{source.label} ↗</a></li>)}</ul></section>
      <section className="border-t border-slate-200 pt-6"><h2 className="text-xl font-bold text-slate-900">Dalla decisione al percorso</h2><div className="mt-3 flex flex-wrap gap-5"><Link href="/idee-e-percorsi" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Esplora i nove percorsi professionali →</Link><Link href="/imparare-e-fare-in-sardegna" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Trova un corso →</Link><Link href={DECISION_GUIDES_PATH} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Tutte le guide per scegliere →</Link></div></section>
    </div></main>
  </>;
}
