import Link from "next/link";
import { Building2, Users } from "lucide-react";

import FollowOrganizerButton from "@/src/components/events/FollowOrganizerButton";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import {
  getFollowedOrganizers,
  getOrganizerDisplayName,
} from "@/src/lib/follows";
import { isOrganizer } from "@/src/lib/profile";

export default async function OrganizzatoriSeguitiPage() {
  const { user, profile } = await requireProfile("/dashboard/organizzatori");
  const organizers = await getFollowedOrganizers(user.id);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                {isOrganizer(profile) ? "Area account" : "Area personale"}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Organizzatori seguiti
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Tieni d’occhio chi organizza gli eventi che ti interessano.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              Torna alla dashboard
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          {organizers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Users
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#075EAE]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Non segui ancora nessuno
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Apri un evento e tocca «Segui» sotto il nome dell’organizzatore.
              </p>
              <Link
                href="/eventi"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                Esplora eventi
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {organizers.map((organizer) => {
                const name = getOrganizerDisplayName(organizer);

                return (
                  <article
                    key={organizer.id}
                    className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#075EAE]">
                        <Building2 aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <div>
                        <Link
                          href={`/organizzatori/${organizer.id}`}
                          className="text-xl font-bold text-slate-900 hover:text-[#075EAE]"
                        >
                          {name}
                        </Link>
                        <p className="mt-1 text-sm text-slate-600">
                          {organizer.publishedEventsCount}{" "}
                          {organizer.publishedEventsCount === 1
                            ? "evento pubblicato"
                            : "eventi pubblicati"}
                          {(organizer.municipality || organizer.province) &&
                            ` · ${[organizer.municipality, organizer.province]
                              .filter(Boolean)
                              .join(", ")}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/organizzatori/${organizer.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                      >
                        Vedi profilo
                      </Link>
                      <FollowOrganizerButton
                        organizerId={organizer.id}
                        organizerName={name}
                        initialIsFollowing
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
