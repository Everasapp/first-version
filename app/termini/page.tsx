import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Termini di utilizzo",
  description: "Termini di utilizzo della piattaforma EVERAS.",
};

export default function TerminiPage() {
  return (
    <LegalPage title="Termini di utilizzo" updatedAt="9 agosto 2026">
      <p>
        Usando EVERAS accetti di pubblicare e consultare contenuti relativi ad
        eventi in modo corretto, lecito e rispettoso della legge e dei diritti
        di terzi.
      </p>
      <p>
        Gli organizzatori sono responsabili delle informazioni inserite
        (date, luoghi, prezzi, link ai biglietti e immagini) e della loro
        veridicità.
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
