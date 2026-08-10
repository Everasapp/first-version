import { redirect } from "next/navigation";

import { requireProfile } from "@/src/lib/auth";
import { isOrganizer } from "@/src/lib/profile";

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
