import type { ReactNode } from "react";
import { Eye, Heart, Share2 } from "lucide-react";

import { formatEngagementCount } from "@/src/lib/event-engagement";

type EventEngagementStatsProps = {
  likesCount?: number;
  viewsCount?: number;
  sharesCount?: number;
  className?: string;
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <li className="inline-flex items-center gap-1.5" title={label}>
      {icon}
      <span className="font-semibold tabular-nums">
        {formatEngagementCount(value)}
      </span>
      <span className="sr-only">{label}</span>
    </li>
  );
}

export default function EventEngagementStats({
  likesCount = 0,
  viewsCount = 0,
  sharesCount = 0,
  className = "",
}: EventEngagementStatsProps) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 ${className}`}
    >
      <Stat
        icon={
          <Heart aria-hidden="true" className="h-4 w-4 text-[#E67E22]" />
        }
        label="Mi piace"
        value={likesCount}
      />
      <Stat
        icon={<Eye aria-hidden="true" className="h-4 w-4 text-[#075EAE]" />}
        label="Visualizzazioni"
        value={viewsCount}
      />
      <Stat
        icon={
          <Share2 aria-hidden="true" className="h-4 w-4 text-slate-500" />
        }
        label="Inoltri"
        value={sharesCount}
      />
    </ul>
  );
}
