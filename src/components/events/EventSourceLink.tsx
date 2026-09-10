import { ExternalLink } from "lucide-react";

import { publicSourceAttribution } from "@/src/lib/event-source";

type EventSourceLinkProps = {
  sourceUrl: string | null | undefined;
  sourceName: string | null | undefined;
};

export default function EventSourceLink({
  sourceUrl,
  sourceName,
}: EventSourceLinkProps) {
  const source = publicSourceAttribution(sourceName, sourceUrl);
  if (!source) return null;

  return (
    <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">
      Fonte:{" "}
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-[#075EAE] hover:underline"
      >
        {source.label}
        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only"> (si apre in una nuova scheda)</span>
      </a>
    </p>
  );
}
