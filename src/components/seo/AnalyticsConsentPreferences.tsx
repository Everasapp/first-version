"use client";

import { OPEN_ANALYTICS_CONSENT_EVENT } from "@/src/lib/analytics-consent";

export default function AnalyticsConsentPreferences() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_ANALYTICS_CONSENT_EVENT))}
      className="text-[#075EAE] transition hover:text-[#064E91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075EAE]"
    >
      Preferenze cookie
    </button>
  );
}
