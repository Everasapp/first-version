import Script from "next/script";

/**
 * Consent Mode v2 defaults must run before AdSense / Analytics tags.
 *
 * TEMPORARY: analytics_storage is 'granted' so GA4 can collect page_view /
 * sessions / users while we set up a real CMP. Ads consents stay denied.
 * Revert analytics_storage to 'denied' once Privacy & messaging (or another
 * CMP) calls gtag('consent', 'update', …) after user choice.
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
  analytics_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`}</Script>
  );
}
