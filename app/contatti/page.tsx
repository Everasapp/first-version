import type { Metadata } from "next";
import { Mail } from "lucide-react";

import ContactForm from "@/src/components/home/ContactForm";
import Header from "@/src/components/home/Header";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Contatta il team EVERAS per informazioni, supporto o collaborazioni.",
};

export default function ContattiPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Contatti
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Parliamone
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Hai una domanda, un evento da promuovere o un&apos;idea di
              collaborazione? Scrivici: ti rispondiamo al più presto.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ContactForm />

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Mail aria-hidden="true" className="h-6 w-6 text-[#075EAE]" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Oppure via email
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Preferisci scrivere direttamente? Puoi contattarci anche a
            </p>
            <a
              href="mailto:info@everas.it"
              className="mt-3 inline-flex font-semibold text-[#075EAE] hover:underline"
            >
              info@everas.it
            </a>
          </aside>
        </section>
      </main>
    </>
  );
}
