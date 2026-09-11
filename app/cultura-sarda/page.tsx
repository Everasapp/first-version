import type { Metadata } from "next";

import CultureHubView from "@/src/components/seo/CultureHubView";
import { CULTURE_HUB, CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-towns";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: CULTURE_HUB.title,
  description: CULTURE_HUB.description,
  alternates: { canonical: CULTURE_HUB.path },
  openGraph: {
    title: `${CULTURE_HUB.title} | EVERAS`,
    description: CULTURE_HUB.description,
    url: CULTURE_HUB.path,
    type: "website",
    images: defaultOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${CULTURE_HUB.title} | EVERAS`,
    description: CULTURE_HUB.description,
    images: defaultOgImages().map((image) => image.url),
  },
};

export default function CulturaSardaPage() {
  return (
    <CultureHubView
      jsonLd={[
        collectionPageSchema({
          name: CULTURE_HUB.h1,
          description: CULTURE_HUB.description,
          url: absoluteUrl(CULTURE_HUB_PATH),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: CULTURE_HUB.h1, path: CULTURE_HUB_PATH },
        ]),
        faqPageSchema([...CULTURE_HUB.faqs]),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
