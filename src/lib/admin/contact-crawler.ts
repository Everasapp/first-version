import * as cheerio from "cheerio";
import robotsParser from "robots-parser";

import {
  classifyEmail,
  emailCategoryToField,
  type ContactFieldKey,
  type FoundContactItem,
} from "@/src/lib/admin/organizer-directory";

const MAX_PAGES = 20;
const GLOBAL_TIMEOUT_MS = 45_000;
const PAGE_TIMEOUT_MS = 15_000;

/** Plain browser UA: some municipal hosts (e.g. Stintino) return 403 on *Bot* UAs. */
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const LINK_KEYWORDS = [
  "contatti",
  "contatto",
  "uffici",
  "ufficio",
  "amministrazione",
  "cultura",
  "turismo",
  "eventi",
  "spettacolo",
  "manifestazioni",
  "informazioni",
  "info",
  "trasparenza",
  "pec",
];

const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}(?![a-zA-Z0-9])/g;

const PHONE_REGEX =
  /(?:\+39[\s.]*)?(?:0\d{1,3}|\(0\d{1,3}\))[\s./-]*\d{5,10}|\+39[\s./-]*3\d{2}[\s./-]*\d{6,7}/g;

const ADDRESS_HINT =
  /(?:via|viale|piazza|corso|largo|vicolo)\s+[A-Za-zÀ-ÿ.'’\-][A-Za-zÀ-ÿ0-9.'’\-\s]{2,50}(?:\s*,?\s*\d{1,4})?(?:\s*[-–]\s*)?(?:\s*\d{5})?(?:\s+[A-Za-zÀ-ÿ]+)?/i;

const ADDRESS_JUNK =
  /\b(argomenti|notizia|pec devono|performance|provved|modalit|dettagl|aperto il|candeliere)\b/i;

type PageKind =
  | "page_contatti"
  | "page_cultura"
  | "page_turismo"
  | "page_eventi"
  | "page_amministrazione"
  | null;

type Accumulator = {
  emails: Map<
    string,
    { category: ReturnType<typeof classifyEmail>; sourceUrl: string }
  >;
  phones: Map<string, string>;
  addresses: Map<string, string>;
  facebook: Map<string, string>;
  instagram: Map<string, string>;
  pages: Map<ContactFieldKey, string>;
};

type FetchOutcome = {
  ok: boolean;
  status: number;
  text: string;
  finalUrl: string;
  reason?: string;
};

type FailureStats = {
  httpStatuses: number[];
  robotsBlocked: number;
  networkErrors: number;
  nonHtml: number;
  offDomain: number;
  emptyBody: number;
  lastReason?: string;
};

export type CrawlResult = {
  ok: boolean;
  error?: string;
  startUrl: string;
  pagesVisited: number;
  pagesAnalyzed: string[];
  items: FoundContactItem[];
  skippedRobots: number;
};

function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  url.hash = "";
  return url;
}

function sameRegistrableHost(a: URL, b: URL) {
  return a.hostname.replace(/^www\./, "") === b.hostname.replace(/^www\./, "");
}

function withWwwFlip(url: URL): URL {
  const flipped = new URL(url.toString());
  if (flipped.hostname.startsWith("www.")) {
    flipped.hostname = flipped.hostname.slice(4);
  } else {
    flipped.hostname = `www.${flipped.hostname}`;
  }
  return flipped;
}

function absolutize(base: URL, href: string): URL | null {
  try {
    const url = new URL(href, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function scoreLinkRelevance(url: URL, anchorText: string) {
  const hay = `${url.pathname} ${url.search} ${anchorText}`.toLowerCase();
  let score = 0;
  for (const keyword of LINK_KEYWORDS) {
    if (hay.includes(keyword)) score += 2;
  }
  if (hay.includes("contatt")) score += 3;
  if (hay.includes("pec")) score += 2;
  return score;
}

function detectPageKind(url: URL, title: string): PageKind {
  const hay = `${url.pathname} ${title}`.toLowerCase();
  if (/contatt/.test(hay)) return "page_contatti";
  if (/cultura|culturale|bibliotec/.test(hay)) return "page_cultura";
  if (/turismo|tourist/.test(hay)) return "page_turismo";
  if (/eventi|spettacolo|manifestazion/.test(hay)) return "page_eventi";
  if (/amministrazion|uffici|organigramma/.test(hay)) {
    return "page_amministrazione";
  }
  return null;
}

function cleanPhone(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function isLikelyPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) return false;
  if (/^00\d{8,}$/.test(digits) && !digits.startsWith("0039")) return false;
  return /^(?:\+?39)?0\d{5,10}$|^(?:\+?39)?3\d{8,9}$/.test(
    digits.replace(/^0039/, "39"),
  );
}

function cleanEmail(raw: string) {
  return raw.toLowerCase().replace(/[),.;:>\]]+$/g, "");
}

function isValidEmail(email: string) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/i.test(email);
}

function isLikelyJunkEmail(email: string) {
  if (!isValidEmail(email)) return true;
  return (
    email.endsWith(".png") ||
    email.endsWith(".jpg") ||
    email.endsWith(".gif") ||
    email.endsWith(".webp") ||
    email.includes("example.com") ||
    email.includes("sentry.io") ||
    email.includes("wixpress.com")
  );
}

function looksLikeHtml(text: string) {
  const sample = text.slice(0, 2000).toLowerCase();
  return (
    sample.includes("<html") ||
    sample.includes("<!doctype html") ||
    sample.includes("<body") ||
    sample.includes("<head")
  );
}

function looksLikeChallengePage(text: string) {
  // Important: do NOT match the bare word "cloudflare" — many public municipal
  // sites load CF CDN/scripts and would be false-positives.
  const sample = text.slice(0, 8000).toLowerCase();
  const titleMatch = sample.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = (titleMatch?.[1] || "").replace(/\s+/g, " ").trim();

  if (
    title.includes("just a moment") ||
    title.includes("attention required") ||
    title.includes("access denied") ||
    title.includes("cf-error") ||
    title.includes("403 forbidden") ||
    title.includes("security check")
  ) {
    return true;
  }

  return (
    sample.includes("cf-browser-verification") ||
    sample.includes("cf-challenge") ||
    sample.includes("cdn-cgi/challenge-platform") ||
    sample.includes('id="challenge-form"') ||
    sample.includes("managed_challenge") ||
    (sample.includes("checking your browser before accessing") &&
      sample.includes("cloudflare"))
  );
}

function hasUsablePageContent(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("mailto:") ||
    lower.includes("@") ||
    lower.includes("contatt") ||
    lower.includes("<nav") ||
    lower.includes("comune") ||
    (lower.match(/<a\s/g) || []).length >= 5
  );
}

async function fetchRaw(
  url: string,
  signal: AbortSignal,
  accept: string,
): Promise<FetchOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAGE_TIMEOUT_MS);

  const onAbort = () => controller.abort();
  signal.addEventListener("abort", onAbort);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: accept,
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
      },
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      text,
      finalUrl: response.url,
    };
  } catch (error) {
    const aborted =
      (error instanceof Error && error.name === "AbortError") || signal.aborted;
    return {
      ok: false,
      status: 0,
      text: "",
      finalUrl: url,
      reason: aborted ? "timeout" : "network",
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

async function fetchHtml(
  url: string,
  signal: AbortSignal,
): Promise<FetchOutcome> {
  const result = await fetchRaw(
    url,
    signal,
    "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  );

  if (!result.text) {
    return {
      ...result,
      ok: false,
      reason: result.reason || (result.status ? `http_${result.status}` : "empty"),
    };
  }

  const contentLooksHtml = looksLikeHtml(result.text);
  if (!contentLooksHtml) {
    return {
      ...result,
      ok: false,
      reason: result.status >= 400 ? `http_${result.status}` : "non_html",
    };
  }

  if (looksLikeChallengePage(result.text) && !hasUsablePageContent(result.text)) {
    return {
      ...result,
      ok: false,
      reason: "protected",
    };
  }

  if (!result.ok) {
    // Some WAFs return 403 with a usable public page; only hard-fail empty walls.
    if (hasUsablePageContent(result.text) && result.status < 500) {
      return { ...result, ok: true };
    }
    return {
      ...result,
      ok: false,
      reason:
        result.status === 403 || result.status === 401
          ? "protected"
          : `http_${result.status}`,
    };
  }

  return { ...result, ok: true };
}

function markdownToHtml(markdown: string) {
  const withLinks = markdown.replace(
    /\[([^\]]*)\]\((https?:[^)\s]+)\)/g,
    (_full, label: string, href: string) => {
      const safeHref = String(href).replace(/"/g, "");
      const safeLabel = String(label).replace(/</g, "");
      return `<a href="${safeHref}">${safeLabel}</a>`;
    },
  );
  return `<!DOCTYPE html><html><body>${withLinks}</body></html>`;
}

async function fetchViaTextProxy(
  url: string,
  signal: AbortSignal,
): Promise<FetchOutcome> {
  // Public reader used only as fallback when the origin blocks datacenter IPs.
  const proxyUrl = `https://r.jina.ai/${url}`;
  const result = await fetchRaw(proxyUrl, signal, "text/plain,*/*;q=0.8");

  if (!result.ok || !result.text || result.text.trim().length < 80) {
    return {
      ...result,
      ok: false,
      reason: result.reason || "proxy_failed",
    };
  }

  const lower = result.text.toLowerCase();
  if (
    (lower.includes("403 forbidden") || lower.includes("access denied")) &&
    result.text.length < 2500
  ) {
    return { ...result, ok: false, reason: "protected" };
  }

  return {
    ok: true,
    status: 200,
    text: markdownToHtml(result.text),
    finalUrl: url,
  };
}

async function fetchPage(
  url: string,
  signal: AbortSignal,
): Promise<FetchOutcome> {
  const direct = await fetchHtml(url, signal);
  if (direct.ok) return direct;

  const shouldProxy =
    direct.reason === "protected" ||
    direct.reason === "network" ||
    direct.reason === "timeout" ||
    direct.status === 403 ||
    direct.status === 401 ||
    direct.status === 503;

  if (!shouldProxy) return direct;

  const proxied = await fetchViaTextProxy(url, signal);
  if (proxied.ok) return proxied;
  return direct;
}

async function loadRobots(origin: string, signal: AbortSignal) {
  const robotsUrl = new URL("/robots.txt", origin).toString();
  try {
    const res = await fetchRaw(robotsUrl, signal, "text/plain,*/*;q=0.8");
    if (!res.ok || !res.text) {
      return robotsParser(robotsUrl, "");
    }
    // Only treat as robots if it looks like one
    if (!/user-agent:/i.test(res.text) && looksLikeHtml(res.text)) {
      return robotsParser(robotsUrl, "");
    }
    return robotsParser(robotsUrl, res.text);
  } catch {
    return robotsParser(robotsUrl, "");
  }
}

function extractFromHtml(
  html: string,
  pageUrl: URL,
  acc: Accumulator,
  queue: { url: string; score: number }[],
  visited: Set<string>,
  baseHost: URL,
) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();

  const title = $("title").first().text().trim();
  const pageKind = detectPageKind(pageUrl, title);
  if (pageKind && !acc.pages.has(pageKind)) {
    acc.pages.set(pageKind, pageUrl.toString());
  }

  const bodyText = $("body").text().replace(/\s+/g, " ");

  for (const match of bodyText.matchAll(EMAIL_REGEX)) {
    const email = cleanEmail(match[0]);
    if (!email || isLikelyJunkEmail(email)) continue;
    if (!acc.emails.has(email)) {
      acc.emails.set(email, {
        category: classifyEmail(email),
        sourceUrl: pageUrl.toString(),
      });
    }
  }

  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const email = cleanEmail(href.replace(/^mailto:/i, "").split("?")[0] || "");
    if (!email || isLikelyJunkEmail(email)) return;
    if (!acc.emails.has(email)) {
      acc.emails.set(email, {
        category: classifyEmail(email),
        sourceUrl: pageUrl.toString(),
      });
    }
  });

  $('a[href^="tel:"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const phone = cleanPhone(href.replace(/^tel:/i, ""));
    if (!isLikelyPhone(phone) || acc.phones.has(phone)) return;
    acc.phones.set(phone, pageUrl.toString());
  });

  for (const match of bodyText.matchAll(PHONE_REGEX)) {
    const phone = cleanPhone(match[0]);
    if (!isLikelyPhone(phone) || acc.phones.has(phone)) continue;
    acc.phones.set(phone, pageUrl.toString());
  }

  for (const match of bodyText.matchAll(
    new RegExp(ADDRESS_HINT.source, "gi"),
  )) {
    const address = match[0]
      .replace(/\s+/g, " ")
      .replace(/\s+(Codice fiscale|C\.?\s*F\.?|P\.?\s*IVA).*$/i, "")
      .trim();
    if (
      address.length < 12 ||
      address.length > 70 ||
      ADDRESS_JUNK.test(address) ||
      acc.addresses.has(address)
    ) {
      continue;
    }
    if (!/\d/.test(address)) continue;
    acc.addresses.set(address, pageUrl.toString());
  }

  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const absolute = absolutize(pageUrl, href);
    if (!absolute) return;

    const host = absolute.hostname.replace(/^www\./, "");
    if (
      host === "facebook.com" ||
      host === "fb.com" ||
      host === "m.facebook.com"
    ) {
      const value = absolute.toString();
      if (!acc.facebook.has(value)) acc.facebook.set(value, pageUrl.toString());
      return;
    }
    if (host === "instagram.com" || host === "www.instagram.com") {
      const value = absolute.toString();
      if (!acc.instagram.has(value)) {
        acc.instagram.set(value, pageUrl.toString());
      }
      return;
    }

    if (!sameRegistrableHost(absolute, baseHost)) return;

    const key = absolute.toString();
    if (visited.has(key)) return;

    const anchorText = $(el).text().replace(/\s+/g, " ").trim();
    const score = scoreLinkRelevance(absolute, anchorText);
    if (score > 0) {
      queue.push({ url: key, score });
    }
  });
}

function toItems(acc: Accumulator): FoundContactItem[] {
  const items: FoundContactItem[] = [];
  let n = 0;
  const nextId = () => `c-${++n}`;

  for (const [email, meta] of acc.emails) {
    const field = emailCategoryToField(meta.category);
    items.push({
      id: nextId(),
      field,
      label:
        field === "email_generale"
          ? "Email generale"
          : field === "pec"
            ? "PEC"
            : field === "email_cultura"
              ? "Email Cultura"
              : field === "email_turismo"
                ? "Email Turismo"
                : "Email Eventi",
      value: email,
      sourceUrl: meta.sourceUrl,
      selected: true,
      verified: false,
    });
  }

  for (const [phone, sourceUrl] of acc.phones) {
    items.push({
      id: nextId(),
      field: "phone",
      label: "Telefono",
      value: phone,
      sourceUrl,
      selected: true,
      verified: false,
    });
  }

  for (const [address, sourceUrl] of acc.addresses) {
    items.push({
      id: nextId(),
      field: "address",
      label: "Indirizzo",
      value: address,
      sourceUrl,
      selected: true,
      verified: false,
    });
  }

  for (const [value, sourceUrl] of acc.facebook) {
    items.push({
      id: nextId(),
      field: "facebook",
      label: "Facebook",
      value,
      sourceUrl,
      selected: true,
      verified: false,
    });
  }

  for (const [value, sourceUrl] of acc.instagram) {
    items.push({
      id: nextId(),
      field: "instagram",
      label: "Instagram",
      value,
      sourceUrl,
      selected: true,
      verified: false,
    });
  }

  const pageLabels: Record<string, string> = {
    page_contatti: "Pagina Contatti",
    page_cultura: "Pagina Cultura",
    page_turismo: "Pagina Turismo",
    page_eventi: "Pagina Eventi",
    page_amministrazione: "Pagina Amministrazione/Uffici",
  };

  for (const [field, sourceUrl] of acc.pages) {
    items.push({
      id: nextId(),
      field,
      label: pageLabels[field] || field,
      value: sourceUrl,
      sourceUrl,
      selected: true,
      verified: false,
    });
  }

  return items;
}

function ensureNotFoundPlaceholders(
  items: FoundContactItem[],
): FoundContactItem[] {
  const required: Array<{ field: FoundContactItem["field"]; label: string }> = [
    { field: "email_generale", label: "Email generale" },
    { field: "pec", label: "PEC" },
    { field: "email_cultura", label: "Email Cultura" },
    { field: "email_turismo", label: "Email Turismo" },
    { field: "email_eventi", label: "Email Eventi" },
    { field: "phone", label: "Telefono" },
    { field: "address", label: "Indirizzo" },
    { field: "facebook", label: "Facebook" },
    { field: "instagram", label: "Instagram" },
  ];

  const present = new Set(items.map((i) => i.field));
  let n = items.length;
  const extras: FoundContactItem[] = [];

  for (const req of required) {
    if (!present.has(req.field)) {
      extras.push({
        id: `nf-${++n}`,
        field: req.field,
        label: req.label,
        value: "Non trovato",
        sourceUrl: "",
        selected: false,
        verified: false,
      });
    }
  }

  return [...items, ...extras];
}

function buildFailureMessage(stats: FailureStats): string {
  if (stats.robotsBlocked > 0 && stats.httpStatuses.length === 0) {
    return "Il sito blocca la scansione tramite robots.txt. Puoi inserire i contatti a mano e salvarli comunque.";
  }

  const has403 = stats.httpStatuses.some((s) => s === 403);
  const has401 = stats.httpStatuses.some((s) => s === 401);
  const has404 = stats.httpStatuses.some((s) => s === 404);
  const has5xx = stats.httpStatuses.some((s) => s >= 500);

  if (stats.lastReason === "protected" || has403 || has401) {
    return "Il sito è protetto (anti-bot / accesso negato) e non espone HTML pubblico al crawler. Inserisci i contatti a mano.";
  }
  if (stats.lastReason === "timeout" || stats.networkErrors > 0) {
    return "Il sito non risponde in tempo o non è raggiungibile dal server. Verifica l’URL e riprova.";
  }
  if (has404) {
    return "Pagina non trovata (404). Controlla che l’URL del Comune sia corretto.";
  }
  if (has5xx) {
    return "Il sito del Comune ha restituito un errore server. Riprova più tardi.";
  }
  if (stats.offDomain > 0 && stats.nonHtml === 0) {
    return "Il sito reindirizza su un altro dominio: per sicurezza analizziamo solo pagine dello stesso dominio.";
  }
  if (stats.nonHtml > 0) {
    return "Il sito non ha restituito pagine HTML analizzabili (forse solo JavaScript o un formato non supportato).";
  }

  return "Sito non raggiungibile, protetto, o senza pagine HTML pubbliche analizzabili.";
}

export async function crawlOrganizerContacts(
  websiteUrl: string,
): Promise<CrawlResult> {
  let start: URL;
  try {
    start = normalizeUrl(websiteUrl);
  } catch {
    return {
      ok: false,
      error: "URL non valido",
      startUrl: websiteUrl,
      pagesVisited: 0,
      pagesAnalyzed: [],
      items: [],
      skippedRobots: 0,
    };
  }

  const globalController = new AbortController();
  const globalTimer = setTimeout(
    () => globalController.abort(),
    GLOBAL_TIMEOUT_MS,
  );

  const acc: Accumulator = {
    emails: new Map(),
    phones: new Map(),
    addresses: new Map(),
    facebook: new Map(),
    instagram: new Map(),
    pages: new Map(),
  };

  const visited = new Set<string>();
  const pagesAnalyzed: string[] = [];
  let skippedRobots = 0;
  const stats: FailureStats = {
    httpStatuses: [],
    robotsBlocked: 0,
    networkErrors: 0,
    nonHtml: 0,
    offDomain: 0,
    emptyBody: 0,
  };

  try {
    // Probe homepage (+ www flip) before crawling so we can give a clear error.
    let workingStart = start;
    let homepage = await fetchPage(start.toString(), globalController.signal);

    if (!homepage.ok) {
      const flipped = withWwwFlip(start);
      const alt = await fetchPage(flipped.toString(), globalController.signal);
      if (alt.ok) {
        workingStart = flipped;
        homepage = alt;
      }
    }

    if (!homepage.ok) {
      if (homepage.status) stats.httpStatuses.push(homepage.status);
      if (homepage.reason === "timeout" || homepage.reason === "network") {
        stats.networkErrors += 1;
      }
      if (homepage.reason === "non_html") stats.nonHtml += 1;
      if (homepage.reason === "empty") stats.emptyBody += 1;
      if (homepage.reason === "protected") stats.lastReason = "protected";
      else stats.lastReason = homepage.reason;

      return {
        ok: false,
        error: buildFailureMessage(stats),
        startUrl: start.toString(),
        pagesVisited: 1,
        pagesAnalyzed: [],
        items: ensureNotFoundPlaceholders([]),
        skippedRobots: 0,
      };
    }

    try {
      const finalHome = new URL(homepage.finalUrl);
      if (sameRegistrableHost(finalHome, workingStart)) {
        workingStart = finalHome;
      } else {
        stats.offDomain += 1;
      }
    } catch {
      // keep workingStart
    }

    const robots = await loadRobots(
      workingStart.origin,
      globalController.signal,
    );

    const queue: { url: string; score: number }[] = [
      { url: workingStart.toString(), score: 100 },
    ];

    // Seed with already-fetched homepage to avoid double download
    visited.add(workingStart.toString());
    if (!robots.isAllowed(workingStart.toString(), USER_AGENT)) {
      skippedRobots += 1;
      stats.robotsBlocked += 1;
    } else {
      pagesAnalyzed.push(workingStart.toString());
      extractFromHtml(
        homepage.text,
        workingStart,
        acc,
        queue,
        visited,
        workingStart,
      );
    }

    while (queue.length > 0 && visited.size < MAX_PAGES) {
      if (globalController.signal.aborted) break;

      queue.sort((a, b) => b.score - a.score);
      const next = queue.shift();
      if (!next) break;
      if (visited.has(next.url)) continue;
      visited.add(next.url);

      if (!robots.isAllowed(next.url, USER_AGENT)) {
        skippedRobots += 1;
        stats.robotsBlocked += 1;
        continue;
      }

      const page = await fetchPage(next.url, globalController.signal);

      if (!page.ok || !page.text) {
        if (page.status) stats.httpStatuses.push(page.status);
        if (page.reason === "timeout" || page.reason === "network") {
          stats.networkErrors += 1;
        }
        if (page.reason === "non_html") stats.nonHtml += 1;
        if (page.reason === "empty") stats.emptyBody += 1;
        if (page.reason === "protected") stats.lastReason = "protected";
        continue;
      }

      let pageUrl: URL;
      try {
        pageUrl = new URL(page.finalUrl || next.url);
      } catch {
        continue;
      }

      if (!sameRegistrableHost(pageUrl, workingStart)) {
        stats.offDomain += 1;
        continue;
      }

      pagesAnalyzed.push(pageUrl.toString());
      extractFromHtml(page.text, pageUrl, acc, queue, visited, workingStart);
    }

    if (pagesAnalyzed.length === 0) {
      return {
        ok: false,
        error: buildFailureMessage(stats),
        startUrl: start.toString(),
        pagesVisited: visited.size,
        pagesAnalyzed,
        items: ensureNotFoundPlaceholders([]),
        skippedRobots,
      };
    }

    return {
      ok: true,
      startUrl: workingStart.toString(),
      pagesVisited: visited.size,
      pagesAnalyzed,
      items: ensureNotFoundPlaceholders(toItems(acc)),
      skippedRobots,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Timeout della ricerca (45s). Riprova o restringi le pagine del sito."
        : error instanceof Error
          ? error.message
          : "Errore durante la ricerca";

    return {
      ok: false,
      error: message,
      startUrl: start.toString(),
      pagesVisited: visited.size,
      pagesAnalyzed,
      items: ensureNotFoundPlaceholders(toItems(acc)),
      skippedRobots,
    };
  } finally {
    clearTimeout(globalTimer);
  }
}
