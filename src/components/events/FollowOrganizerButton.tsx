"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, UserMinus, UserPlus } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type FollowOrganizerButtonProps = {
  organizerId: string;
  organizerName: string;
  initialIsFollowing?: boolean;
  className?: string;
};

export default function FollowOrganizerButton({
  organizerId,
  organizerName,
  initialIsFollowing = false,
  className = "",
}: FollowOrganizerButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  function handleClick() {
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

      if (user.id === organizerId) {
        setErrorMessage("Non puoi seguire te stesso.");
        return;
      }

      if (isFollowing) {
        const { error } = await supabase
          .from("organizer_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("organizer_id", organizerId);

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setIsFollowing(false);
        router.refresh();
        return;
      }

      const { error } = await supabase.from("organizer_follows").insert({
        follower_id: user.id,
        organizer_id: organizerId,
      });

      if (error) {
        if (error.code === "23505") {
          setIsFollowing(true);
          router.refresh();
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setIsFollowing(true);
      router.refresh();
    });
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isFollowing}
        aria-label={
          isFollowing
            ? `Smetti di seguire ${organizerName}`
            : `Segui ${organizerName}`
        }
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-wait disabled:opacity-70 ${
          isFollowing
            ? "border border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:text-red-600"
            : "bg-[#075EAE] text-white hover:bg-[#064E91]"
        }`}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <UserMinus aria-hidden="true" className="h-4 w-4" />
        ) : (
          <UserPlus aria-hidden="true" className="h-4 w-4" />
        )}
        {isFollowing ? "Seguito" : "Segui"}
      </button>

      {errorMessage ? (
        <p className="mt-2 text-xs font-medium text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
