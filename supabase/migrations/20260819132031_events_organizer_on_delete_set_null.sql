-- Prevent deleting a profile from wiping all of that user's events and import logs.
ALTER TABLE public.events
  ALTER COLUMN organizer_id DROP NOT NULL;

ALTER TABLE public.events
  DROP CONSTRAINT events_organizer_id_fkey;

ALTER TABLE public.events
  ADD CONSTRAINT events_organizer_id_fkey
  FOREIGN KEY (organizer_id) REFERENCES public.profiles(id)
  ON DELETE SET NULL;

ALTER TABLE public.event_import_logs
  ALTER COLUMN admin_id DROP NOT NULL;

ALTER TABLE public.event_import_logs
  DROP CONSTRAINT event_import_logs_admin_id_fkey;

ALTER TABLE public.event_import_logs
  ADD CONSTRAINT event_import_logs_admin_id_fkey
  FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
  ON DELETE SET NULL;
