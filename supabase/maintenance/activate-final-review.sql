-- MANUAL OPERATION: not a migration and not run by builds.
-- Run only after the authorized deployment of PR #31 and verification of all four 308 redirects.
-- The user explicitly asked to postpone deployment. Do not run this with COMMIT yet.
-- Event records and institutional advertising statistics are retained for recovery.
BEGIN;
DO $activation$
DECLARE affected integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id='3f2ddb17-2e65-4c18-a35d-c810c93ea870' AND slug='autunno-in-barbagia-lollove-2026-10-10' AND status='published') THEN
    RAISE EXCEPTION 'Canonical event missing: 3f2ddb17-2e65-4c18-a35d-c810c93ea870';
  END IF;
  UPDATE public.events SET status='draft'
  WHERE id='bd2e18f8-1733-4a0d-9777-099db38c777a' AND slug='autunno-in-barbagia-carreras-de-lollobe-nuoro-2026' AND status='published'
    AND updated_at='2026-10-09 16:56:15.820925+00'::timestamptz;
  GET DIAGNOSTICS affected=ROW_COUNT;
  IF affected=0 AND NOT EXISTS (SELECT 1 FROM public.events WHERE id='bd2e18f8-1733-4a0d-9777-099db38c777a' AND status='draft') THEN
    RAISE EXCEPTION 'Duplicate changed; review before retiring: bd2e18f8-1733-4a0d-9777-099db38c777a';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id='827c4217-307a-488f-ae1d-c4aba354af3d' AND slug='a-stintino-dal-9-all-11-ottobre-va-in-scena-il-turismo-lento-e-sostenibile-tutte-le-attivita-che-si-potranno-fare-muxq9dcz' AND status='published') THEN
    RAISE EXCEPTION 'Canonical event missing: 827c4217-307a-488f-ae1d-c4aba354af3d';
  END IF;
  UPDATE public.events SET status='draft'
  WHERE id='5e893c29-3e5b-447b-947a-7aaaf56e46d0' AND slug='torna-il-festival-del-turismo-itinerante-il-programma-completo-dell-edizione-2026-a-stintino-muuvehg4' AND status='published'
    AND updated_at='2026-10-09 16:08:02.564885+00'::timestamptz;
  GET DIAGNOSTICS affected=ROW_COUNT;
  IF affected=0 AND NOT EXISTS (SELECT 1 FROM public.events WHERE id='5e893c29-3e5b-447b-947a-7aaaf56e46d0' AND status='draft') THEN
    RAISE EXCEPTION 'Duplicate changed; review before retiring: 5e893c29-3e5b-447b-947a-7aaaf56e46d0';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id='827c4217-307a-488f-ae1d-c4aba354af3d' AND slug='a-stintino-dal-9-all-11-ottobre-va-in-scena-il-turismo-lento-e-sostenibile-tutte-le-attivita-che-si-potranno-fare-muxq9dcz' AND status='published') THEN
    RAISE EXCEPTION 'Canonical event missing: 827c4217-307a-488f-ae1d-c4aba354af3d';
  END IF;
  UPDATE public.events SET status='draft'
  WHERE id='7006ef27-ed8b-4581-9d42-79297ff5012e' AND slug='festival-del-turismo-itinerante-e-delle-attivit-all-ari-2026-10-09-59db0fe4' AND status='published'
    AND updated_at='2026-10-09 16:08:02.564885+00'::timestamptz;
  GET DIAGNOSTICS affected=ROW_COUNT;
  IF affected=0 AND NOT EXISTS (SELECT 1 FROM public.events WHERE id='7006ef27-ed8b-4581-9d42-79297ff5012e' AND status='draft') THEN
    RAISE EXCEPTION 'Duplicate changed; review before retiring: 7006ef27-ed8b-4581-9d42-79297ff5012e';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE id='ae214fea-d807-4d95-86a7-bcf5d12c8d3d' AND slug='autunno-in-barbagia-a-tonara-dal-9-all-11-ottobre-torrone-campanacci-e-sa-coia-antiga-muwatve8' AND status='published') THEN
    RAISE EXCEPTION 'Canonical event missing: ae214fea-d807-4d95-86a7-bcf5d12c8d3d';
  END IF;
  UPDATE public.events SET status='draft'
  WHERE id='b17d43af-f648-44a7-97b6-5ca54c02f211' AND slug='autunno-in-barbagia-tonara-2026-10-10' AND status='published'
    AND updated_at='2026-10-09 16:56:15.820925+00'::timestamptz;
  GET DIAGNOSTICS affected=ROW_COUNT;
  IF affected=0 AND NOT EXISTS (SELECT 1 FROM public.events WHERE id='b17d43af-f648-44a7-97b6-5ca54c02f211' AND status='draft') THEN
    RAISE EXCEPTION 'Duplicate changed; review before retiring: b17d43af-f648-44a7-97b6-5ca54c02f211';
  END IF;

  INSERT INTO public.advertising_orders (
    id, package_id, package_name, placement, duration_months,
    price, list_price, final_price, promo_applied, currency, status,
    company_name, contact_name, email, phone, address, postal_code, city, province,
    website_url, banner_url, banner_urls, approved_at, start_date, expiration_date,
    admin_notes
  ) VALUES (
    'e7e8a500-0000-4000-8000-000000000005',
    'speaking-fluently-partner', 'Speaking Fluently — Conversazione inglese',
    'home', 12, 0, 0, 0, false, 'EUR', 'active',
    'Speaking Fluently', 'Speaking Fluently', 'm.canalis@live.it',
    '', '', '', 'Sassari', 'SS', 'mailto:m.canalis@live.it',
    '/images/ads/speaking-fluently-banner.webp',
    ARRAY['/images/ads/speaking-fluently-banner.webp'],
    now(), now(), '2099-12-31T23:59:59Z',
    'Partner fisso. Statistiche proprie dalla data di attivazione; nessun dato EVERAS trasferito.'
  ) ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (
    SELECT 1 FROM public.advertising_orders
    WHERE id='e7e8a500-0000-4000-8000-000000000005'
      AND package_id='speaking-fluently-partner'
      AND company_name='Speaking Fluently' AND status='active'
  ) THEN
    RAISE EXCEPTION 'Speaking Fluently order already exists with different data; review it';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.advertising_orders
    WHERE id='e7e8a500-0000-4000-8000-000000000001'
      AND package_id='everas-self-promo'
  ) THEN
    RAISE EXCEPTION 'Institutional order missing or changed; review its archive';
  END IF;

  UPDATE public.advertising_orders
  SET status='cancelled',
      admin_notes=concat_ws(E'\n', admin_notes,
        'Banner ritirato. Statistiche storiche archiviate; contatore sostituito da Speaking Fluently, senza trasferire views o click.')
  WHERE id='e7e8a500-0000-4000-8000-000000000001'
    AND status <> 'cancelled';
END $activation$;
COMMIT;
