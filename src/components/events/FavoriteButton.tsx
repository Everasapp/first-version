"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart, LoaderCircle } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type FavoriteButtonProps = {
  eventId: string;
  eventTitle: string;
  initialIsFavorite?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export default function FavoriteButton({
  eventId,
  eventTitle,
  initialIsFavorite = false,
  size = "sm",
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const dimension = size === "md" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "md" ? "h-5 w-5" : "h-5 w-5";

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setErrorMessage("");

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const next = `${window.location.pathname}${window.location.search}`;
        router.push(`/accedi?redirect=${encodeURIComponent(next)}`);
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from("event_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setIsFavorite(false);
        router.refresh();
        return;
      }

      const { error } = await supabase.from("event_favorites").insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) {
        // Already favorited (unique constraint) → treat as success
        if (error.code === "23505") {
          setIsFavorite(true);
          router.refresh();
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setIsFavorite(true);
      router.refresh();
    });
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Rimuovi ${eventTitle} dai preferiti`
            : `Salva ${eventTitle} nei preferiti`
        }
        title={errorMessage || undefined}
        className={`grid ${dimension} place-items-center rounded-full bg-white/95 shadow-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-70 ${
          isFavorite
            ? "text-[#E67E22]"
            : "text-slate-700 hover:text-[#E67E22]"
        } ${className}`}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className={`${iconSize} animate-spin`} />
        ) : (
          <Heart
            aria-hidden="true"
            className={`${iconSize} ${isFavorite ? "fill-current" : ""}`}
          />
        )}
      </button>
    </span>
  );
}
