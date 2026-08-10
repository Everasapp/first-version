import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, Sparkles } from "lucide-react";

import RequestPlanButton from "@/src/components/dashboard/RequestPlanButton";
import Header from "@/src/components/home/Header";
import { requireProfile } from "@/src/lib/auth";
import {
  PLAN_SELECT,
  formatPlanPrice,
  getPlanDisplayName,
  type Plan,
  type PlanSlug,
} from "@/src/lib/plans";
import { isOrganizer } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";

type PianoPageProps = {
  searchParams: Promise<{
    motivo?: string | string[];
  }>;
};

const planBenefits: Record<PlanSlug, string[]> = {
  free: [
    "1 evento al mese",
    "Statistiche essenziali",
    "Profilo attività",
  ],
  regular: [
    "Fino a 12 eventi al mese",
    "1 evento in evidenza",
    "Analytics avanzate",
  ],
  full: [
    "Eventi illimitati",
    "Fino a 5 eventi in evidenza",
    "Priorità in homepage",
    "Supporto dedicato",
  ],
};

export default async function PianoPage({ searchParams }: PianoPageProps) {
  const params = await searchParams;
  const motivo = Array.isArray(params.motivo) ? params.motivo[0] : params.motivo;
  const { supabase, profile } = await requireProfile("/dashboard/piano");

  if (!isOrganizer(profile)) {
    redirect("/diventa-organizzatore?next=/dashboard/piano");
  }

  const { data: plansData } = await supabase
    .from("plans")
    .select(PLAN_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const plans = (plansData ?? []) as Plan[];
  const currentPlan =
    plans.find((plan) => plan.id === profile.plan_id) ??
    plans.find((plan) => plan.slug === "free") ??
    null;

  const { data: pendingRequests } = await supabase
    .from("plan_requests")
    .select("requested_plan_slug, status, created_at")
    .eq("user_id", profile.id)
    .eq("status", "pending");

  const pendingSlugs = new Set(
    (pendingRequests ?? []).map((row) => row.requested_plan_slug as string),
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
                Area organizzatore
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Piano e promozione
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Piano attuale:{" "}
                <span className="font-bold text-slate-900">
                  {getPlanDisplayName(currentPlan?.slug)}
                </span>
                . Passa a Pro per mettere gli eventi in evidenza.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              Torna alla dashboard
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          {motivo === "promuovi" ? (
            <div className="mb-8 rounded-3xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm font-medium text-[#C96A1A]">
              Per promuovere un evento serve un piano Plus o Pro.
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = currentPlan?.id === plan.id;
              const isProLike = plan.slug === "full" || plan.slug === "regular";
              const benefits = planBenefits[plan.slug] ?? [];

              return (
                <article
                  key={plan.id}
                  className={`rounded-3xl border bg-white p-7 shadow-sm ${
                    plan.slug === "full"
                      ? "border-[#E67E22] ring-4 ring-orange-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-black text-slate-900">
                      {getPlanDisplayName(plan.slug)}
                    </h2>
                    {plan.slug === "full" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#E67E22]">
                        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                        Consigliato
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {formatPlanPrice(plan.price_monthly)}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]"
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {isCurrent ? (
                      <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                        Piano attuale
                      </p>
                    ) : pendingSlugs.has(plan.slug) ? (
                      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        Richiesta già inviata: in elaborazione.
                      </p>
                    ) : isProLike ? (
                      <RequestPlanButton
                        planSlug={plan.slug as "regular" | "full"}
                        label={`Richiedi ${getPlanDisplayName(plan.slug)}`}
                      />
                    ) : (
                      <p className="text-sm text-slate-500">
                        Incluso per tutti gli organizzatori.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Il pagamento online arriverà a breve. Per ora puoi richiedere
            l’upgrade: ti attiviamo il piano manualmente.
          </p>
        </section>
      </main>
    </>
  );
}
