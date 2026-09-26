-- Banner ad stats: totals on orders + daily rollup.

alter table public.advertising_orders
  add column if not exists impressions_count bigint not null default 0,
  add column if not exists clicks_count bigint not null default 0;

create table if not exists public.advertising_banner_stats_daily (
  order_id uuid not null references public.advertising_orders (id) on delete cascade,
  day date not null,
  impressions bigint not null default 0 check (impressions >= 0),
  clicks bigint not null default 0 check (clicks >= 0),
  primary key (order_id, day)
);

create index if not exists advertising_banner_stats_daily_day_idx
  on public.advertising_banner_stats_daily (day desc);

alter table public.advertising_banner_stats_daily enable row level security;

create policy "Admins can select advertising banner daily stats"
  on public.advertising_banner_stats_daily
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create or replace function public.increment_advertising_banner_stat(
  p_order_id uuid,
  p_event text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (timezone('Europe/Rome', now()))::date;
begin
  if p_event is distinct from 'impression' and p_event is distinct from 'click' then
    raise exception 'invalid advertising event';
  end if;

  update public.advertising_orders
  set
    impressions_count = impressions_count
      + case when p_event = 'impression' then 1 else 0 end,
    clicks_count = clicks_count
      + case when p_event = 'click' then 1 else 0 end
  where id = p_order_id
    and status = 'active';

  if not found then
    return;
  end if;

  insert into public.advertising_banner_stats_daily as d (
    order_id,
    day,
    impressions,
    clicks
  )
  values (
    p_order_id,
    v_day,
    case when p_event = 'impression' then 1 else 0 end,
    case when p_event = 'click' then 1 else 0 end
  )
  on conflict (order_id, day) do update
  set
    impressions = d.impressions + excluded.impressions,
    clicks = d.clicks + excluded.clicks;
end;
$$;

revoke all on function public.increment_advertising_banner_stat(uuid, text) from public;
grant execute on function public.increment_advertising_banner_stat(uuid, text) to service_role;
