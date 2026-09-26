-- Allow up to 3 banners (incl. GIF) per advertising order.
alter table public.advertising_orders
  add column if not exists banner_urls text[] not null default '{}',
  add column if not exists banner_storage_paths text[] not null default '{}';

update public.advertising_orders
set
  banner_urls = array[banner_url],
  banner_storage_paths = case
    when banner_storage_path is not null then array[banner_storage_path]
    else '{}'::text[]
  end
where banner_url is not null
  and (banner_urls is null or cardinality(banner_urls) = 0);
