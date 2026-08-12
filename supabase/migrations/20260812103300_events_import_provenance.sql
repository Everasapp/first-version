-- Provenance + directory link for admin-imported events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS organizer_directory_id uuid REFERENCES public.organizer_directory(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_name text,
  ADD COLUMN IF NOT EXISTS imported_at timestamptz,
  ADD COLUMN IF NOT EXISTS imported_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS import_method text
    CHECK (import_method IS NULL OR import_method IN ('url', 'search', 'manual')),
  ADD COLUMN IF NOT EXISTS verification_status text
    CHECK (verification_status IS NULL OR verification_status IN ('pending_verification', 'verified')),
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;

CREATE INDEX IF NOT EXISTS events_source_url_idx ON public.events (source_url);
CREATE INDEX IF NOT EXISTS events_organizer_directory_id_idx ON public.events (organizer_directory_id);
CREATE INDEX IF NOT EXISTS events_imported_by_idx ON public.events (imported_by);

CREATE TABLE IF NOT EXISTS public.event_import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  organizer_directory_id uuid REFERENCES public.organizer_directory(id) ON DELETE SET NULL,
  source_url text,
  source_name text,
  import_method text NOT NULL DEFAULT 'url'
    CHECK (import_method IN ('url', 'search', 'manual')),
  status text NOT NULL DEFAULT 'success'
    CHECK (status IN ('success', 'error', 'duplicate_skipped', 'updated')),
  error_message text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_import_logs_admin_id_idx ON public.event_import_logs (admin_id);
CREATE INDEX IF NOT EXISTS event_import_logs_event_id_idx ON public.event_import_logs (event_id);

ALTER TABLE public.event_import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_import_logs_admin_select"
  ON public.event_import_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "event_import_logs_admin_insert"
  ON public.event_import_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    AND admin_id = auth.uid()
  );

GRANT SELECT, INSERT ON public.event_import_logs TO authenticated;
GRANT ALL ON public.event_import_logs TO service_role;
