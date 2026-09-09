import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";

import OrganizerPublicPageForm from "@/src/components/dashboard/OrganizerPublicPageForm";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import { parseOrganizerDirectoryPublic } from "@/src/lib/organizer-claim";
import { ORGANIZER_DIRECTORY_PUBLIC_SELECT } from "@/src/lib/organizer-page";
import { isOrganizer } from "@/src/lib/profile";

export const dynamic = "force-dynamic";

export default async function OrganizerPublicPageSettings() {
  const { user, profile, supabase } = await requireProfile("/dashboard/pagina");

  if (!isOrganizer(profile)) {
    redirect("/diventa-organizzatore?next=/dashboard/pagina");
  }

  const { data, error } = await supabase
    .from("organizer_directory_public")
    .select(ORGANIZER_DIRECTORY_PUBLIC_SELECT)
    .eq("claimed_by_profile_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Impossibile caricare la pagina pubblica: ${error.message}`);
  }

  const directories = (data ?? [])
    .map(parseOrganizerDirectoryPublic)
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area organizzatore
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                Pagina pubblica
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                Crea la pagina del Comune o della Pro Loco con tutti gli
                appuntamenti organizzati.
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

        <section className="mx-auto max-w-3xl space-y-6 px-5 py-10 sm:px-8">
          {directories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Building2
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#075EAE]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Nessun profilo rivendicato
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Questa pagina è disponibile dopo aver rivendicato il profilo
                del Comune o della Pro Loco collegato ai vostri eventi.
              </p>
              <Link
                href="/eventi"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                Trova i vostri eventi
              </Link>
            </div>
          ) : (
            directories.map((directory) => (
              <div
                key={directory.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
              >
                <div className="mb-8 flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-[#E67E22]">
                    <Building2 aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {directory.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {directory.public_page_enabled
                        ? "La pagina è pubblica."
                        : "La pagina è pronta: pubblicala quando vuoi."}
                    </p>
                  </div>
                </div>

                <OrganizerPublicPageForm directory={directory} />
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}
