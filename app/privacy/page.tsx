import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Come EVERAS tratta i dati personali, inclusa l’uso di Google Analytics e Google AdSense.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="21 settembre 2026">
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
        di produzione viene utilizzato Google Analytics (measurement ID{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          G-NBHEHZ5FLD
        </code>
        , oppure l’identificativo indicato dalla variabile d’ambiente{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          NEXT_PUBLIC_GA_MEASUREMENT_ID
        </code>
        ) per statistiche e analisi d’uso del sito, in forma aggregata.
      </p>
      <p>
        Il sito utilizza anche Google AdSense (publisher ID{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          ca-pub-5513319548780658
        </code>
        ) per mostrare annunci. Google e i suoi partner possono usare cookie o
        tecnologie analoghe per finalità pubblicitarie, secondo le rispettive
        impostazioni e policy. Il file{" "}
        <a
          href="/ads.txt"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          ads.txt
        </a>{" "}
        dichiara il rapporto con Google AdSense.
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
        . Per le impostazioni relative agli annunci:{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          Impostazioni annunci Google
        </a>
        .
      </p>
      <p>
        EVERAS non implementa un banner di consenso cookie dedicato. Puoi
        gestire o limitare cookie e tecnologie simili anche dalle impostazioni
        del browser. Per esercitare i tuoi diritti o ricevere maggiori
        informazioni puoi scriverci a{" "}
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
