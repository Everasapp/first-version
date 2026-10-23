"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Mail } from "lucide-react";
import { createClient } from "@/src/lib/supabase/client";

type Props = { directoryId: string; organizerName: string; eventCount: number; isAlreadyOrganizer: boolean };

export default function ClaimOrganizerForm({ directoryId, organizerName, eventCount }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const subject = `Assistenza rivendicazione profilo – ${organizerName}`;
  const body = `Buongiorno, vorrei gestire il profilo ${organizerName} (ID: ${directoryId}). Sono un referente autorizzato, ma utilizzo un'email diversa da quella ufficiale. Potete aiutarmi con la verifica?`;
  const emailLink = `mailto:info@everas.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function claim() {
    setBusy(true);
    setError("");
    const { error: claimError } = await supabase.rpc("claim_organizer_directory", { p_directory_id: directoryId });
    if (claimError) {
      setError("Non è stato possibile verificare automaticamente il tuo indirizzo. Accedi con l'email ufficiale già confermata oppure richiedi assistenza.");
      setBusy(false);
      return;
    }
    router.push("/dashboard?rivendicato=1");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-slate-600">
        Se hai effettuato l&apos;accesso con l&apos;email ufficiale verificata di {organizerName},
        puoi collegare il profilo e gestire {eventCount} corsi già pubblicati.
      </p>
      <button type="button" onClick={() => void claim()} disabled={busy}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 py-3 font-bold text-white disabled:opacity-60">
        <BadgeCheck aria-hidden="true" className="h-5 w-5" />
        {busy ? "Verifica in corso..." : "Attiva il mio profilo"}
      </button>
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <a href={emailLink} className="inline-flex items-center gap-2 text-sm font-semibold text-[#075EAE]">
        <Mail aria-hidden="true" className="h-4 w-4" /> Uso un&apos;altra email: richiedi assistenza
      </a>
    </div>
  );
}
