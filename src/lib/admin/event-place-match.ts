import { cities } from "@/src/data/cities";

function normalized(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’‘]/g, "'");
}

/** Match names as words; a street named after a town is not an event locality. */
export function containsPlaceName(text: string, name: string) {
  const hay = normalized(text);
  const needle = normalized(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${needle}(?![\\p{L}\\p{N}])`, "gu");
  for (const match of hay.matchAll(pattern)) {
    const before = hay.slice(0, match.index).trimEnd();
    if (/\b(?:via|viale|v\.|corso|piazza|vicolo|largo|strada)\s*$/u.test(before)) continue;
    return true;
  }
  return false;
}

export function matchEventCity(text: string): { city: string; province: string } | null {
  const sorted = [...cities].sort((a, b) => b.city.length - a.city.length);
  for (const city of sorted) {
    if (containsPlaceName(text, city.city)) return { city: city.city, province: city.province };
  }
  return null;
}
