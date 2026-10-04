"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
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

  // AdSense is temporarily suspended while its consent banner is unavailable.
  // Policy links use document navigation so previously loaded tags are cleared.
  if (pathname === "/privacy" || pathname === "/cookie") return null;

  return (
    <>
      {/* GA4 Enhanced Measurement handles history changes; no manual page_view. */}
      {analyticsEnabled && consent === "granted" ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </>
  );
}
