import Link from "next/link";

import { linkifyCulturaTownNames } from "@/src/lib/seo/linkify-cultura-towns";

type FaqAnswerProps = {
  text: string;
  className?: string;
};

/** Renders FAQ answer text with Scopri la Sardegna town names as links. */
export default function FaqAnswer({
  text,
  className = "mt-3 text-sm leading-relaxed text-slate-600",
}: FaqAnswerProps) {
  const parts = linkifyCulturaTownNames(text);

  return (
    <p className={className}>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <Link
            key={`${part.href}-${index}`}
            href={part.href}
            className="font-semibold text-[#075EAE] underline-offset-2 hover:underline"
          >
            {part.value}
          </Link>
        ) : (
          <span key={`t-${index}`}>{part.value}</span>
        ),
      )}
    </p>
  );
}
