import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Come EVERAS tratta i dati personali, inclusa l’uso di Google Analytics, Google AdSense e il consenso cookie.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="4 ottobre 2026">
      <p>
        EVERAS tratta i dati personali degli utenti per erogare il servizio di
        scoperta e pubblicazione eventi in Sardegna, gestire gli account e
        rispondere alle richieste di contatto.
      </p>
      <p>
        I dati raccolti possono includere nome, email, informazioni del profilo
        organizzatore e contenuti relativi agli eventi pubblicati.
      </p>
      <p>
        Su EVERAS sono presenti servizi di terzi forniti da Google. In ambiente
        di produzione viene utilizzato Google Analytics per statistiche e
        analisi d’uso del sito. Le pagine Privacy Policy e Cookie Policy non
        caricano i tag di Google Analytics e Google AdSense.
      </p>
      <p>
        Dal 4 ottobre 2026, Google AdSense e il suo banner Privacy &amp;
        messaging sono temporaneamente sospesi su tutto il sito. EVERAS non
        carica il tag pubblicitario AdSense e non mostra annunci tramite questa
        integrazione. Google Analytics resta presente con il consenso iniziale
        negato.
      </p>
      <p>
        Per gli utenti nello Spazio economico europeo, nel Regno Unito e in
        Svizzera, EVERAS utilizza Google Consent Mode e il messaggio di consenso
        Privacy &amp; messaging di Google (CMP certificato, framework IAB TCF)
        quando è attivo sul sito. In assenza di consenso, cookie analitici e
        pubblicitari restano disattivati di default; dopo la scelta, Analytics e
        AdSense ricevono gli stati aggiornati. Puoi modificare le preferenze dal
        banner di consenso quando viene mostrato. Per le impostazioni annunci
        Google:{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          adssettings.google.com
        </a>
        .
      </p>
      <p>
        Google Consent Mode può inviare segnali di misurazione senza cookie
        anche quando il consenso è negato. Negare il consenso non equivale
        quindi a impedire ogni comunicazione con Google.
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
