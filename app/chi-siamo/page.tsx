import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/src/components/home/Header";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Cos’è EVERAS: calendario eventi in Sardegna e guide alla cultura dei comuni, pensato per chi cerca cosa fare e per chi organizza.",
  alternates: { canonical: "/chi-siamo" },
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
            EVERAS è una piattaforma per scoprire eventi, sagre, concerti e
            attività in Sardegna, e per pubblicarli quando sei tu a
            organizzarli.
          </p>

          <div className="mt-10 space-y-5 text-base leading-7 text-slate-700">
            <p>
              È nata perché trovare cosa fare sull’isola è ancora frammentato:
              locandine sparse, siti comunali, social, passaparola. EVERAS
              riunisce in un solo calendario ciò che è pubblico e verificabile,
              filtrabile per giorno, città e interesse.
            </p>
            <p>
              Accanto al calendario c’è{" "}
              <Link
                href="/cultura-sarda"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                Scopri la Sardegna
              </Link>
              : guide ai comuni e pagine sulla cultura e sul patrimonio sardo.
              Non sostituiscono il calendario; lo affiancano, per chi arriva
              anche fuori stagione o vuole capire un paese oltre la data
              dell’evento.
            </p>
            <p>
              Gli eventi su EVERAS arrivano da organizzatori che pubblicano
              dalla piattaforma, da segnalazioni della community e da lavoro di
              raccolta e verifica. Ogni scheda riporta, quando disponibili,
              data, luogo, descrizione e collegamenti utili. Non pretendiamo di
              elencare tutto ciò che accade in Sardegna: puntiamo a dati chiari
              e aggiornati su ciò che pubblichiamo.
            </p>
            <p>
              Se hai visto un appuntamento che manca, puoi{" "}
              <Link
                href="/segnala-evento"
                className="font-semibold text-[#075EAE] hover:underline"
              >
                segnalare un evento
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
              prima di partire, verifica le ultime comunicazioni
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
