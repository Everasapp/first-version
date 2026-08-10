"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type ShareEventButtonProps = {
  title: string;
  slug: string;
  size?: "sm" | "md";
  className?: string;
};

export default function ShareEventButton({
  title,
  slug,
  size = "sm",
  className = "",
}: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);

  const dimension = size === "md" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "md" ? "h-5 w-5" : "h-5 w-5";

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const url = `${window.location.origin}/eventi/${slug}`;
    const shareData = {
      title: `${title} · EVERAS`,
      text: `Scopri questo evento su Everas: ${title}`,
      url,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      // User cancelled share sheet — ignore
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia il link dell’evento:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "Link copiato" : `Condividi ${title}`}
      className={`grid ${dimension} place-items-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white hover:text-[#075EAE] ${className}`}
    >
      {copied ? (
        <Check aria-hidden="true" className={`${iconSize} text-emerald-600`} />
      ) : (
        <Share2 aria-hidden="true" className={iconSize} />
      )}
    </button>
  );
}
