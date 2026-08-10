import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";

import BecomeOrganizerForm from "@/src/components/auth/BecomeOrganizerForm";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import { isOrganizer } from "@/src/lib/profile";

type BecomeOrganizerPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function resolveNextPath(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/pubblica";
  }
  return raw;
}

export default async function BecomeOrganizerPage({
  searchParams,
}: BecomeOrganizerPageProps) {
  const params = await searchParams;
  const nextPath = resolveNextPath(params.next);
  const { profile } = await requireProfile(
    `/diventa-organizzatore?next=${encodeURIComponent(nextPath)}`,
  );

  if (isOrganizer(profile)) {
    redirect(nextPath);
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Passa a organizzatore
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Diventa organizzatore
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Con lo stesso account potrai pubblicare eventi, modificarli e
              vedere le statistiche. Non serve una seconda registrazione.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-[#E67E22]">
                <Building2 aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Informazioni attività
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Queste informazioni compaiono sul tuo profilo organizzatore.
                  La partita IVA è opzionale.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <BecomeOrganizerForm
                nextPath={nextPath}
                initialBusinessName={profile.business_name ?? ""}
                initialVatNumber={profile.vat_number ?? ""}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Hai già un account organizzatore?{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-[#075EAE] hover:underline"
            >
              Vai alla dashboard
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
