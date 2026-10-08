import Link from "next/link";

import type { LandingLink } from "@/src/lib/seo/landing-copy";

type EventContextLinksProps = {
  municipality: string;
  links: LandingLink[];
};

export default function EventContextLinks({
  municipality,
  links,
}: EventContextLinksProps) {
  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="event-context-links-title"
      className="border-t border-slate-200 py-10"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
        Continua a esplorare
      </p>
      <h2
        id="event-context-links-title"
        className="mt-2 text-3xl font-bold text-slate-900"
      >
        Altri eventi e calendari utili
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
        Scopri cosa fare a {municipality} e consulta le raccolte aggiornate di
        eventi, categorie e date in Sardegna.
      </p>

      <nav aria-label="Collegamenti correlati all'evento" className="mt-6">
        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-[#075EAE] transition hover:border-[#075EAE] hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075EAE] focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
