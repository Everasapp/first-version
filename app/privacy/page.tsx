import type { Metadata } from "next";

import LegalPage from "@/src/components/home/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy di EVERAS.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="9 agosto 2026">
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
        Per esercitare i tuoi diritti o ricevere maggiori informazioni puoi
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
