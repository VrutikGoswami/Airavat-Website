/**
 * Tile-provider configuration, kept apart from map components so the
 * provider can change without touching UI code.
 */

const FALLBACK_TILE_TEMPLATE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function getMapTileUrl({ x, y, z }: { x: number; y: number; z: number }): string {
  const template = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? FALLBACK_TILE_TEMPLATE;
  const key = process.env.NEXT_PUBLIC_MAP_PROVIDER_KEY;
  const url = template
    .replace("{x}", String(x))
    .replace("{y}", String(y))
    .replace("{z}", String(z))
    .replace("{key}", key ?? "");
  if (!key || template.includes("{key}")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}key=${key}`;
}

/** Approximate view of Kenya for the homepage preview. */
export const KENYA_VIEW = {
  center: [37.9, 0.2] as [number, number],
  zoom: 5.1,
};

/** Approximate view of the Maasai Mara ecosystem. */
export const MARA_VIEW = {
  center: [35.25, -1.42] as [number, number],
  zoom: 8.4,
};

export const MAP_ATTRIBUTION_NOTE =
  "Map locations are provided for trip-planning context. Routes, access points and operating conditions should be confirmed before travel.";

export const MAP_TILE_ATTRIBUTION = "© OpenStreetMap contributors";
