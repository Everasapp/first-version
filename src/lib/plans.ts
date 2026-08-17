import type { UserRole } from "@/src/lib/profile";

export type PlanSlug = "free" | "regular" | "full";

export type Plan = {
  id: string;
  name: string;
  slug: PlanSlug;
  price_monthly: number | string;
  events_limit: number | null;
  featured_events_limit: number | null;
  analytics_enabled: boolean;
};

export const PLAN_SELECT =
  "id, name, slug, price_monthly, events_limit, featured_events_limit, analytics_enabled";

export function getPlanDisplayName(slug: PlanSlug | string | null | undefined) {
  switch (slug) {
    case "full":
      return "Pro";
    case "regular":
      return "Promozione";
    case "free":
    default:
      return "Free";
  }
}

export function canPromoteEvents(plan: Pick<Plan, "featured_events_limit"> | null | undefined) {
  return (plan?.featured_events_limit ?? 0) > 0;
}

/** Admin and Pro can associate a directory organizer (or a custom name). */
export function canAssignOrganizers(
  plan: Pick<Plan, "slug"> | null | undefined,
  role?: UserRole | null,
) {
  return role === "admin" || plan?.slug === "full";
}

export function formatPlanPrice(
  price: number | string | null | undefined,
  slug?: PlanSlug | string | null,
) {
  if (slug === "regular") {
    return "Su richiesta";
  }

  const value = price === null || price === undefined ? 0 : Number(price);
  if (!Number.isFinite(value) || value <= 0) {
    return "Gratis";
  }

  return `${new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value)}/mese`;
}
