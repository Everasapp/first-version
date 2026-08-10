"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export default function BackButton({
  fallbackHref = "/eventi",
  label = "Indietro",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#075EAE] ${className}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white shadow-sm">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      </span>
      {label}
    </button>
  );
}
