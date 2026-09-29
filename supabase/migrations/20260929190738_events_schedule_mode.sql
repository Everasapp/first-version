-- Editorial calendar classification for temporal landings (oggi / weekend / …).
-- Additive only: column + default + NOT NULL + allowed values.
-- Default `single` keeps existing rows compatible without backfill.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS schedule_mode text NOT NULL DEFAULT 'single';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_schedule_mode_check'
      AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_schedule_mode_check
      CHECK (
        schedule_mode = ANY (
          ARRAY[
            'single'::text,
            'continuous'::text,
            'series'::text,
            'container'::text
          ]
        )
      );
  END IF;
END $$;

COMMENT ON COLUMN public.events.schedule_mode IS
  'single | continuous | series | container — controls inclusion on daily/weekend landings';
