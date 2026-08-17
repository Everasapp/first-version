-- Merge spettacoli into musica-concerti and add Locali e ballo.

UPDATE public.events
SET category = 'musica-concerti'
WHERE category = 'spettacoli';

UPDATE public.events
SET categories = ARRAY(
  SELECT DISTINCT
    CASE
      WHEN c = 'spettacoli' THEN 'musica-concerti'
      ELSE c
    END
  FROM unnest(categories) AS c
)
WHERE categories && ARRAY['spettacoli']::text[];

UPDATE public.profiles
SET newsletter_category = 'musica-concerti'
WHERE newsletter_category = 'spettacoli';

UPDATE public.categories
SET name = 'Musica e spettacoli'
WHERE slug = 'musica-concerti';

UPDATE public.categories
SET is_active = false
WHERE slug = 'spettacoli';

INSERT INTO public.categories (name, slug, sort_order, is_active)
VALUES ('Locali e ballo', 'locali-ballo', 3, true)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  is_active = true,
  sort_order = EXCLUDED.sort_order;
