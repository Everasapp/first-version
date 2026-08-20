-- Community layer: RSVPs, lightweight public profile fields, and future moderation tables.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS interests text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS open_to_meeting boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_in_community boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.display_name IS
  'Nome visibile nella community eventi. Non usare per email o dati di contatto.';
COMMENT ON COLUMN public.profiles.interests IS
  'Slug di categorie scelti dalla persona, massimo 6 lato applicazione.';
COMMENT ON COLUMN public.profiles.open_to_meeting IS
  'Preferenza facoltativa: aperta a conoscere persone nuove agli eventi.';
COMMENT ON COLUMN public.profiles.show_in_community IS
  'Se false, la persona conta nel totale RSVP ma non compare nell’elenco.';

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS rsvps_count integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'going'
    CHECK (status = 'going'),
  social_intent text
    CHECK (social_intent IS NULL OR social_intent IN ('solo', 'meet', 'friends')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_rsvps_event_id_idx ON public.event_rsvps (event_id);
CREATE INDEX IF NOT EXISTS event_rsvps_user_id_idx ON public.event_rsvps (user_id);

CREATE TABLE IF NOT EXISTS public.community_blocks (
  blocker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS public.community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  reason text,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewed', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_reports_status_idx
  ON public.community_reports (status, created_at DESC);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_rsvps_select_own ON public.event_rsvps;
CREATE POLICY event_rsvps_select_own
  ON public.event_rsvps
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS event_rsvps_insert_own ON public.event_rsvps;
CREATE POLICY event_rsvps_insert_own
  ON public.event_rsvps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.events e
      WHERE e.id = event_id
        AND e.status = 'published'
    )
  );

DROP POLICY IF EXISTS event_rsvps_update_own ON public.event_rsvps;
CREATE POLICY event_rsvps_update_own
  ON public.event_rsvps
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS event_rsvps_delete_own ON public.event_rsvps;
CREATE POLICY event_rsvps_delete_own
  ON public.event_rsvps
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS event_rsvps_admin_select ON public.event_rsvps;
CREATE POLICY event_rsvps_admin_select
  ON public.event_rsvps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS community_blocks_own ON public.community_blocks;
CREATE POLICY community_blocks_own
  ON public.community_blocks
  FOR ALL
  TO authenticated
  USING (blocker_id = auth.uid())
  WITH CHECK (blocker_id = auth.uid());

DROP POLICY IF EXISTS community_reports_insert_own ON public.community_reports;
CREATE POLICY community_reports_insert_own
  ON public.community_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS community_reports_select_own ON public.community_reports;
CREATE POLICY community_reports_select_own
  ON public.community_reports
  FOR SELECT
  TO authenticated
  USING (
    reporter_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS community_reports_admin_update ON public.community_reports;
CREATE POLICY community_reports_admin_update
  ON public.community_reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.sync_event_rsvps_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events
    SET rsvps_count = rsvps_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE public.events
    SET rsvps_count = GREATEST(rsvps_count - 1, 0)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS event_rsvps_sync_count ON public.event_rsvps;
CREATE TRIGGER event_rsvps_sync_count
AFTER INSERT OR DELETE ON public.event_rsvps
FOR EACH ROW
EXECUTE FUNCTION private.sync_event_rsvps_count();

CREATE OR REPLACE FUNCTION private.can_view_event_community(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.events e
    WHERE e.id = p_event_id
      AND (
        e.status = 'published'
        OR e.organizer_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION private.event_community_summary(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  going integer;
  meet integer;
BEGIN
  IF auth.uid() IS NULL
     OR p_event_id IS NULL
     OR NOT private.can_view_event_community(p_event_id) THEN
    RETURN jsonb_build_object('going_count', 0, 'meet_count', 0);
  END IF;

  SELECT COUNT(*)::integer INTO going
  FROM public.event_rsvps r
  WHERE r.event_id = p_event_id
    AND r.status = 'going';

  SELECT COUNT(*)::integer INTO meet
  FROM public.event_rsvps r
  JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = p_event_id
    AND r.status = 'going'
    AND (
      r.social_intent = 'meet'
      OR (r.social_intent IS NULL AND p.open_to_meeting)
    );

  RETURN jsonb_build_object(
    'going_count', COALESCE(going, 0),
    'meet_count', COALESCE(meet, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION private.event_community_preview(p_event_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL
     OR p_event_id IS NULL
     OR NOT private.can_view_event_community(p_event_id) THEN
    RETURN '[]'::jsonb;
  END IF;

  RETURN COALESCE((
    SELECT jsonb_agg(to_jsonb(t) - 'sort_at' ORDER BY t.sort_at)
    FROM (
      SELECT
        r.user_id,
        COALESCE(
          NULLIF(btrim(p.display_name), ''),
          NULLIF(split_part(COALESCE(p.full_name, ''), ' ', 1), ''),
          'Persona su Everas'
        ) AS display_name,
        p.avatar_url,
        COALESCE(p.interests, '{}'::text[]) AS interests,
        r.social_intent,
        (
          r.social_intent = 'meet'
          OR (r.social_intent IS NULL AND p.open_to_meeting)
        ) AS open_to_meeting,
        r.created_at AS sort_at
      FROM public.event_rsvps r
      JOIN public.profiles p ON p.id = r.user_id
      WHERE r.event_id = p_event_id
        AND r.status = 'going'
        AND p.show_in_community IS DISTINCT FROM false
        AND NOT EXISTS (
          SELECT 1
          FROM public.community_blocks b
          WHERE (b.blocker_id = auth.uid() AND b.blocked_id = r.user_id)
             OR (b.blocker_id = r.user_id AND b.blocked_id = auth.uid())
        )
      ORDER BY r.created_at ASC
      LIMIT 12
    ) t
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.event_community_summary(p_event_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.event_community_summary(p_event_id);
$$;

CREATE OR REPLACE FUNCTION public.event_community_preview(p_event_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.event_community_preview(p_event_id);
$$;

REVOKE ALL ON FUNCTION private.can_view_event_community(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.event_community_summary(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.event_community_preview(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.event_community_summary(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.event_community_preview(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.event_community_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.event_community_summary(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.event_community_preview(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.event_community_preview(uuid) TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_rsvps TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.community_blocks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.community_reports TO authenticated;
GRANT ALL ON public.event_rsvps TO service_role;
GRANT ALL ON public.community_blocks TO service_role;
GRANT ALL ON public.community_reports TO service_role;
