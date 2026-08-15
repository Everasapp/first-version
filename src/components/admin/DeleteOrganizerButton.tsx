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
  className?: string;
};

export default function DeleteOrganizerButton({
  organizerId,
  organizerName,
  redirectToList = true,
  className = "",
}: DeleteOrganizerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function deleteOrganizer() {
    const confirmed = window.confirm(
      `Vuoi eliminare definitivamente «${organizerName}» dalla rubrica?\n\nGli eventuali eventi collegati restano online (il collegamento viene rimosso). L’operazione non può essere annullata.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    const supabase = createClient();
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
