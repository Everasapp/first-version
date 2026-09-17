import Link from "next/link";

import { temporalExploreLinks } from "@/src/lib/seo/internal-links";

type TemporalExploreLinksProps = {
  /** Path of the current page — excluded from the list. */
  excludeHref?: string;
  title?: string;
  className?: string;
};

/**
 * Descriptive temporal cluster links (oggi / domani / weekend / mese / …).
 * Prefer this over generic “clicca qui” chips.
 */
export default function TemporalExploreLinks({
  excludeHref,
  title = "Scopri anche",
  className,
}: TemporalExploreLinksProps) {
  const links = temporalExploreLinks(excludeHref);
  if (links.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className={className ?? "mt-8 border-t border-slate-200 pt-6"}
    >
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#075EAE] transition hover:border-[#075EAE]/40 hover:bg-sky-50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
