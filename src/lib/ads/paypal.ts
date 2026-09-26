import "server-only";

/**
 * PayPal Orders API (one-time payments).
 *
 * Env:
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 * - PAYPAL_ENVIRONMENT = "sandbox" | "live" (default: live)
 * - PAYPAL_WEBHOOK_ID (opzionale, per verifica webhook)
 */

const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
const LIVE_BASE = "https://api-m.paypal.com";

export type PayPalEnvironment = "sandbox" | "live";

export function getPayPalEnvironment(): PayPalEnvironment {
  const raw = process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase();
  if (raw === "sandbox") return "sandbox";
  return "live";
}

function getPayPalBaseUrl() {
  return getPayPalEnvironment() === "sandbox" ? SANDBOX_BASE : LIVE_BASE;
}

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() || "";
  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal non configurato: imposta PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET.",
    );
  }
  return { clientId, clientSecret };
}

export function isPayPalConfigured() {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID?.trim() &&
      process.env.PAYPAL_CLIENT_SECRET?.trim(),
  );
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const { clientId, clientSecret } = getCredentials();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal OAuth fallito (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

type CreateOrderInput = {
  amount: number;
  currency: string;
  description: string;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createPayPalOrder(input: CreateOrderInput) {
  const token = await getPayPalAccessToken();
  const value = input.amount.toFixed(2);

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.customId,
          description: input.description.slice(0, 127),
          amount: {
            currency_code: input.currency,
            value,
          },
        },
      ],
      application_context: {
        brand_name: "EVERAS",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal create order fallito (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    id: string;
    status: string;
    links?: Array<{ rel: string; href: string }>;
  };

  const approveUrl = data.links?.find((l) => l.rel === "approve")?.href;
  if (!approveUrl) {
    throw new Error("PayPal non ha restituito un URL di approvazione.");
  }

  return { orderId: data.id, status: data.status, approveUrl };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    // Already captured is ok — fetch the order instead
    if (response.status === 422) {
      return getPayPalOrder(paypalOrderId);
    }
    throw new Error(`PayPal capture fallito (${response.status}): ${body}`);
  }

  return (await response.json()) as PayPalOrderDetails;
}

export type PayPalOrderDetails = {
  id: string;
  status: string;
  purchase_units?: Array<{
    custom_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: { value: string; currency_code: string };
      }>;
    };
  }>;
};

export async function getPayPalOrder(paypalOrderId: string) {
  const token = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PayPal get order fallito (${response.status}): ${body}`);
  }

  return (await response.json()) as PayPalOrderDetails;
}

export function extractCaptureId(order: PayPalOrderDetails): string | null {
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || capture.status !== "COMPLETED") return null;
  return capture.id;
}

export function isPayPalOrderCompleted(order: PayPalOrderDetails) {
  if (order.status === "COMPLETED") return true;
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  return capture?.status === "COMPLETED";
}

/** Verifica firma webhook PayPal (se PAYPAL_WEBHOOK_ID è impostato). */
export async function verifyPayPalWebhook({
  headers,
  body,
}: {
  headers: Headers;
  body: string;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) {
    // Senza webhook ID non possiamo verificare: rifiuta in produzione.
    console.warn("[paypal] PAYPAL_WEBHOOK_ID non impostato: webhook rifiutato.");
    return false;
  }

  const token = await getPayPalAccessToken();
  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");
  const transmissionSig = headers.get("paypal-transmission-sig");

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false;
  }

  const response = await fetch(
    `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("[paypal] verify webhook failed:", text);
    return false;
  }

  const data = (await response.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}
