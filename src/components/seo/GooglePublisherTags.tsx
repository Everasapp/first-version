"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

type GooglePublisherTagsProps = {
  gaMeasurementId: string;
  analyticsEnabled: boolean;
};

export default function GooglePublisherTags({
  gaMeasurementId,
  analyticsEnabled,
}: GooglePublisherTagsProps) {
  const pathname = usePathname();

  // AdSense is temporarily suspended while its consent banner is unavailable.
  // Policy links use document navigation so previously loaded tags are cleared.
  if (pathname === "/privacy" || pathname === "/cookie") return null;

  return (
    <>
      {/* GA4 Enhanced Measurement handles history changes; no manual page_view. */}
      {analyticsEnabled ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </>
  );
}
