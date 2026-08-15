import Link from "next/link";
import { CalendarDays } from "lucide-react";

import CalendarButton from "@/src/components/events/CalendarButton";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import { getCalendarEvents } from "@/src/lib/calendar";
import { resolveCategoryLabels } from "@/src/lib/event-categories";
import { isOrganizer } from "@/src/lib/profile";

function formatDayHeading(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

function formatTime(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

function formatPastDate(startAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(new Date(startAt));
}

export default async function CalendarioPage() {
  const { user, profile } = await requireProfile("/dashboard/calendario");
  const events = await getCalendarEvents(user.id);
  const now = Date.now();

  const upcoming = events.filter(
    (event) =>
      new Date(event.end_at ?? event.start_at).getTime() >= now,
  );
  const past = events.filter(
    (event) => new Date(event.end_at ?? event.start_at).getTime() < now,
  );

  const grouped = upcoming.reduce<Record<string, typeof upcoming>>((acc, event) => {
    const key = formatDayHeading(event.start_at);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {});

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
                Il mio calendario
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Gli eventi che hai aggiunto al tuo calendario personale.
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
          {upcoming.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <CalendarDays
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-[#075EAE]"
              />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Calendario vuoto
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Apri un evento e tocca «Aggiungi al calendario» per salvarlo qui.
              </p>
              <Link
                href="/eventi"
                className="mt-6 inline-flex rounded-2xl bg-[#E67E22] px-6 py-3 font-bold text-white transition hover:bg-[#C96A1A]"
              >
                Esplora eventi
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([day, dayEvents]) => (
                <div key={day}>
                  <h2 className="text-lg font-bold capitalize text-slate-900">
                    {day}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {dayEvents.map((event) => (
                      <article
                        key={event.id}
                        className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-sm font-black text-[#075EAE]">
                            {formatTime(event.start_at)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#075EAE]">
                              {resolveCategoryLabels(event).join(" · ")}
                            </p>
                            <Link
                              href={`/eventi/${event.slug}`}
                              className="mt-1 block truncate text-xl font-bold text-slate-900 hover:text-[#075EAE]"
                            >
                              {event.title}
                            </Link>
                            <p className="mt-1 text-sm text-slate-600">
                              {event.location_name || event.municipality}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:shrink-0">
                          <Link
                            href={`/eventi/${event.slug}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                          >
                            Apri
                          </Link>
                          <CalendarButton
                            eventId={event.id}
                            eventTitle={event.title}
                            initialInCalendar
                            variant="button"
                            className="!w-auto !rounded-xl !px-4 !py-2.5 !text-sm"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">Passati</h2>
              <div className="mt-4 space-y-3">
                {past.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-600"
                  >
                    <p className="text-sm">{formatPastDate(event.start_at)}</p>
                    <Link
                      href={`/eventi/${event.slug}`}
                      className="mt-1 block font-bold text-slate-900 hover:text-[#075EAE]"
                    >
                      {event.title}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
