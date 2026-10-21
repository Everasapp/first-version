import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/src/components/home/Footer";
import PWAInstallBanner from "@/src/components/PWAInstallBanner";
import PWARegister from "@/src/components/PWARegister";
import GoogleConsentDefaults from "@/src/components/seo/GoogleConsentDefaults";
import GooglePublisherTags from "@/src/components/seo/GooglePublisherTags";
import InMobiConsentManager from "@/src/components/seo/InMobiConsentManager";
import JsonLd from "@/src/components/seo/JsonLd";
import {
  organizationSchema,
  websiteSearchActionSchema,
} from "@/src/lib/seo/schema";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-NBHEHZ5FLD";

export const viewport: Viewport = {
  themeColor: "#E67E22",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.everas.it"),
  title: {
    default: "EVERAS | Formazione, corsi e workshop in Sardegna",
    template: "%s | EVERAS",
  },
  description:
    "Formazione per il lavoro e corsi, workshop, laboratori ed esperienze per coltivare una passione in Sardegna.",
  applicationName: "EVERAS",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    title: "EVERAS",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "google-adsense-account": "ca-pub-5513319548780658",
  },
  openGraph: {
    title: "EVERAS | Formazione, corsi e workshop in Sardegna",
    description:
      "Scopri formazione per il lavoro e corsi, workshop ed esperienze per passione in Sardegna.",
    url: "/",
    siteName: "EVERAS",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/images/learning/imparare-sardegna-og.jpg",
        width: 1200,
        height: 630,
        alt: "EVERAS — Imparare e fare in Sardegna",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVERAS | Formazione, corsi e workshop in Sardegna",
    description:
      "Scopri formazione, corsi, workshop ed esperienze in Sardegna.",
    images: ["/images/learning/imparare-sardegna-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col">
        <GoogleConsentDefaults />
        <InMobiConsentManager />
        <JsonLd data={websiteSearchActionSchema()} />
        <JsonLd data={organizationSchema()} />
        <div className="flex min-w-0 max-w-full flex-1 flex-col">
          {children}
          <Footer />
        </div>
        <PWARegister />
        <PWAInstallBanner />
        <GooglePublisherTags
          gaMeasurementId={gaMeasurementId}
          analyticsEnabled={process.env.NODE_ENV === "production"}
        />
      </body>
    </html>
  );
}
