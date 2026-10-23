set local lock_timeout = '5s';
set local statement_timeout = '15s';

-- Unknown intake dates must stay NULL, never a placeholder date.
-- Existing dated events keep the same required start date and permissions.
alter table public.events drop constraint events_schedule_mode_check;
alter table public.events add constraint events_schedule_mode_check
  check (schedule_mode in ('single', 'continuous', 'series', 'container', 'enrollment'));
alter table public.events alter column start_at drop not null;
alter table public.events add constraint events_course_enrollment_dates_check
  check (case when schedule_mode = 'enrollment' then
    start_at is null and end_at is null
    and subcategory is not null and subcategory like 'imparare-%'
  else start_at is not null end);
