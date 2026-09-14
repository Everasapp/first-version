-- Public email-only newsletter subscribers + unified send/unsubscribe.

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  city text NOT NULL,
  category text NOT NULL,
  opt_in boolean NOT NULL DEFAULT true,
  opted_at timestamptz,
  last_sent_at timestamptz,
  unsub_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_format
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_unsub_token_idx
  ON public.newsletter_subscribers (unsub_token);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_opt_in_idx
  ON public.newsletter_subscribers (opt_in)
  WHERE opt_in IS TRUE;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.newsletter_subscribers FROM PUBLIC;
REVOKE ALL ON TABLE public.newsletter_subscribers FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.newsletter_subscribers TO service_role;

-- Allow logging sends for email-only subscribers (no auth.users / profiles row).
ALTER TABLE public.newsletter_sends
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.newsletter_sends
  ADD COLUMN IF NOT EXISTS subscriber_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'newsletter_sends_subscriber_id_fkey'
  ) THEN
    ALTER TABLE public.newsletter_sends
      ADD CONSTRAINT newsletter_sends_subscriber_id_fkey
      FOREIGN KEY (subscriber_id)
      REFERENCES public.newsletter_subscribers (id)
      ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'newsletter_sends_subject_check'
  ) THEN
    ALTER TABLE public.newsletter_sends
      ADD CONSTRAINT newsletter_sends_subject_check
      CHECK (user_id IS NOT NULL OR subscriber_id IS NOT NULL);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  p_email text,
  p_city text,
  p_category text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email text;
  v_city text;
  v_category text;
  v_existing public.newsletter_subscribers%ROWTYPE;
BEGIN
  v_email := lower(trim(COALESCE(p_email, '')));
  v_city := trim(COALESCE(p_city, ''));
  v_category := trim(COALESCE(p_category, ''));

  IF v_email = '' OR v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Email non valida';
  END IF;

  IF v_city = '' THEN
    RAISE EXCEPTION 'Seleziona una città';
  END IF;

  IF v_category = '' THEN
    RAISE EXCEPTION 'Seleziona una categoria';
  END IF;

  SELECT *
  INTO v_existing
  FROM public.newsletter_subscribers s
  WHERE s.email = v_email;

  IF FOUND THEN
    IF v_existing.opt_in
      AND v_existing.city = v_city
      AND v_existing.category = v_category THEN
      RETURN 'already';
    END IF;

    UPDATE public.newsletter_subscribers
    SET
      city = v_city,
      category = v_category,
      opt_in = true,
      opted_at = now(),
      updated_at = now()
    WHERE id = v_existing.id;

    RETURN 'updated';
  END IF;

  INSERT INTO public.newsletter_subscribers (
    email,
    city,
    category,
    opt_in,
    opted_at
  )
  VALUES (
    v_email,
    v_city,
    v_category,
    true,
    now()
  );

  RETURN 'subscribed';
END;
$$;

CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(p_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_count integer := 0;
BEGIN
  UPDATE public.profiles
  SET
    newsletter_opt_in = false,
    newsletter_opted_at = null,
    updated_at = now()
  WHERE newsletter_unsub_token = p_token
    AND newsletter_opt_in = true;

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count > 0 THEN
    RETURN true;
  END IF;

  UPDATE public.newsletter_subscribers
  SET
    opt_in = false,
    opted_at = null,
    updated_at = now()
  WHERE unsub_token = p_token
    AND opt_in = true;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$;

CREATE OR REPLACE FUNCTION private.admin_newsletter_recipients()
RETURNS TABLE (
  id uuid,
  full_name text,
  municipality text,
  province text,
  newsletter_city text,
  newsletter_category text,
  newsletter_unsub_token uuid,
  email text,
  email_confirmed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.municipality,
    p.province,
    p.newsletter_city,
    p.newsletter_category,
    p.newsletter_unsub_token,
    u.email::text,
    (u.email_confirmed_at IS NOT NULL)
  FROM public.profiles p
  INNER JOIN auth.users u ON u.id = p.id
  WHERE p.newsletter_opt_in IS TRUE

  UNION ALL

  SELECT
    s.id,
    NULL::text AS full_name,
    s.city AS municipality,
    NULL::text AS province,
    s.city AS newsletter_city,
    s.category AS newsletter_category,
    s.unsub_token AS newsletter_unsub_token,
    s.email::text,
    true AS email_confirmed
  FROM public.newsletter_subscribers s
  WHERE s.opt_in IS TRUE
    AND NOT EXISTS (
      SELECT 1
      FROM public.profiles p2
      INNER JOIN auth.users u2 ON u2.id = p2.id
      WHERE p2.newsletter_opt_in IS TRUE
        AND lower(u2.email) = lower(s.email)
    );
END;
$$;

CREATE OR REPLACE FUNCTION private.admin_record_newsletter_send(
  p_user_id uuid,
  p_events_count integer,
  p_status text,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_profile boolean;
  v_is_subscriber boolean;
BEGIN
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  IF p_status NOT IN ('sent', 'skipped', 'failed') THEN
    RAISE EXCEPTION 'Stato newsletter non valido';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = p_user_id
  ) INTO v_is_profile;

  SELECT EXISTS (
    SELECT 1 FROM public.newsletter_subscribers s WHERE s.id = p_user_id
  ) INTO v_is_subscriber;

  IF v_is_profile THEN
    INSERT INTO public.newsletter_sends (user_id, events_count, status, error_message)
    VALUES (p_user_id, COALESCE(p_events_count, 0), p_status, p_error_message);

    IF p_status = 'sent' THEN
      UPDATE public.profiles
      SET
        newsletter_last_sent_at = now(),
        updated_at = now()
      WHERE id = p_user_id;
    END IF;
    RETURN;
  END IF;

  IF v_is_subscriber THEN
    INSERT INTO public.newsletter_sends (subscriber_id, events_count, status, error_message)
    VALUES (p_user_id, COALESCE(p_events_count, 0), p_status, p_error_message);

    IF p_status = 'sent' THEN
      UPDATE public.newsletter_subscribers
      SET
        last_sent_at = now(),
        updated_at = now()
      WHERE id = p_user_id;
    END IF;
    RETURN;
  END IF;

  RAISE EXCEPTION 'Destinatario newsletter non trovato';
END;
$$;

-- Thin public wrappers already exist; recreate grants for new RPCs.
REVOKE ALL ON FUNCTION public.subscribe_newsletter(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.unsubscribe_newsletter(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO service_role;
