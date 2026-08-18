const SIGNUP_EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

function firstSearchValue(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export function parseSignupEmail(
  value: string | string[] | null | undefined,
) {
  const email = firstSearchValue(value).trim().toLowerCase();
  if (!email || email.length > 254 || !SIGNUP_EMAIL_RE.test(email)) {
    return "";
  }
  return email;
}

export function parseSafeRedirectPath(
  value: string | string[] | null | undefined,
  fallback = "/dashboard",
) {
  const raw = firstSearchValue(value);
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return fallback;
  }
  return raw;
}

export function buildAuthHref(
  path: "/accedi" | "/registrati",
  options: { redirect?: string | null; email?: string | null } = {},
) {
  const params = new URLSearchParams();
  const redirectTo = options.redirect
    ? parseSafeRedirectPath(options.redirect, "")
    : "";
  if (redirectTo) {
    params.set("redirect", redirectTo);
  }
  const email = parseSignupEmail(options.email);
  if (email) {
    params.set("email", email);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
