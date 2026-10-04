"use client";

import ConsentedGoogleAnalytics from "./ConsentedGoogleAnalytics";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { clearAnalyticsCookies } from "@/src/lib/analytics-consent";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

type GooglePublisherTagsProps = {
  gaMeasurementId: string;
  analyticsEnabled: boolean;
};

export default function GooglePublisherTags({
  gaMeasurementId,
  analyticsEnabled,
}: GooglePublisherTagsProps) {
  const pathname = usePathname();
  const consent = useAnalyticsConsent();
  const previouslyGranted = useRef(false);

  useEffect(() => {
    if (consent === "granted") previouslyGranted.current = true;
    if (consent === "denied") {
      clearAnalyticsCookies(document);
      // Unmounting a Script does not stop a loaded GA runtime. A fresh document does.
      if (previouslyGranted.current) {
        // Let the CMP finish persisting all consent strings in the current task.
        const timer = window.setTimeout(() => window.location.reload(), 0);
        return () => window.clearTimeout(timer);
      }
    }
  }, [consent]);

  // AdSense remains suspended pending site approval.
  // Policy links use document navigation so previously loaded tags are cleared.
  if (pathname === "/privacy" || pathname === "/cookie") return null;

  return (
    <>
      {/* GA4 Enhanced Measurement handles history changes; no manual page_view. */}
      {analyticsEnabled && consent === "granted" ? <ConsentedGoogleAnalytics gaId={gaMeasurementId} /> : null}
    </>
  );
}
