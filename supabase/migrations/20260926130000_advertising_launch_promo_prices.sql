-- Launch promo pricing fields for advertising_orders.
-- Does not alter existing price values; backfills final_price from price.

alter table public.advertising_orders
  add column if not exists list_price numeric(10, 2),
  add column if not exists promo_price numeric(10, 2),
  add column if not exists final_price numeric(10, 2),
  add column if not exists promo_applied boolean not null default false;

-- Ordini già esistenti: mantieni il prezzo pagato/bloccato in `price`.
update public.advertising_orders
set
  final_price = coalesce(final_price, price),
  list_price = coalesce(list_price, price),
  promo_applied = coalesce(promo_applied, false)
where final_price is null or list_price is null;

alter table public.advertising_orders
  alter column final_price set default 0;

-- Indice per conteggio promo clienti paganti.
create index if not exists advertising_orders_promo_paid_idx
  on public.advertising_orders (promo_applied, paid_at)
  where promo_applied = true and paid_at is not null;
