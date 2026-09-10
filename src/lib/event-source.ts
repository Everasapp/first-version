const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
];

const HOST_LABELS: Record<string, string> = {
  "saludetrigu.it": "Salude & Trigu",
  "paradisola.it": "Paradisola",
  "sardegnaturismo.it": "SardegnaTurismo",
  "sardegnaeventi24.it": "SardegnaEventi24",
  "sassaritoday.it": "SassariToday",
  "cagliaritoday.it": "CagliariToday",
  "eventbrite.it": "Eventbrite",
  "eventbrite.com": "Eventbrite",
};

export function publicSourceHref(rawUrl: string | null | undefined) {
  const value = (rawUrl || "").trim();
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    for (const param of TRACKING_PARAMS) {
      parsed.searchParams.delete(param);
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function publicSourceLabel(
  sourceName: string | null | undefined,
  href: string,
) {
  const named = (sourceName || "").trim();
  if (named) return named;

  try {
    const host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
    return HOST_LABELS[host] || host;
  } catch {
    return "sito originale";
  }
}
