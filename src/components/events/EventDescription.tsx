import {
  looksLikeHtml,
  sanitizeEventHtml,
} from "@/src/lib/sanitizeHtml";

type EventDescriptionProps = {
  description: string | null | undefined;
  emptyLabel?: string;
  className?: string;
};

export default function EventDescription({
  description,
  emptyLabel = "L'organizzatore non ha ancora aggiunto una descrizione per questo evento.",
  className = "",
}: EventDescriptionProps) {
  const raw = description?.trim() || "";

  if (!raw) {
    return (
      <p className={`text-lg leading-8 text-slate-600 ${className}`.trim()}>
        {emptyLabel}
      </p>
    );
  }

  if (looksLikeHtml(raw)) {
    const safeHtml = sanitizeEventHtml(raw);
    return (
      <div
        className={[
          "event-description text-lg leading-8 text-slate-600",
          "[&_p]:mb-4 [&_p:last-child]:mb-0",
          "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900",
          "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900",
          "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_li]:mb-1",
          "[&_a]:font-semibold [&_a]:text-[#075EAE] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#064a8a]",
          "[&_strong]:font-bold [&_strong]:text-slate-800",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:italic",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div
      className={`whitespace-pre-line text-lg leading-8 text-slate-600 ${className}`.trim()}
    >
      {raw}
    </div>
  );
}
