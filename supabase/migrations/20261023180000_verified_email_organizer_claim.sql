-- Only users who confirmed the exact official organization's email may claim.
CREATE OR REPLACE FUNCTION private.claim_organizer_directory(p_directory_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $claim$
DECLARE
  uid uuid := (SELECT auth.uid());
  dir public.organizer_directory%ROWTYPE;
  prof public.profiles%ROWTYPE;
  free_plan_id uuid;
  became_organizer boolean := false;
  transferred integer := 0;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Devi accedere per rivendicare un organizzatore.'; END IF;
  IF p_directory_id IS NULL THEN RAISE EXCEPTION 'Organizzatore non trovato.'; END IF;
  SELECT * INTO dir FROM public.organizer_directory WHERE id = p_directory_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Organizzatore non trovato.'; END IF;
  IF dir.claimed_by_profile_id IS NOT NULL AND dir.claimed_by_profile_id IS DISTINCT FROM uid THEN
    RAISE EXCEPTION 'Questo organizzatore è già stato rivendicato.';
  END IF;
  -- Never trust client-provided email, profile metadata, or an unverified account.
  IF dir.email IS NULL OR length(trim(dir.email)) = 0
     OR dir.email LIKE '%;%' OR dir.email LIKE '%,%'
     OR NOT EXISTS (
       SELECT 1 FROM auth.users au WHERE au.id = uid
         AND au.email_confirmed_at IS NOT NULL
         AND lower(trim(au.email)) = lower(trim(dir.email))
     ) THEN
    RAISE EXCEPTION 'Accedi con l''email ufficiale verificata dell''ente o contatta info@everas.it.';
  END IF;
  SELECT * INTO prof FROM public.profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Profilo non trovato.'; END IF;
  IF prof.role = 'utente' THEN
    SELECT id INTO free_plan_id FROM public.plans WHERE slug = 'free' LIMIT 1;
    UPDATE public.profiles SET role='organizzatore',
      business_name=COALESCE(NULLIF(trim(business_name), ''),dir.name),
      organizer_since=COALESCE(organizer_since,now()),
      plan_id=COALESCE(plan_id,free_plan_id),updated_at=now() WHERE id=uid;
    became_organizer := true;
  ELSIF NULLIF(trim(COALESCE(prof.business_name,'')),'') IS NULL THEN
    UPDATE public.profiles SET business_name=dir.name,updated_at=now() WHERE id=uid;
  END IF;
  UPDATE public.organizer_directory SET claim_status='claimed',claimed_by_profile_id=uid,updated_at=now() WHERE id=dir.id;
  UPDATE public.events SET organizer_id=uid,
    organizer_display_name=COALESCE(NULLIF(trim(organizer_display_name),''),dir.name),
    updated_at=now()
  WHERE organizer_directory_id=dir.id AND organizer_id IS DISTINCT FROM uid;
  GET DIAGNOSTICS transferred = ROW_COUNT;
  RETURN jsonb_build_object('directory_id',dir.id,'name',dir.name,
    'events_transferred',transferred,'became_organizer',became_organizer);
END;
$claim$;
REVOKE EXECUTE ON FUNCTION public.claim_organizer_directory(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.claim_organizer_directory(uuid) TO authenticated;
