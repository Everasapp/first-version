import * as cheerio from "cheerio";

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
]);

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/** Testo piano per meta SEO / anteprime. */
export function stripHtml(value: string) {
  if (!value) return "";
  if (!looksLikeHtml(value)) return value.replace(/\s+/g, " ").trim();
  const $ = cheerio.load(`<div id="__root">${value}</div>`);
  return $("#__root").text().replace(/\s+/g, " ").trim();
}

/**
 * Sanifica HTML descrizione evento: solo tag sicuri + link https/http/mailto.
 */
export function sanitizeEventHtml(dirty: string) {
  if (!dirty.trim()) return "";

  const $ = cheerio.load(`<div id="__root">${dirty}</div>`, {
    xml: false,
  });
  const root = $("#__root");

  root.find("script, style, iframe, object, embed, form, input, button").remove();

  // Deepest-first: unwrap disallowed tags without skipping nested content.
  const elements = root.find("*").toArray().reverse();
  for (const node of elements) {
    const el = $(node);
    const tag =
      "tagName" in node && typeof node.tagName === "string"
        ? node.tagName.toLowerCase()
        : "";

    if (!ALLOWED_TAGS.has(tag)) {
      el.replaceWith(el.contents());
      continue;
    }

    const attribs =
      "attribs" in node && node.attribs && typeof node.attribs === "object"
        ? { ...(node.attribs as Record<string, string>) }
        : {};
    for (const name of Object.keys(attribs)) {
      const keepHref = tag === "a" && name === "href";
      const keepTitle = tag === "a" && name === "title";
      if (!keepHref && !keepTitle) {
        el.removeAttr(name);
      }
    }

    if (tag === "a") {
      const href = (el.attr("href") || "").trim();
      const safe =
        /^https?:\/\//i.test(href) ||
        /^mailto:/i.test(href) ||
        (href.startsWith("/") && !href.startsWith("//"));

      if (!safe) {
        el.replaceWith(el.contents());
        continue;
      }

      el.attr("href", href);
      el.attr("target", "_blank");
      el.attr("rel", "noopener noreferrer");
    }
  }

  return (root.html() || "").trim();
}

/** Normalizza descrizione in ingresso (import / salvataggio). */
export function normalizeEventDescription(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!looksLikeHtml(trimmed)) return trimmed;
  return sanitizeEventHtml(trimmed);
}
