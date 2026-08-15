-- Multi-category support: keep `category` as primary (first slug),
-- store all selected slugs in `categories` (1–3 items).

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}';

UPDATE public.events
SET categories = ARRAY[category]
WHERE category IS NOT NULL
  AND category <> ''
  AND (categories = '{}' OR categories IS NULL);

-- Legacy safety: if category is empty but somehow needed, leave as-is;
-- enforce cardinality only where we have data after backfill.
UPDATE public.events
SET categories = ARRAY[COALESCE(NULLIF(category, ''), 'celebrazioni')]
WHERE categories = '{}' OR categories IS NULL;

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_categories_cardinality_check;

ALTER TABLE public.events
  ADD CONSTRAINT events_categories_cardinality_check
  CHECK (
    cardinality(categories) >= 1
    AND cardinality(categories) <= 3
  );

CREATE INDEX IF NOT EXISTS events_categories_gin_idx
  ON public.events
  USING GIN (categories);
