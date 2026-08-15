import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/src/components/home/Header";
import SuggestEventForm from "@/src/components/home/SuggestEventForm";

export const metadata: Metadata = {
  title: "Segnala un evento",
  description:
    "Hai visto un evento in Sardegna che manca su EVERAS? Incolla il link e segnalacelo.",
};

export default function SegnalaEventoPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Community
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Segnala un evento
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Hai trovato un evento interessante che non c&apos;è ancora su
              EVERAS? Incolla il link: lo controlliamo e, se è adatto, lo
              pubblichiamo.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <SuggestEventForm />

          <aside className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Sei un organizzatore?
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Se gestisci gli eventi in prima persona, puoi pubblicarli
              direttamente dal tuo account.
            </p>
            <Link
              href="/pubblica"
              className="inline-flex rounded-2xl bg-[#075EAE] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#064E91]"
            >
              Pubblica evento
            </Link>
          </aside>
        </section>
      </main>
    </>
  );
}
