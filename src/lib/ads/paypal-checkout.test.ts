import { describe, expect, it } from "vitest";
import {
  decidePayPalCheckout,
  LIVE_PAYPAL_API,
  paypalApiBase,
  SANDBOX_PAYPAL_API,
} from "./paypal-checkout";

const LIVE_LINK = "https://www.paypal.com/ncp/payment/JW4SJWAUCR8R2";

describe("PayPal checkout by environment", () => {
  it("keeps live links and the live API in production", () => {
    const env = { VERCEL_ENV: "production" };
    expect(paypalApiBase(env)).toBe(LIVE_PAYPAL_API);
    expect(decidePayPalCheckout(LIVE_LINK, env)).toEqual({
      kind: "ncp",
      approveUrl: LIVE_LINK,
    });
  });

  it("keeps the production orders return url on the public site", () => {
    const decision = decidePayPalCheckout(null, {
      VERCEL_ENV: "production",
      PAYPAL_CLIENT_ID: "live-client",
      PAYPAL_CLIENT_SECRET: "live-secret",
    });
    expect(decision).toEqual({
      kind: "orders",
      returnOrigin: "https://www.everas.it",
      apiBase: LIVE_PAYPAL_API,
    });
  });

  it("uses sandbox in production only when that environment is selected", () => {
    expect(
      paypalApiBase({
        VERCEL_ENV: "production",
        PAYPAL_ENVIRONMENT: "sandbox",
      }),
    ).toBe(SANDBOX_PAYPAL_API);
  });

  it("does not expose live links or the live API in preview", () => {
    const env = {
      VERCEL_ENV: "preview",
      PAYPAL_ENVIRONMENT: "live",
      PAYPAL_CLIENT_ID: "live-client",
      PAYPAL_CLIENT_SECRET: "live-secret",
      VERCEL_URL: "everas-git-preview.vercel.app",
    };
    expect(paypalApiBase(env)).toBeNull();
    expect(decidePayPalCheckout(LIVE_LINK, env)).toEqual({ kind: "unavailable" });
  });

  it("shows payment unavailable when sandbox configuration is missing", () => {
    expect(
      decidePayPalCheckout(LIVE_LINK, {
        VERCEL_ENV: "preview",
        PAYPAL_ENVIRONMENT: "sandbox",
        VERCEL_URL: "everas-git-preview.vercel.app",
      }),
    ).toEqual({ kind: "unavailable" });
    expect(decidePayPalCheckout(LIVE_LINK, {})).toEqual({ kind: "unavailable" });
    expect(paypalApiBase({})).toBeNull();
  });

  it("uses sandbox and the preview origin when sandbox is configured", () => {
    const decision = decidePayPalCheckout(LIVE_LINK, {
      VERCEL_ENV: "preview",
      PAYPAL_ENVIRONMENT: "sandbox",
      PAYPAL_CLIENT_ID: "sandbox-client",
      PAYPAL_CLIENT_SECRET: "sandbox-secret",
      NEXT_PUBLIC_SITE_URL: "https://www.everas.it",
      VERCEL_URL: "everas-git-preview.vercel.app",
    });
    expect(decision).toEqual({
      kind: "orders",
      returnOrigin: "https://everas-git-preview.vercel.app",
      apiBase: SANDBOX_PAYPAL_API,
    });
  });
});
