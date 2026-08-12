import * as cheerio from "cheerio";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import {
  emptyField,
  type Confidence,
  type EventListingResult,
  type ExtractedEventDraft,
  type ExtractedField,
  type ListingEventCandidate,
} from "@/src/lib/admin/event-import";

const FETCH_TIMEOUT_MS = 20_000;
const MAX_HTML_BYTES = 2_500_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const ITALIAN_MONTHS: Record<string, string> = {
  gennaio: "01",
  febbraio: "02",
  marzo: "03",
  aprile: "04",
  maggio: "05",
  giugno: "06",
  luglio: "07",
  agosto: "08",
  settembre: "09",
  ottobre: "10",
  novembre: "11",
  dicembre: "12",
};

const GENERIC_LISTING_TITLES = new Set([
  "eventi",
  "tutti gli eventi",
  "calendario eventi",
  "novita",
  "novità",
  "news",
  "home",
  "iniziative",
  "cosa fare in citta",
  "cosa fare in città",
]);

function field<T = string>(
  value: T | null | undefined,
  confidence: Confidence,
  source: string,
): ExtractedField<T> {
  if (value === null || value === undefined || value === "") {
    return emptyField<T>(null, "low", source);
  }
  return { value, confidence, source };
}

function absolutize(base: string, href: string | undefined | null) {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“");
}

function cleanText(value: string | null | undefined) {
  return decodeHtmlEntities(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseJsonLdBlocks(html: string): unknown[] {
  const $ = cheerio.load(html);
  const blocks: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw.trim()) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else blocks.push(parsed);
    } catch {
      // ignore invalid JSON-LD
    }
  });
  return blocks;
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getTypes(node: Record<string, unknown>) {
  const raw = node["@type"];
  if (!raw) return [] as string[];
  if (Array.isArray(raw)) return raw.map(String);
  return [String(raw)];
}

function flattenGraph(nodes: unknown[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const obj = node as Record<string, unknown>;
    out.push(obj);
    if (Array.isArray(obj["@graph"])) {
      out.push(...flattenGraph(obj["@graph"]));
    }
  }
  return out;
}

function findEventNodes(nodes: unknown[]) {
  return flattenGraph(nodes).filter((node) =>
    getTypes(node).some((t) => t.toLowerCase().includes("event")),
  );
}

function extractDateParts(isoLike: string | null | undefined): {
  date: string | null;
  time: string | null;
} {
  if (!isoLike) return { date: null, time: null };
  const cleaned = isoLike.trim();
  const dateMatch = cleaned.match(/(\d{4}-\d{2}-\d{2})/);
  const timeMatch = cleaned.match(/T(\d{2}):(\d{2})/);
  return {
    date: dateMatch?.[1] || null,
    time: timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : null,
  };
}

function guessCategory(text: string): string | null {
  const hay = ` ${text.toLowerCase()} `;
  const rules: Array<{ slug: string; words: string[] }> = [
    { slug: "sport-competizioni", words: ["sport", "gara", "maratona", "torneo", "triathlon", "ironman", "ciclismo", "nuoto"] },
    { slug: "musica-concerti", words: ["concerto", "musica", " live ", " band ", " dj "] },
    { slug: "sagre-tradizioni", words: ["sagra", "tradizion", "festa patronale"] },
    { slug: "spettacoli", words: ["spettacolo", "teatro", "cabaret", "show"] },
    { slug: "fiere-mercatini", words: ["fiera", "mercatino", "mercato"] },
    { slug: "arte-cultura", words: ["mostra", "arte", "galleria", "esposizion", "cultura"] },
    { slug: "food-drink", words: ["food", "degustazione", "enogastronom", "wine"] },
    { slug: "famiglie-bambini", words: ["bambini", "famiglie", "kids"] },
    { slug: "celebrazioni", words: ["celebrazion", "cerimonia"] },
  ];
  for (const rule of rules) {
    if (rule.words.some((w) => hay.includes(w))) {
      if (categories.some((c) => c.slug === rule.slug)) return rule.slug;
    }
  }
  return null;
}

function matchCity(text: string): { city: string; province: string } | null {
  const hay = text.toLowerCase();
  const sorted = [...cities].sort((a, b) => b.city.length - a.city.length);
  for (const city of sorted) {
    if (hay.includes(city.city.toLowerCase())) {
      return { city: city.city, province: city.province };
    }
  }
  return null;
}

function locationFromJsonLd(eventNode: Record<string, unknown>) {
  const loc = eventNode.location;
  if (!loc) return { name: null, address: null, locality: null };
  if (typeof loc === "string") {
    return { name: cleanText(loc), address: cleanText(loc), locality: null };
  }
  const locObj = Array.isArray(loc) ? loc[0] : loc;
  if (!locObj || typeof locObj !== "object") {
    return { name: null, address: null, locality: null };
  }
  const place = locObj as Record<string, unknown>;
  const name = cleanText(String(place.name || ""));
  const addressRaw = place.address;
  if (typeof addressRaw === "string") {
    return { name: name || null, address: cleanText(addressRaw), locality: null };
  }
  if (addressRaw && typeof addressRaw === "object") {
    const addr = addressRaw as Record<string, unknown>;
    const street = cleanText(String(addr.streetAddress || ""));
    const locality = cleanText(String(addr.addressLocality || ""));
    const parts = [street, locality].filter(Boolean);
    return {
      name: name || null,
      address: parts.join(", ") || null,
      locality: locality || null,
    };
  }
  return { name: name || null, address: null, locality: null };
}

function organizerFromJsonLd(eventNode: Record<string, unknown>) {
  const org = eventNode.organizer;
  if (!org) return { name: null, url: null, email: null, phone: null };
  if (typeof org === "string") {
    return { name: cleanText(org), url: null, email: null, phone: null };
  }
  const first = Array.isArray(org) ? org[0] : org;
  if (!first || typeof first !== "object") {
    return { name: null, url: null, email: null, phone: null };
  }
  const obj = first as Record<string, unknown>;
  return {
    name: cleanText(String(obj.name || "")) || null,
    url: cleanText(String(obj.url || "")) || null,
    email: cleanText(String(obj.email || "")) || null,
    phone: cleanText(String(obj.telephone || obj.phone || "")) || null,
  };
}

function imageFromJsonLd(eventNode: Record<string, unknown>, pageUrl: string) {
  const image = eventNode.image;
  if (!image) return null;
  if (typeof image === "string") return absolutize(pageUrl, image);
  if (Array.isArray(image)) {
    const first = image[0];
    if (typeof first === "string") return absolutize(pageUrl, first);
    if (first && typeof first === "object" && "url" in first) {
      return absolutize(pageUrl, String((first as { url: string }).url));
    }
  }
  if (typeof image === "object" && image && "url" in image) {
    return absolutize(pageUrl, String((image as { url: string }).url));
  }
  return null;
}

function offersIsFree(eventNode: Record<string, unknown>): boolean | null {
  const offers = asArray(eventNode.offers as unknown);
  if (offers.length === 0) return null;
  for (const offer of offers) {
    if (!offer || typeof offer !== "object") continue;
    const price = String((offer as Record<string, unknown>).price ?? "");
    if (price === "0" || price === "0.0" || price === "0.00") return true;
    const free =
      String((offer as Record<string, unknown>).isAccessibleForFree || "") ===
      "true";
    if (free) return true;
  }
  return null;
}

function priceFromOffers(eventNode: Record<string, unknown>): string | null {
  const offers = asArray(eventNode.offers as unknown);
  for (const offer of offers) {
    if (!offer || typeof offer !== "object") continue;
    const price = (offer as Record<string, unknown>).price;
    if (price !== undefined && price !== null && String(price) !== "") {
      return String(price);
    }
  }
  return null;
}

function ticketFromOffers(eventNode: Record<string, unknown>): string | null {
  const offers = asArray(eventNode.offers as unknown);
  for (const offer of offers) {
    if (!offer || typeof offer !== "object") continue;
    const url = (offer as Record<string, unknown>).url;
    if (typeof url === "string" && url) return url;
  }
  return null;
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
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
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_HTML_BYTES) {
      throw new Error("Pagina troppo grande da analizzare");
    }
    const html = new TextDecoder("utf-8").decode(buffer);
    return { html, finalUrl: response.url || url };
  } finally {
    clearTimeout(timer);
  }
}

function parseItalianCalendarDate($: cheerio.CheerioAPI) {
  const dayEl = $(".calendar-date-day .title-xxlarge-regular").first();
  const monthEl = $(".calendar-date-day__month").first();
  const yearEl = $(".calendar-date-day__year").first();
  const day = cleanText(dayEl.text());
  const monthName = cleanText(monthEl.text()).toLowerCase();
  const year = cleanText(yearEl.text());
  const month = ITALIAN_MONTHS[monthName];
  if (!day || !month || !/^\d{4}$/.test(year)) return null;
  const dd = day.padStart(2, "0");
  return `${year}-${month}-${dd}`;
}

function parseDesignItaliaPlace($: cheerio.CheerioAPI) {
  const place = $("#luogo");
  if (!place.length) return { name: null as string | null, address: null as string | null };
  const name = cleanText(place.find(".card-title").first().text());
  const address = cleanText(place.find(".card-text").first().text());
  return {
    name: name || null,
    address: address || null,
  };
}

/** "13 agosto 2026" / "dal 10 luglio al 20 settembre 2026" → ISO date (inizio). */
function guessDateFromItalianText(text: string, fallbackYear?: string | null) {
  const full = text.match(
    /\b(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})\b/i,
  );
  if (full) {
    const mm = ITALIAN_MONTHS[full[2].toLowerCase()];
    if (mm) return `${full[3]}-${mm}-${full[1].padStart(2, "0")}`;
  }

  const partial = text.match(
    /\b(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/i,
  );
  const year =
    fallbackYear ||
    text.match(/\b(20\d{2})\b/)?.[1] ||
    null;
  if (partial && year) {
    const mm = ITALIAN_MONTHS[partial[2].toLowerCase()];
    if (mm) return `${year}-${mm}-${partial[1].padStart(2, "0")}`;
  }
  return null;
}

/**
 * Elenco HTML stile CityNews (SassariToday, *Today.it): card con link /eventi/*.html
 */
function extractHtmlEventListing(
  $: cheerio.CheerioAPI,
  pageUrl: string,
): EventListingResult | null {
  const candidates: ListingEventCandidate[] = [];
  const seen = new Set<string>();
  const pageYear =
    cleanText($("title").first().text()).match(/\b(20\d{2})\b/)?.[1] ||
    $('a[href*="/eventi/dal/20"]').first().attr("href")?.match(/20\d{2}/)?.[0] ||
    String(new Date().getFullYear());

  const pushCandidate = (titleRaw: string, href: string, description?: string) => {
    if (!href || href.includes("/location/")) return;
    if (!/\.html(?:[?#]|$)/i.test(href)) return;
    const abs = absolutize(pageUrl, href);
    if (!abs || seen.has(abs)) return;
    try {
      const path = new URL(abs).pathname;
      if (/\/eventi\/?$/i.test(path) || /\/eventi\/tipo\//i.test(path)) return;
      if (/\/eventi\/dal\//i.test(path) || /\/eventi\/tema\//i.test(path)) return;
      if (/\/eventi\/data\//i.test(path) || /\/eventi\/cinema\/?$/i.test(path)) return;
    } catch {
      return;
    }
    const title = cleanText(titleRaw);
    if (!title || title.length < 8) return;
    seen.add(abs);
    const yearFromUrl = abs.match(/(20\d{2})/)?.[1] || pageYear;
    const startDate = guessDateFromItalianText(title, yearFromUrl);
    candidates.push({
      title,
      url: abs,
      startAt: startDate ? `${startDate}T12:00:00+02:00` : null,
      endAt: null,
      description: description ? cleanText(description).slice(0, 280) : null,
    });
  };

  // CityNews cards
  $("article.c-card").each((_, article) => {
    const card = $(article);
    const link =
      card.find('a[href*="/eventi/"][href$=".html"]').first().attr("href") ||
      card.find('a[href*="/eventi/"][href*=".html"]').first().attr("href");
    if (!link) return;
    const title =
      card.find("a[aria-label]").first().attr("aria-label") ||
      card.find("h2.c-card__heading, h2, h3").first().text() ||
      "";
    pushCandidate(title, link);
  });

  // Fallback: any event detail anchors with aria-label
  if (candidates.length < 2) {
    $('a[href*="/eventi/"][href*=".html"]').each((_, el) => {
      const href = $(el).attr("href") || "";
      const title =
        $(el).attr("aria-label") ||
        $(el).find("h2, h3").text() ||
        $(el).text();
      pushCandidate(title, href);
    });
  }

  if (candidates.length < 2) return null;

  let sourceName =
    cleanText($('meta[property="og:site_name"]').attr("content") || "") ||
    cleanText($("title").first().text()).split(/[|\-–]/)[0]?.trim() ||
    "elenco web";

  return {
    sourceUrl: pageUrl,
    sourceName,
    total: candidates.length,
    candidates: candidates.slice(0, 30),
  };
}

function detectListaContenuti($: cheerio.CheerioAPI) {
  const el = $("app-lista-contenuti").first();
  if (!el.length) return null;
  const tipocontenuti = (el.attr("tipocontenuti") || "").toLowerCase();
  if (!tipocontenuti.includes("ccm-evento") && !tipocontenuti.includes("evento")) {
    return null;
  }
  const baseUrl = (el.attr("url") || "").replace(/\/$/, "");
  const filtri = el.attr("filtri") || "";
  const sizepagina = Number.parseInt(el.attr("sizepagina") || "12", 10) || 12;
  if (!baseUrl) return null;
  return { baseUrl, tipocontenuti, filtri, sizepagina };
}

async function fetchSolrEventListing(opts: {
  baseUrl: string;
  tipocontenuti: string;
  filtri: string;
  sizepagina: number;
  pageOrigin: string;
}): Promise<{ total: number; candidates: ListingEventCandidate[] } | null> {
  const types = opts.tipocontenuti
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(" OR ");
  const rows = Math.min(Math.max(opts.sizepagina, 9), 24);
  let query = `fq=type:(${types})&rows=${rows}&start=0`;
  if (opts.filtri) {
    query += opts.filtri.startsWith("&") ? opts.filtri : `&${opts.filtri}`;
  } else {
    query += "&sort=instancedate_dt desc";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(
      `${opts.baseUrl}/handleSolrSelect?${encodeURI(query).replace(/\+/g, "%2B")}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json,*/*;q=0.8",
        },
      },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      response?: {
        numFound?: number;
        docs?: Array<Record<string, unknown>>;
      };
    };
    const docs = data.response?.docs || [];
    const candidates: ListingEventCandidate[] = [];
    for (const doc of docs) {
      const title = cleanText(
        String(doc.titolo_it_t || doc.title_it_s || doc.disptitle_sort || ""),
      );
      const link = String(doc.link || "");
      if (!title || !link) continue;
      const abs = absolutize(opts.pageOrigin, link);
      if (!abs) continue;
      candidates.push({
        title,
        url: abs,
        startAt: doc.instancedate_it_dt
          ? String(doc.instancedate_it_dt)
          : doc.instancedate_dt
            ? String(doc.instancedate_dt)
            : null,
        endAt: doc.instancedateend_it_dt
          ? String(doc.instancedateend_it_dt)
          : doc.instancedateend_dt
            ? String(doc.instancedateend_dt)
            : null,
        description: doc.description_it_s
          ? cleanText(String(doc.description_it_s)).slice(0, 280)
          : null,
      });
    }
    return {
      total: data.response?.numFound ?? candidates.length,
      candidates,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function extractEventFromUrl(inputUrl: string): Promise<{
  ok: boolean;
  error?: string;
  draft?: ExtractedEventDraft;
  listing?: EventListingResult;
}> {
  let pageUrl: string;
  try {
    const normalized = /^https?:\/\//i.test(inputUrl.trim())
      ? inputUrl.trim()
      : `https://${inputUrl.trim()}`;
    pageUrl = new URL(normalized).toString();
  } catch {
    return { ok: false, error: "URL non valido" };
  }

  let html: string;
  let finalUrl: string;
  try {
    const fetched = await fetchHtml(pageUrl);
    html = fetched.html;
    finalUrl = fetched.finalUrl;
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Timeout nel caricamento della pagina"
        : error instanceof Error
          ? error.message
          : "Impossibile raggiungere la pagina";
    return { ok: false, error: message };
  }

  const $ = cheerio.load(html);

  // Listing page (Design Italia / OpenCms): pick a single event first
  const lista = detectListaContenuti($);
  if (lista) {
    const listing = await fetchSolrEventListing({
      ...lista,
      pageOrigin: finalUrl,
    });
    let sourceName =
      cleanText($('meta[property="og:site_name"]').attr("content") || "") ||
      "sito comunale";
    if (listing && listing.candidates.length > 0) {
      return {
        ok: true,
        listing: {
          sourceUrl: finalUrl,
          sourceName,
          total: listing.total,
          candidates: listing.candidates,
        },
      };
    }
    return {
      ok: false,
      error:
        "Questa sembra una pagina elenco eventi, non un singolo evento. Apri la scheda di un evento e usa quella URL, oppure riprova più tardi.",
    };
  }

  // Listing page HTML (CityNews / SassariToday e simili) — non sulle schede .html
  const pathname = new URL(finalUrl).pathname;
  const isLikelyDetailPage = /\.html(?:[?#]|$)/i.test(pathname);
  const isLikelyListingPath =
    /\/eventi\/?$/i.test(pathname) ||
    /\/eventi\/(tipo|tema|dal|data)\b/i.test(pathname) ||
    (/\/eventi\/[^/]+\/?$/i.test(pathname) && !isLikelyDetailPage);

  if (!isLikelyDetailPage) {
    const htmlListing = extractHtmlEventListing($, finalUrl);
    if (
      htmlListing &&
      (htmlListing.candidates.length >= 5 ||
        (isLikelyListingPath && htmlListing.candidates.length >= 2))
    ) {
      return { ok: true, listing: htmlListing };
    }
  }

  $("script:not([type='application/ld+json']), style, noscript").remove();

  const jsonLd = parseJsonLdBlocks(html);
  const eventNodes = findEventNodes(jsonLd);
  const eventNode = eventNodes[0] || null;

  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogDescription =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const ogSiteName = $('meta[property="og:site_name"]').attr("content") || "";
  const docTitle = cleanText($("title").first().text()).replace(
    /\s*[|\-–].*$/,
    "",
  );
  const h1 =
    $("h1[data-element='news-title']").first().text() ||
    $("h1.l-entry__title").first().text() ||
    $("h1").first().text();

  let title = cleanText(ogTitle || h1 || docTitle);
  let description = cleanText(ogDescription);
  let startDate: string | null = null;
  let startTime: string | null = null;
  let endDate: string | null = null;
  let endTime: string | null = null;
  let locationName: string | null = null;
  let address: string | null = null;
  let municipality: string | null = null;
  let province: string | null = null;
  let organizerName: string | null = null;
  let organizerWebsite: string | null = null;
  let organizerEmail: string | null = null;
  let organizerPhone: string | null = null;
  let imageUrl = absolutize(finalUrl, ogImage);
  let isFree: boolean | null = null;
  let priceFrom: string | null = null;
  let ticketUrl: string | null = null;
  let category: string | null = null;

  const conf = {
    title: "medium" as Confidence,
    description: "medium" as Confidence,
    dates: "low" as Confidence,
    place: "low" as Confidence,
    organizer: "low" as Confidence,
    image: ogImage ? ("high" as Confidence) : ("low" as Confidence),
    category: "low" as Confidence,
  };
  const sources = {
    title: ogTitle ? "Open Graph" : h1 ? "H1" : docTitle ? "Title" : "",
    description: ogDescription ? "meta/OG" : "",
    dates: "",
    place: "",
    organizer: "",
    image: ogImage ? "og:image" : "",
    category: "",
  };

  if (eventNode) {
    title = cleanText(String(eventNode.name || eventNode.headline || title));
    description = cleanText(
      String(eventNode.description || description),
    );
    const start = extractDateParts(
      String(eventNode.startDate || eventNode.start_date || ""),
    );
    const end = extractDateParts(
      String(eventNode.endDate || eventNode.end_date || ""),
    );
    startDate = start.date;
    startTime = start.time;
    endDate = end.date;
    endTime = end.time;
    conf.dates = startDate ? "high" : "low";
    sources.dates = "JSON-LD Event";
    conf.title = title ? "high" : conf.title;
    sources.title = "JSON-LD Event";
    conf.description = description ? "high" : conf.description;
    sources.description = description ? "JSON-LD Event" : sources.description;

    const loc = locationFromJsonLd(eventNode);
    locationName = loc.name;
    address = loc.address;
    if (loc.locality) municipality = loc.locality;
    conf.place = loc.name || loc.address || loc.locality ? "high" : conf.place;
    sources.place = "JSON-LD Event";

    const org = organizerFromJsonLd(eventNode);
    organizerName = org.name;
    organizerWebsite = org.url;
    organizerEmail = org.email;
    organizerPhone = org.phone;
    conf.organizer = org.name ? "high" : conf.organizer;
    sources.organizer = org.name ? "JSON-LD Event" : sources.organizer;

    const jsonImage = imageFromJsonLd(eventNode, finalUrl);
    if (jsonImage) {
      imageUrl = jsonImage;
      conf.image = "high";
      sources.image = "JSON-LD Event";
    }

    isFree =
      typeof eventNode.isAccessibleForFree === "boolean"
        ? eventNode.isAccessibleForFree
        : offersIsFree(eventNode);
    priceFrom = priceFromOffers(eventNode);
    ticketUrl = ticketFromOffers(eventNode);
  }

  // Design Italia municipal detail page: calendar + luogo
  if (!startDate) {
    const calDate = parseItalianCalendarDate($);
    if (calDate) {
      startDate = calDate;
      conf.dates = "high";
      sources.dates = "Calendario pagina";
    }
  }
  const designPlace = parseDesignItaliaPlace($);
  if (designPlace.name || designPlace.address) {
    locationName = locationName || designPlace.name;
    address = address || designPlace.address;
    if (!sources.place) {
      conf.place = "high";
      sources.place = "Sezione Luogo";
    }
  }
  if (isFree === null) {
    const costi = cleanText($("#prezzi").text()).toLowerCase();
    if (costi.includes("gratuito")) {
      isFree = true;
    }
  }

  // Prefer city from title/location over dubious JSON-LD locality
  // (some CMS pages put a wrong addressLocality).
  const titleCity = matchCity([title, locationName || ""].join(" "));
  const pageCity = matchCity(
    [title, description, locationName || "", address || "", municipality || ""].join(
      " ",
    ),
  );
  const preferredCity = titleCity || pageCity;
  if (preferredCity) {
    const localityLooksWrong =
      municipality &&
      municipality.toLowerCase() !== preferredCity.city.toLowerCase() &&
      Boolean(titleCity);
    if (!municipality || localityLooksWrong) {
      municipality = preferredCity.city;
      province = preferredCity.province;
      conf.place = titleCity ? "high" : "medium";
      sources.place = titleCity
        ? "Match città (titolo/luogo)"
        : "Match città Everas";
    } else {
      province = province || preferredCity.province;
      if (!sources.place) {
        conf.place = "medium";
        sources.place = "Match città Everas";
      }
    }
  }

  if (!organizerName && ogSiteName) {
    organizerName = cleanText(ogSiteName);
    conf.organizer = "medium";
    sources.organizer = "og:site_name";
  }

  category = guessCategory(`${title} ${description}`);
  if (category) {
    conf.category = eventNode ? "medium" : "low";
    sources.category = "Euristica testo";
  }

  // Italian date heuristic if still missing
  if (!startDate) {
    const bodyText = $("body").text().replace(/\s+/g, " ");
    const itNamed = bodyText.match(
      /\b(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})\b/i,
    );
    if (itNamed) {
      const dd = itNamed[1].padStart(2, "0");
      const mm = ITALIAN_MONTHS[itNamed[2].toLowerCase()];
      if (mm) {
        startDate = `${itNamed[3]}-${mm}-${dd}`;
        conf.dates = "medium";
        sources.dates = "Testo pagina";
      }
    }
  }
  if (!startDate) {
    const bodyText = $("body").text().replace(/\s+/g, " ");
    const itDate = bodyText.match(
      /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/,
    );
    if (itDate) {
      const dd = itDate[1].padStart(2, "0");
      const mm = itDate[2].padStart(2, "0");
      const yyyy = itDate[3];
      startDate = `${yyyy}-${mm}-${dd}`;
      conf.dates = "medium";
      sources.dates = "Testo pagina";
    }
    const timeHit = bodyText.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
    if (timeHit && !startTime) {
      startTime = `${timeHit[1].padStart(2, "0")}:${timeHit[2]}`;
    }
  }

  if (!imageUrl) {
    const firstImg = $("article img, main img, .event img, img")
      .filter((_, el) => {
        const src = $(el).attr("src") || "";
        return Boolean(src) && !src.includes("logo") && !src.includes("icon");
      })
      .first()
      .attr("src");
    imageUrl = absolutize(finalUrl, firstImg);
    if (imageUrl) {
      conf.image = "medium";
      sources.image = "Immagine pagina";
    }
  }

  let sourceName = cleanText(ogSiteName);
  if (!sourceName) {
    try {
      sourceName = new URL(finalUrl).hostname.replace(/^www\./, "");
    } catch {
      sourceName = "web";
    }
  }

  if (!title) {
    return {
      ok: false,
      error:
        "Nessun titolo evento trovato. Controlla che la pagina contenga un evento pubblico.",
    };
  }

  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const looksLikeListingTitle =
    GENERIC_LISTING_TITLES.has(normalizedTitle) ||
    normalizedTitle.startsWith("tutti gli eventi");
  if (
    !startDate &&
    (looksLikeListingTitle ||
      /\/eventi\/?$/i.test(new URL(finalUrl).pathname))
  ) {
    return {
      ok: false,
      error:
        "Questa sembra una pagina elenco, non un singolo evento. Apri la scheda di un evento specifico e usa quella URL.",
    };
  }

  const draft: ExtractedEventDraft = {
    title: field(title, conf.title, sources.title),
    description: field(description, conf.description, sources.description),
    startDate: field(startDate, conf.dates, sources.dates),
    startTime: field(startTime, conf.dates, sources.dates),
    endDate: field(endDate, conf.dates, sources.dates),
    endTime: field(endTime, conf.dates, sources.dates),
    category: field(category, conf.category, sources.category),
    subcategory: emptyField(),
    municipality: field(municipality, conf.place, sources.place),
    province: field(province, conf.place, sources.place),
    locationName: field(locationName, conf.place, sources.place),
    address: field(address, conf.place, sources.place),
    organizerName: field(organizerName, conf.organizer, sources.organizer),
    organizerWebsite: field(
      organizerWebsite,
      conf.organizer,
      sources.organizer,
    ),
    organizerEmail: field(organizerEmail, conf.organizer, sources.organizer),
    organizerPhone: field(organizerPhone, conf.organizer, sources.organizer),
    imageUrl: field(imageUrl, conf.image, sources.image),
    isFree: field(isFree, isFree === null ? "low" : "medium", "JSON-LD/offers"),
    priceFrom: field(priceFrom, priceFrom ? "medium" : "low", "JSON-LD/offers"),
    ticketUrl: field(ticketUrl, ticketUrl ? "medium" : "low", "JSON-LD/offers"),
    sourceUrl: finalUrl,
    sourceName,
  };

  return { ok: true, draft };
}
