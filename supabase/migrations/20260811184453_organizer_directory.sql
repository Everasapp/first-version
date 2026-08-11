-- Unclaimed/claimed institutional organizer contacts (not tied to auth.users)
CREATE TABLE IF NOT EXISTS public.organizer_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  email text,
  pec text,
  phone text,
  address text,
  facebook text,
  instagram text,
  email_cultura text,
  email_turismo text,
  email_eventi text,
  claim_status text NOT NULL DEFAULT 'unclaimed'
    CHECK (claim_status IN ('unclaimed', 'claimed')),
  claimed_by_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sources jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS organizer_directory_claim_status_idx
  ON public.organizer_directory (claim_status);

CREATE INDEX IF NOT EXISTS organizer_directory_name_idx
  ON public.organizer_directory (name);

ALTER TABLE public.organizer_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizer_directory_admin_select"
  ON public.organizer_directory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "organizer_directory_admin_insert"
  ON public.organizer_directory
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "organizer_directory_admin_update"
  ON public.organizer_directory
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "organizer_directory_admin_delete"
  ON public.organizer_directory
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizer_directory TO authenticated;
GRANT ALL ON public.organizer_directory TO service_role;
