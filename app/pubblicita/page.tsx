import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Header from "@/src/components/home/Header";
import {
  ADVERTISING_FAQS,
  ADVERTISING_PLACEMENT_GROUPS,
  ADVERTISING_STEPS,
  LAUNCH_CAMPAIGN,
  resolvePackagePricing,
  type AdvertisingPackage,
} from "@/src/lib/ads/advertising-packages";
import {
  getLaunchPromoState,
  type LaunchPromoState,
} from "@/src/lib/ads/orders";

export const metadata: Metadata = {
  title: {
    absolute: "Pubblicità su EVERAS | Promuovi la tua attività in Sardegna",
  },
  description:
    "Pubblicizza la tua attività su EVERAS e raggiungi persone interessate a eventi, esperienze e attività in Sardegna.",
  alternates: { canonical: "/pubblicita" },
};

export const dynamic = "force-dynamic";

function PackageCard({
  pkg,
  promoActive,
}: {
  pkg: AdvertisingPackage;
  promoActive: boolean;
}) {
  const pricing = resolvePackagePricing(pkg, promoActive);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
        pkg.active
          ? "border-[#E67E22] ring-2 ring-[#E67E22]/25"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900">
          {pkg.durationMonths} mesi
        </h3>
        {pkg.active ? (
          <span className="shrink-0 rounded-full bg-[#E67E22]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#C96A1A]">
            Disponibile
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        {pricing.promoApplied ? (
          <>
            <p className="text-base text-slate-400 line-through">
              €{pricing.listPrice}
            </p>
            <p className="text-3xl font-black tracking-tight text-[#E67E22]">
              €{pricing.finalPrice}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#C96A1A]">
              {LAUNCH_CAMPAIGN.tagline}
            </p>
          </>
        ) : (
          <p className="text-3xl font-black tracking-tight text-slate-900">
            €{pricing.finalPrice}
          </p>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {pkg.description}
      </p>

      {pkg.active ? (
        <Link
          href={`/pubblicita/richiesta?package=${pkg.id}`}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#E67E22] px-5 text-sm font-bold text-white transition hover:bg-[#C96A1A]"
        >
          Acquista
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-5 text-sm font-bold text-slate-500"
        >
          Disponibile a breve
        </button>
      )}
    </article>
  );
}

function PromoBanner({ promo }: { promo: LaunchPromoState }) {
  return (
    <section className="relative overflow-hidden border-b border-[#E67E22]/25 bg-gradient-to-br from-[#075EAE] via-[#0a6bc4] to-[#E67E22]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/85">
          🚀 {LAUNCH_CAMPAIGN.name}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          {LAUNCH_CAMPAIGN.eyebrow}
        </h1>
        <p className="mt-3 text-lg font-semibold text-white sm:text-xl">
          {promo.active
            ? LAUNCH_CAMPAIGN.headlineActive
            : LAUNCH_CAMPAIGN.headlineEnded}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">
          Promuovi la tua attività su EVERAS e raggiungi persone interessate a
          eventi, esperienze e attività in Sardegna.
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90">
          Fai conoscere la tua attività a chi cerca eventi, esperienze e cose da
          fare in Sardegna.
        </p>

        {promo.active ? (
          <div className="mt-8 w-full max-w-md rounded-2xl border-2 border-[#E67E22] bg-white p-5 shadow-lg shadow-black/20 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C96A1A]">
              Offerta limitata
            </p>
            <p className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Solo per i primi {promo.limit} clienti
            </p>
            <p className="mt-3 text-base font-semibold text-slate-700">
              {promo.used} / {promo.limit} promozioni utilizzate
            </p>
            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-valuenow={promo.used}
              aria-valuemin={0}
              aria-valuemax={promo.limit}
              aria-label={`${promo.used} su ${promo.limit} promozioni utilizzate`}
            >
              <div
                className="h-full rounded-full bg-[#E67E22] transition-[width]"
                style={{
                  width: `${Math.min(100, (promo.used / promo.limit) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-lg font-black text-[#E67E22]">
              Restano {promo.remaining}{" "}
              {promo.remaining === 1 ? "promozione" : "promozioni"}
            </p>
          </div>
        ) : (
          <div className="mt-8 inline-flex rounded-2xl border-2 border-white/40 bg-white/15 px-5 py-4 text-base font-bold text-white backdrop-blur-sm">
            {LAUNCH_CAMPAIGN.headlineEnded}
          </div>
        )}

        <div className="mt-10">
          <a
            href="#pacchetti"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-[#075EAE] transition hover:bg-slate-100"
          >
            Scopri i pacchetti
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function PubblicitaPage() {
  const promo = await getLaunchPromoState();

  return (
    <>
      <Header />

      <main className="flex-1 bg-slate-50">
        <PromoBanner promo={promo} />

        <section
          id="pacchetti"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-12 sm:px-8 sm:py-16"
        >
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Scegli il tuo spazio pubblicitario
          </h2>
          {promo.active ? (
            <p className="mt-2 max-w-2xl text-base text-slate-600">
              Prezzi speciali di lancio — listino barrato, prezzo promo evidenziato.
            </p>
          ) : null}

          <div className="mt-10 space-y-12">
            {ADVERTISING_PLACEMENT_GROUPS.map((placement) => (
              <div key={placement.id}>
                <h3 className="text-xl font-bold text-slate-900">
                  {placement.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base text-slate-600">
                  {placement.description}
                </p>

                {placement.id === "home" ? (
                  <figure className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <Image
                      src="/images/ads/banner-home-reference.jpg"
                      alt="Esempio di banner pubblicitari nella sezione Pubblicità della Home EVERAS, sotto Hot this week"
                      width={963}
                      height={1024}
                      className="h-auto w-full"
                      unoptimized
                    />
                    <figcaption className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-5">
                      Riferimento: così appare lo spazio Banner Home su EVERAS.
                    </figcaption>
                  </figure>
                ) : null}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {placement.packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      promoActive={promo.active}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Come funziona
            </h2>

            <ol className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {ADVERTISING_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#075EAE] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 sm:px-5">
              Il banner sarà pubblicato dopo la verifica del materiale e dei
              dati forniti.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Domande frequenti
          </h2>

          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {ADVERTISING_FAQS.map((faq) => (
              <details key={faq.question} className="group px-5 py-4 sm:px-6">
                <summary className="cursor-pointer list-none text-base font-bold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-lg font-normal text-slate-400 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-sm text-slate-600">
            Hai altre domande?{" "}
            <Link
              href="/contatti"
              className="font-semibold text-[#075EAE] hover:underline"
            >
              Contattaci
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
