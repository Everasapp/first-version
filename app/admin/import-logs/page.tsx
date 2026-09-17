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
        <ImportLogsPanel runs={(data || []) as ImportRunRow[]} />
      </div>
    </div>
  );
}
