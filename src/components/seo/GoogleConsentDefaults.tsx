import Script from "next/script";

/**
 * Consent Mode v2 defaults must run before AdSense / Analytics tags.
 *
 * Start with denied signals. Google's certified CMP is responsible for
 * updating them from the visitor's choices; enable its advertising and
 * analytics Consent Mode settings in AdSense Privacy & messaging.
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
gtag('set', 'url_passthrough', false);
`}</Script>
  );
}
