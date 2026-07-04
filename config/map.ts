/**
 * Tile-provider configuration and map metadata, kept apart from the MapLibre
 * component so (a) the provider can change without touching UI code and
 * (b) the list/legend can render on the server without pulling maplibre-gl
 * into the initial bundle.
 */
import type { MapPointCategory } from "@/types";

/** Marker + legend colours per location category (brand palette). */
export const CATEGORY_META: Record<MapPointCategory, { label: string; color: string }> = {
  destination: { label: "Destination", color: "#B4531F" },
  reserve: { label: "Reserve", color: "#6E4A2A" },
  conservancy: { label: "Conservancy", color: "#4A5A40" },
  gate: { label: "Gate", color: "#26221B" },
  airstrip: { label: "Airstrip", color: "#7C8FA0" },
  town: { label: "Town / staging", color: "#8A8273" },
  experience: { label: "Experience area", color: "#C08A2E" },
  departure: { label: "Departure point", color: "#93441A" },
};

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
