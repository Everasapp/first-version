import Script from "next/script";
import { INMOBI_CHOICE_TAG } from "@/src/lib/inmobi-choice-tag";

/** Mounted after Google defaults, before any optional measurement tags. */
export default function InMobiConsentManager() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="inmobi-choice-cmp" strategy="beforeInteractive">{INMOBI_CHOICE_TAG}</Script>
  );
}
