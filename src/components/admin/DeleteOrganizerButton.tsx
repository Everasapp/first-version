"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type DeleteOrganizerButtonProps = {
  organizerId: string;
  organizerName: string;
  /** Se true, dopo il delete torna all'elenco */
  redirectToList?: boolean;
  /** Collegato ad almeno un evento: non eliminabile */
  inUse?: boolean;
  eventCount?: number;
  className?: string;
};

export default function DeleteOrganizerButton({
  organizerId,
  organizerName,
  redirectToList = true,
  inUse = false,
  eventCount = 0,
  className = "",
}: DeleteOrganizerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function deleteOrganizer() {
    if (inUse) {
      return;
    }

    const confirmed = window.confirm(
      `Vuoi eliminare definitivamente «${organizerName}» dalla rubrica?\n\nL’operazione non può essere annullata.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    const supabase = createClient();

    const { count, error: countError } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("organizer_directory_id", organizerId);

    if (countError) {
      setErrorMessage(`Verifica utilizzo non riuscita: ${countError.message}`);
      setIsDeleting(false);
      return;
    }

    if ((count ?? 0) > 0) {
      setErrorMessage(
        `Non eliminabile: collegato a ${count} event${count === 1 ? "o" : "i"}.`,
      );
      setIsDeleting(false);
      router.refresh();
      return;
    }

    const { error } = await supabase
      .from("organizer_directory")
      .delete()
      .eq("id", organizerId);

    if (error) {
      setErrorMessage(`Eliminazione non riuscita: ${error.message}`);
      setIsDeleting(false);
      return;
    }

    if (redirectToList) {
      router.push("/admin/organizzatori");
      router.refresh();
      return;
    }

    router.refresh();
    setIsDeleting(false);
  }

  if (inUse) {
    return (
      <p
        className="text-xs font-semibold text-slate-500"
        title={`Collegato a ${eventCount} event${eventCount === 1 ? "o" : "i"}`}
      >
        In uso
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteOrganizer}
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
