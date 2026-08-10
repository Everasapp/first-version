"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, Star } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type PromoteEventButtonProps = {
  eventId: string;
  isFeatured: boolean;
  canPromote: boolean;
};

export default function PromoteEventButton({
  eventId,
  isFeatured,
  canPromote,
}: PromoteEventButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  function handleClick() {
    setErrorMessage("");

    if (!isFeatured && !canPromote) {
      router.push("/dashboard/piano?motivo=promuovi");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc("set_event_featured", {
        p_event_id: eventId,
        p_featured: !isFeatured,
      });

      if (error) {
        if (error.message.includes("PROMO_REQUIRES_PRO")) {
          router.push("/dashboard/piano?motivo=promuovi");
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-wait disabled:opacity-60 ${
          isFeatured
            ? "border border-[#E67E22] bg-orange-50 text-[#E67E22]"
            : "border border-slate-300 text-slate-700 hover:border-[#E67E22] hover:text-[#E67E22]"
        }`}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Star
            aria-hidden="true"
            className={`h-4 w-4 ${isFeatured ? "fill-current" : ""}`}
          />
        )}
        {isFeatured ? "In evidenza" : "Promuovi"}
      </button>
      {errorMessage ? (
        <p className="mt-1 text-xs font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
