"use client";

import { useEffect, useRef, useState } from "react";
import {
  OPEN_ANALYTICS_CONSENT_EVENT,
  saveAnalyticsConsent,
} from "@/src/lib/analytics-consent";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

export default function AnalyticsConsentBanner() {
  const choice = useAnalyticsConsent();
  const [manuallyOpen, setManuallyOpen] = useState(false);
  const [sessionChoice, setSessionChoice] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const visible = manuallyOpen || (choice === null && !sessionChoice);

  useEffect(() => {
    const open = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setManuallyOpen(true);
    };
    window.addEventListener(OPEN_ANALYTICS_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_ANALYTICS_CONSENT_EVENT, open);
  }, []);

  useEffect(() => {
    if (visible) heading.current?.focus({ preventScroll: true });
  }, [visible]);

  function choose(nextChoice: "granted" | "denied") {
    saveAnalyticsConsent(nextChoice);
    setSessionChoice(true);
    setManuallyOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
    // A new document drops the previously loaded GA runtime after revocation.
    if (choice === "granted" && nextChoice === "denied") window.location.reload();
  }

  if (!visible) return null;

  return (
    <section
      role="dialog"
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description"
      className="fixed inset-x-0 bottom-0 z-[110] max-h-[85dvh] overflow-y-auto border-t border-[#c5d8ec] bg-white px-5 py-5 shadow-[0_-8px_35px_rgba(15,23,42,0.16)] sm:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex-1">
          <h2 ref={heading} tabIndex={-1} id="analytics-consent-title" className="text-lg font-bold text-slate-900 outline-none">
            Cookie e statistiche su EVERAS
          </h2>
          <p id="analytics-consent-description" className="mt-2 text-sm leading-6 text-slate-700">
            Usiamo cookie necessari al funzionamento del sito. Con il tuo consenso,
            Google Analytics usa anche cookie per misurare visite e utenti e aiutarci
            a migliorare EVERAS. Puoi rifiutare questi cookie e continuare a navigare.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Puoi cambiare scelta da “Preferenze cookie” nel footer.{" "}
            <a href="/cookie" className="font-semibold text-[#075EAE] underline">Cookie Policy</a>{" · "}
            <a href="/privacy" className="font-semibold text-[#075EAE] underline">Privacy Policy</a>
          </p>
          {manuallyOpen && choice !== null && choice !== "pending" ? (
            <p className="mt-2 text-sm font-medium text-slate-700">
              Cookie Analytics: {choice === "granted" ? "accettati" : "rifiutati"}.
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose("denied")} className="min-h-11 flex-1 rounded-xl border-2 border-[#075EAE] bg-white px-6 py-2.5 text-sm font-bold text-[#075EAE] hover:bg-[#e8f1fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">
            Rifiuta
          </button>
          <button type="button" onClick={() => choose("granted")} className="min-h-11 flex-1 rounded-xl border-2 border-[#075EAE] bg-[#075EAE] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#064E91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]">
            Accetta
          </button>
        </div>
      </div>
    </section>
  );
}
