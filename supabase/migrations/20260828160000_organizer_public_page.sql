-- Dedicated public page for a claimed Comune/Pro Loco:
-- friendly slug, public-safe fields, owner-only publish RPC.
-- Emails/PEC stay off the public view.

CREATE OR REPLACE FUNCTION private.organizer_slug_base(value text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  s text;
BEGIN
  s := lower(coalesce(value, ''));
  s := replace(s, 'à', 'a');
  s := replace(s, 'á', 'a');
  s := replace(s, 'â', 'a');
  s := replace(s, 'ä', 'a');
  s := replace(s, 'è', 'e');
  s := replace(s, 'é', 'e');
  s := replace(s, 'ê', 'e');
  s := replace(s, 'ë', 'e');
  s := replace(s, 'ì', 'i');
  s := replace(s, 'í', 'i');
  s := replace(s, 'î', 'i');
  s := replace(s, 'ï', 'i');
  s := replace(s, 'ò', 'o');
  s := replace(s, 'ó', 'o');
  s := replace(s, 'ô', 'o');
  s := replace(s, 'ö', 'o');
  s := replace(s, 'ù', 'u');
  s := replace(s, 'ú', 'u');
  s := replace(s, 'û', 'u');
  s := replace(s, 'ü', 'u');
  s := replace(s, 'ç', 'c');
  s := replace(s, 'ñ', 'n');
  s := regexp_replace(s, '[^a-z0-9]+', '-', 'g');
  s := trim(both '-' from s);
  IF s = '' OR s ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN 'organizzatore';
  END IF;
  RETURN s;
END;
$$;

ALTER TABLE public.organizer_directory
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS public_description text,
  ADD COLUMN IF NOT EXISTS public_page_enabled boolean NOT NULL DEFAULT false;

DO $$
DECLARE
  rec record;
  base text;
  candidate text;
  n int;
BEGIN
  FOR rec IN
    SELECT id, name
    FROM public.organizer_directory
    WHERE slug IS NULL
    ORDER BY created_at, id
  LOOP
    base := private.organizer_slug_base(rec.name);
    candidate := base;
    n := 1;
    WHILE EXISTS (
      SELECT 1
      FROM public.organizer_directory d
      WHERE d.slug = candidate
    ) LOOP
      n := n + 1;
      candidate := base || '-' || n::text;
    END LOOP;

    UPDATE public.organizer_directory
    SET slug = candidate
    WHERE id = rec.id;
  END LOOP;
END $$;

ALTER TABLE public.organizer_directory
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS organizer_directory_slug_key
  ON public.organizer_directory (slug);

CREATE INDEX IF NOT EXISTS organizer_directory_claimed_by_idx
  ON public.organizer_directory (claimed_by_profile_id);

CREATE INDEX IF NOT EXISTS organizer_directory_public_page_idx
  ON public.organizer_directory (slug)
  WHERE public_page_enabled;

CREATE OR REPLACE FUNCTION private.assign_organizer_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  base text;
  candidate text;
  n int := 1;
BEGIN
  IF NEW.slug IS NOT NULL AND btrim(NEW.slug) <> '' THEN
    NEW.slug := private.organizer_slug_base(NEW.slug);
    IF NEW.slug = 'organizzatore' THEN
      NEW.slug := 'organizzatore-' || replace(NEW.id::text, '-', '');
    END IF;
    RETURN NEW;
  END IF;

  base := private.organizer_slug_base(NEW.name);
  candidate := base;

  WHILE EXISTS (
    SELECT 1
    FROM public.organizer_directory d
    WHERE d.slug = candidate
      AND d.id IS DISTINCT FROM NEW.id
  ) LOOP
    n := n + 1;
    candidate := base || '-' || n::text;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS organizer_directory_assign_slug ON public.organizer_directory;
CREATE TRIGGER organizer_directory_assign_slug
BEFORE INSERT OR UPDATE OF name, slug ON public.organizer_directory
FOR EACH ROW
WHEN (NEW.slug IS NULL OR btrim(NEW.slug) = '')
EXECUTE FUNCTION private.assign_organizer_slug();

CREATE OR REPLACE VIEW public.organizer_directory_public
WITH (security_invoker = false)
AS
SELECT
  id,
  name,
  claim_status,
  claimed_by_profile_id,
  slug,
  website,
  facebook,
  instagram,
  address,
  phone,
  public_description,
  public_page_enabled
FROM public.organizer_directory;

REVOKE ALL ON public.organizer_directory_public FROM PUBLIC;
GRANT SELECT ON public.organizer_directory_public TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_organizer_public_page(
  p_directory_id uuid,
  p_website text DEFAULT NULL,
  p_facebook text DEFAULT NULL,
  p_instagram text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_enabled boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  uid uuid := (SELECT auth.uid());
  dir public.organizer_directory%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Devi accedere per aggiornare la pagina pubblica.';
  END IF;

  IF p_directory_id IS NULL THEN
    RAISE EXCEPTION 'Organizzatore non trovato.';
  END IF;

  SELECT *
  INTO dir
  FROM public.organizer_directory
  WHERE id = p_directory_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Organizzatore non trovato.';
  END IF;

  IF dir.claimed_by_profile_id IS DISTINCT FROM uid THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = uid AND p.role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Puoi aggiornare solo la pagina che hai rivendicato.';
    END IF;
  END IF;

  IF p_description IS NOT NULL AND char_length(p_description) > 2000 THEN
    RAISE EXCEPTION 'La descrizione può avere al massimo 2000 caratteri.';
  END IF;

  UPDATE public.organizer_directory
  SET
    website = CASE
      WHEN p_website IS NULL THEN website
      ELSE NULLIF(btrim(p_website), '')
    END,
    facebook = CASE
      WHEN p_facebook IS NULL THEN facebook
      ELSE NULLIF(btrim(p_facebook), '')
    END,
    instagram = CASE
      WHEN p_instagram IS NULL THEN instagram
      ELSE NULLIF(btrim(p_instagram), '')
    END,
    address = CASE
      WHEN p_address IS NULL THEN address
      ELSE NULLIF(btrim(p_address), '')
    END,
    phone = CASE
      WHEN p_phone IS NULL THEN phone
      ELSE NULLIF(btrim(p_phone), '')
    END,
    public_description = CASE
      WHEN p_description IS NULL THEN public_description
      ELSE NULLIF(btrim(p_description), '')
    END,
    public_page_enabled = COALESCE(p_enabled, public_page_enabled),
    updated_at = now()
  WHERE id = dir.id
  RETURNING * INTO dir;

  RETURN jsonb_build_object(
    'id', dir.id,
    'slug', dir.slug,
    'public_page_enabled', dir.public_page_enabled
  );
END;
$$;

REVOKE ALL ON FUNCTION public.update_organizer_public_page(
  uuid, text, text, text, text, text, text, boolean
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_organizer_public_page(
  uuid, text, text, text, text, text, text, boolean
) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_organizer_public_page(
  uuid, text, text, text, text, text, text, boolean
) TO service_role;

CREATE OR REPLACE FUNCTION private.events_apply_claimed_directory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  dir_id uuid;
BEGIN
  IF NEW.organizer_directory_id IS NOT NULL OR NEW.organizer_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT id
  INTO dir_id
  FROM public.organizer_directory
  WHERE claimed_by_profile_id = NEW.organizer_id
  ORDER BY updated_at DESC
  LIMIT 1;

  IF dir_id IS NOT NULL THEN
    NEW.organizer_directory_id := dir_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_apply_claimed_directory ON public.events;
CREATE TRIGGER events_apply_claimed_directory
BEFORE INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION private.events_apply_claimed_directory();
