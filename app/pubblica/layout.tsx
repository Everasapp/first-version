import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireProfile } from "@/src/lib/auth";
import { isOrganizer } from "@/src/lib/profile";
import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Pubblica un evento",
  robots: privatePageRobots,
};

export default async function PubblicaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireProfile("/pubblica");

  if (!isOrganizer(profile)) {
    redirect("/diventa-organizzatore?next=/pubblica");
  }

  return children;
}
