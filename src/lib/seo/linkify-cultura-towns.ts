import { CULTURE_TOWNS } from "@/src/lib/seo/cultura-towns";

export type LinkifyPart =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

type TownLink = { name: string; path: string };

let cachedTowns: TownLink[] | null = null;

function cultureTownLinksSorted(): TownLink[] {
  if (cachedTowns) return cachedTowns;

  const byPath = new Map<string, TownLink>();
  for (const article of CULTURE_TOWNS) {
    const name = article.town.trim();
    if (!name || name.length < 3) continue;
    const existing = byPath.get(article.path);
    if (!existing || name.length > existing.name.length) {
      byPath.set(article.path, { name, path: article.path });
    }
  }

  cachedTowns = [...byPath.values()].sort(
    (a, b) => b.name.length - a.name.length || a.name.localeCompare(b.name, "it"),
  );
  return cachedTowns;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split FAQ (or other plain) text so municipality names with a Scopri guide
 * become link parts. Longest names first; overlapping matches skipped.
 */
export function linkifyCulturaTownNames(text: string): LinkifyPart[] {
  if (!text) return [];

  const towns = cultureTownLinksSorted();
  type Match = { start: number; end: number; href: string; value: string };
  const matches: Match[] = [];

  for (const town of towns) {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(town.name)}(?![\\p{L}\\p{N}])`,
      "giu",
    );
    for (const hit of text.matchAll(pattern)) {
      const start = hit.index ?? -1;
      if (start < 0) continue;
      const value = hit[0];
      const end = start + value.length;
      const overlaps = matches.some(
        (m) => !(end <= m.start || start >= m.end),
      );
      if (overlaps) continue;
      matches.push({ start, end, href: town.path, value });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const parts: LinkifyPart[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) {
      parts.push({ type: "text", value: text.slice(cursor, match.start) });
    }
    parts.push({
      type: "link",
      value: match.value,
      href: match.href,
    });
    cursor = match.end;
  }
  if (cursor < text.length) {
    parts.push({ type: "text", value: text.slice(cursor) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}
