import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/src/components/home/Footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://everas.it"),
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
        url: "/og.jpg?v=20260811f",
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
    images: ["/og.jpg?v=20260811f"],
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
      <body className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
