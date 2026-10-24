import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/home/Header";
import EditorialPathCards from "@/src/components/seo/EditorialPathCards";
import JsonLd from "@/src/components/seo/JsonLd";
import { IDEAS_PATH, PASSION_PATH } from "@/src/lib/editorial-learning-paths";
import { LEARNING_PATH } from "@/src/lib/learning-courses";
import { breadcrumbListSchema, collectionPageSchema } from "@/src/lib/seo/schema";
import { absoluteUrl } from "@/src/lib/seo/site";

const title = "Guide pratiche per imparare in Sardegna";
const description = "Guide pratiche originali su arte, lingue, digitale, cucina, spiritualità e manualità: esercizi autonomi e collegamenti ai corsi in Sardegna.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: PASSION_PATH },
  openGraph: { title, description, url: PASSION_PATH, type: "website", images: [{ url: "/images/learning/imparare-sardegna-og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/images/learning/imparare-sardegna-og.jpg"] },
};

export default function PassionIndexPage() {
  return <>
    <Header />
    <JsonLd data={collectionPageSchema({ name: title, description, url: absoluteUrl(PASSION_PATH) })} />
    <JsonLd data={breadcrumbListSchema([{ name: "Home", path: "/" }, { name: "Idee e percorsi", path: IDEAS_PATH }, { name: "Per passione", path: PASSION_PATH }])} />
    <main className="bg-slate-50 pb-16">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <Link href={IDEAS_PATH} prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">← Idee e percorsi</Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-[#075EAE]">Per il piacere di imparare</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black text-slate-900 sm:text-5xl">Guide pratiche per imparare</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Guide originali da leggere e mettere in pratica, anche senza un corso disponibile vicino a te. Trovi consigli, esercizi e domande utili prima di iscriverti a lezioni e laboratori.</p>
          <Link href={`${LEARNING_PATH}#corsi-workshop`} prefetch={false} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#075EAE] px-5 py-3 font-bold text-white hover:bg-[#064a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075EAE]">Esplora corsi e workshop</Link>
        </div>
      </header>
      <section aria-labelledby="tutti-percorsi-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h2 id="tutti-percorsi-title" className="mb-6 text-2xl font-bold text-slate-900">Tutte le guide pratiche</h2>
        <EditorialPathCards />
      </section>
    </main>
  </>;
}
