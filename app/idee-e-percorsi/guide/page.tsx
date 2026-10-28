import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/home/Header";
import DecisionGuideCards from "@/src/components/seo/DecisionGuideCards";
import { DECISION_GUIDES_PATH } from "@/src/lib/career-decision-guides";

const title = "Scegliere formazione e lavoro: guide pratiche";
const description = "Cambiare lavoro dopo i 40 o 50 anni, capire i titoli, scegliere corsi gratuiti e modalità di studio, presentare progetti nel CV.";
export const metadata: Metadata = { title, description, alternates: { canonical: DECISION_GUIDES_PATH }, openGraph: { title, description, url: DECISION_GUIDES_PATH, images: ["/images/learning/imparare-sardegna-og.jpg"] } };

export default function DecisionGuidesPage() {
  return <><Header /><main className="min-h-screen bg-slate-50 pb-16">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <Link href="/idee-e-percorsi" prefetch={false} className="inline-flex min-h-11 items-center font-bold text-[#075EAE] underline">← Idee e percorsi</Link>
      <h1 className="mt-4 text-4xl font-black text-slate-900">Scegliere formazione e lavoro</h1>
      <p className="mt-5 text-xl leading-relaxed text-slate-600">Cinque guide per prendere decisioni concrete, capire cosa controllare e preparare il prossimo passo.</p>
    </div></header>
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><DecisionGuideCards /></div>
  </main></>;
}
