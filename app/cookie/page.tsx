import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie e tecnologie simili su EVERAS: tecnici, Analytics e pubblicità Google AdSense.",
  alternates: { canonical: "/cookie" },
};

export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updatedAt="21 settembre 2026">
      <p>
        EVERAS utilizza cookie e tecnologie simili per garantire il
        funzionamento del sito, mantenere la sessione di accesso e migliorare
        l&apos;esperienza di navigazione.
      </p>
      <p>
        Alcuni cookie sono tecnici e necessari al servizio (per esempio per
        autenticazione e preferenze di navigazione).
      </p>
      <p>
        In produzione è attivo Google Analytics, che può impostare cookie o
        tecnologie analoghe per misurare in forma aggregata come viene usato il
        sito. È inoltre presente Google AdSense, che può usare cookie o
        tecnologie analoghe per finalità pubblicitarie, secondo le policy di
        Google e dei suoi partner.
      </p>
      <p>
        EVERAS non offre un pannello di gestione cookie proprio. Puoi
        controllare o disabilitare i cookie dalle impostazioni del browser e,
        per gli annunci Google, dalle{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          Impostazioni annunci Google
        </a>
        . Informativa privacy di Google:{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          policies.google.com/privacy
        </a>
        .
      </p>
      <p>
        Per domande:{" "}
        <a
          href="mailto:info@everas.it"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          info@everas.it
        </a>
        . Maggiori dettagli sul trattamento dei dati sono nella{" "}
        <a
          href="/privacy"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </LegalPage>
  );
}
