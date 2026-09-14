/**
 * Autorizza le invocazioni Cron di Vercel.
 *
 * - `x-vercel-cron: 1` è impostato solo da Vercel sulle invocazioni cron
 *   (non spoofabile dall’esterno sulla piattaforma Vercel).
 * - Con `CRON_SECRET` in env, Vercel dovrebbe anche inviare
 *   `Authorization: Bearer <secret>`. Accettiamo entrambi: se il secret
 *   è presente ma il Bearer non arriva (o non combacia per whitespace),
 *   il header cron resta sufficiente per non bloccare il job quotidiano.
 */
export function isCronAuthorized(request: Request) {
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  if (isVercelCron) return true;

  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization")?.trim() || "";
  return (
    authorization === `Bearer ${cronSecret}` ||
    authorization.toLowerCase() === `bearer ${cronSecret.toLowerCase()}`
  );
}
