import RegisterView from "@/src/components/auth/RegisterView";
import {
  parseClaimDirectoryId,
  parseSafeRedirectPath,
  parseSignupEmail,
} from "@/src/lib/auth-urls";
import { getSuggestedClaimEmail } from "@/src/lib/organizer-claim";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

type RegistratiPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    email?: string | string[];
  }>;
};

export default async function RegistratiPage({
  searchParams,
}: RegistratiPageProps) {
  const params = await searchParams;
  const redirectPath = parseSafeRedirectPath(params.redirect);
  let initialEmail = parseSignupEmail(params.email);

  if (!initialEmail) {
    const directoryId = parseClaimDirectoryId(redirectPath);
    if (directoryId) {
      const supabase = await createClient();
      initialEmail = (await getSuggestedClaimEmail(supabase, directoryId)) ?? "";
    }
  }

  return (
    <RegisterView initialEmail={initialEmail} redirectPath={redirectPath} />
  );
}
