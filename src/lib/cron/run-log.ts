import type { SupabaseClient } from "@supabase/supabase-js";

import { tryCreateAdminClient } from "@/src/lib/supabase/admin";

export type CronRunStatus = "started" | "success" | "error" | "unauthorized";

export async function logCronRun({
  supabase,
  jobName,
  status,
  startedAt,
  summary = {},
  errorMessage,
}: {
  supabase?: SupabaseClient | null;
  jobName: string;
  status: CronRunStatus;
  startedAt: Date;
  summary?: Record<string, unknown>;
  errorMessage?: string | null;
}) {
  const client = supabase ?? tryCreateAdminClient();
  if (!client) {
    console.error(
      `[cron:${jobName}] impossibile loggare run (manca service role):`,
      status,
      errorMessage,
      summary,
    );
    return;
  }

  const finishedAt = new Date();
  const { error } = await client.from("cron_run_logs").insert({
    job_name: jobName,
    status,
    started_at: startedAt.toISOString(),
    finished_at:
      status === "started" ? null : finishedAt.toISOString(),
    duration_ms:
      status === "started"
        ? null
        : Math.max(0, finishedAt.getTime() - startedAt.getTime()),
    summary,
    error_message: errorMessage || null,
  });

  if (error) {
    console.error(`[cron:${jobName}] log fallito:`, error.message, summary);
  }
}
