-- Consenti agli admin di eliminare campagne email e destinatari

CREATE POLICY "email_campaigns_admin_delete"
  ON public.email_campaigns FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "email_campaign_recipients_admin_delete"
  ON public.email_campaign_recipients FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
