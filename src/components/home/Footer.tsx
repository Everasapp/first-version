import Image from "next/image";
import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie", label: "Cookie Policy" },
  { href: "/termini", label: "Termini di utilizzo" },
] as const;

/** Official Facebook page: Everas - Eventi Sardegna */
const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61575344263784";

const socialLinkClassName =
  "inline-flex text-[#E67E22] transition hover:text-[#C96A1A]";

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

function FacebookIcon({ className }: { className?: string }) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#c5d8ec] bg-[#e8f1fa]">
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
          <p className="max-w-md text-base text-slate-700">
            Scopri gli eventi più belli della Sardegna.
          </p>

          <div className="flex shrink-0 items-center gap-4 self-start sm:self-auto">
            <a
              href="https://www.instagram.com/everas.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EVERAS su Instagram"
              className={socialLinkClassName}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EVERAS su Facebook"
              className={socialLinkClassName}
            >
              <FacebookIcon className="h-5 w-5" />
            </a>

            <Link
              href="/contatti"
              className="text-sm font-semibold text-[#075EAE] transition hover:text-[#064E91]"
            >
              Contattaci
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#c5d8ec] pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-slate-600">
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
                className="text-[#075EAE] transition hover:text-[#064E91]"
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
