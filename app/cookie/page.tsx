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
        autenticazione e preferenze di navigazione. La tua scelta per Analytics
        viene salvata nel cookie tecnico <code>everas_analytics_consent_v1</code>
        per 180 giorni, salvo cancellazione dal browser.
      </p>
      <p>
        Google Analytics misura visite e utenti solo dopo che premi “Accetta”
        nel banner. Prima della scelta o se premi “Rifiuta”, il tag Analytics
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
        Dal 4 ottobre 2026, Google AdSense e il suo messaggio di consenso sono
        sospesi su tutto il sito. Il banner attuale gestisce soltanto Analytics
        e non abilita cookie pubblicitari. Per informazioni su come Google
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
