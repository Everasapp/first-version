import Link from "next/link";
import ImportLogsPanel, {
  type ImportRunRow,
} from "@/src/components/admin/ImportLogsPanel";
import { requireAdmin } from "@/src/lib/auth";

export default async function ImportLogsPage() {
  const { supabase } = await requireAdmin("/admin/import-logs");
  const { data, error } = await supabase
    .from("import_runs")
    .select(
      "id, batch_id, source, started_at, completed_at, status, events_found, events_created, duplicates, skipped, errors, candidates_available, candidates_attempted, limit_skipped, duration_ms, error_message, http_status, last_error_code, triggered_by",
    )
    .order("started_at", { ascending: false })
    .limit(140);

  if (error) {
    throw new Error(`Impossibile caricare i log di import: ${error.message}`);
  }

  const { data: drafts, error: draftError } = await supabase
    .from("events")
    .select("id, title, municipality, source_url")
    .eq("status", "draft")
    .eq("verification_status", "pending_verification")
    .order("updated_at", { ascending: false })
    .limit(30);
  if (draftError) throw new Error(`Impossibile caricare le bozze: ${draftError.message}`);

  const reviewReasons = new Map<string, string[]>();
  if (drafts?.length) {
    const { data: logs, error: logError } = await supabase
      .from("event_import_logs")
      .select("event_id, payload")
      .in("event_id", drafts.map((row) => row.id))
      .in("status", ["success", "updated"])
      .order("created_at", { ascending: false });
    if (logError) throw new Error(`Impossibile caricare i controlli delle bozze: ${logError.message}`);
    for (const log of logs ?? []) {
      if (reviewReasons.has(log.event_id)) continue;
      const reasons = log.payload?.reviewReasons;
      reviewReasons.set(log.event_id, Array.isArray(reasons) ? reasons.filter((reason): reason is string => typeof reason === "string") : []);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Import Logs
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Verifica se l&apos;import delle 08:00 è partito e come è andata ogni
        fonte. Una riga per fonte, raggruppata per batch.
      </p>
      <div className="mt-8">
        <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5" aria-labelledby="draft-review-title">
          <h2 id="draft-review-title" className="text-xl font-bold text-slate-900">Bozze da verificare</h2>
          <p className="mt-2 text-sm text-slate-700">Le schede in revisione non sono pubbliche. Leggi il motivo del controllo, verifica la fonte e completa le informazioni prima di pubblicare. I doppioni consolidati devono restare in bozza.</p>
          {drafts?.length ? (
            <ul className="mt-4 space-y-4">
              {drafts.map((draft) => (
                <li key={draft.id} className="rounded-xl border border-amber-200 bg-white p-4">
                  <h3 className="font-bold text-slate-900">{draft.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{draft.municipality}</p>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {(reviewReasons.get(draft.id)?.length ? reviewReasons.get(draft.id)! : ["Informazioni da rivedere con la fonte"]).map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-[#075EAE]">
                    <Link href={`/dashboard/eventi/${draft.id}/modifica`} prefetch={false} className="hover:underline">Rivedi la bozza →</Link>
                    {draft.source_url && /^https?:\/\//i.test(draft.source_url) ? <a href={draft.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">Apri la fonte</a> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-sm text-slate-600">Nessuna bozza da verificare.</p>}
        </section>
        <ImportLogsPanel runs={(data || []) as ImportRunRow[]} />
      </div>
    </div>
  );
}
