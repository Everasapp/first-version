import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/home/Header";
import CareerPathCards from "@/src/components/seo/CareerPathCards";
import EditorialPathCards from "@/src/components/seo/EditorialPathCards";
import JsonLd from "@/src/components/seo/JsonLd";
import { IDEAS_PATH } from "@/src/lib/editorial-learning-paths";
import { LEARNING_PATH } from "@/src/lib/learning-courses";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

const title = "Idee e percorsi: cambiare lavoro e imparare in Sardegna";
const description = "Scegli una professione e scopri come formarti: tappe, progetti pratici e corsi collegati in Sardegna e online. Anche percorsi creativi e culturali.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: IDEAS_PATH },
  openGraph: { title, description, url: IDEAS_PATH, type: "website", images: [{ url: "/images/learning/imparare-sardegna-og.jpg", width: 1200, height: 630, alt: "Imparare e fare in Sardegna" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/learning/imparare-sardegna-og.jpg"] },
};

export default function IdeasPage() {
  return <>
    <Header />
    <JsonLd data={collectionPageSchema({ name: title, description, url: absoluteUrl(IDEAS_PATH) })} />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: "Idee e percorsi", path: IDEAS_PATH }])} />
    <main className="bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-[#075EAE]">Scegli · Impara · Metti in pratica</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black text-slate-900 sm:text-5xl">Idee e percorsi</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Vuoi cambiare lavoro o dare spazio a un interesse? Parti da una professione: scopri le competenze da acquisire, segui un piano di studio e costruisci un progetto concreto. Qui trovi corsi collegati in Sardegna e online, insieme a percorsi per esplorare arte e territorio.</p>
          <Link href={LEARNING_PATH} prefetch={false} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Vai al catalogo corsi</Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section aria-labelledby="carriera-title">
          <h2 id="carriera-title" className="text-2xl font-bold text-slate-900">Cambiare lavoro: scegli una professione</h2>
          <p className="mb-6 mt-3 max-w-3xl leading-relaxed text-slate-600">Sei percorsi per orientarti verso un ruolo junior, capire da dove partire e scegliere cosa studiare. I corsi possono essere alternative o coprire una parte della preparazione; ogni guida indica anche cosa manca.</p>
          <CareerPathCards />
        </section>
        <section aria-labelledby="percorsi-title" className="mt-12">
          <h2 id="percorsi-title" className="mb-6 text-2xl font-bold text-slate-900">Per passione: arte, materiali e territorio</h2>
          <EditorialPathCards />
        </section>
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Continua a conoscere la Sardegna</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">Le guide dei comuni e gli approfondimenti culturali restano consultabili. Usale per approfondire un interesse e collegare ciò che scopri a esercizi, corsi e laboratori.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/cultura-sarda" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Guide dei comuni</Link>
            <Link href="/cultura" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Storie, persone e tradizioni</Link>
          </div>
        </section>
      </div>
    </main>
  </>;
}
