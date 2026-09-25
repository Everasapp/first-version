-- Newsletter signup: email + city only (category optional / empty = all).

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
