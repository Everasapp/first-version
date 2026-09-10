import { ExternalLink } from "lucide-react";

import {
  publicSourceHref,
  publicSourceLabel,
} from "@/src/lib/event-source";

type EventSourceLinkProps = {
  sourceUrl: string | null | undefined;
  sourceName: string | null | undefined;
};

export default function EventSourceLink({
  sourceUrl,
  sourceName,
}: EventSourceLinkProps) {
  const href = publicSourceHref(sourceUrl);
  if (!href) return null;

  const label = publicSourceLabel(sourceName, href);

  return (
    <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">
      Fonte:{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-[#075EAE] hover:underline"
      >
        {label}
        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only"> (si apre in una nuova scheda)</span>
      </a>
    </p>
  );
}
