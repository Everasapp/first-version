import Link from "next/link";

import NewsletterHtmlPreview from "@/src/components/admin/NewsletterHtmlPreview";
import SendWeeklyNewsletterButton from "@/src/components/admin/SendWeeklyNewsletterButton";
import { requireAdmin } from "@/src/lib/auth";
import { getCategoryLabel } from "@/src/lib/newsletter";
import {
  loadNewsletterSubscribers,
  loadWeekEvents,
  pickEventsForGeo,
} from "@/src/lib/newsletter-week";
import { ADMIN_NOTIFICATION_EMAIL } from "@/src/lib/notifications/config";
import { resolveGeoPreference } from "@/src/lib/geo-area";

export const dynamic = "force-dynamic";

function geoSourceLabel(source: string) {
  switch (source) {
    case "newsletter_city":
      return "città newsletter";
    case "municipality":
      return "comune profilo";
    case "province":
      return "provincia";
    default:
      return "non nota";
  }
}

export default async function AdminNewsletterPage() {
  const { supabase } = await requireAdmin("/admin/newsletter");

  let weekLabel = "questa settimana";
  let eventsCount = 0;
  let loadError = "";
  let recipientRows: Array<{
    subscriber: Awaited<ReturnType<typeof loadNewsletterSubscribers>>[number];
    geo: ReturnType<typeof resolveGeoPreference>;
    eventsCount: number;
  }> = [];

  try {
    const [{ week, events }, subscribers] = await Promise.all([
      loadWeekEvents(new Date(), supabase),
      loadNewsletterSubscribers(supabase),
    ]);
    weekLabel = week.label;
    eventsCount = events.length;
    recipientRows = subscribers.map((subscriber) => {
      const geo = resolveGeoPreference({
        newsletterCity: subscriber.newsletter_city,
        municipality: subscriber.municipality,
        province: subscriber.province,
      });
      const picked = pickEventsForGeo(
        events,
        geo,
        subscriber.newsletter_category,
      );
      return {
        subscriber,
        geo,
        eventsCount: picked.nearbyEvents.length + picked.areaEvents.length,
      };
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Non riesco a caricare eventi o iscritti.";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link
        href="/admin"
        className="text-sm font-semibold text-[#075EAE] hover:underline"
      >
        ← Amministrazione
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Newsletter settimanale
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Eventi del {weekLabel}. Ogni iscritto riceve gli appuntamenti della
            sua area (Nord, Centro o Sud), con priorità alla città scelta in
            fase di registrazione.
          </p>
        </div>
        <SendWeeklyNewsletterButton
          subscriberCount={recipientRows.length}
          testEmail={ADMIN_NOTIFICATION_EMAIL}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Iscritti
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {recipientRows.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Eventi in settimana
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {eventsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Posizione GPS
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Non è salvata sul profilo: usiamo città newsletter, poi comune,
            poi provincia.
          </p>
        </div>
      </div>

      {loadError ? (
        <p className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {loadError}
        </p>
      ) : null}

      <section className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Iscritto</th>
              <th className="px-4 py-3 font-semibold">Zona</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Eventi</th>
            </tr>
          </thead>
          <tbody>
            {recipientRows.map(({ subscriber, geo, eventsCount }) => (
              <tr
                key={subscriber.id}
                className="border-b border-slate-100 align-top"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {subscriber.full_name || "Utente"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {geo.city || "—"}
                  {geo.area ? ` · ${geo.area}` : ""}
                  <span className="mt-1 block text-xs text-slate-500">
                    {geoSourceLabel(geo.source)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {getCategoryLabel(subscriber.newsletter_category)}
                </td>
                <td className="px-4 py-3 text-slate-700">{eventsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10 space-y-8">
        <NewsletterHtmlPreview area="nord" title="Anteprima Nord · Sassari" />
        <NewsletterHtmlPreview area="centro" title="Anteprima Centro · Nuoro" />
        <NewsletterHtmlPreview area="sud" title="Anteprima Sud · Cagliari" />
      </section>
    </div>
  );
}
