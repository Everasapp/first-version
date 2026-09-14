alter table public.cron_run_logs drop constraint if exists cron_run_logs_status_check;
alter table public.cron_run_logs
  add constraint cron_run_logs_status_check
  check (status in ('started', 'success', 'error', 'unauthorized'));
