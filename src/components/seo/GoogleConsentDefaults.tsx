import Script from "next/script";
import { ANALYTICS_CONSENT_EVENT } from "@/src/lib/analytics-consent";

/** InMobi is the consent writer. Mirror its Google signal for the GA loading gate. */
export default function GoogleConsentDefaults() {
  // This component is mounted only in the root App Router layout.
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="google-consent-mode-defaults" strategy="beforeInteractive">{`
window.dataLayer = window.dataLayer || [];
window.__everasAnalyticsConsent = null;
function gtag(){
  window.dataLayer.push(arguments);
  if (arguments[0] === 'consent' && arguments[1] === 'update') {
    var choice = arguments[2] && arguments[2].analytics_storage;
    if (choice === 'granted' || choice === 'denied') {
      window.__everasAnalyticsConsent = choice;
      window.dispatchEvent(new Event('${ANALYTICS_CONSENT_EVENT}'));
    }
  }
}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
`}</Script>
  );
}
