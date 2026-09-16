import type { Metadata } from "next";

import CulturaArticlesHubView from "@/src/components/seo/CulturaArticlesHubView";
import {
  CULTURA_ARTICLES_HUB,
  CULTURA_ARTICLES_HUB_PATH,
} from "@/src/lib/seo/cultura-articles";
import {
  breadcrumbListSchema,
  collectionPageSchema,
} from "@/src/lib/seo/schema";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: CULTURA_ARTICLES_HUB.title,
  description: CULTURA_ARTICLES_HUB.description,
  alternates: { canonical: CULTURA_ARTICLES_HUB.path },
  openGraph: {
    title: `${CULTURA_ARTICLES_HUB.title} | EVERAS`,
    description: CULTURA_ARTICLES_HUB.description,
    url: CULTURA_ARTICLES_HUB.path,
    type: "website",
    images: defaultOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${CULTURA_ARTICLES_HUB.title} | EVERAS`,
    description: CULTURA_ARTICLES_HUB.description,
    images: defaultOgImages().map((image) => image.url),
  },
};

export default function CulturaPage() {
  return (
    <CulturaArticlesHubView
      jsonLd={[
        collectionPageSchema({
          name: CULTURA_ARTICLES_HUB.h1,
          description: CULTURA_ARTICLES_HUB.description,
          url: absoluteUrl(CULTURA_ARTICLES_HUB_PATH),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: CULTURA_ARTICLES_HUB.h1, path: CULTURA_ARTICLES_HUB_PATH },
        ]),
      ]}
    />
  );
}
