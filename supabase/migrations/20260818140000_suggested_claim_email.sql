-- Returns one outreach email for an unclaimed organizer, without exposing
-- the full contact row. Used to prefill signup when claiming a profile.

CREATE OR REPLACE FUNCTION private.suggested_claim_email(p_directory_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  raw_fields text[];
  raw text;
  part text;
BEGIN
  IF p_directory_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT ARRAY[
    NULLIF(btrim(email_eventi), ''),
    NULLIF(btrim(email), ''),
    NULLIF(btrim(email_cultura), ''),
    NULLIF(btrim(email_turismo), '')
  ]
  INTO raw_fields
  FROM public.organizer_directory
  WHERE id = p_directory_id
    AND claimed_by_profile_id IS NULL;

  IF raw_fields IS NULL THEN
    RETURN NULL;
  END IF;

  FOREACH raw IN ARRAY raw_fields
  LOOP
    IF raw IS NULL THEN
      CONTINUE;
    END IF;

    FOREACH part IN ARRAY regexp_split_to_array(lower(raw), '[;,[:space:]]+')
    LOOP
      IF part ~* '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$'
         AND position('pec' in part) = 0
         AND position('protocollo' in part) = 0
      THEN
        RETURN part;
      END IF;
    END LOOP;
  END LOOP;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.suggested_claim_email(p_directory_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT private.suggested_claim_email(p_directory_id);
$$;

REVOKE ALL ON FUNCTION private.suggested_claim_email(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.suggested_claim_email(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.suggested_claim_email(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.suggested_claim_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.suggested_claim_email(uuid) TO service_role;
