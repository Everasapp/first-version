import type { Metadata } from "next";

import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Conferma email",
  robots: privatePageRobots,
};

export default function ConfermaEmailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
