const COORDS_KEY = "everas_geo_coords";
const DENIED_KEY = "everas_geo_denied";

export type GeoCoords = {
  lat: number;
  lng: number;
};

export function readGeoCoords(): GeoCoords | null {
  try {
    const raw = window.localStorage.getItem(COORDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GeoCoords>;
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number" &&
      Number.isFinite(parsed.lat) &&
      Number.isFinite(parsed.lng)
    ) {
      return { lat: parsed.lat, lng: parsed.lng };
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveGeoCoords(coords: GeoCoords) {
  try {
    window.localStorage.setItem(COORDS_KEY, JSON.stringify(coords));
    window.localStorage.removeItem(DENIED_KEY);
  } catch {
    // ignore
  }
}

export function isGeoDenied() {
  try {
    return window.localStorage.getItem(DENIED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markGeoDenied() {
  try {
    window.localStorage.setItem(DENIED_KEY, "1");
  } catch {
    // ignore
  }
}
