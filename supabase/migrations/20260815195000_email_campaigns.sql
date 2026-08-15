-- Email campaigns (admin outreach via Resend)

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body_text text NOT NULL,
  body_html text NOT NULL,
  from_email text NOT NULL,
  reply_to text NOT NULL DEFAULT 'info@everas.it',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sending', 'sent', 'partial', 'failed')),
  total_recipients integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.email_campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  error text,
  resend_id text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_campaigns_created_at_idx
  ON public.email_campaigns (created_at DESC);

CREATE INDEX IF NOT EXISTS email_campaign_recipients_campaign_id_idx
  ON public.email_campaign_recipients (campaign_id);

CREATE INDEX IF NOT EXISTS email_campaign_recipients_email_idx
  ON public.email_campaign_recipients (email);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_campaigns_admin_select"
  ON public.email_campaigns FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "email_campaigns_admin_insert"
  ON public.email_campaigns FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "email_campaigns_admin_update"
  ON public.email_campaigns FOR UPDATE TO authenticated
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

CREATE POLICY "email_campaign_recipients_admin_select"
  ON public.email_campaign_recipients FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "email_campaign_recipients_admin_insert"
  ON public.email_campaign_recipients FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "email_campaign_recipients_admin_update"
  ON public.email_campaign_recipients FOR UPDATE TO authenticated
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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_campaign_recipients TO authenticated;
GRANT ALL ON public.email_campaigns TO service_role;
GRANT ALL ON public.email_campaign_recipients TO service_role;
