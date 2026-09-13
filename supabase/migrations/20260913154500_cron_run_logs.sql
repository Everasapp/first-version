create table if not exists public.cron_run_logs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  status text not null check (status in ('success', 'error', 'unauthorized')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  summary jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists cron_run_logs_job_started_idx
  on public.cron_run_logs (job_name, started_at desc);

alter table public.cron_run_logs enable row level security;
