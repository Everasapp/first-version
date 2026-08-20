"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, LoaderCircle, Users } from "lucide-react";

import { type SocialIntent } from "@/src/lib/community";
import { createClient } from "@/src/lib/supabase/client";

type EventRsvpCardProps = {
  eventId: string;
  eventTitle: string;
  isAuthenticated: boolean;
  initialGoing: boolean;
  initialIntent: SocialIntent | null;
  defaultOpenToMeeting: boolean;
};

const INTENT_OPTIONS: { value: SocialIntent; label: string; hint: string }[] = [
  {
    value: "solo",
    label: "Vado da solo/a",
    hint: "Mi va di partecipare in autonomia.",
  },
  {
    value: "meet",
    label: "Aperto/a a conoscere persone nuove",
    hint: "Se qualcuno vuole salutare, sono contento/a.",
  },
  {
    value: "friends",
    label: "Vengo con amici",
    hint: "Arrivo già in compagnia.",
  },
];

export default function EventRsvpCard({
  eventId,
  eventTitle,
  isAuthenticated,
  initialGoing,
  initialIntent,
  defaultOpenToMeeting,
}: EventRsvpCardProps) {
  const router = useRouter();
  const [going, setGoing] = useState(initialGoing);
  const [intent, setIntent] = useState<SocialIntent | null>(initialIntent);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function redirectToLogin() {
    const next = `${window.location.pathname}${window.location.search}`;
    router.push(`/accedi?redirect=${encodeURIComponent(next)}`);
  }

  function saveRsvp(nextGoing: boolean, nextIntent: SocialIntent | null) {
    setErrorMessage("");

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirectToLogin();
        return;
      }

      if (!nextGoing) {
        const { error } = await supabase
          .from("event_rsvps")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);

        if (error) {
          setErrorMessage("Non è stato possibile aggiornare la partecipazione.");
          return;
        }

        setGoing(false);
        setIntent(null);
        router.refresh();
        return;
      }

      const payload = {
        event_id: eventId,
        user_id: user.id,
        status: "going",
        social_intent: nextIntent,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("event_rsvps").upsert(payload, {
        onConflict: "event_id,user_id",
      });

      if (error) {
        setErrorMessage("Non è stato possibile salvare. Riprova tra poco.");
        return;
      }

      setGoing(true);
      setIntent(nextIntent);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#E67E22]">
          <Users aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Ci vado</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Fai sapere se sarai a {eventTitle}. Incontrare persone nuove è
            facoltativo e sempre con rispetto.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => saveRsvp(!going, going ? null : intent)}
        disabled={isPending}
        aria-pressed={going}
        className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition disabled:cursor-wait disabled:opacity-70 ${
          going
            ? "border border-[#075EAE] bg-blue-50 text-[#075EAE]"
            : "bg-[#E67E22] text-white hover:bg-[#C96A1A]"
        }`}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
        ) : going ? (
          <Check aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Users aria-hidden="true" className="h-5 w-5" />
        )}
        {going ? "Ci vado · tocca per ritirare" : "Ci vado"}
      </button>

      {going ? (
        <fieldset className="mt-5 space-y-2">
          <legend className="text-sm font-semibold text-slate-800">
            Come partecipi?{" "}
            <span className="font-normal text-slate-500">(opzionale)</span>
          </legend>
          {INTENT_OPTIONS.map((option) => {
            const selected = intent === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                  selected
                    ? "border-[#075EAE] bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="social-intent"
                  className="mt-1"
                  checked={selected}
                  disabled={isPending}
                  onChange={() => saveRsvp(true, option.value)}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                    {option.hint}
                  </span>
                </span>
              </label>
            );
          })}
          {intent ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => saveRsvp(true, null)}
              className="text-xs font-semibold text-slate-500 hover:text-[#075EAE]"
            >
              Rimuovi questa scelta
            </button>
          ) : defaultOpenToMeeting ? (
            <p className="text-xs text-slate-500">
              Nel tuo profilo sei aperto/a a conoscere persone nuove. Puoi
              confermarlo qui o lasciarlo così.
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {errorMessage ? (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isAuthenticated ? (
        <p className="mt-4 text-xs text-slate-500">
          <Link
            href="/dashboard/comunita"
            className="font-semibold text-[#075EAE] hover:underline"
          >
            Personalizza come compari
          </Link>
        </p>
      ) : null}
    </div>
  );
}
