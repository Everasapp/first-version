import Link from "next/link";

import { buildAuthHref } from "@/src/lib/auth-urls";

function CommunityRing() {
  return (
    <div className="mx-auto w-full max-w-[320px]" aria-hidden="true">
      <img
        src="/images/community/community-ring.webp"
        alt=""
        width={734}
        height={749}
        className="h-auto w-full"
      />
    </div>
  );
}

type CommunityInviteProps = {
  isAuthenticated?: boolean;
};

export default function CommunityInvite({
  isAuthenticated = false,
}: CommunityInviteProps) {
  const href = isAuthenticated
    ? "/dashboard/comunita"
    : buildAuthHref("/registrati", { redirect: "/dashboard/comunita" });

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-14 lg:py-12">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E67E22]">
              La community
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
              Una community da far crescere insieme
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
              Entra tra le prime persone a darle forma.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Scegli gli eventi che ti interessano, fai sapere che ci sarai e
              incontra persone con cui condividere l’esperienza.
            </p>
            <Link
              href={href}
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#E67E22] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
            >
              Unisciti alla community
            </Link>
          </div>

          <CommunityRing />
        </div>
      </div>
    </section>
  );
}
