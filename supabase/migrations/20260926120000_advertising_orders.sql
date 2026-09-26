-- Advertising banner sales: orders table + storage bucket policies.

create table if not exists public.advertising_orders (
  id uuid primary key default gen_random_uuid(),
  access_token text not null unique default replace(
    gen_random_uuid()::text || gen_random_uuid()::text,
    '-',
    ''
  ),

  package_id text not null,
  package_name text not null,
  placement text not null check (placement in ('home', 'internal')),
  duration_months integer not null check (duration_months in (3, 6, 12)),
  price numeric(10, 2) not null check (price >= 0),
  list_price numeric(10, 2),
  promo_price numeric(10, 2),
  final_price numeric(10, 2),
  promo_applied boolean not null default false,
  currency text not null default 'EUR',

  status text not null default 'awaiting_payment'
    check (status in (
      'draft',
      'awaiting_payment',
      'paid',
      'awaiting_approval',
      'needs_changes',
      'approved',
      'active',
      'rejected',
      'expired',
      'cancelled'
    )),

  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  postal_code text not null,
  city text not null,
  province text not null,
  website_url text not null,

  banner_url text,
  banner_storage_path text,

  paypal_order_id text,
  paypal_capture_id text,

  admin_notes text,
  rejection_reason text,

  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  paid_at timestamptz,
  start_date timestamptz,
  expiration_date timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  expired_at timestamptz
);

create index if not exists advertising_orders_status_idx
  on public.advertising_orders (status);

create index if not exists advertising_orders_placement_status_idx
  on public.advertising_orders (placement, status);

create index if not exists advertising_orders_expiration_idx
  on public.advertising_orders (expiration_date)
  where status = 'active';

create index if not exists advertising_orders_paypal_order_idx
  on public.advertising_orders (paypal_order_id)
  where paypal_order_id is not null;

alter table public.advertising_orders enable row level security;

-- No public policies: all access via service role or authenticated admin RPCs.
-- Authenticated admins can read/update via existing role checks in app code
-- using the user client only when profile.role = admin (enforced in API).

create policy "Admins can select advertising orders"
  on public.advertising_orders
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update advertising orders"
  on public.advertising_orders
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Storage bucket for advertiser banners (public read for active creatives).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'advertising-banners',
  'advertising-banners',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public can read objects (banner URLs on the site). Uploads only via service role.
create policy "Public read advertising banners"
  on storage.objects
  for select
  to public
  using (bucket_id = 'advertising-banners');
