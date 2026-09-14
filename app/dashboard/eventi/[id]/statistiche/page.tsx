import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  Pencil,
  Share2,
} from "lucide-react";

import Header from "@/src/components/home/Header";
import {
  getEventBucket,
  type DashboardEventStatus,
} from "@/src/lib/dashboardEvents";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

type StatisticheEventoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<DashboardEventStatus, string> = {
  draft: "Bozza",
  pending: "In revisione",
  published: "Pubblicato",
  rejected: "Non approvato",
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

function getRelativeLabel(startAt: string, endAt: string | null) {
  const now = Date.now();
  const reference = new Date(endAt ?? startAt).getTime();
  const diffMs = reference - now;
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil(Math.abs(diffMs) / dayMs);

  if (diffMs >= 0) {
    if (days <= 0) {
      return "In programma oggi";
    }

    return days === 1 ? "Tra 1 giorno" : `Tra ${days} giorni`;
  }

  return days === 1 ? "Terminato da 1 giorno" : `Terminato da ${days} giorni`;
}

export default async function StatisticheEventoPage({
  params,
}: StatisticheEventoPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/accedi?redirect=/dashboard/eventi/${id}/statistiche`);
  }

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, slug, title, municipality, location_name, start_at, end_at, status, views_count, favorites_count, shares_count, created_at, updated_at",
    )
    .eq("id", id)
    .eq("organizer_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile caricare le statistiche: ${error.message}`);
  }

  if (!event) {
    notFound();
  }

  const status = event.status as DashboardEventStatus;
  const bucket = getEventBucket({
    status,
    start_at: event.start_at,
    end_at: event.end_at,
  });
  const views = event.views_count ?? 0;
  const likes = event.favorites_count ?? 0;
  const shares = event.shares_count ?? 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Link
            href={`/dashboard?filtro=${bucket}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#075EAE]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Torna ai miei eventi
          </Link>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Statistiche
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-3 text-slate-600">
            Panoramica delle performance della pagina evento su EVERAS.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Eye aria-hidden="true" className="h-6 w-6 text-[#075EAE]" />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {new Intl.NumberFormat("it-IT").format(views)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Visualizzazioni
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Heart aria-hidden="true" className="h-6 w-6 text-[#E67E22]" />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {new Intl.NumberFormat("it-IT").format(likes)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Mi piace
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Share2 aria-hidden="true" className="h-6 w-6 text-slate-600" />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {new Intl.NumberFormat("it-IT").format(shares)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Inoltri
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <BarChart3
                aria-hidden="true"
                className="h-6 w-6 text-[#E67E22]"
              />
              <p className="mt-4 text-3xl font-black text-slate-900">
                {statusLabels[status]}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Stato attuale
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <CalendarDays
                aria-hidden="true"
                className="h-6 w-6 text-emerald-600"
              />
              <p className="mt-4 text-2xl font-black text-slate-900">
                {getRelativeLabel(event.start_at, event.end_at)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Tempistica
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Dettagli</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Data evento
                </dt>
                <dd className="mt-1 flex items-start gap-2 text-slate-800">
                  <CalendarDays
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                  />
                  {formatDate(event.start_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Luogo
                </dt>
                <dd className="mt-1 flex items-start gap-2 text-slate-800">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                  />
                  {event.location_name || event.municipality}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Creato il
                </dt>
                <dd className="mt-1 text-slate-800">
                  {formatDate(event.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ultimo aggiornamento
                </dt>
                <dd className="mt-1 text-slate-800">
                  {formatDate(event.updated_at)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Link
                href={`/dashboard/eventi/${event.id}/modifica`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
              >
                <Pencil aria-hidden="true" className="h-4 w-4" />
                Modifica evento
              </Link>

              {status === "published" && (
                <Link
                  href={`/eventi/${event.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                >
                  Vedi pagina pubblica
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
