/**
 * Converts HTML (or plain text) into plain text for local search / matching only.
 *
 * NOT a security sanitizer — never insert the result into the DOM as HTML.
 * Intentionally free of Cheerio / DOM APIs so it stays out of the client graph.
 */
export function htmlToSearchText(
  value: string | null | undefined,
): string {
  if (value == null) return "";
  let text = String(value);
  if (!text) return "";

  // Drop script/style blocks entirely (content included).
  text = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");

  // Block-level / break tags → whitespace separators before stripping tags.
  text = text.replace(/<br\s*\/?>/gi, " ");
  text = text.replace(
    /<\/?(?:p|div|li|ul|ol|h[1-6]|tr|td|th|blockquote|section|article|header|footer|nav|main|pre|hr)(?:\s[^>]*)?>/gi,
    " ",
  );

  // Remaining tags.
  text = text.replace(/<[^>]+>/g, " ");

  // Named entities (common subset used in event descriptions).
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

  // Numeric entities: decimal then hex.
  text = text.replace(/&#(\d+);/g, (_, digits: string) => {
    const code = Number(digits);
    if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return " ";
    try {
      return String.fromCodePoint(code);
    } catch {
      return " ";
    }
  });
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
    const code = Number.parseInt(hex, 16);
    if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return " ";
    try {
      return String.fromCodePoint(code);
    } catch {
      return " ";
    }
  });

  // Normalize NBSP and whitespace; drop gaps before punctuation (Cheerio-like).
  text = text.replace(/\u00a0/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.replace(/ ([.,;:!?])/g, "$1");
  return text.trim();
}
