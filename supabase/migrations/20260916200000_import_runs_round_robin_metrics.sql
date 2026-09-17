-- Round-robin allocation metrics: distinguish limit exhaustion from skip/duplicate.

alter table public.import_runs
  add column if not exists candidates_available integer not null default 0,
  add column if not exists candidates_attempted integer not null default 0,
  add column if not exists limit_skipped integer not null default 0;
