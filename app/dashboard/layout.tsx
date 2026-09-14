import type { Metadata } from "next";

import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: privatePageRobots,
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
