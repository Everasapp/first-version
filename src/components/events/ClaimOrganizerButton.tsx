import Link from "next/link";
import { BadgeCheck } from "lucide-react";

type ClaimOrganizerButtonProps = {
  directoryId: string;
  organizerName: string;
  className?: string;
};

export default function ClaimOrganizerButton({
  directoryId,
  organizerName,
  className = "",
}: ClaimOrganizerButtonProps) {
  return (
    <Link
      href={`/rivendica/${directoryId}`}
      aria-label={`Rivendica il profilo di ${organizerName}`}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#E67E22] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C96A1A] ${className}`}
    >
      <BadgeCheck aria-hidden="true" className="h-4 w-4" />
      Rivendica organizzatore
    </Link>
  );
}
