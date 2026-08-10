"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Sparkles } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";
import type { PlanSlug } from "@/src/lib/plans";

type RequestPlanButtonProps = {
  planSlug: Extract<PlanSlug, "regular" | "full">;
  label: string;
};

export default function RequestPlanButton({
  planSlug,
  label,
}: RequestPlanButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.rpc("request_plan_upgrade", {
      p_plan_slug: planSlug,
      p_message: message.trim() || null,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setDone(true);
    setIsLoading(false);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        <span className="inline-flex items-center gap-2">
          <Check aria-hidden="true" className="h-4 w-4" />
          Richiesta inviata. Ti contatteremo per attivare il piano.
        </span>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={3}
        placeholder="Messaggio opzionale (es. quante eventi pubblichi al mese)"
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
      />
      {errorMessage ? (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        )}
        {label}
      </button>
    </form>
  );
}
