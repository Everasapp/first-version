"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type DeleteCampaignButtonProps = {
  campaignId: string;
  subject: string;
  /** Se true, dopo il delete torna all'elenco */
  redirectToList?: boolean;
  /** Campagna ancora in invio: non eliminabile */
  isSending?: boolean;
  className?: string;
};

export default function DeleteCampaignButton({
  campaignId,
  subject,
  redirectToList = true,
  isSending = false,
  className = "",
}: DeleteCampaignButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function deleteCampaign() {
    if (isSending) return;

    const confirmed = window.confirm(
      `Vuoi eliminare la campagna «${subject}» dallo storico?\n\nLe email già inviate restano nelle caselle dei destinatari. L’operazione non può essere annullata.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("email_campaigns")
      .delete()
      .eq("id", campaignId);

    if (error) {
      setErrorMessage(`Eliminazione non riuscita: ${error.message}`);
      setIsDeleting(false);
      return;
    }

    if (redirectToList) {
      router.push("/admin/campagne");
      router.refresh();
      return;
    }

    router.refresh();
    setIsDeleting(false);
  }

  if (isSending) {
    return (
      <p className="text-xs font-semibold text-slate-500">
        Invio in corso
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteCampaign}
        disabled={isDeleting}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {isDeleting ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        )}
        {isDeleting ? "Eliminazione…" : "Elimina"}
      </button>

      {errorMessage ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
