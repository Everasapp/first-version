import Image from "next/image";
import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie", label: "Cookie Policy" },
  { href: "/termini", label: "Termini di utilizzo" },
] as const;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/everas-logo-v2.png"
            alt="EVERAS"
            width={96}
            height={19}
            className="h-auto w-24"
          />
        </Link>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <p className="max-w-md text-base text-slate-600">
            Scopri gli eventi più belli della Sardegna.
          </p>

          <div className="flex shrink-0 items-center gap-5 self-start sm:self-auto">
            <Link
              href="/contatti"
              className="text-sm font-semibold text-slate-800 transition hover:text-[#075EAE]"
            >
              Contattaci
            </Link>

            <a
              href="https://www.instagram.com/everas.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EVERAS su Instagram"
              className="inline-flex text-slate-800 transition hover:text-[#075EAE]"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-slate-500">
            © {year} EVERAS. Tutti i diritti riservati.
          </p>

          <nav
            aria-label="Informazioni legali"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 transition hover:text-[#075EAE]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
