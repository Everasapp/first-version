import type { SupabaseClient } from "@supabase/supabase-js";

export type ImportRunStatus = "started" | "success" | "error" | "partial";
export type ImportTriggeredBy = "cron" | "admin";

export type ClassifiedError = {
  errorMessage: string;
  httpStatus: number | null;
  lastErrorCode: string;
};

export function classifyImportError(error: unknown): ClassifiedError {
  const errorMessage =
    error instanceof Error ? error.message : String(error || "errore sconosciuto");
  const httpMatch = errorMessage.match(/\bHTTP\s+(\d{3})\b/i);
  const httpStatus = httpMatch ? Number.parseInt(httpMatch[1], 10) : null;

  let lastErrorCode = "unknown";
  if (/timeout|aborted|abort/i.test(errorMessage)) lastErrorCode = "timeout";
  else if (/row-level security|rls/i.test(errorMessage)) lastErrorCode = "rls";
  else if (httpStatus === 403) lastErrorCode = "http_403";
  else if (httpStatus === 401) lastErrorCode = "http_401";
  else if (httpStatus === 404) lastErrorCode = "http_404";
  else if (httpStatus === 429) lastErrorCode = "http_429";
  else if (httpStatus && httpStatus >= 500) lastErrorCode = "http_5xx";
  else if (httpStatus && httpStatus >= 400) lastErrorCode = `http_${httpStatus}`;
  else if (/JSON|parse|cheerio|analisi/i.test(errorMessage)) lastErrorCode = "parse";
  else if (/fetch|network|ENOTFOUND|ECONN/i.test(errorMessage)) lastErrorCode = "network";

  return { errorMessage, httpStatus, lastErrorCode };
}

export async function startImportRun({
  supabase,
  batchId,
  source,
  triggeredBy,
  startedAt,
}: {
  supabase: SupabaseClient;
  batchId: string;
  source: string;
  triggeredBy: ImportTriggeredBy;
  startedAt: Date;
}) {
  const { data, error } = await supabase
    .from("import_runs")
    .insert({
      batch_id: batchId,
      source,
      started_at: startedAt.toISOString(),
      status: "started",
      triggered_by: triggeredBy,
    })
    .select("id")
    .single();

  if (error) {
    console.error(`[import_runs] start fallito (${source}):`, error.message);
    return null;
  }

  return (data?.id as string) || null;
}

export async function finishImportRun({
  supabase,
  runId,
  status,
  startedAt,
  eventsFound = 0,
  eventsParsed = 0,
  eventsCreated = 0,
  duplicates = 0,
  skipped = 0,
  errors = 0,
  retryCount = 0,
  candidatesAvailable = 0,
  candidatesAttempted = 0,
  limitSkipped = 0,
  errorMessage = null,
  httpStatus = null,
  lastErrorCode = null,
}: {
  supabase: SupabaseClient;
  runId: string | null;
  status: ImportRunStatus;
  startedAt: Date;
  eventsFound?: number;
  eventsParsed?: number;
  eventsCreated?: number;
  duplicates?: number;
  skipped?: number;
  errors?: number;
  retryCount?: number;
  candidatesAvailable?: number;
  candidatesAttempted?: number;
  limitSkipped?: number;
  errorMessage?: string | null;
  httpStatus?: number | null;
  lastErrorCode?: string | null;
}) {
  if (!runId) return;
  const completedAt = new Date();
  const { error } = await supabase
    .from("import_runs")
    .update({
      status,
      completed_at: completedAt.toISOString(),
      duration_ms: Math.max(0, completedAt.getTime() - startedAt.getTime()),
      events_found: eventsFound,
      events_parsed: eventsParsed,
      events_created: eventsCreated,
      duplicates,
      skipped,
      errors,
      retry_count: retryCount,
      candidates_available: candidatesAvailable,
      candidates_attempted: candidatesAttempted,
      limit_skipped: limitSkipped,
      error_message: errorMessage,
      http_status: httpStatus,
      last_error_code: lastErrorCode,
    })
    .eq("id", runId);

  if (error) {
    console.error("[import_runs] finish fallito:", error.message);
  }
}
