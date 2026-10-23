"use client";

import { Mail } from "lucide-react";

type ClaimOrganizerFormProps = {
  directoryId: string;
  organizerName: string;
  eventCount: number;
  isAlreadyOrganizer: boolean;
};

/**
 * Ownership must be verified by Everas before any courses are transferred.
 * The old public claim_organizer_directory RPC is intentionally not called.
 */
export default function ClaimOrganizerForm({
  directoryId,
  organizerName,
  eventCount,
  isAlreadyOrganizer,
}: ClaimOrganizerFormProps) {
  const subject = `Richiesta di rivendicazione profilo – ${organizerName}`;
  const body = [
    "Buongiorno team EVERAS,",
    "",
    `Vorrei richiedere la gestione del profilo organizzatore "${organizerName}".`,
    `ID profilo: ${directoryId}`,
    "",
    "Nome e cognome del referente:",
    "Ruolo nell'organizzazione:",
    "Email aziendale di riferimento:",
    "",
    "Potete indicarmi come completare la verifica dell'autorizzazione?",
    "",
    "Grazie.",
  ].join("\n");
  const mailto = `mailto:info@everas.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">
        {isAlreadyOrganizer
          ? `Per gestire ${organizerName} e i ${eventCount} corsi già pubblicati, richiedi la verifica del tuo ruolo nell'organizzazione.`
          : `Per gestire il profilo ${organizerName} e i ${eventCount} corsi già pubblicati, invia una richiesta di verifica al team EVERAS.`}
      </p>
      <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
        Per proteggere gli organizzatori, il profilo e i corsi saranno assegnati
        soltanto dopo la verifica e l'approvazione del team EVERAS.
      </p>
      <a
        href={mailto}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 py-3 text-center font-bold text-white transition hover:bg-[#C96A1A]"
      >
        <Mail aria-hidden="true" className="h-5 w-5" />
        Richiedi la gestione del profilo
      </a>
      <p className="text-xs text-slate-500">
        Si aprirà la tua applicazione email con una richiesta precompilata. Nessuna
        proprietà viene trasferita automaticamente.
      </p>
    </div>
  );
}
