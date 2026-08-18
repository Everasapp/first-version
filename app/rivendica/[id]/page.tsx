import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Building2 } from "lucide-react";

import ClaimOrganizerForm from "@/src/components/events/ClaimOrganizerForm";
import Header from "@/src/components/home/Header";
import { getProfileForUser } from "@/src/lib/auth";
import { buildAuthHref } from "@/src/lib/auth-urls";
import {
  getSuggestedClaimEmail,
  isDirectoryUnclaimed,
  parseOrganizerDirectoryPublic,
} from "@/src/lib/organizer-claim";
import { isOrganizer } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

type ClaimOrganizerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClaimOrganizerPage({
  params,
}: ClaimOrganizerPageProps) {
  const { id } = await params;
  const claimPath = `/rivendica/${id}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const email = await getSuggestedClaimEmail(supabase, id);
    redirect(buildAuthHref("/registrati", { redirect: claimPath, email }));
  }

  const profile = await getProfileForUser(supabase, user.id);
  if (!profile) {
    await supabase.auth.signOut();
    const email = await getSuggestedClaimEmail(supabase, id);
    redirect(buildAuthHref("/registrati", { redirect: claimPath, email }));
  }

  const { data, error } = await supabase
    .from("organizer_directory_public")
    .select("id, name, claim_status, claimed_by_profile_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare l'organizzatore: ${error.message}`);
  }

  const directory = parseOrganizerDirectoryPublic(data);
  if (!directory) {
    notFound();
  }

  if (directory.claimed_by_profile_id === user.id) {
    redirect("/dashboard?rivendicato=1");
  }

  const { count, error: countError } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("organizer_directory_id", directory.id)
    .eq("status", "published");

  if (countError) {
    throw new Error(`Impossibile caricare gli eventi: ${countError.message}`);
  }

  const eventCount = count ?? 0;
  const alreadyClaimed = !isDirectoryUnclaimed(directory);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Profilo organizzatore
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Rivendica organizzatore
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Collega {directory.name} al tuo account per modificare gli eventi
              già online e pubblicarne altri.
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
                  {directory.name}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {eventCount === 1
                    ? "1 evento già pubblicato su EVERAS."
                    : `${eventCount} eventi già pubblicati su EVERAS.`}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {alreadyClaimed ? (
                <div className="space-y-4">
                  <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    Questo organizzatore è già stato rivendicato.
                  </p>
                  {directory.claimed_by_profile_id ? (
                    <Link
                      href={`/organizzatori/${directory.claimed_by_profile_id}`}
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-[#075EAE] px-5 font-bold text-white transition hover:bg-[#064E91]"
                    >
                      Vai al profilo
                    </Link>
                  ) : null}
                </div>
              ) : (
                <ClaimOrganizerForm
                  directoryId={directory.id}
                  organizerName={directory.name}
                  eventCount={eventCount}
                  isAlreadyOrganizer={isOrganizer(profile)}
                />
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Non sei tu?{" "}
            <Link
              href="/eventi"
              className="font-semibold text-[#075EAE] hover:underline"
            >
              Torna agli eventi
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
