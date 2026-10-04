"use client";

import { useSyncExternalStore } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  getBrowserAnalyticsConsent,
} from "@/src/lib/analytics-consent";

function subscribe(onChange: () => void) {
  window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
  return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
}

function getChoice() { return getBrowserAnalyticsConsent(); }
function getServerChoice() { return "pending" as const; }

export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribe, getChoice, getServerChoice);
}
