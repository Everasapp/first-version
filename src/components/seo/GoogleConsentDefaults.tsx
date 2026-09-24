import Script from "next/script";

/**
 * Consent Mode v2 defaults must run before AdSense / Analytics tags.
 *
 * TEMPORARY: all consent signals are 'granted' so GA4 / Google tags can
 * collect without Consent Mode blocks while we set up a real CMP.
 * Revert to denied defaults (+ CMP update) before treating this as final.
 *
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */
export default function GoogleConsentDefaults() {
  return (
    <Script id="google-consent-mode-defaults" strategy="beforeInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', false);
gtag('set', 'url_passthrough', true);
`}</Script>
  );
}
