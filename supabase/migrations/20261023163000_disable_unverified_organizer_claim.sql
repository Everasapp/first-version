-- SECURITY: Do not grant organizer ownership by a public one-click claim.
-- Ownership verification and transfer require a separately reviewed admin workflow.
-- This revoke intentionally disables direct calls by anonymous and authenticated users.
REVOKE EXECUTE ON FUNCTION public.claim_organizer_directory(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_organizer_directory(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.claim_organizer_directory(uuid) FROM authenticated;

-- service_role permission is retained for controlled server-side workflows.
