"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type DeleteEventButtonProps = {
  eventId: string;
  imageUrl: string | null;
};

function getStoragePath(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  const marker = "/storage/v1/object/public/event-images/";
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const encodedPath = imageUrl.slice(markerIndex + marker.length).split("?")[0];

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

export default function DeleteEventButton({
  eventId,
  imageUrl,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function deleteEvent() {
    const confirmed = window.confirm(
      "Vuoi eliminare definitivamente questo evento? L'operazione non può essere annullata.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    const supabase = createClient();
    let imageIsUsedByOtherEvents = true;

    if (imageUrl) {
      const { count, error: countError } = await supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("image_url", imageUrl)
        .neq("id", eventId);

      if (!countError) {
        imageIsUsedByOtherEvents = (count ?? 0) > 0;
      }
    }

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      setErrorMessage(`Eliminazione non riuscita: ${error.message}`);
      setIsDeleting(false);
      return;
    }

    const storagePath = getStoragePath(imageUrl);

    if (storagePath && !imageIsUsedByOtherEvents) {
      const { error: storageError } = await supabase.storage
        .from("event-images")
        .remove([storagePath]);

      if (storageError) {
        console.error("Immagine non eliminata:", storageError);
      }
    }

    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteEvent}
        disabled={isDeleting}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        )}
        {isDeleting ? "Eliminazione..." : "Elimina"}
      </button>

      {errorMessage && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
