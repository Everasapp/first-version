import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import AdvertisingPaymentComplete from "@/src/components/ads/AdvertisingPaymentComplete";
import Header from "@/src/components/home/Header";
import { getOrderByAccessToken } from "@/src/lib/ads/orders";
import { privatePageRobots } from "@/src/lib/seo/site";

export const metadata: Metadata = {
  title: "Conferma pagamento pubblicità",
  robots: privatePageRobots,
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function PubblicitaOrdineCompletaPage({ params }: Props) {
  const { token } = await params;
  const order = await getOrderByAccessToken(token);
  if (!order) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-xl px-5 py-12 sm:px-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                Conferma in corso...
              </div>
            }
          >
            <AdvertisingPaymentComplete accessToken={order.access_token} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
