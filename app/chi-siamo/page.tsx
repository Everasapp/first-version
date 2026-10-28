import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/src/components/home/Header";

const description =
  "EVERAS ti aiuta a trovare formazione per il lavoro e corsi, workshop ed esperienze per coltivare una passione in Sardegna.";
const socialImage = {
  url: "/images/learning/imparare-sardegna-og.jpg",
  width: 1200,
  height: 630,
  alt: "Imparare e fare in Sardegna con EVERAS",
};

export const metadata: Metadata = {
  title: "Chi siamo",
  description,
  alternates: { canonical: "/chi-siamo" },
  openGraph: {
    title: "Chi siamo | EVERAS",
    description,
    url: "/chi-siamo",
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chi siamo | EVERAS",
    description,
    images: [socialImage.url],
  },
};

export default function ChiSiamoPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Il progetto
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            Chi siamo
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            EVERAS ti aiuta a trovare formazione per il lavoro e corsi,
            workshop ed esperienze per coltivare una passione in Sardegna.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Due percorsi guidano la scelta: Formazione, per acquisire competenze
            professionali, e Corsi e workshop, per vivere esperienze che
            arricchiscono. Materia e formato aiutano a trovare l’attività più
            adatta al tuo obiettivo.
          </p>

          <div className="mt-10 space-y-5 text-base leading-7 text-slate-700">
            <p>
              È nata perché trovare cosa fare sull’isola è ancora frammentato:
              locandine sparse, siti comunali, social, passaparola. Le proposte
              per imparare sono raccolte nei due percorsi Formazione e Corsi e
              workshop, con informazioni utili a confrontare le attività.
            </p>
            <section aria-labelledby="missione-everas" className="space-y-5">
              <h2
                id="missione-everas"
                className="pt-5 text-2xl font-bold tracking-tight text-slate-900"
              >
                La nostra missione
              </h2>
              <p className="text-lg font-semibold text-slate-900">
                Facilitare l’accesso all’apprendimento e ridurre le barriere
                informative e territoriali che rendono più difficile partecipare.
              </p>
              <p>
                Vogliamo aiutare chi vive in Sardegna a conoscere le opportunità
                disponibili, capire a chi sono rivolte e scegliere quelle più
                adatte ai propri interessi e obiettivi. Con attenzione anche ai
                piccoli comuni e alle realtà meno visibili.
              </p>
            </section>
            <section aria-labelledby="valori-everas" className="space-y-5">
              <h2
                id="valori-everas"
                className="pt-5 text-2xl font-bold tracking-tight text-slate-900"
              >
                In cosa crediamo
              </h2>
              <p>
                Imparare ha valore in ogni fase della vita. Può aiutare a trovare
                nuove prospettive nel lavoro, esprimere la propria creatività,
                conoscere altre persone e sentirsi parte di una comunità.
              </p>
              <p>
                La Sardegna custodisce competenze, saperi e iniziative che
                meritano di essere conosciuti. Vogliamo contribuire a mettere
                in relazione chi desidera imparare con chi ha qualcosa da
                insegnare.
              </p>
            </section>
            <section aria-labelledby="obiettivi-everas" className="space-y-5">
              <h2
                id="obiettivi-everas"
                className="pt-5 text-2xl font-bold tracking-tight text-slate-900"
              >
                Come lavoriamo per questo obiettivo
              </h2>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong>Rendiamo più semplice la ricerca</strong>, raccogliendo
                  opportunità consultabili per territorio, disciplina e interesse.
                </li>
                <li>
                  <strong>Diamo visibilità alla formazione gratuita e agevolata</strong>,
                  per aiutare le persone a conoscere le possibilità di accesso.
                </li>
                <li>
                  <strong>Affianchiamo formazione professionale e passioni personali</strong>,
                  perché l’apprendimento comprende sia il lavoro sia il piacere
                  di sperimentare.
                </li>
                <li>
                  <strong>Valorizziamo le iniziative locali</strong>, dai percorsi
                  degli enti formativi ai laboratori di associazioni, insegnanti
                  e artigiani.
                </li>
                <li>
                  <strong>Pubblichiamo guide e risorse</strong>, per aiutare a
                  esplorare un interesse e prepararsi a scegliere un percorso.
                </li>
              </ul>
            </section>
            <h2 className="pt-5 text-2xl font-bold tracking-tight text-slate-900">
              Le proposte e la partecipazione
            </h2>
            <p>
              Le attività su EVERAS arrivano da organizzatori che pubblicano
              dalla piattaforma, da segnalazioni della community e da lavoro di
              raccolta e verifica. Ogni scheda riporta, quando disponibili,
              data, luogo, descrizione e collegamenti utili. Non pretendiamo di
              elencare tutto ciò che accade in Sardegna: puntiamo a dati chiari
              e aggiornati su ciò che pubblichiamo.
            </p>
            <p>
              Se hai visto un appuntamento che manca, puoi{" "}
              <Link
                href="/per-gli-organizzatori"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                proporre un corso o un’esperienza
              </Link>
              . Se organizzi, puoi{" "}
              <Link
                href="/pubblica"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                pubblicare
              </Link>{" "}
              o{" "}
              <Link
                href="/diventa-organizzatore"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                diventare organizzatore
              </Link>
              .
            </p>
            <h2 className="pt-5 text-2xl font-bold tracking-tight text-slate-900">
              Chi c’è dietro EVERAS
            </h2>
            <p>
              EVERAS è un progetto indipendente ideato e sviluppato da Marina
              Canalis, attraverso{" "}
              <a
                href="https://www.mc-design.site/it/home"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                MC Design
              </a>
              . Per domande, segnalazioni o collaborazioni:{" "}
              <Link
                href="/contatti"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                Contatti
              </Link>{" "}
              oppure{" "}
              <a
                href="mailto:info@everas.it"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                info@everas.it
              </a>
              .
            </p>
            <h2 className="pt-5 text-2xl font-bold tracking-tight text-slate-900">
              Come curiamo i contenuti
            </h2>
            <p>
              Per controllare gli appuntamenti, il nostro riferimento sono le
              comunicazioni degli organizzatori, dei Comuni e degli enti che
              promuovono le iniziative. Confrontiamo le informazioni disponibili
              su data, luogo e programma e correggiamo le schede quando emergono
              errori o aggiornamenti. Se mancano dati essenziali e non riusciamo
              a verificarli, sospendiamo la pubblicazione della scheda.
            </p>
            <p>
              Le guide ai comuni raccolgono storia, tradizioni e luoghi da
              visitare, con riferimenti alle fonti nelle pagine. Orari,
              programmi, prezzi e condizioni di accesso possono cambiare:
              prima di iscriverti o partire, verifica le ultime comunicazioni
              dell’organizzatore o del gestore del luogo.
            </p>
            <p>
              Hai trovato un errore? Scrivi a{" "}
              <a
                href="mailto:info@everas.it"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                info@everas.it
              </a>{" "}
              indicando il collegamento alla pagina, la correzione e, se
              disponibile, una fonte. Le segnalazioni ci aiutano a mantenere
              utili il calendario e le guide.
            </p>
          </div>
        </article>
      </main>
    </>
  );
}
