"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type DeleteUnusedOrganizersButtonProps = {
  unusedIds: string[];
};

export default function DeleteUnusedOrganizersButton({
  unusedIds,
}: DeleteUnusedOrganizersButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (unusedIds.length === 0) {
    return null;
  }

  async function deleteUnused() {
    const confirmed = window.confirm(
      `Vuoi eliminare ${unusedIds.length} organizzator${
        unusedIds.length === 1 ? "e non usato" : "i non usati"
      } dalla rubrica?\n\nVerranno rimossi solo quelli senza eventi collegati. L’operazione non può essere annullata.`,
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
      .in("id", unusedIds);

    if (error) {
      setErrorMessage(`Eliminazione non riuscita: ${error.message}`);
      setIsDeleting(false);
      return;
    }

    router.refresh();
    setIsDeleting(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteUnused}
        disabled={isDeleting}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        )}
        {isDeleting
          ? "Eliminazione…"
          : `Elimina ${unusedIds.length} non usat${unusedIds.length === 1 ? "o" : "i"}`}
      </button>
      {errorMessage ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
