import Link from "next/link";
import { Mail } from "lucide-react";

import NewsletterPreferencesForm from "@/src/components/dashboard/NewsletterPreferencesForm";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import { getCategoryLabel } from "@/src/lib/newsletter";

export default async function NewsletterPreferencesPage() {
  const { profile } = await requireProfile("/dashboard/newsletter");

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area personale
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                Newsletter
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                Ricevi ogni settimana eventi per città e categoria preferita.
              </p>
              {profile.newsletter_opt_in ? (
                <p className="mt-2 text-sm text-slate-500">
                  Attiva per{" "}
                  <span className="font-semibold text-slate-700">
                    {profile.newsletter_city}
                  </span>
                  {" · "}
                  <span className="font-semibold text-slate-700">
                    {getCategoryLabel(profile.newsletter_category)}
                  </span>
                </p>
              ) : null}
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
                <Mail aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Preferenze di invio
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Puoi modificare o disattivare quando vuoi.
                </p>
              </div>
            </div>

            <NewsletterPreferencesForm profile={profile} />
          </div>
        </section>
      </main>
    </>
  );
}
