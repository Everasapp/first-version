-- cron_run_logs is written only by service_role (Vercel cron / admin client).
-- Enable RLS with no client policies so anon/authenticated cannot access rows.
alter table public.cron_run_logs enable row level security;

revoke all on table public.cron_run_logs from anon, authenticated;
