import Script from "next/script";

/**
 * Consent Mode v2 defaults must run before AdSense / Analytics tags.
 *
 * Defaults stay denied until a real CMP updates them via
 * gtag('consent', 'update', …). This repo has no in-app consent banner
 * and no code that calls consent update — only Google Privacy & messaging
 * (AdSense) can do that if a message is published in the Google UI.
 *
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */
export default function GoogleConsentDefaults() {
  return (
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
gtag('set', 'url_passthrough', true);
`}</Script>
  );
}
