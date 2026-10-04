import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie su EVERAS: cookie necessari, scelta per Google Analytics e preferenze.",
  alternates: { canonical: "/cookie" },
};

export default function CookiePage() {
  return (
    <LegalPage title="Cookie Policy" updatedAt="4 ottobre 2026">
      <p>
        EVERAS utilizza cookie e tecnologie simili per garantire il
        funzionamento del sito, mantenere la sessione di accesso e migliorare
        l&apos;esperienza di navigazione.
      </p>
      <p>
        I cookie tecnici sono necessari al servizio, per esempio per
        autenticazione e preferenze di navigazione. InMobi Choice gestisce il
        banner e memorizza le scelte di consenso con cookie e archiviazione
        locale, tra cui <code>euconsent-v2</code> e <code>gbc_consent</code>.
        Puoi modificare le scelte o cancellarle dalle impostazioni del browser.
      </p>
      <p>
        Google Analytics misura visite e utenti solo dopo che accetti i cookie
        per le statistiche, anche separatamente da quelli pubblicitari.
        Prima della scelta o se rifiuti i cookie per le statistiche, il tag Analytics
        non viene caricato. Quando accetti, Google può usare cookie come
        <code> _ga</code> e <code>_ga_*</code> per le statistiche del sito.
        Le pagine Privacy Policy e Cookie Policy non caricano il tag Analytics.
      </p>
      <p>
        Puoi cambiare scelta in qualsiasi momento da “Preferenze cookie” nel
        footer. Se revochi un consenso già dato, il sito cancella i cookie
        Analytics accessibili sul proprio dominio e ricarica la pagina per
        interrompere il tag già caricato. Puoi anche cancellare i cookie dalle
        impostazioni del browser.
      </p>
      <p>
        Il banner InMobi Choice consente anche di scegliere le finalità e i
        partner pubblicitari. Al momento il tag Google AdSense e gli annunci
        sono sospesi su tutto il sito, in attesa dell&apos;approvazione.
        Accettare una finalità pubblicitaria non attiva il tag AdSense.
        Per informazioni su come Google
        tratta i dati:{" "}
        <a href="https://policies.google.com/privacy" target="_blank"
          rel="noopener noreferrer" className="font-semibold text-[#075EAE] hover:underline">
          Privacy Policy di Google
        </a>.
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
