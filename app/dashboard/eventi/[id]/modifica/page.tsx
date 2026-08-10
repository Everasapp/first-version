import { notFound, redirect } from "next/navigation";

import Header from "@/src/components/home/Header";
import EditEventForm from "@/src/components/dashboard/EditEventForm";
import {
  PLAN_SELECT,
  canAssignOrganizers,
  type Plan,
} from "@/src/lib/plans";
import { PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

type ModificaEventoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModificaEventoPage({
  params,
}: ModificaEventoPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/accedi?redirect=/dashboard/eventi/${id}/modifica`);
  }

  const [{ data: event, error }, { data: profileData }] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, slug, title, description, category, province, municipality, location_name, address, start_at, image_url, is_free, price_from, ticket_url, organizer_display_name",
      )
      .eq("id", id)
      .eq("organizer_id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (error) {
    throw new Error(`Impossibile caricare l'evento: ${error.message}`);
  }

  if (!event) {
    notFound();
  }

  const profile = profileData as Profile | null;
  let plan: Plan | null = null;

  if (profile?.plan_id) {
    const { data: planData } = await supabase
      .from("plans")
      .select(PLAN_SELECT)
      .eq("id", profile.plan_id)
      .maybeSingle();
    plan = (planData as Plan | null) ?? null;
  }

  const accountOrganizerName =
    profile?.business_name?.trim() ||
    profile?.full_name?.trim() ||
    "Organizzatore";

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Area organizzatore
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Modifica evento
          </h1>

          <div className="mt-8">
            <EditEventForm
              event={event}
              canAssignOrganizer={canAssignOrganizers(plan)}
              accountOrganizerName={accountOrganizerName}
            />
          </div>
        </div>
      </main>
    </>
  );
}
