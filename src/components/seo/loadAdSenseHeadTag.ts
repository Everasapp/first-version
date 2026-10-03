const ADSENSE_SOURCE = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5513319548780658";

/** Called after hydration, when the beforeInteractive consent defaults exist. */
export function loadAdSenseHeadTag(doc: Document) {
  // Keep one tag across client navigation and React Strict Mode remounts.
  if (doc.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
  const script = doc.createElement("script");
  script.async = true;
  script.src = ADSENSE_SOURCE;
  script.crossOrigin = "anonymous";
  doc.head.appendChild(script);
}
