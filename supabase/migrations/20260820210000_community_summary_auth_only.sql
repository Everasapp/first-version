-- Attendance counts are only for logged-in users.

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

REVOKE EXECUTE ON FUNCTION public.event_community_summary(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.event_community_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.event_community_summary(uuid) TO service_role;
