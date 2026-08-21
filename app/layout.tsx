import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import Footer from "@/src/components/home/Footer";
import PWAInstallBanner from "@/src/components/PWAInstallBanner";
import PWARegister from "@/src/components/PWARegister";
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
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.everas.it"),
  title: {
    default: "Eventi in Sardegna: concerti, sagre e festival | EVERAS",
    template: "%s | EVERAS",
  },
  description:
    "Scopri cosa fare in Sardegna: concerti, sagre, festival, spettacoli, sport e appuntamenti in tutta l'isola.",
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
  openGraph: {
    title: "Eventi in Sardegna: concerti, sagre e festival | EVERAS",
    description:
      "Scopri cosa fare in Sardegna: concerti, sagre, festival, spettacoli, sport e appuntamenti in tutta l'isola.",
    url: "/",
    siteName: "EVERAS",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/og.jpg?v=20260811g",
        width: 1200,
        height: 630,
        alt: "EVERAS — Eventi in Sardegna",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventi in Sardegna | EVERAS",
    description:
      "Scopri concerti, sagre, festival e appuntamenti in tutta la Sardegna.",
    images: ["/og.jpg?v=20260811g"],
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
        <JsonLd data={websiteSearchActionSchema()} />
        <JsonLd data={organizationSchema()} />
        <div className="flex min-w-0 max-w-full flex-1 flex-col">
          {children}
          <Footer />
        </div>
        <PWARegister />
        <PWAInstallBanner />
        {process.env.NODE_ENV === "production" ? (
          <GoogleAnalytics gaId={gaMeasurementId} />
        ) : null}
      </body>
    </html>
  );
}
