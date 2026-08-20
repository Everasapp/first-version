-- Align share increment with views so PostgREST can call it reliably
-- after the user leaves the page for WhatsApp/Instagram.

CREATE OR REPLACE FUNCTION public.increment_event_shares(event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.events
  SET shares_count = shares_count + 1
  WHERE id = event_id
    AND status = 'published';
END;
$$;

REVOKE ALL ON FUNCTION public.increment_event_shares(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO service_role;
