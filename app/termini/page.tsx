import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Termini di utilizzo",
  description: "Consultazione e pubblicazione di corsi su EVERAS, account organizzatori e iscrizioni presso gli enti.",
  alternates: { canonical: "/termini" },
};

export default function TerminiPage() {
  return (
    <LegalPage title="Termini di utilizzo" updatedAt="26 ottobre 2026">
      <p>
        EVERAS è una piattaforma per scoprire formazione per il lavoro,
        corsi, workshop, laboratori ed esperienze in Sardegna e online.
        Guide, esercizi e percorsi editoriali aiutano a confrontare le
        opportunità e a scegliere cosa approfondire. Usando il servizio
        ti impegni a rispettare la legge e i diritti di terzi.
      </p>
      <p>
        Per proporre un’attività puoi creare un account e completare il
        percorso organizzatore. Le proposte sono soggette a verifica prima
        della pubblicazione. Gli organizzatori sono responsabili
        dell’accuratezza di programmi, destinatari, requisiti, date, sedi,
        costi e collegamenti, nonché dei diritti sui testi e sulle immagini
        che caricano. Devono segnalare modifiche, annullamenti e chiusura
        delle iscrizioni.
      </p>
      <p>
        Le schede possono essere curate anche dalla redazione sulla base
        di fonti pubbliche, indicate nella pagina. Una preiscrizione aperta
        con avvio da definire non è una conferma del calendario o del posto.
        Prima di candidarti, verifica le condizioni aggiornate con l’ente.
        Per segnalare un errore, scrivi a info@everas.it indicando la pagina
        e, se disponibile, la fonte della correzione.
      </p>
      <p>
        Creare un account, salvare un corso o seguire un organizzatore su
        EVERAS non equivale a iscriversi al corso. Candidature, ammissioni,
        eventuali pagamenti, rimborsi e svolgimento delle attività sono
        gestiti dagli enti attraverso i canali indicati nelle schede,
        secondo le rispettive condizioni. I link esterni possono avere
        termini e informative propri.
      </p>
      <p>
        Le guide sono strumenti di orientamento: non garantiscono accesso
        a una professione, certificazioni, riconoscimenti o occupazione.
        Attestati e qualifiche dipendono dal percorso effettivamente seguito
        e dalle condizioni dell’ente. EVERAS può correggere o sospendere
        schede incomplete, non verificabili o non conformi a questi termini.
      </p>
      <p>
        Il progetto è ideato e sviluppato da Marina Canalis attraverso
        MC Design. Il trattamento dei dati e le preferenze di consenso
        sono descritti nella <a href="/privacy" className="font-semibold text-[#075EAE] hover:underline">Privacy Policy</a>{" "}
        e nella <a href="/cookie" className="font-semibold text-[#075EAE] hover:underline">Cookie Policy</a>.
      </p>
      <p>
        EVERAS può aggiornare questi termini per migliorare il servizio. Per
        richieste:{" "}
        <a
          href="mailto:info@everas.it"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          info@everas.it
        </a>
        .
      </p>
    </LegalPage>
  );
}
