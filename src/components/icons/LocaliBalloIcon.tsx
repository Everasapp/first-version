import type { SVGProps } from "react";

type LocaliBalloIconProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number | string;
};

/** Disco / vinile per Locali e ballo. */
export default function LocaliBalloIcon({
  className,
  strokeWidth = 1.8,
  ...props
}: LocaliBalloIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props["aria-hidden"] ?? true}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
