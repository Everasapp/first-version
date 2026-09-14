import type { Metadata } from "next";

import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Account",
  description: "Accedi o crea il tuo account EVERAS.",
  robots: privatePageRobots,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
