"use server";

import { createClient } from "@/src/lib/supabase/server";
import { notifyNewUser } from "@/src/lib/notifications/notify";
import { sendSignupConfirmationEmail } from "@/src/lib/auth/send-confirmation-email";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthFormState = {
  error?: string;
  success?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Email o password non corretti.";
  }
  if (lower.includes("email not confirmed")) {
    return "Conferma la tua email prima di accedere. Controlla anche Spam e Promozioni.";
  }
  if (lower.includes("user already registered")) {
    return "Esiste già un account con questa email.";
  }
  if (lower.includes("signup is disabled")) {
    return "La registrazione non è al momento disponibile.";
  }
  if (lower.includes("rate limit")) {
    return "Troppi tentativi. Riprova tra qualche minuto.";
  }

  return "Si è verificato un errore. Riprova.";
}

async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Compila tutti i campi obbligatori." };
  }

  if (!isValidEmail(email)) {
    return { error: "Inserisci un indirizzo email valido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("password_confirm") ?? "");
  const privacyAccepted = formData.get("privacy") === "on";
  const newsletterOptIn = formData.get("newsletter") === "on";
  const newsletterCity = String(formData.get("newsletter_city") ?? "").trim();
  const newsletterCategory = String(
    formData.get("newsletter_category") ?? "",
  ).trim();

  if (!fullName || !email || !password || !passwordConfirm) {
    return { error: "Compila tutti i campi obbligatori." };
  }

  if (!isValidEmail(email)) {
    return { error: "Inserisci un indirizzo email valido." };
  }

  if (password.length < 8) {
    return { error: "La password deve contenere almeno 8 caratteri." };
  }

  if (password !== passwordConfirm) {
    return { error: "Le password non coincidono." };
  }

  if (!privacyAccepted) {
    return {
      error: "Devi accettare l'informativa sulla privacy per registrarti.",
    };
  }

  if (newsletterOptIn && (!newsletterCity || !newsletterCategory)) {
    return {
      error: "Per la newsletter scegli città e categoria preferita.",
    };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        newsletter_opt_in: newsletterOptIn,
        newsletter_city: newsletterOptIn ? newsletterCity : null,
        newsletter_category: newsletterOptIn ? newsletterCategory : null,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/accedi`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  await notifyNewUser({
    name: fullName,
    email,
    registeredAt: data.user?.created_at ?? new Date().toISOString(),
  });

  if (!data.session) {
    try {
      await sendSignupConfirmationEmail(email);
    } catch (sendError) {
      console.error("[auth] Invio conferma via Resend fallito:", sendError);
    }
  }

  return {
    success:
      "Registrazione completata. Ti abbiamo inviato un’email da EVERAS: se non la vedi, controlla Spam e Promozioni.",
  };
}
