-- Per-source importer runs. One row per source per invocation (batch_id).

create table if not exists public.import_runs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  source text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null
    check (status in ('started', 'success', 'error', 'partial')),
  events_found integer not null default 0,
  events_parsed integer not null default 0,
  events_created integer not null default 0,
  duplicates integer not null default 0,
  skipped integer not null default 0,
  errors integer not null default 0,
  error_message text,
  http_status integer,
  last_error_code text,
  duration_ms integer,
  retry_count integer not null default 0,
  triggered_by text not null default 'cron'
    check (triggered_by in ('cron', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists import_runs_started_idx
  on public.import_runs (started_at desc);

create index if not exists import_runs_batch_idx
  on public.import_runs (batch_id, started_at);

create unique index if not exists import_runs_batch_source_idx
  on public.import_runs (batch_id, source);

alter table public.import_runs enable row level security;

revoke all on table public.import_runs from public;
revoke all on table public.import_runs from anon, authenticated;

grant all on table public.import_runs to service_role;
grant select on table public.import_runs to authenticated;

create policy "import_runs_admin_select"
  on public.import_runs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
