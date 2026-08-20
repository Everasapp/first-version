import Link from "next/link";
import { Users } from "lucide-react";

import CommunityProfileForm from "@/src/components/dashboard/CommunityProfileForm";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function CommunityProfilePage() {
  const { profile } = await requireProfile("/dashboard/comunita");

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Community
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                Come compari agli eventi
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                Incontrare persone con interessi in comune, di persona, intorno
                agli eventi della Sardegna. Sempre con rispetto.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              Torna alla dashboard
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-8 flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-[#E67E22]">
                <Users aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Profilo visibile
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Nome, foto e interessi. Niente email, telefono o indirizzo.
                </p>
              </div>
            </div>

            <CommunityProfileForm profile={profile} />
          </div>
        </section>
      </main>
    </>
  );
}
