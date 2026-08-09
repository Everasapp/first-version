import { notFound, redirect } from "next/navigation";

import Header from "@/src/components/home/Header";
import EditEventForm from "@/src/components/dashboard/EditEventForm";
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

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, description, category, province, municipality, location_name, address, start_at, image_url, is_free, price_from, ticket_url",
    )
    .eq("id", id)
    .eq("organizer_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare l'evento: ${error.message}`);
  }

  if (!event) {
    notFound();
  }

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
            <EditEventForm event={event} />
          </div>
        </div>
      </main>
    </>
  );
}
