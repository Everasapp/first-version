import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type AdminKeySource =
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_SECRET_KEY"
  | null;

export type AdminKeyDiagnostics = {
  present: boolean;
  source: AdminKeySource;
  format: "jwt" | "sb_secret" | "sb_publishable" | "unknown" | "missing";
  role: string | null;
  bypassesRls: boolean;
};

function getServiceRoleKeyEntry(): {
  source: AdminKeySource;
  key: string;
} {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  if (serviceRole) {
    return { source: "SUPABASE_SERVICE_ROLE_KEY", key: serviceRole };
  }
  const secret = process.env.SUPABASE_SECRET_KEY?.trim() || "";
  if (secret) {
    return { source: "SUPABASE_SECRET_KEY", key: secret };
  }
  return { source: null, key: "" };
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const padded = parts[1] + "=".repeat((4 - (parts[1].length % 4)) % 4);
    const json = Buffer.from(padded, "base64url").toString("utf8");
    const payload = JSON.parse(json) as unknown;
    if (!payload || typeof payload !== "object") return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getAdminKeyDiagnostics(): AdminKeyDiagnostics {
  const { source, key } = getServiceRoleKeyEntry();
  if (!key) {
    return {
      present: false,
      source: null,
      format: "missing",
      role: null,
      bypassesRls: false,
    };
  }

  if (key.startsWith("sb_publishable_")) {
    return {
      present: true,
      source,
      format: "sb_publishable",
      role: "anon",
      bypassesRls: false,
    };
  }

  if (key.startsWith("sb_secret_")) {
    return {
      present: true,
      source,
      format: "sb_secret",
      role: "service_role",
      bypassesRls: true,
    };
  }

  const payload = decodeJwtPayload(key);
  if (payload) {
    const role =
      typeof payload.role === "string" && payload.role ? payload.role : null;
    return {
      present: true,
      source,
      format: "jwt",
      role,
      bypassesRls: role === "service_role",
    };
  }

  return {
    present: true,
    source,
    format: "unknown",
    role: null,
    bypassesRls: false,
  };
}

function privilegedKeyError(diagnostics: AdminKeyDiagnostics) {
  if (!diagnostics.present) {
    return "Manca SUPABASE_SERVICE_ROLE_KEY su Vercel. Aggiungila in Project → Settings → Environment Variables.";
  }
  return (
    `La chiave in ${diagnostics.source || "env"} non bypassa RLS ` +
    `(format=${diagnostics.format}, role=${diagnostics.role || "sconosciuto"}). ` +
    "Deve essere la service_role JWT oppure sb_secret_, non la publishable/anon key."
  );
}

export function tryCreateAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const { key } = getServiceRoleKeyEntry();

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    },
  });
}

export function createAdminClient() {
  const diagnostics = getAdminKeyDiagnostics();
  if (!diagnostics.bypassesRls) {
    throw new Error(privilegedKeyError(diagnostics));
  }

  const client = tryCreateAdminClient();
  if (!client) {
    throw new Error(privilegedKeyError(diagnostics));
  }

  return client;
}
