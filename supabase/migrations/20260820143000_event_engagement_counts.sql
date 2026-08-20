-- Public like / view / share counters on event cards.
-- Likes stay in sync with event_favorites; shares are incremented from the client.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS favorites_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shares_count integer NOT NULL DEFAULT 0;

UPDATE public.events AS e
SET favorites_count = c.n
FROM (
  SELECT event_id, COUNT(*)::integer AS n
  FROM public.event_favorites
  GROUP BY event_id
) AS c
WHERE e.id = c.event_id;

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.sync_event_favorites_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE public.events
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS event_favorites_sync_count ON public.event_favorites;
CREATE TRIGGER event_favorites_sync_count
AFTER INSERT OR DELETE ON public.event_favorites
FOR EACH ROW
EXECUTE FUNCTION private.sync_event_favorites_count();

CREATE OR REPLACE FUNCTION private.increment_event_shares(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_event_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.events
  SET shares_count = shares_count + 1
  WHERE id = p_event_id
    AND status = 'published';
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_event_shares(event_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.increment_event_shares(event_id);
$$;

REVOKE ALL ON FUNCTION private.increment_event_shares(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_event_shares(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_event_shares(uuid) TO service_role;
