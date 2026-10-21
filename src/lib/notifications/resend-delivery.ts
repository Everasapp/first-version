export const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export const REAL_EMAIL_DISABLED_MESSAGE =
  "Invio email non disponibile fuori produzione.";

type Env = Record<string, string | undefined>;

export function realEmailDeliveryAllowed(env: Env = process.env) {
  return env.VERCEL_ENV === "production";
}

export type ResendPostResult =
  | { blocked: true }
  | { blocked: false; ok: true; id: string | null }
  | { blocked: false; ok: false; message: string; status: number };

export async function postResendEmail(
  payload: Record<string, unknown>,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<ResendPostResult> {
  if (!realEmailDeliveryAllowed(env)) {
    return { blocked: true };
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata");
  }

  const response = await fetchImpl(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const raw = await response.text();
  let parsed: { id?: string; message?: string; error?: { message?: string } } =
    {};
  try {
    parsed = raw ? (JSON.parse(raw) as typeof parsed) : {};
  } catch {
    parsed = {};
  }

  if (!response.ok) {
    return {
      blocked: false,
      ok: false,
      status: response.status,
      message:
        parsed.error?.message ||
        parsed.message ||
        raw ||
        `Resend error ${response.status}`,
    };
  }

  return { blocked: false, ok: true, id: parsed.id ?? null };
}
