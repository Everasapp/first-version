import Link from "next/link";

import Header from "@/src/components/home/Header";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  updatedAt,
  children,
}: LegalPageProps) {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Informazioni legali
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Ultimo aggiornamento: {updatedAt}
          </p>

          <div className="mt-10 space-y-5 text-base leading-7 text-slate-700">
            {children}
          </div>

          <Link
            href="/"
            className="mt-10 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
          >
            Torna alla home
          </Link>
        </article>
      </main>
    </>
  );
}
