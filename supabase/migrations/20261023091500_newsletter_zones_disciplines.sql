-- Zones and disciplines for newsletter subscribers. Consent, unsubscribe tokens and existing rows stay in place.

CREATE OR REPLACE FUNCTION private.newsletter_area_for_city(p_city text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT area
  FROM (
    VALUES
    ('Aggius', 'Nord Sardegna'),
    ('Aglientu', 'Nord Sardegna'),
    ('Alà dei Sardi', 'Nord Sardegna'),
    ('Alghero', 'Nord Sardegna'),
    ('Anela', 'Nord Sardegna'),
    ('Ardara', 'Nord Sardegna'),
    ('Arzachena', 'Nord Sardegna'),
    ('Badesi', 'Nord Sardegna'),
    ('Banari', 'Nord Sardegna'),
    ('Benetutti', 'Nord Sardegna'),
    ('Berchidda', 'Nord Sardegna'),
    ('Bessude', 'Nord Sardegna'),
    ('Bonnanaro', 'Nord Sardegna'),
    ('Bono', 'Nord Sardegna'),
    ('Bonorva', 'Nord Sardegna'),
    ('Bortigiadas', 'Nord Sardegna'),
    ('Borutta', 'Nord Sardegna'),
    ('Bottidda', 'Nord Sardegna'),
    ('Buddusò', 'Nord Sardegna'),
    ('Budoni', 'Nord Sardegna'),
    ('Bultei', 'Nord Sardegna'),
    ('Bulzi', 'Nord Sardegna'),
    ('Burgos', 'Nord Sardegna'),
    ('Calangianus', 'Nord Sardegna'),
    ('Cargeghe', 'Nord Sardegna'),
    ('Castelsardo', 'Nord Sardegna'),
    ('Cheremule', 'Nord Sardegna'),
    ('Chiaramonti', 'Nord Sardegna'),
    ('Codrongianos', 'Nord Sardegna'),
    ('Cossoine', 'Nord Sardegna'),
    ('Erula', 'Nord Sardegna'),
    ('Esporlatu', 'Nord Sardegna'),
    ('Florinas', 'Nord Sardegna'),
    ('Giave', 'Nord Sardegna'),
    ('Golfo Aranci', 'Nord Sardegna'),
    ('Illorai', 'Nord Sardegna'),
    ('Isola dell''Asinara', 'Nord Sardegna'),
    ('Ittireddu', 'Nord Sardegna'),
    ('Ittiri', 'Nord Sardegna'),
    ('La Maddalena', 'Nord Sardegna'),
    ('Laerru', 'Nord Sardegna'),
    ('Loiri Porto San Paolo', 'Nord Sardegna'),
    ('Luogosanto', 'Nord Sardegna'),
    ('Luras', 'Nord Sardegna'),
    ('Mara', 'Nord Sardegna'),
    ('Martis', 'Nord Sardegna'),
    ('Monteleone Rocca Doria', 'Nord Sardegna'),
    ('Monti', 'Nord Sardegna'),
    ('Mores', 'Nord Sardegna'),
    ('Muros', 'Nord Sardegna'),
    ('Nughedu San Nicolò', 'Nord Sardegna'),
    ('Nule', 'Nord Sardegna'),
    ('Nulvi', 'Nord Sardegna'),
    ('Olbia', 'Nord Sardegna'),
    ('Olmedo', 'Nord Sardegna'),
    ('Oschiri', 'Nord Sardegna'),
    ('Osilo', 'Nord Sardegna'),
    ('Ossi', 'Nord Sardegna'),
    ('Ozieri', 'Nord Sardegna'),
    ('Padria', 'Nord Sardegna'),
    ('Padru', 'Nord Sardegna'),
    ('Palau', 'Nord Sardegna'),
    ('Pattada', 'Nord Sardegna'),
    ('Perfugas', 'Nord Sardegna'),
    ('Ploaghe', 'Nord Sardegna'),
    ('Porto Torres', 'Nord Sardegna'),
    ('Pozzomaggiore', 'Nord Sardegna'),
    ('Putifigari', 'Nord Sardegna'),
    ('Romana', 'Nord Sardegna'),
    ('San Teodoro', 'Nord Sardegna'),
    ('Sant''Antonio di Gallura', 'Nord Sardegna'),
    ('Santa Maria Coghinas', 'Nord Sardegna'),
    ('Santa Teresa Gallura', 'Nord Sardegna'),
    ('Sassari', 'Nord Sardegna'),
    ('Sedini', 'Nord Sardegna'),
    ('Semestene', 'Nord Sardegna'),
    ('Sennori', 'Nord Sardegna'),
    ('Siligo', 'Nord Sardegna'),
    ('Sorso', 'Nord Sardegna'),
    ('Stintino', 'Nord Sardegna'),
    ('Telti', 'Nord Sardegna'),
    ('Tempio Pausania', 'Nord Sardegna'),
    ('Tergu', 'Nord Sardegna'),
    ('Thiesi', 'Nord Sardegna'),
    ('Tissi', 'Nord Sardegna'),
    ('Torralba', 'Nord Sardegna'),
    ('Trinità d''Agultu e Vignola', 'Nord Sardegna'),
    ('Tula', 'Nord Sardegna'),
    ('Uri', 'Nord Sardegna'),
    ('Usini', 'Nord Sardegna'),
    ('Valledoria', 'Nord Sardegna'),
    ('Viddalba', 'Nord Sardegna'),
    ('Villanova Monteleone', 'Nord Sardegna'),
    ('Aritzo', 'Centro Sardegna'),
    ('Atzara', 'Centro Sardegna'),
    ('Austis', 'Centro Sardegna'),
    ('Baunei', 'Centro Sardegna'),
    ('Baressa', 'Centro Sardegna'),
    ('Belvì', 'Centro Sardegna'),
    ('Bitti', 'Centro Sardegna'),
    ('Bosa', 'Centro Sardegna'),
    ('Cabras', 'Centro Sardegna'),
    ('Desulo', 'Centro Sardegna'),
    ('Dorgali', 'Centro Sardegna'),
    ('Fonni', 'Centro Sardegna'),
    ('Gadoni', 'Centro Sardegna'),
    ('Gavoi', 'Centro Sardegna'),
    ('Girasole', 'Centro Sardegna'),
    ('Lanusei', 'Centro Sardegna'),
    ('Lodine', 'Centro Sardegna'),
    ('Lollove', 'Centro Sardegna'),
    ('Lula', 'Centro Sardegna'),
    ('Macomer', 'Centro Sardegna'),
    ('Mamoiada', 'Centro Sardegna'),
    ('Meana Sardo', 'Centro Sardegna'),
    ('Nuoro', 'Centro Sardegna'),
    ('Oliena', 'Centro Sardegna'),
    ('Ollolai', 'Centro Sardegna'),
    ('Olzai', 'Centro Sardegna'),
    ('Onanì', 'Centro Sardegna'),
    ('Oniferi', 'Centro Sardegna'),
    ('Orani', 'Centro Sardegna'),
    ('Orgosolo', 'Centro Sardegna'),
    ('Oristano', 'Centro Sardegna'),
    ('Nurachi', 'Centro Sardegna'),
    ('Orosei', 'Centro Sardegna'),
    ('Orotelli', 'Centro Sardegna'),
    ('Ortueri', 'Centro Sardegna'),
    ('Orune', 'Centro Sardegna'),
    ('Ottana', 'Centro Sardegna'),
    ('Ovodda', 'Centro Sardegna'),
    ('Santa Maria Navarrese', 'Centro Sardegna'),
    ('Sarule', 'Centro Sardegna'),
    ('Scano di Montiferro', 'Centro Sardegna'),
    ('Seneghe', 'Centro Sardegna'),
    ('Siniscola', 'Centro Sardegna'),
    ('Sorgono', 'Centro Sardegna'),
    ('Tiana', 'Centro Sardegna'),
    ('Tonara', 'Centro Sardegna'),
    ('Tortolì', 'Centro Sardegna'),
    ('Zeddiani', 'Centro Sardegna'),
    ('Armungia', 'Sud Sardegna'),
    ('Assemini', 'Sud Sardegna'),
    ('Ballao', 'Sud Sardegna'),
    ('Barrali', 'Sud Sardegna'),
    ('Burcei', 'Sud Sardegna'),
    ('Cagliari', 'Sud Sardegna'),
    ('Capoterra', 'Sud Sardegna'),
    ('Castiadas', 'Sud Sardegna'),
    ('Decimomannu', 'Sud Sardegna'),
    ('Decimoputzu', 'Sud Sardegna'),
    ('Dolianova', 'Sud Sardegna'),
    ('Domus de Maria', 'Sud Sardegna'),
    ('Donori', 'Sud Sardegna'),
    ('Elmas', 'Sud Sardegna'),
    ('Escalaplano', 'Sud Sardegna'),
    ('Escolca', 'Sud Sardegna'),
    ('Esterzili', 'Sud Sardegna'),
    ('Genoni', 'Sud Sardegna'),
    ('Gergei', 'Sud Sardegna'),
    ('Gesico', 'Sud Sardegna'),
    ('Goni', 'Sud Sardegna'),
    ('Guamaggiore', 'Sud Sardegna'),
    ('Guasila', 'Sud Sardegna'),
    ('Guspini', 'Sud Sardegna'),
    ('Isili', 'Sud Sardegna'),
    ('Mandas', 'Sud Sardegna'),
    ('Maracalagonis', 'Sud Sardegna'),
    ('Monastir', 'Sud Sardegna'),
    ('Monserrato', 'Sud Sardegna'),
    ('Mogoro', 'Sud Sardegna'),
    ('Muravera', 'Sud Sardegna'),
    ('Nuragus', 'Sud Sardegna'),
    ('Nurallao', 'Sud Sardegna'),
    ('Nuraminis', 'Sud Sardegna'),
    ('Nurri', 'Sud Sardegna'),
    ('Orroli', 'Sud Sardegna'),
    ('Ortacesus', 'Sud Sardegna'),
    ('Pimentel', 'Sud Sardegna'),
    ('Pula', 'Sud Sardegna'),
    ('Quartu Sant''Elena', 'Sud Sardegna'),
    ('Quartucciu', 'Sud Sardegna'),
    ('Sadali', 'Sud Sardegna'),
    ('Samatzai', 'Sud Sardegna'),
    ('Samugheo', 'Sud Sardegna'),
    ('San Basilio', 'Sud Sardegna'),
    ('San Nicolò Gerrei', 'Sud Sardegna'),
    ('San Sperate', 'Sud Sardegna'),
    ('San Vito', 'Sud Sardegna'),
    ('Sanluri', 'Sud Sardegna'),
    ('Sant''Andrea Frius', 'Sud Sardegna'),
    ('Sarroch', 'Sud Sardegna'),
    ('Selargius', 'Sud Sardegna'),
    ('Selegas', 'Sud Sardegna'),
    ('Senorbì', 'Sud Sardegna'),
    ('Serdiana', 'Sud Sardegna'),
    ('Serri', 'Sud Sardegna'),
    ('Sestu', 'Sud Sardegna'),
    ('Seulo', 'Sud Sardegna'),
    ('Settimo San Pietro', 'Sud Sardegna'),
    ('Siddi', 'Sud Sardegna'),
    ('Siliqua', 'Sud Sardegna'),
    ('Silius', 'Sud Sardegna'),
    ('Sinnai', 'Sud Sardegna'),
    ('Siurgus Donigala', 'Sud Sardegna'),
    ('Soleminis', 'Sud Sardegna'),
    ('Suelli', 'Sud Sardegna'),
    ('Ussana', 'Sud Sardegna'),
    ('Seui', 'Sud Sardegna'),
    ('Uta', 'Sud Sardegna'),
    ('Vallermosa', 'Sud Sardegna'),
    ('Villa San Pietro', 'Sud Sardegna'),
    ('Villanova Tulo', 'Sud Sardegna'),
    ('Barumini', 'Sud Sardegna'),
    ('Villacidro', 'Sud Sardegna'),
    ('Villanovaforru', 'Sud Sardegna'),
    ('Villaputzu', 'Sud Sardegna'),
    ('Villasalto', 'Sud Sardegna'),
    ('Villasimius', 'Sud Sardegna'),
    ('Villasor', 'Sud Sardegna'),
    ('Villaspeciosa', 'Sud Sardegna'),
    ('Carbonia', 'Sud Sardegna'),
    ('Domusnovas', 'Sud Sardegna'),
    ('San Giovanni Suergiu', 'Sud Sardegna'),
    ('Carloforte', 'Sud Sardegna'),
    ('Gonnesa', 'Sud Sardegna'),
    ('Iglesias', 'Sud Sardegna'),
    ('Narcao', 'Sud Sardegna'),
    ('Portoscuso', 'Sud Sardegna'),
    ('Sant''Antioco', 'Sud Sardegna')
  ) AS places(city, area)
  WHERE places.city = trim(COALESCE(p_city, ''))
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION private.newsletter_area_for_province(p_province text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE lower(trim(COALESCE(p_province, '')))
    WHEN 'ss' THEN 'Nord Sardegna'
    WHEN 'sassari' THEN 'Nord Sardegna'
    WHEN 'ot' THEN 'Nord Sardegna'
    WHEN 'olbia-tempio' THEN 'Nord Sardegna'
    WHEN 'olbia tempio' THEN 'Nord Sardegna'
    WHEN 'nu' THEN 'Centro Sardegna'
    WHEN 'nuoro' THEN 'Centro Sardegna'
    WHEN 'or' THEN 'Centro Sardegna'
    WHEN 'oristano' THEN 'Centro Sardegna'
    WHEN 'og' THEN 'Centro Sardegna'
    WHEN 'ogliastra' THEN 'Centro Sardegna'
    WHEN 'ca' THEN 'Sud Sardegna'
    WHEN 'cagliari' THEN 'Sud Sardegna'
    WHEN 'su' THEN 'Sud Sardegna'
    WHEN 'sud sardegna' THEN 'Sud Sardegna'
    WHEN 'ci' THEN 'Sud Sardegna'
    WHEN 'vs' THEN 'Sud Sardegna'
    ELSE NULL
  END
$$;

CREATE OR REPLACE FUNCTION private.newsletter_disciplines_from_legacy(p_category text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT COALESCE(array_agg(DISTINCT mapped), '{}'::text[])
  FROM (
    SELECT CASE trim(part)
      WHEN 'natura-saperi' THEN 'natura-saperi'
      WHEN 'famiglie-bambini' THEN 'laboratori-bambini'
      WHEN 'musica-concerti' THEN 'musica'
      WHEN 'spettacoli' THEN 'musica'
      ELSE NULL
    END AS mapped
    FROM unnest(string_to_array(COALESCE(p_category, ''), ',')) AS part
  ) mapped_parts
  WHERE mapped IS NOT NULL
$$;

CREATE OR REPLACE FUNCTION private.newsletter_selection_valid(
  p_areas text[],
  p_disciplines text[],
  p_require_disciplines boolean
)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN
    p_areas IS NOT NULL
    AND p_disciplines IS NOT NULL
    AND cardinality(p_areas) BETWEEN 1 AND 3
    AND p_areas <@ ARRAY['Nord Sardegna', 'Centro Sardegna', 'Sud Sardegna']::text[]
    AND cardinality(p_areas) = (SELECT count(DISTINCT value) FROM unnest(p_areas) AS value)
    AND cardinality(p_disciplines) <= 5
    AND (NOT p_require_disciplines OR cardinality(p_disciplines) >= 1)
    AND p_disciplines <@ ARRAY['digitale-informatica', 'marketing-comunicazione', 'amministrazione-contabilita', 'gestione-impresa', 'risorse-umane', 'sicurezza-lavoro', 'competenze-tecniche', 'salute-sanita', 'educazione-didattica', 'competenze-trasversali', 'enologia-sommellerie', 'lingue', 'fotografia-video', 'ceramica', 'pittura-disegno', 'artigianato-tessitura', 'musica', 'teatro', 'cucina', 'benessere-movimento', 'ambiente-sostenibilita', 'natura-saperi', 'laboratori-bambini']::text[]
    AND cardinality(p_disciplines) = (SELECT count(DISTINCT value) FROM unnest(p_disciplines) AS value);
END;
$$;

CREATE OR REPLACE FUNCTION private.save_newsletter_subscriber(
  p_email text,
  p_areas text[],
  p_disciplines text[],
  p_require_disciplines boolean
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email text;
  v_areas text[];
  v_disciplines text[];
  v_existing public.newsletter_subscribers%ROWTYPE;
BEGIN
  v_email := lower(trim(COALESCE(p_email, '')));
  v_areas := ARRAY(
    SELECT zone
    FROM unnest(ARRAY['Nord Sardegna', 'Centro Sardegna', 'Sud Sardegna']::text[]) AS zone
    WHERE zone = ANY(COALESCE(p_areas, '{}'::text[]))
  );
  v_disciplines := ARRAY(
    SELECT slug
    FROM unnest(ARRAY['digitale-informatica', 'marketing-comunicazione', 'amministrazione-contabilita', 'gestione-impresa', 'risorse-umane', 'sicurezza-lavoro', 'competenze-tecniche', 'salute-sanita', 'educazione-didattica', 'competenze-trasversali', 'enologia-sommellerie', 'lingue', 'fotografia-video', 'ceramica', 'pittura-disegno', 'artigianato-tessitura', 'musica', 'teatro', 'cucina', 'benessere-movimento', 'ambiente-sostenibilita', 'natura-saperi', 'laboratori-bambini']::text[]) AS slug
    WHERE slug = ANY(COALESCE(p_disciplines, '{}'::text[]))
  );

  IF v_email = '' OR v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Email non valida';
  END IF;
  IF NOT private.newsletter_selection_valid(v_areas, v_disciplines, p_require_disciplines) THEN
    RAISE EXCEPTION 'Scegli da 1 a 3 zone e da 1 a 5 discipline';
  END IF;

  SELECT * INTO v_existing
  FROM public.newsletter_subscribers AS subscriber
  WHERE subscriber.email = v_email;

  IF FOUND THEN
    IF v_existing.opt_in
      AND v_existing.areas = v_areas
      AND v_existing.disciplines = v_disciplines THEN
      RETURN 'already';
    END IF;

    UPDATE public.newsletter_subscribers
    SET
      areas = v_areas,
      disciplines = v_disciplines,
      city = CASE
        WHEN cardinality(v_areas) = 1
          AND private.newsletter_area_for_city(city) = v_areas[1]
          THEN city
        ELSE array_to_string(v_areas, ', ')
      END,
      category = array_to_string(v_disciplines, ','),
      opt_in = true,
      opted_at = now(),
      updated_at = now()
    WHERE id = v_existing.id;
    RETURN 'updated';
  END IF;

  INSERT INTO public.newsletter_subscribers (
    email, city, category, areas, disciplines, opt_in, opted_at
  )
  VALUES (
    v_email,
    array_to_string(v_areas, ', '),
    array_to_string(v_disciplines, ','),
    v_areas,
    v_disciplines,
    true,
    now()
  );
  RETURN 'subscribed';
END;
$$;

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS areas text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS disciplines text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS newsletter_areas text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS newsletter_disciplines text[] NOT NULL DEFAULT '{}';

UPDATE public.newsletter_subscribers
SET areas = ARRAY[private.newsletter_area_for_city(city)]::text[]
WHERE cardinality(areas) = 0
  AND private.newsletter_area_for_city(city) IS NOT NULL;

UPDATE public.newsletter_subscribers
SET disciplines = private.newsletter_disciplines_from_legacy(category)
WHERE cardinality(disciplines) = 0
  AND btrim(COALESCE(category, '')) <> '';

UPDATE public.profiles
SET newsletter_areas = ARRAY[private.newsletter_area_for_city(newsletter_city)]::text[]
WHERE newsletter_opt_in IS TRUE
  AND cardinality(newsletter_areas) = 0
  AND private.newsletter_area_for_city(newsletter_city) IS NOT NULL;

UPDATE public.profiles
SET newsletter_disciplines = private.newsletter_disciplines_from_legacy(newsletter_category)
WHERE newsletter_opt_in IS TRUE
  AND cardinality(newsletter_disciplines) = 0
  AND btrim(COALESCE(newsletter_category, '')) <> '';

UPDATE public.profiles
SET newsletter_areas = ARRAY[private.newsletter_area_for_city(municipality)]::text[]
WHERE newsletter_opt_in IS TRUE
  AND cardinality(newsletter_areas) = 0
  AND private.newsletter_area_for_city(municipality) IS NOT NULL;

UPDATE public.profiles
SET newsletter_areas = ARRAY[private.newsletter_area_for_province(province)]::text[]
WHERE newsletter_opt_in IS TRUE
  AND cardinality(newsletter_areas) = 0
  AND private.newsletter_area_for_province(province) IS NOT NULL;

-- A saved opt-in with no recognizable place still receives the whole island.
UPDATE public.profiles
SET newsletter_areas = ARRAY['Nord Sardegna', 'Centro Sardegna', 'Sud Sardegna']::text[]
WHERE newsletter_opt_in IS TRUE
  AND cardinality(newsletter_areas) = 0;

UPDATE public.newsletter_subscribers
SET areas = ARRAY['Nord Sardegna', 'Centro Sardegna', 'Sud Sardegna']::text[]
WHERE opt_in IS TRUE
  AND cardinality(areas) = 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.newsletter_subscribers
    WHERE opt_in IS TRUE AND cardinality(areas) = 0
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE newsletter_opt_in IS TRUE AND cardinality(newsletter_areas) = 0
  ) THEN
    RAISE EXCEPTION 'Iscrizione newsletter senza zona dopo la conversione';
  END IF;
END $$;

ALTER TABLE public.newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_selection_valid;
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_selection_valid
  CHECK (
    (NOT opt_in)
    OR private.newsletter_selection_valid(areas, disciplines, false)
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_newsletter_selection_valid;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_newsletter_selection_valid
  CHECK (
    (NOT newsletter_opt_in)
    OR private.newsletter_selection_valid(newsletter_areas, newsletter_disciplines, false)
  );

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  p_email text,
  p_areas text[],
  p_disciplines text[]
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN private.save_newsletter_subscriber(p_email, p_areas, p_disciplines, true);
END;
$$;

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  p_email text,
  p_city text,
  p_category text DEFAULT ''
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_area text;
BEGIN
  v_area := private.newsletter_area_for_city(p_city);
  IF v_area IS NULL THEN
    RAISE EXCEPTION 'Seleziona una città';
  END IF;
  RETURN private.save_newsletter_subscriber(
    p_email,
    ARRAY[v_area],
    private.newsletter_disciplines_from_legacy(p_category),
    false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_newsletter(text, text[], text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.subscribe_newsletter(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text[], text[]) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text, text, text) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION private.newsletter_area_for_city(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.newsletter_area_for_province(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.newsletter_disciplines_from_legacy(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.newsletter_selection_valid(text[], text[], boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.save_newsletter_subscriber(text, text[], text[], boolean) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wants_newsletter boolean := COALESCE(new.raw_user_meta_data ->> 'newsletter_opt_in', 'false') IN ('true', '1', 'yes');
  preferred_city text := nullif(trim(COALESCE(new.raw_user_meta_data ->> 'newsletter_city', '')), '');
  preferred_category text := nullif(trim(COALESCE(new.raw_user_meta_data ->> 'newsletter_category', '')), '');
  supplied_disciplines boolean := jsonb_typeof(new.raw_user_meta_data -> 'newsletter_disciplines') = 'array';
  preferred_areas text[] := CASE
    WHEN jsonb_typeof(new.raw_user_meta_data -> 'newsletter_areas') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data -> 'newsletter_areas'))
    ELSE '{}'::text[]
  END;
  preferred_disciplines text[] := CASE
    WHEN supplied_disciplines
      THEN ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data -> 'newsletter_disciplines'))
    ELSE '{}'::text[]
  END;
BEGIN
  IF cardinality(preferred_areas) = 0 AND preferred_city IS NOT NULL THEN
    preferred_areas := ARRAY[private.newsletter_area_for_city(preferred_city)];
  END IF;
  preferred_areas := array_remove(preferred_areas, NULL);
  IF cardinality(preferred_disciplines) = 0 AND NOT supplied_disciplines THEN
    preferred_disciplines := private.newsletter_disciplines_from_legacy(preferred_category);
  END IF;

  IF wants_newsletter AND NOT private.newsletter_selection_valid(
    preferred_areas,
    COALESCE(preferred_disciplines, '{}'::text[]),
    supplied_disciplines
  ) THEN
    RAISE EXCEPTION 'Per la newsletter scegli da 1 a 3 zone e da 1 a 5 discipline';
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    newsletter_opt_in,
    newsletter_city,
    newsletter_category,
    newsletter_areas,
    newsletter_disciplines,
    newsletter_opted_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    'utente'::public.user_role,
    wants_newsletter,
    CASE WHEN wants_newsletter THEN preferred_city ELSE NULL END,
    CASE WHEN wants_newsletter THEN array_to_string(preferred_disciplines, ',') ELSE NULL END,
    CASE WHEN wants_newsletter THEN preferred_areas ELSE '{}'::text[] END,
    CASE WHEN wants_newsletter THEN COALESCE(preferred_disciplines, '{}'::text[]) ELSE '{}'::text[] END,
    CASE WHEN wants_newsletter THEN now() ELSE NULL END
  );

  RETURN new;
END;
$$;

DROP FUNCTION IF EXISTS public.admin_newsletter_recipients();
DROP FUNCTION IF EXISTS private.admin_newsletter_recipients();

CREATE FUNCTION private.admin_newsletter_recipients()
RETURNS TABLE (
  id uuid,
  full_name text,
  municipality text,
  province text,
  newsletter_city text,
  newsletter_category text,
  newsletter_unsub_token uuid,
  email text,
  email_confirmed boolean,
  newsletter_areas text[],
  newsletter_disciplines text[]
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
    profile.id,
    profile.full_name,
    profile.municipality,
    profile.province,
    profile.newsletter_city,
    profile.newsletter_category,
    profile.newsletter_unsub_token,
    account.email::text,
    (account.email_confirmed_at IS NOT NULL),
    profile.newsletter_areas,
    profile.newsletter_disciplines
  FROM public.profiles AS profile
  INNER JOIN auth.users AS account ON account.id = profile.id
  WHERE profile.newsletter_opt_in IS TRUE

  UNION ALL

  SELECT
    subscriber.id,
    NULL::text,
    subscriber.city,
    NULL::text,
    subscriber.city,
    subscriber.category,
    subscriber.unsub_token,
    subscriber.email::text,
    true,
    subscriber.areas,
    subscriber.disciplines
  FROM public.newsletter_subscribers AS subscriber
  WHERE subscriber.opt_in IS TRUE
    AND NOT EXISTS (
      SELECT 1
      FROM public.profiles AS profile
      INNER JOIN auth.users AS account ON account.id = profile.id
      WHERE profile.newsletter_opt_in IS TRUE
        AND lower(account.email) = lower(subscriber.email)
    );
END;
$$;

CREATE FUNCTION public.admin_newsletter_recipients()
RETURNS TABLE (
  id uuid,
  full_name text,
  municipality text,
  province text,
  newsletter_city text,
  newsletter_category text,
  newsletter_unsub_token uuid,
  email text,
  email_confirmed boolean,
  newsletter_areas text[],
  newsletter_disciplines text[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT * FROM private.admin_newsletter_recipients();
$$;

REVOKE ALL ON FUNCTION private.admin_newsletter_recipients() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_newsletter_recipients() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_newsletter_recipients() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_newsletter_recipients() TO authenticated, service_role;

NOTIFY pgrst, 'reload schema';
