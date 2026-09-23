import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie e tecnologie simili su EVERAS: tecnici, Analytics, AdSense e consenso Privacy & messaging.",
  alternates: { canonical: "/cookie" },
};

export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updatedAt="22 settembre 2026">
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
        In produzione sono presenti Google Analytics e Google AdSense, che
        possono impostare cookie o tecnologie analoghe per misurazione
        aggregata e finalità pubblicitarie, secondo le policy di Google e dei
        suoi partner.
      </p>
      <p>
        Per UE, Regno Unito e Svizzera, quando è attivo, EVERAS mostra il
        messaggio di consenso Privacy &amp; messaging di Google (CMP
        certificato). Fino al consenso, cookie analitici e pubblicitari restano
        non abilitati di default (Google Consent Mode). Puoi accettare,
        rifiutare o gestire le opzioni dal banner; in seguito puoi tornare sulle
        preferenze quando il messaggio lo consente. Impostazioni annunci Google:{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#075EAE] hover:underline"
        >
          adssettings.google.com
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
