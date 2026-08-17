"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, LoaderCircle } from "lucide-react";

import { requestAdminNotification } from "@/src/lib/notifications/client";
import type { ClaimOrganizerResult } from "@/src/lib/organizer-claim";
import { createClient } from "@/src/lib/supabase/client";

type ClaimOrganizerFormProps = {
  directoryId: string;
  organizerName: string;
  eventCount: number;
  isAlreadyOrganizer: boolean;
};

export default function ClaimOrganizerForm({
  directoryId,
  organizerName,
  eventCount,
  isAlreadyOrganizer,
}: ClaimOrganizerFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClaim() {
    setErrorMessage("");
    setIsLoading(true);

    const { data, error } = await supabase.rpc("claim_organizer_directory", {
      p_directory_id: directoryId,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    const result = data as ClaimOrganizerResult | null;
    if (result?.became_organizer) {
      requestAdminNotification({ type: "organizer_registered" });
    }

    router.push("/dashboard?rivendicato=1");
    router.refresh();
  }

  const eventsLabel =
    eventCount === 1
      ? "1 evento già pubblicato"
      : `${eventCount} eventi già pubblicati`;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-600">
        {isAlreadyOrganizer
          ? `Confermi di rappresentare ${organizerName}? Potrai modificare ${eventsLabel} e pubblicarne altri dal tuo account.`
          : `Con lo stesso account diventi organizzatore di ${organizerName}, puoi modificare ${eventsLabel} e crearne di nuovi.`}
      </p>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleClaim()}
        disabled={isLoading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Rivendicazione in corso...
          </>
        ) : (
          <>
            <BadgeCheck aria-hidden="true" className="h-5 w-5" />
            Rivendica organizzatore
          </>
        )}
      </button>
    </div>
  );
}
