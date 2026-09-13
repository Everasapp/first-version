/**
 * Autorizza le invocazioni Cron di Vercel.
 *
 * - Con `CRON_SECRET` in env, Vercel invia `Authorization: Bearer <secret>`.
 * - Senza secret, accettiamo solo `x-vercel-cron: 1` (header delle cron Vercel).
 *   Prima, senza secret, il job rispondeva sempre 401 e non pubblicava mai.
 */
export function isCronAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret) {
    return request.headers.get("authorization") === `Bearer ${cronSecret}`;
  }

  return request.headers.get("x-vercel-cron") === "1";
}
