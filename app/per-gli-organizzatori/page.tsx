import type { Metadata } from "next";

import Header from "@/src/components/home/Header";

const pageTitle = "Organizzi corsi o laboratori in Sardegna?";
const pageDescription =
  "EVERAS raccoglie formazione per il lavoro e corsi, workshop ed esperienze per coltivare una passione in Sardegna. Cerchiamo organizzatori con proposte chiare e informazioni aggiornate.";
const socialImage = {
  url: "/images/learning/imparare-sardegna-og.jpg",
  width: 1200,
  height: 630,
  alt: "Corsi, laboratori e workshop in Sardegna su EVERAS",
};

const PROPOSAL_EMAIL = "info@everas.it";
const PROPOSAL_MAILTO = `mailto:${PROPOSAL_EMAIL}?subject=${encodeURIComponent("Proposta di corso o laboratorio")}`;

const aspects = [
  "Una scheda che spiega attività, destinatari, luogo, date e costi.",
  "Collegamenti ai canali dell’organizzatore per informazioni e iscrizioni.",
  "Attività raccolte per disciplina e zona, per facilitarne la scoperta.",
] as const;

const proposalDetails = [
  "Titolo",
  "Obiettivo: formazione per il lavoro oppure esperienza per passione",
  "Formato: corso, workshop, laboratorio, seminario, masterclass o esperienza guidata",
  "Disciplina e argomento",
  "Descrizione",
  "Organizzatore",
  "Sede",
  "Date e durata",
  "Destinatari e livello",
  "Prezzo complessivo",
  "Eventuali materiali o tessere",
  "Modalità di iscrizione",
  "Immagine utilizzabile",
] as const;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/per-gli-organizzatori" },
  openGraph: {
    title: `${pageTitle} | EVERAS`,
    description: pageDescription,
    url: "/per-gli-organizzatori",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | EVERAS`,
    description: pageDescription,
    images: [socialImage.url],
  },
};

export default function PerGliOrganizzatoriPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Per gli organizzatori
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {pageDescription}
          </p>
          <p className="mt-4 text-base leading-7 text-slate-700">
            La formazione comprende lezioni e percorsi per il lavoro; ceramica,
            manualità e laboratori creativi rientrano in Corsi e workshop. Indica
            destinatari e risultati attesi, specificando eventuali attestati o
            qualifiche soltanto quando previsti e verificabili.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
            Come viene presentato un corso
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-slate-700">
            {aspects.map((aspect) => (
              <li key={aspect}>{aspect}</li>
            ))}
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-slate-900">
            Informazioni per valutare una proposta
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Per capire se una proposta è pubblicabile servono queste
            informazioni:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
            {proposalDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-7 text-slate-700">
            La pubblicazione avviene dopo la verifica della completezza e della
            pertinenza delle informazioni.
          </p>

          <div className="mt-10">
            <a
              href={PROPOSAL_MAILTO}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#B95408] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#A94B06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
            >
              Proponi un corso o laboratorio
            </a>
            <p className="mt-4 text-base leading-7 text-slate-700">
              La proposta arriva a{" "}
              <a
                href={PROPOSAL_MAILTO}
                className="font-semibold text-[#075EAE] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
              >
                {PROPOSAL_EMAIL}
              </a>
              .
            </p>
          </div>
        </article>
      </main>
    </>
  );
}
