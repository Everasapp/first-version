-- Admin newsletter send without service_role: emails live in auth.users.
-- Privileged logic stays in private; public wrappers are thin gates for PostgREST.

CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
  );
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
  WHERE p.newsletter_opt_in IS TRUE;
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
BEGIN
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Accesso riservato agli admin';
  END IF;

  IF p_status NOT IN ('sent', 'skipped', 'failed') THEN
    RAISE EXCEPTION 'Stato newsletter non valido';
  END IF;

  INSERT INTO public.newsletter_sends (user_id, events_count, status, error_message)
  VALUES (p_user_id, COALESCE(p_events_count, 0), p_status, p_error_message);

  IF p_status = 'sent' THEN
    UPDATE public.profiles
    SET
      newsletter_last_sent_at = now(),
      updated_at = now()
    WHERE id = p_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_newsletter_recipients()
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
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT * FROM private.admin_newsletter_recipients();
$$;

CREATE OR REPLACE FUNCTION public.admin_record_newsletter_send(
  p_user_id uuid,
  p_events_count integer,
  p_status text,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.admin_record_newsletter_send(
    p_user_id,
    p_events_count,
    p_status,
    p_error_message
  );
$$;

REVOKE ALL ON FUNCTION private.current_user_is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.admin_newsletter_recipients() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.admin_record_newsletter_send(uuid, integer, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_newsletter_recipients() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_record_newsletter_send(uuid, integer, text, text) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.admin_newsletter_recipients() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_record_newsletter_send(uuid, integer, text, text) FROM anon;

GRANT EXECUTE ON FUNCTION public.admin_newsletter_recipients() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_record_newsletter_send(uuid, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_newsletter_recipients() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_record_newsletter_send(uuid, integer, text, text) TO service_role;
