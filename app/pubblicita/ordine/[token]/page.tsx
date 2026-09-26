import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdvertisingOrderClient from "@/src/components/ads/AdvertisingOrderClient";
import Header from "@/src/components/home/Header";
import { getOrderByAccessToken } from "@/src/lib/ads/orders";
import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Ordine pubblicità",
  robots: privatePageRobots,
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ cancelled?: string }>;
};

export default async function PubblicitaOrdinePage({
  params,
  searchParams,
}: Props) {
  const { token } = await params;
  const { cancelled } = await searchParams;

  const order = await getOrderByAccessToken(token);
  if (!order) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
            Pubblicità
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Il tuo ordine
          </h1>
          <div className="mt-8">
            <AdvertisingOrderClient
              order={order}
              cancelled={cancelled === "1"}
            />
          </div>
          <p className="mt-8 text-sm text-slate-500">
            <Link
              href="/pubblicita"
              className="font-semibold text-[#075EAE] hover:underline"
            >
              ← Torna a Pubblicità
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
