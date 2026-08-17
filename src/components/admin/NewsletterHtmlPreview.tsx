"use client";

import { useEffect, useState } from "react";

type NewsletterHtmlPreviewProps = {
  area: "nord" | "centro" | "sud";
  title: string;
};

export default function NewsletterHtmlPreview({
  area,
  title,
}: NewsletterHtmlPreviewProps) {
  const [html, setHtml] = useState("");
  const [subject, setSubject] = useState("");
  const [eventsCount, setEventsCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      try {
        const response = await fetch(
          `/api/admin/newsletter/preview?area=${area}`,
        );
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          html?: string;
          subject?: string;
          eventsCount?: number;
          error?: string;
        };

        if (!response.ok || !payload.ok || !payload.html) {
          throw new Error(payload.error || "Anteprima non disponibile");
        }

        if (cancelled) return;
        setHtml(payload.html);
        setSubject(payload.subject ?? "");
        setEventsCount(payload.eventsCount ?? 0);
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Anteprima non disponibile",
        );
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [area]);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {error
          ? error
          : eventsCount == null
            ? "Caricamento anteprima…"
            : `${eventsCount} eventi · ${subject}`}
      </p>
      {html ? (
        <iframe
          title={title}
          srcDoc={html}
          className="mt-3 h-[720px] w-full rounded-2xl border border-slate-200 bg-slate-100"
        />
      ) : (
        <div className="mt-3 grid h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
          {error || "Caricamento…"}
        </div>
      )}
    </div>
  );
}
