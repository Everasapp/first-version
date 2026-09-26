import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import AdvertisingRequestForm from "@/src/components/ads/AdvertisingRequestForm";
import Header from "@/src/components/home/Header";
import {
  getAdvertisingPackage,
  resolvePackagePricing,
} from "@/src/lib/ads/advertising-packages";
import { getLaunchPromoState } from "@/src/lib/ads/orders";
import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Richiesta pubblicità",
  robots: privatePageRobots,
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ package?: string }>;
};

export default async function PubblicitaRichiestaPage({ searchParams }: Props) {
  const params = await searchParams;
  const packageId = params.package?.trim();

  if (!packageId) {
    redirect("/pubblicita");
  }

  const pkg = getAdvertisingPackage(packageId);
  if (!pkg || !pkg.active) {
    notFound();
  }

  const promo = await getLaunchPromoState();
  const pricing = resolvePackagePricing(pkg, promo.active);

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Pubblicità
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Compila la richiesta
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Inserisci i dati della tua attività e carica il banner. Dopo l&apos;invio
            potrai completare il pagamento con PayPal.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <AdvertisingRequestForm pkg={pkg} pricing={pricing} />
          </div>

          <p className="mt-6 text-sm text-slate-500">
            <Link href="/pubblicita" className="font-semibold text-[#075EAE] hover:underline">
              ← Torna ai pacchetti
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
