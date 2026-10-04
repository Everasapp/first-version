import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Come EVERAS tratta i dati personali e gestisce la scelta per Google Analytics.",
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
