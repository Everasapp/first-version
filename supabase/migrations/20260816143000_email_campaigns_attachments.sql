-- Metadata allegati campagne email (file/immagini inviati via Resend)

ALTER TABLE public.email_campaigns
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.email_campaigns.attachments IS
  'Metadata allegati campagna: [{filename, content_type, size_bytes}]';
