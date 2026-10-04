"use client";

import Script from "next/script";

/** Preserve the CMP-aware gtag installed by GoogleConsentDefaults. */
export default function ConsentedGoogleAnalytics({ gaId }: { gaId: string }) {
  const measurementId = JSON.stringify(gaId).replace(/</g, "\\u003c");
  return (
    <>
      <Script id="_next-ga-init" strategy="afterInteractive">{`
window.gtag('js', new Date());
window.gtag('config', ${measurementId});
`}</Script>
      <Script id="_next-ga" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
    </>
  );
}
