import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/home/Header";
import EditorialPathCards from "@/src/components/seo/EditorialPathCards";
import JsonLd from "@/src/components/seo/JsonLd";
import { IDEAS_PATH } from "@/src/lib/editorial-learning-paths";
import { LEARNING_PATH } from "@/src/lib/learning-courses";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

const title = "Idee e percorsi per imparare in Sardegna";
const description = "Parti da un luogo, un artista o un materiale: approfondimenti sulla Sardegna, piccoli esercizi e consigli per scegliere corsi e laboratori.";
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
          <p className="text-sm font-bold uppercase tracking-wider text-[#075EAE]">Scopri · Prova · Approfondisci</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black text-slate-900 sm:text-5xl">Idee e percorsi</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Un luogo, un artista o una tradizione possono accendere un interesse. Qui trovi letture, esercizi da provare e criteri per scegliere cosa imparare in Sardegna, per il lavoro o per passione.</p>
          <Link href={LEARNING_PATH} prefetch={false} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Vai al catalogo corsi</Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section aria-labelledby="percorsi-title">
          <h2 id="percorsi-title" className="mb-6 text-2xl font-bold text-slate-900">Da dove vuoi cominciare?</h2>
          <EditorialPathCards />
        </section>
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Continua a conoscere la Sardegna</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">Le guide dei comuni e gli approfondimenti culturali restano consultabili. I percorsi pratici sono disponibili nelle tre letture qui sopra; aggiungeremo altri collegamenti dove il tema e il catalogo si incontrano.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/cultura-sarda" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Guide dei comuni</Link>
            <Link href="/cultura" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">Storie, persone e tradizioni</Link>
          </div>
        </section>
      </div>
    </main>
  </>;
}
