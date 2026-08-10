import { redirect } from "next/navigation";

import { requireProfile } from "@/src/lib/auth";
import { isOrganizer } from "@/src/lib/profile";

export default async function DashboardEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireProfile("/dashboard");

  if (!isOrganizer(profile)) {
    redirect("/diventa-organizzatore?next=/dashboard");
  }

  return children;
}
