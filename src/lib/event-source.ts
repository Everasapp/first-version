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
  "turismosassari.it": "Turismo Sassari",
  "sardegnaturismo.it": "SardegnaTurismo",
  "sardegnaeventi24.it": "SardegnaEventi24",
  "sassaritoday.it": "SassariToday",
  "cagliaritoday.it": "CagliariToday",
  "eventbrite.it": "Eventbrite",
  "eventbrite.com": "Eventbrite",
  "nu.camcom.it": "Camera di commercio di Nuoro",
  "cuoredellasardegna.it": "Camera di commercio di Nuoro",
};

const CAMERA_COMMERCIO_NUORO = {
  href: "https://www.cuoredellasardegna.it/autunnoinbarbagia/it/index.html",
  label: "Camera di commercio di Nuoro",
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

function hostFromHref(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function stripCompetitorName(name: string) {
  return name
    .replace(/paradisola(\.it)?/gi, "")
    .replace(/^[/\s–—-]+|[/\s–—-]+$/g, "")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

export function publicSourceLabel(
  sourceName: string | null | undefined,
  href: string,
) {
  const named = stripCompetitorName(sourceName || "");
  if (named) return named;

  const host = hostFromHref(href);
  return HOST_LABELS[host] || host || "sito originale";
}

export function publicSourceAttribution(
  sourceName: string | null | undefined,
  sourceUrl: string | null | undefined,
) {
  const rawName = (sourceName || "").trim();
  const href = publicSourceHref(sourceUrl);
  const host = href ? hostFromHref(href) : "";
  const isCompetitorHost = host === "paradisola.it";
  const cleanedName = stripCompetitorName(rawName);

  if (/camera di commercio/i.test(rawName) || /camera di commercio/i.test(cleanedName)) {
    return {
      href: isCompetitorHost || !href ? CAMERA_COMMERCIO_NUORO.href : href,
      label: cleanedName || CAMERA_COMMERCIO_NUORO.label,
    };
  }

  if (isCompetitorHost || !href) {
    return null;
  }

  const label = publicSourceLabel(cleanedName, href);
  if (!label || /paradisola/i.test(label)) {
    return null;
  }

  return { href, label };
}
