"use client";

import { useState } from "react";
import { openConsentPreferences } from "@/src/lib/analytics-consent";

export default function AnalyticsConsentPreferences() {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <span>
    <button
      type="button"
      onClick={() => setUnavailable(!openConsentPreferences())}
      className="text-[#075EAE] transition hover:text-[#064E91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
    >
      Preferenze cookie
    </button>
    {unavailable ? <span role="status" className="ml-2 text-sm text-slate-600">Il pannello cookie non è disponibile. Ricarica la pagina e riprova.</span> : null}
    </span>
  );
}
