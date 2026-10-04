"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
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
      if (previouslyGranted.current) window.location.reload();
    }
  }, [consent]);

  // AdSense remains suspended pending site approval.
  // Policy links use document navigation so previously loaded tags are cleared.
  if (pathname === "/privacy" || pathname === "/cookie") return null;

  return (
    <>
      {/* GA4 Enhanced Measurement handles history changes; no manual page_view. */}
      {analyticsEnabled && consent === "granted" ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </>
  );
}
