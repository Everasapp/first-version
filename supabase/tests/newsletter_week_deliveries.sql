-- Run only against a disposable database, after applying the delivery migration.
-- All fixtures and delivery claims are rolled back. No provider is contacted.
BEGIN;
SELECT set_config('request.jwt.claims', '{"role":"service_role"}', true);
DO $$
DECLARE first_claim jsonb; second_claim jsonb; snapshot jsonb;
BEGIN
  first_claim := public.claim_newsletter_delivery('test:atomic','2099-01-05','newsletter/2099-01-05/test:atomic');
  second_claim := public.claim_newsletter_delivery('test:atomic','2099-01-05','different-key');
  ASSERT first_claim->>'action' = 'send', 'first claim must send';
  ASSERT second_claim->>'action' = 'skip', 'duplicate claim must skip';
  ASSERT (SELECT count(*) FROM public.newsletter_week_deliveries WHERE recipient_key='test:atomic')=1;
  snapshot := public.stage_newsletter_body('test:atomic','2099-01-05','First subject','<p>First</p>');
  snapshot := public.stage_newsletter_body('test:atomic','2099-01-05','Changed subject','<p>Changed</p>');
  ASSERT snapshot->>'subject' = 'First subject' AND snapshot->>'html' = '<p>First</p>', 'snapshot must stay fixed';
  PERFORM public.complete_newsletter_delivery('test:atomic','2099-01-05','sent',3,NULL);
  ASSERT (SELECT events_count=3 FROM public.newsletter_week_deliveries WHERE recipient_key='test:atomic');
  ASSERT public.claim_newsletter_delivery('test:atomic','2099-01-05','new-key')->>'action' = 'skip';
END $$;

DO $$
DECLARE state text; decision jsonb;
BEGIN
  FOREACH state IN ARRAY ARRAY['sending','failed'] LOOP
    INSERT INTO public.newsletter_week_deliveries(recipient_key,week_key,status,idempotency_key,first_claimed_at,claimed_at)
    VALUES ('test:window:'||state,'2099-01-05',state,'original-key',now()-interval '23 hours',now()-interval '23 hours');
    decision := public.claim_newsletter_delivery('test:window:'||state,'2099-01-05','changed-key');
    ASSERT decision->>'action' = 'send' AND decision->>'idempotency_key' = 'original-key';
    UPDATE public.newsletter_week_deliveries SET status=state,first_claimed_at=now()-interval '25 hours',claimed_at=now()-interval '2 hours'
      WHERE recipient_key='test:window:'||state;
    decision := public.claim_newsletter_delivery('test:window:'||state,'2099-01-05','changed-key');
    ASSERT decision->>'reason' = 'uncertain', 'last retry must not extend the first provider window';
  END LOOP;
END $$;

-- Ordinary authenticated users cannot list addresses, claim sends or stage HTML.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-4000-8000-000000000099"}', true);
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.newsletter_delivery_recipients();
    RAISE EXCEPTION 'recipient authorization was bypassed';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Accesso riservato agli admin' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM public.claim_newsletter_delivery('test:forbidden','2099-01-05','forbidden');
    RAISE EXCEPTION 'claim authorization was bypassed';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Accesso riservato agli admin' THEN RAISE; END IF;
  END;
  ASSERT NOT has_table_privilege(current_user,'public.newsletter_week_deliveries','SELECT');
END $$;
RESET ROLE;

-- Anonymous requests cannot even execute the public functions.
DO $$ BEGIN
  ASSERT NOT has_function_privilege('anon','public.newsletter_delivery_recipients()','EXECUTE');
  ASSERT NOT has_function_privilege('anon','public.claim_newsletter_delivery(text,text,text)','EXECUTE');
  ASSERT NOT has_table_privilege('anon','public.newsletter_week_deliveries','SELECT');
END $$;
ROLLBACK;
