import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CirclePlus,
  ExternalLink,
  FileText,
  MapPin,
  Pencil,
  TicketCheck,
} from "lucide-react";

import Header from "@/src/components/home/Header";
import DeleteEventButton from "@/src/components/dashboard/DeleteEventButton";
import LogoutButton from "@/src/components/dashboard/LogoutButton";
import { createClient } from "@/src/lib/supabase/server";

type DashboardEvent = {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  location_name: string | null;
  start_at: string;
  image_url: string | null;
  status: "draft" | "pending" | "published" | "rejected";
  is_free: boolean;
  price_from: number | string | null;
};

const statusLabels: Record<DashboardEvent["status"], string> = {
  draft: "Bozza",
  pending: "In revisione",
  published: "Pubblicato",
  rejected: "Non approvato",
};

const statusClasses: Record<DashboardEvent["status"], string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(value));
}

function formatPrice(event: DashboardEvent) {
  if (event.is_free) {
    return "Gratuito";
  }

  const price = event.price_from === null ? null : Number(event.price_from);

  if (price === null || !Number.isFinite(price)) {
    return "A pagamento";
  }

  return `Da ${new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price)}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/accedi?redirect=/dashboard");
  }

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, image_url, status, is_free, price_from",
    )
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile caricare la dashboard: ${error.message}`);
  }

  const events = (data ?? []) as DashboardEvent[];
  const publishedCount = events.filter(
    (event) => event.status === "published",
  ).length;
  const draftCount = events.filter((event) => event.status === "draft").length;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area organizzatore
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                I miei eventi
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Controlla gli eventi pubblicati e gestisci le tue attività su
                EVERAS.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LogoutButton />

              <Link
                href="/pubblica"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-6 py-4 font-bold text-white transition hover:bg-[#E86F00]"
              >
                <CirclePlus aria-hidden="true" className="h-5 w-5" />
                Pubblica un evento
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <FileText aria-hidden="true" className="h-6 w-6 text-[#075EAE]" />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {events.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Eventi totali
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <TicketCheck
                aria-hidden="true"
                className="h-6 w-6 text-emerald-600"
              />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {publishedCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Pubblicati
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <FileText aria-hidden="true" className="h-6 w-6 text-amber-600" />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {draftCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Bozze
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <CirclePlus
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#075EAE]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Non hai ancora pubblicato eventi
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Crea il tuo primo evento e fallo conoscere alle persone che
                cercano cosa fare in Sardegna.
              </p>
              <Link
                href="/pubblica"
                className="mt-6 inline-flex rounded-2xl bg-[#FF7A00] px-6 py-3 font-bold text-white"
              >
                Crea il primo evento
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[220px_minmax(0,1fr)]"
                >
                  <div className="h-52 bg-slate-100 md:h-full">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-slate-400">
                        Nessuna immagine
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[event.status]}`}
                        >
                          {statusLabels[event.status]}
                        </span>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                          {event.title}
                        </h2>
                      </div>

                      <p className="font-bold text-[#FF7A00]">
                        {formatPrice(event)}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p className="flex items-start gap-2">
                        <CalendarDays
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                        />
                        {formatDate(event.start_at)}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                        />
                        {event.location_name || event.municipality}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      {event.status === "published" && (
                        <Link
                          href={`/eventi/${event.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                        >
                          Apri evento
                          <ExternalLink
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </Link>
                      )}

                      <Link
                        href={`/dashboard/eventi/${event.id}/modifica`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        Modifica
                      </Link>

                      <DeleteEventButton
                        eventId={event.id}
                        imageUrl={event.image_url}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

