/**
 * Tile-provider configuration, kept apart from map components so the
 * provider can change without touching UI code.
 */

const FALLBACK_STYLE_URL = "https://demotiles.maplibre.org/style.json";

export function getMapStyleUrl(): string {
  const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
  const key = process.env.NEXT_PUBLIC_MAP_PROVIDER_KEY;
  if (!styleUrl) return FALLBACK_STYLE_URL;
  if (key) {
    const sep = styleUrl.includes("?") ? "&" : "?";
    return `${styleUrl}${sep}key=${key}`;
  }
  return styleUrl;
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
