import { getOperationalOrigin } from "@/src/lib/env/operational-origin";

export const SANDBOX_PAYPAL_API = "https://api-m.sandbox.paypal.com";
export const LIVE_PAYPAL_API = "https://api-m.paypal.com";

type Env = Record<string, string | undefined>;

export function isSandboxPayPalReady(env: Env = process.env) {
  return (
    env.VERCEL_ENV !== "production" &&
    env.PAYPAL_ENVIRONMENT?.trim().toLowerCase() === "sandbox" &&
    Boolean(env.PAYPAL_CLIENT_ID?.trim() && env.PAYPAL_CLIENT_SECRET?.trim())
  );
}

/** Live stays the production default. Other environments can only reach sandbox. */
export function paypalApiBase(env: Env = process.env): string | null {
  if (env.VERCEL_ENV !== "production") {
    return isSandboxPayPalReady(env) ? SANDBOX_PAYPAL_API : null;
  }
  return env.PAYPAL_ENVIRONMENT?.trim().toLowerCase() === "sandbox"
    ? SANDBOX_PAYPAL_API
    : LIVE_PAYPAL_API;
}

export type PayPalCheckoutDecision =
  | { kind: "ncp"; approveUrl: string }
  | { kind: "orders"; returnOrigin: string; apiBase: string }
  | { kind: "unavailable" }
  | { kind: "missing-credentials" };

export function decidePayPalCheckout(
  paymentLink: string | null,
  env: Env = process.env,
): PayPalCheckoutDecision {
  if (env.VERCEL_ENV === "production") {
    if (paymentLink) return { kind: "ncp", approveUrl: paymentLink };
    if (!env.PAYPAL_CLIENT_ID?.trim() || !env.PAYPAL_CLIENT_SECRET?.trim()) {
      return { kind: "missing-credentials" };
    }
    return {
      kind: "orders",
      returnOrigin:
        env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.everas.it",
      apiBase: paypalApiBase(env) || LIVE_PAYPAL_API,
    };
  }

  const apiBase = paypalApiBase(env);
  const returnOrigin = getOperationalOrigin(env);
  if (!apiBase || !returnOrigin) return { kind: "unavailable" };
  return { kind: "orders", returnOrigin, apiBase };
}
