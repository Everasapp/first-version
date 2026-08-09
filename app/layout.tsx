import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventi in Sardegna | EVERAS",
    description:
      "Scopri concerti, sagre, festival e appuntamenti in tutta la Sardegna.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
