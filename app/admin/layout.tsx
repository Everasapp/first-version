import Link from "next/link";

import { requireAdmin } from "@/src/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin("/admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#075EAE]">
              Pannello Admin
            </p>
            <Link href="/admin" className="text-lg font-bold text-slate-900">
              EVERAS
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link
              href="/admin/ricerca-contatti"
              className="rounded-xl px-3 py-2 text-[#075EAE] transition hover:bg-sky-50"
            >
              Ricerca contatti
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl px-3 py-2 text-slate-600 transition hover:bg-slate-100"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
