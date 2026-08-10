import { Heart } from "lucide-react";
import type { SVGProps } from "react";

type CelebrazioniIconProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number | string;
};

/**
 * Cross + heart for Celebrazioni.
 * Uses the same stroke/currentColor style as the other Lucide category icons.
 */
export default function CelebrazioniIcon({
  className,
  strokeWidth = 1.8,
  ...props
}: CelebrazioniIconProps) {
  return (
    <span
      className={`relative inline-block ${className ?? ""}`}
      aria-hidden={props["aria-hidden"] ?? true}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 h-full w-full"
      >
        <path d="M12 2v8" />
        <path d="M8.5 5h7" />
      </svg>
      <Heart
        aria-hidden="true"
        strokeWidth={strokeWidth}
        className="absolute bottom-0 left-1/2 h-[58%] w-[58%] -translate-x-1/2"
      />
    </span>
  );
}
