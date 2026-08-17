import Link from "next/link";

import SendWeeklyNewsletterButton from "@/src/components/admin/SendWeeklyNewsletterButton";
import { requireAdmin } from "@/src/lib/auth";
import { getCategoryLabel } from "@/src/lib/newsletter";
import {
  composeSubscriberNewsletter,
  loadNewsletterSubscribers,
  loadWeekEvents,
} from "@/src/lib/newsletter-week";
import {
  ADMIN_NOTIFICATION_EMAIL,
  getSiteUrl,
} from "@/src/lib/notifications/config";
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

  const [{ week, events }, subscribers] = await Promise.all([
    loadWeekEvents(new Date(), supabase),
    loadNewsletterSubscribers(supabase),
  ]);
  const siteUrl = getSiteUrl();

  const nordPreview = composeSubscriberNewsletter({
    subscriber: {
      id: "preview-nord",
      full_name: "Marina",
      municipality: "Sassari",
      province: "SS",
      newsletter_city: "Sassari",
      newsletter_category: null,
      newsletter_unsub_token: "preview",
    },
    events,
    weekLabel: week.label,
    siteUrl,
  });

  const centroPreview = composeSubscriberNewsletter({
    subscriber: {
      id: "preview-centro",
      full_name: "Marina",
      municipality: "Nuoro",
      province: "NU",
      newsletter_city: "Nuoro",
      newsletter_category: null,
      newsletter_unsub_token: "preview",
    },
    events,
    weekLabel: week.label,
    siteUrl,
  });

  const sudPreview = composeSubscriberNewsletter({
    subscriber: {
      id: "preview-sud",
      full_name: "Marina",
      municipality: "Cagliari",
      province: "CA",
      newsletter_city: "Cagliari",
      newsletter_category: null,
      newsletter_unsub_token: "preview",
    },
    events,
    weekLabel: week.label,
    siteUrl,
  });

  const recipientRows = subscribers.map((subscriber) => {
    const geo = resolveGeoPreference({
      newsletterCity: subscriber.newsletter_city,
      municipality: subscriber.municipality,
      province: subscriber.province,
    });
    const preview = composeSubscriberNewsletter({
      subscriber,
      events,
      weekLabel: week.label,
      siteUrl,
    });
    return { subscriber, geo, eventsCount: preview.eventsCount };
  });

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
            Eventi del {week.label}. Ogni iscritto riceve gli appuntamenti della
            sua area (Nord, Centro o Sud), con priorità alla città scelta in
            fase di registrazione.
          </p>
        </div>
        <SendWeeklyNewsletterButton
          subscriberCount={subscribers.length}
          testEmail={ADMIN_NOTIFICATION_EMAIL}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Iscritti
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {subscribers.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Eventi in settimana
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {events.length}
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
        {[
          { title: "Anteprima Nord · Sassari", preview: nordPreview },
          { title: "Anteprima Centro · Nuoro", preview: centroPreview },
          { title: "Anteprima Sud · Cagliari", preview: sudPreview },
        ].map((item) => (
          <div key={item.title}>
            <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {item.preview.eventsCount} eventi · {item.preview.subject}
            </p>
            <iframe
              title={item.title}
              srcDoc={item.preview.html}
              className="mt-3 h-[720px] w-full rounded-2xl border border-slate-200 bg-slate-100"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
