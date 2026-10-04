import Script from "next/script";
import { ANALYTICS_CONSENT_COOKIE } from "@/src/lib/analytics-consent";

/** Defaults run before measurement. Only a saved visitor choice can grant Analytics. */
export default function GoogleConsentDefaults() {
  // This component is mounted only in the root App Router layout.
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="google-consent-mode-defaults" strategy="beforeInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
try {
  var everasAnalyticsChoice = document.cookie.split(';').map(function(cookie){return cookie.trim();})
    .find(function(cookie){return cookie.indexOf('${ANALYTICS_CONSENT_COOKIE}=') === 0;});
  if (everasAnalyticsChoice === '${ANALYTICS_CONSENT_COOKIE}=granted') {
    gtag('consent', 'update', {analytics_storage: 'granted'});
  }
} catch (error) { /* Missing or inaccessible storage never grants consent. */ }
`}</Script>
  );
}
