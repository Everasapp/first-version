-- Weekly delivery register. Delivery remains paused independently of this migration.
--
-- One row per recipient and Rome week. The primary key makes the claim atomic:
-- two concurrent runs cannot both insert the same pair.
--
-- Resend keeps an Idempotency-Key for 24 hours and will not send that same
-- request again inside the window. After 24 hours the key expires, so a row
-- in "sending" or "failed" becomes "uncertain" and is not emailed again.
-- first_claimed_at never moves on retry; claimed_at is only the short lease.
-- That does not prove the first request never reached the recipient.
-- The first staged subject and HTML stay on the row and are reused on retry.
--
-- Each batch is bounded. The newsletter schedule stays disabled until release.
-- Until this migration is applied, the senders refuse before calling Resend.

CREATE TABLE IF NOT EXISTS public.newsletter_week_deliveries (
  recipient_key text NOT NULL,
  week_key text NOT NULL,
  status text NOT NULL,
  events_count integer NOT NULL DEFAULT 0,
  error_message text,
  subject text,
  body_html text,
  idempotency_key text NOT NULL,
  first_claimed_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_week_deliveries_pkey PRIMARY KEY (recipient_key, week_key),
  CONSTRAINT newsletter_week_deliveries_status_check
    CHECK (status IN ('sending', 'sent', 'skipped', 'failed', 'uncertain')),
  CONSTRAINT newsletter_week_deliveries_keys_check
    CHECK (
      char_length(recipient_key) BETWEEN 1 AND 80
      AND week_key ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      AND char_length(idempotency_key) BETWEEN 1 AND 256
    )
);

ALTER TABLE public.newsletter_week_deliveries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.newsletter_week_deliveries FROM PUBLIC;
REVOKE ALL ON TABLE public.newsletter_week_deliveries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.newsletter_week_deliveries TO service_role;

CREATE OR REPLACE FUNCTION private.claim_newsletter_delivery(
  p_recipient_key text,
  p_week_key text,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_status text;
  v_claimed timestamptz;
  v_first_claimed timestamptz;
  v_key text;
  v_inserted integer;
BEGIN
  IF coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
    AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  INSERT INTO public.newsletter_week_deliveries (
    recipient_key,
    week_key,
    status,
    idempotency_key
  )
  VALUES (p_recipient_key, p_week_key, 'sending', p_idempotency_key)
  ON CONFLICT (recipient_key, week_key) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 1 THEN
    RETURN jsonb_build_object(
      'action', 'send',
      'idempotency_key', p_idempotency_key
    );
  END IF;

  SELECT status, claimed_at, first_claimed_at, idempotency_key
  INTO v_status, v_claimed, v_first_claimed, v_key
  FROM public.newsletter_week_deliveries
  WHERE recipient_key = p_recipient_key
    AND week_key = p_week_key
  FOR UPDATE;

  IF v_status IN ('sent', 'skipped', 'uncertain') THEN
    RETURN jsonb_build_object('action', 'skip', 'reason', v_status);
  END IF;

  -- The provider window is anchored to the FIRST claim, never the last retry.
  -- A failure may mean the provider accepted the email but the response or a
  -- later database write failed. It must obey the same absolute deadline.
  IF v_status IN ('sending', 'failed')
    AND v_first_claimed <= now() - interval '24 hours' THEN
    UPDATE public.newsletter_week_deliveries
    SET status = 'uncertain', updated_at = now()
    WHERE recipient_key = p_recipient_key
      AND week_key = p_week_key
      AND status IN ('sending', 'failed');

    RETURN jsonb_build_object('action', 'skip', 'reason', 'uncertain');
  END IF;

  IF v_status = 'failed' THEN
    UPDATE public.newsletter_week_deliveries
    SET
      status = 'sending',
      claimed_at = now(),
      updated_at = now(),
      error_message = NULL
    WHERE recipient_key = p_recipient_key
      AND week_key = p_week_key
      AND status = 'failed';

    IF FOUND THEN
      RETURN jsonb_build_object('action', 'send', 'idempotency_key', v_key);
    END IF;

    RETURN jsonb_build_object('action', 'skip', 'reason', 'sending');
  END IF;

  IF v_status = 'sending' AND v_claimed <= now() - interval '10 minutes' THEN
    UPDATE public.newsletter_week_deliveries
    SET claimed_at = now(), updated_at = now()
    WHERE recipient_key = p_recipient_key
      AND week_key = p_week_key
      AND status = 'sending'
      AND claimed_at <= now() - interval '10 minutes';

    IF FOUND THEN
      RETURN jsonb_build_object('action', 'send', 'idempotency_key', v_key);
    END IF;
  END IF;

  RETURN jsonb_build_object('action', 'skip', 'reason', 'sending');
END;
$$;

CREATE OR REPLACE FUNCTION private.complete_newsletter_delivery(
  p_recipient_key text,
  p_week_key text,
  p_status text,
  p_events_count integer,
  p_error_message text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
    AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  IF p_status NOT IN ('sent', 'skipped', 'failed') THEN
    RAISE EXCEPTION 'Stato newsletter non valido';
  END IF;

  UPDATE public.newsletter_week_deliveries
  SET
    status = p_status,
    events_count = COALESCE(p_events_count, 0),
    error_message = p_error_message,
    updated_at = now()
  WHERE recipient_key = p_recipient_key
    AND week_key = p_week_key
    AND status = 'sending';
END;
$$;

CREATE OR REPLACE FUNCTION private.stage_newsletter_body(
  p_recipient_key text,
  p_week_key text,
  p_subject text,
  p_html text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_subject text;
  v_html text;
BEGIN
  IF coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
    AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  IF coalesce(p_subject, '') = '' OR coalesce(p_html, '') = '' THEN
    RAISE EXCEPTION 'Contenuto newsletter mancante';
  END IF;

  SELECT subject, body_html
  INTO v_subject, v_html
  FROM public.newsletter_week_deliveries
  WHERE recipient_key = p_recipient_key
    AND week_key = p_week_key
    AND status = 'sending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registrazione newsletter non trovata';
  END IF;

  IF v_subject IS NULL OR v_html IS NULL THEN
    UPDATE public.newsletter_week_deliveries
    SET
      subject = p_subject,
      body_html = p_html,
      updated_at = now()
    WHERE recipient_key = p_recipient_key
      AND week_key = p_week_key
      AND status = 'sending'
      AND body_html IS NULL
    RETURNING subject, body_html
    INTO v_subject, v_html;
  END IF;

  IF v_subject IS NULL OR v_html IS NULL THEN
    RAISE EXCEPTION 'Contenuto newsletter mancante';
  END IF;

  RETURN jsonb_build_object('subject', v_subject, 'html', v_html);
END;
$$;

CREATE OR REPLACE FUNCTION public.stage_newsletter_body(
  p_recipient_key text,
  p_week_key text,
  p_subject text,
  p_html text
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.stage_newsletter_body(
    p_recipient_key,
    p_week_key,
    p_subject,
    p_html
  );
$$;

CREATE OR REPLACE FUNCTION public.claim_newsletter_delivery(
  p_recipient_key text,
  p_week_key text,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.claim_newsletter_delivery(
    p_recipient_key,
    p_week_key,
    p_idempotency_key
  );
$$;

CREATE OR REPLACE FUNCTION public.complete_newsletter_delivery(
  p_recipient_key text,
  p_week_key text,
  p_status text,
  p_events_count integer,
  p_error_message text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM private.complete_newsletter_delivery(
    p_recipient_key,
    p_week_key,
    p_status,
    p_events_count,
    p_error_message
  );
END;
$$;

REVOKE ALL ON FUNCTION public.claim_newsletter_delivery(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_newsletter_delivery(text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.claim_newsletter_delivery(text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.complete_newsletter_delivery(text, text, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_newsletter_delivery(text, text, text, integer, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.complete_newsletter_delivery(text, text, text, integer, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.stage_newsletter_body(text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.stage_newsletter_body(text, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.stage_newsletter_body(text, text, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION private.claim_newsletter_delivery(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.complete_newsletter_delivery(text, text, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.stage_newsletter_body(text, text, text, text) FROM PUBLIC;


-- Resolve both signup sources in one request. Prefer a confirmed account for
-- duplicate addresses, while keeping an independent email-only subscription
-- usable when the account email is not confirmed.
CREATE OR REPLACE FUNCTION private.newsletter_delivery_recipients()
RETURNS TABLE (
  id uuid, full_name text, municipality text, province text,
  newsletter_city text, newsletter_category text, newsletter_unsub_token uuid,
  email text, email_confirmed boolean, recipient_source text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF coalesce(auth.jwt() ->> 'role', '') <> 'service_role'
    AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;
  RETURN QUERY
  SELECT DISTINCT ON (lower(trim(r.email)))
    r.id, r.full_name, r.municipality, r.province,
    r.newsletter_city, r.newsletter_category, r.newsletter_unsub_token,
    lower(trim(r.email)), r.email_confirmed, r.recipient_source
  FROM (
    SELECT p.id, p.full_name, p.municipality, p.province,
      p.newsletter_city, p.newsletter_category, p.newsletter_unsub_token,
      u.email::text, (u.email_confirmed_at IS NOT NULL) AS email_confirmed,
      'profile'::text AS recipient_source
    FROM public.profiles p JOIN auth.users u ON u.id = p.id
    WHERE p.newsletter_opt_in IS TRUE
    UNION ALL
    SELECT s.id, NULL::text, s.city, NULL::text, s.city, s.category,
      s.unsub_token, s.email::text, true, 'subscriber'::text
    FROM public.newsletter_subscribers s WHERE s.opt_in IS TRUE
  ) r
  WHERE coalesce(trim(r.email), '') <> ''
  ORDER BY lower(trim(r.email)), r.email_confirmed DESC,
    CASE WHEN r.recipient_source = 'profile' THEN 0 ELSE 1 END, r.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.newsletter_delivery_recipients()
RETURNS TABLE (
  id uuid, full_name text, municipality text, province text,
  newsletter_city text, newsletter_category text, newsletter_unsub_token uuid,
  email text, email_confirmed boolean, recipient_source text
)
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$ SELECT * FROM private.newsletter_delivery_recipients(); $$;

REVOKE ALL ON FUNCTION private.newsletter_delivery_recipients() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.newsletter_delivery_recipients() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.newsletter_delivery_recipients() TO authenticated, service_role;
