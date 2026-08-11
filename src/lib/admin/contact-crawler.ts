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
const PAGE_TIMEOUT_MS = 12_000;
const USER_AGENT =
  "EverasContactBot/1.0 (+https://everas.it; admin contact discovery; respectful crawler)";

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
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

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
  emails: Map<string, { category: ReturnType<typeof classifyEmail>; sourceUrl: string }>;
  phones: Map<string, string>;
  addresses: Map<string, string>;
  facebook: Map<string, string>;
  instagram: Map<string, string>;
  pages: Map<ContactFieldKey, string>;
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
  if (/amministrazion|uffici|organigramma/.test(hay)) return "page_amministrazione";
  return null;
}

function cleanPhone(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function isLikelyPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 13) return false;
  // Reject values that look like dates / codes (e.g. 00239740905)
  if (/^00\d{8,}$/.test(digits) && !digits.startsWith("0039")) return false;
  return /^(?:\+?39)?0\d{5,10}$|^(?:\+?39)?3\d{8,9}$/.test(
    digits.replace(/^0039/, "39"),
  );
}

function cleanEmail(raw: string) {
  return raw.toLowerCase().replace(/[),.;:]+$/, "");
}

function isLikelyJunkEmail(email: string) {
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

async function fetchText(
  url: string,
  signal: AbortSignal,
): Promise<{ ok: boolean; status: number; text: string; finalUrl: string }> {
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
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { ok: false, status: response.status, text: "", finalUrl: response.url };
    }
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      text,
      finalUrl: response.url,
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

async function loadRobots(origin: string, signal: AbortSignal) {
  try {
    const robotsUrl = new URL("/robots.txt", origin).toString();
    const res = await fetchText(robotsUrl, signal);
    if (!res.ok || !res.text) {
      return robotsParser(robotsUrl, "");
    }
    return robotsParser(robotsUrl, res.text);
  } catch {
    return robotsParser(new URL("/robots.txt", origin).toString(), "");
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
    // Prefer civic addresses (number and/or CAP)
    if (!/\d/.test(address)) continue;
    acc.addresses.set(address, pageUrl.toString());
  }

  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const absolute = absolutize(pageUrl, href);
    if (!absolute) return;

    const host = absolute.hostname.replace(/^www\./, "");
    if (host === "facebook.com" || host === "fb.com" || host === "m.facebook.com") {
      const value = absolute.toString();
      if (!acc.facebook.has(value)) acc.facebook.set(value, pageUrl.toString());
      return;
    }
    if (host === "instagram.com" || host === "www.instagram.com") {
      const value = absolute.toString();
      if (!acc.instagram.has(value)) acc.instagram.set(value, pageUrl.toString());
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

function ensureNotFoundPlaceholders(items: FoundContactItem[]): FoundContactItem[] {
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

  try {
    const robots = await loadRobots(start.origin, globalController.signal);
    const queue: { url: string; score: number }[] = [
      { url: start.toString(), score: 100 },
    ];

    while (queue.length > 0 && visited.size < MAX_PAGES) {
      if (globalController.signal.aborted) break;

      queue.sort((a, b) => b.score - a.score);
      const next = queue.shift();
      if (!next) break;
      if (visited.has(next.url)) continue;
      visited.add(next.url);

      if (!robots.isAllowed(next.url, USER_AGENT)) {
        skippedRobots += 1;
        continue;
      }

      let page;
      try {
        page = await fetchText(next.url, globalController.signal);
      } catch {
        continue;
      }

      if (!page.ok || !page.text) continue;

      let pageUrl: URL;
      try {
        pageUrl = new URL(page.finalUrl || next.url);
      } catch {
        continue;
      }

      if (!sameRegistrableHost(pageUrl, start)) continue;

      pagesAnalyzed.push(pageUrl.toString());
      extractFromHtml(page.text, pageUrl, acc, queue, visited, start);
    }

    if (pagesAnalyzed.length === 0) {
      return {
        ok: false,
        error:
          "Sito non raggiungibile, protetto, o senza pagine HTML pubbliche analizzabili",
        startUrl: start.toString(),
        pagesVisited: visited.size,
        pagesAnalyzed,
        items: ensureNotFoundPlaceholders([]),
        skippedRobots,
      };
    }

    return {
      ok: true,
      startUrl: start.toString(),
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
