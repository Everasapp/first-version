import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa sui cookie di EVERAS.",
};

export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updatedAt="9 agosto 2026">
      <p>
        EVERAS utilizza cookie e tecnologie simili per garantire il
        funzionamento del sito, mantenere la sessione di accesso e migliorare
        l&apos;esperienza di navigazione.
      </p>
      <p>
        Alcuni cookie sono tecnici e necessari al servizio. Eventuali cookie di
        analisi, se presenti, vengono usati in forma aggregata per capire come
        viene utilizzato il sito.
      </p>
      <p>
        Puoi gestire o disabilitare i cookie dalle impostazioni del tuo browser.
        Per domande:{" "}
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
