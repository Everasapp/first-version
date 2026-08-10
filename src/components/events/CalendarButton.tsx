"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarPlus, CalendarCheck, LoaderCircle } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

type CalendarButtonProps = {
  eventId: string;
  eventTitle: string;
  initialInCalendar?: boolean;
  size?: "sm" | "md";
  className?: string;
  variant?: "icon" | "button";
};

export default function CalendarButton({
  eventId,
  eventTitle,
  initialInCalendar = false,
  size = "sm",
  className = "",
  variant = "icon",
}: CalendarButtonProps) {
  const router = useRouter();
  const [inCalendar, setInCalendar] = useState(initialInCalendar);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const dimension = size === "md" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = "h-5 w-5";

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

      if (inCalendar) {
        const { error } = await supabase
          .from("calendar_events")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setInCalendar(false);
        router.refresh();
        return;
      }

      const { error } = await supabase.from("calendar_events").insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) {
        if (error.code === "23505") {
          setInCalendar(true);
          router.refresh();
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setInCalendar(true);
      router.refresh();
    });
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={inCalendar}
        title={errorMessage || undefined}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-4 font-bold transition disabled:cursor-wait disabled:opacity-70 ${
          inCalendar
            ? "border-[#075EAE] bg-blue-50 text-[#075EAE]"
            : "border-slate-300 text-slate-700 hover:border-[#075EAE] hover:text-[#075EAE]"
        } ${className}`}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : inCalendar ? (
          <CalendarCheck aria-hidden="true" className="h-5 w-5" />
        ) : (
          <CalendarPlus aria-hidden="true" className="h-5 w-5" />
        )}
        {inCalendar ? "Nel tuo calendario" : "Aggiungi al calendario"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={inCalendar}
      aria-label={
        inCalendar
          ? `Rimuovi ${eventTitle} dal calendario`
          : `Aggiungi ${eventTitle} al calendario`
      }
      title={errorMessage || undefined}
      className={`grid ${dimension} place-items-center rounded-full bg-white/95 shadow-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-70 ${
        inCalendar
          ? "text-[#075EAE]"
          : "text-slate-700 hover:text-[#075EAE]"
      } ${className}`}
    >
      {isPending ? (
        <LoaderCircle aria-hidden="true" className={`${iconSize} animate-spin`} />
      ) : inCalendar ? (
        <CalendarCheck aria-hidden="true" className={iconSize} />
      ) : (
        <CalendarPlus aria-hidden="true" className={iconSize} />
      )}
    </button>
  );
}
