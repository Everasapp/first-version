import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Dati personali su EVERAS: account, corsi e laboratori, contatti, newsletter e preferenze di consenso.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="26 ottobre 2026">
      <p>
        EVERAS tratta i dati personali degli utenti per erogare il servizio di
        ricerca e pubblicazione di formazione, corsi, workshop ed esperienze
        in Sardegna e online, gestire gli account e rispondere alle richieste
        di contatto. Il sito propone anche guide e percorsi editoriali per
        orientare la scelta di cosa imparare.
      </p>
      <p>
        I dati raccolti possono includere nome, email, informazioni del profilo
        organizzatore, messaggi inviati e contenuti relativi alle attività
        pubblicate. I dati inseriti nelle schede e nei profili organizzatore
        destinati alla pubblicazione sono visibili ai visitatori: evita di
        inserire informazioni personali non necessarie.
      </p>
      <p>
        Se ti iscrivi alla newsletter, utilizziamo l’indirizzo email e le
        preferenze sulle zone e sulle discipline per inviarti le proposte
        selezionate. Puoi annullare l’iscrizione dal collegamento presente
        nelle email. L’account EVERAS e l’iscrizione alla newsletter sono
        distinti dalla candidatura a un corso.
      </p>
      <p>
        I collegamenti per informazioni, candidature e pagamenti dei corsi
        possono aprire siti esterni gestiti dagli organizzatori. Prima di
        inviare dati o documenti a un ente, consulta la sua informativa:
        la pubblicazione di una scheda su EVERAS non comporta l’invio
        automatico dei tuoi dati all’organizzatore.
      </p>
      <p>
        In produzione, Google Analytics misura visite e utenti del sito dopo
        il tuo consenso. Prima della scelta o in caso di rifiuto, il tag non
        viene caricato. Le pagine Privacy Policy e Cookie Policy non caricano
        il tag Analytics.
      </p>
      <p>
        Dal 4 ottobre 2026, Google AdSense e il suo banner Privacy &amp;
        messaging sono temporaneamente sospesi su tutto il sito. EVERAS non
        carica il tag pubblicitario AdSense e non mostra annunci tramite questa
        integrazione. Il nuovo banner InMobi Choice gestisce le preferenze
        per Analytics e le finalità pubblicitarie, comprese le scelte per Google.
      </p>
      <p>
        Puoi accettare, rifiutare o personalizzare i cookie dal banner InMobi
        Choice. Le preferenze per le statistiche sono distinte da quelle
        pubblicitarie. La scelta viene memorizzata dalla CMP e può essere modificata dal
        comando “Preferenze cookie” nel footer. In caso di revoca, il sito
        disattiva Analytics, cancella i relativi cookie accessibili sul proprio
        dominio e ricarica la pagina. Per maggiori dettagli consulta la{" "}
        <a href="/cookie" className="font-semibold text-[#075EAE] hover:underline">
          Cookie Policy
        </a>.
      </p>
      <p>
        Per maggiori dettagli su come Google tratta i dati:{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          Privacy Policy di Google
        </a>
        . Per esercitare i tuoi diritti o ricevere maggiori informazioni puoi
        scriverci a{" "}
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
