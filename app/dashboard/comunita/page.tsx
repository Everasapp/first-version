import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Community rimossa: vecchi link puntano qui. */
export default function CommunityProfilePage() {
  redirect("/dashboard");
}
