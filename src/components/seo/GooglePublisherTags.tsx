"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import Script from "next/script";

type GooglePublisherTagsProps = {
  gaMeasurementId: string;
  analyticsEnabled: boolean;
};

export default function GooglePublisherTags({
  gaMeasurementId,
  analyticsEnabled,
}: GooglePublisherTagsProps) {
  const pathname = usePathname();

  // Policy links use document navigation so previously loaded tags are cleared.
  if (pathname === "/privacy" || pathname === "/cookie") return null;

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5513319548780658"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      {/* GA4 Enhanced Measurement handles history changes; no manual page_view. */}
      {analyticsEnabled ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </>
  );
}
