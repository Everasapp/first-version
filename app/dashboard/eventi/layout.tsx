import { requireOrganizer } from "@/src/lib/auth";

export default async function DashboardEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOrganizer("/dashboard");

  return children;
}
