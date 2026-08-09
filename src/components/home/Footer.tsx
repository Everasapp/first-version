import Image from "next/image";
import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie", label: "Cookie Policy" },
  { href: "/termini", label: "Termini di utilizzo" },
] as const;

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

        <p className="mt-5 max-w-md text-base text-slate-600">
          Scopri gli eventi più belli della Sardegna.
        </p>

        <div className="mt-6 flex flex-col gap-3 text-sm font-semibold">
          <a
            href="mailto:info@everas.it"
            className="w-fit text-slate-800 transition hover:text-[#075EAE]"
          >
            Contattaci
          </a>
          <a
            href="https://www.instagram.com/everas"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-slate-800 transition hover:text-[#075EAE]"
          >
            Instagram
          </a>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          © {year} EVERAS. Tutti i diritti riservati.
        </p>

        <nav
          aria-label="Informazioni legali"
          className="mt-4 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="w-fit text-slate-700 transition hover:text-[#075EAE]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
