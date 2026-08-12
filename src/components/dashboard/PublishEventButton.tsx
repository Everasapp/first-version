"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Send } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type PublishEventButtonProps = {
  eventId: string;
  eventSlug: string;
};

export default function PublishEventButton({
  eventId,
  eventSlug,
}: PublishEventButtonProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function publishEvent() {
    const confirmed = window.confirm(
      "Vuoi pubblicare questo evento? Diventerà visibile su EVERAS.",
    );
    if (!confirmed) return;

    setIsPublishing(true);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("events")
      .update({ status: "published" })
      .eq("id", eventId);

    if (error) {
      setErrorMessage(`Pubblicazione non riuscita: ${error.message}`);
      setIsPublishing(false);
      return;
    }

    router.push(`/eventi/${eventSlug}`);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={publishEvent}
        disabled={isPublishing}
        className="inline-flex items-center gap-2 rounded-xl bg-[#075EAE] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#064a8a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPublishing ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="h-4 w-4" />
        )}
        {isPublishing ? "Pubblicazione..." : "Pubblica"}
      </button>
      {errorMessage ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
