"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapPoint } from "@/types";
import { getMapTileUrl, MAP_TILE_ATTRIBUTION } from "@/config/map";
import { track } from "@/lib/analytics";

export const CATEGORY_META: Record<
  MapPoint["category"],
  { label: string; color: string }
> = {
  reserve: { label: "Reserve", color: "#B4531F" },
  conservancy: { label: "Conservancy", color: "#4A5A40" },
  gate: { label: "Gate", color: "#26221B" },
  airstrip: { label: "Airstrip", color: "#7C8FA0" },
  town: { label: "Town / staging", color: "#8A8273" },
  experience: { label: "Experience area", color: "#E9B44C" },
  departure: { label: "Departure point", color: "#93441A" },
};

type Props = {
  points: MapPoint[];
  center: [number, number];
  zoom: number;
  activePointId?: string | null;
  onSelect?: (id: string) => void;
  /** Fit the view to the supplied points on load / when they change. */
  fitToPoints?: boolean;
  heightClass?: string;
  trackingSource: string;
};

type Size = { width: number; height: number };
type View = { center: [number, number]; zoom: number };

const TILE_SIZE = 256;
const MIN_ZOOM = 3;
const MAX_ZOOM = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function zoomLevel(value: number): number {
  return clamp(Math.round(value), MIN_ZOOM, MAX_ZOOM);
}

function project(longitude: number, latitude: number, zoom: number) {
  const sin = Math.sin((clamp(latitude, -85.0511, 85.0511) * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function fitView(points: MapPoint[], fallback: View, size: Size, fitToPoints: boolean): View {
  if (!fitToPoints || points.length < 2 || size.width === 0 || size.height === 0) {
    return { center: fallback.center, zoom: zoomLevel(fallback.zoom) };
  }

  const west = Math.min(...points.map((p) => p.longitude));
  const east = Math.max(...points.map((p) => p.longitude));
  const south = Math.min(...points.map((p) => p.latitude));
  const north = Math.max(...points.map((p) => p.latitude));
  const center: [number, number] = [(west + east) / 2, (south + north) / 2];
  const usableWidth = Math.max(160, size.width - 96);
  const usableHeight = Math.max(160, size.height - 96);

  for (let z = MAX_ZOOM; z >= MIN_ZOOM; z -= 1) {
    const nw = project(west, north, z);
    const se = project(east, south, z);
    if (Math.abs(se.x - nw.x) <= usableWidth && Math.abs(se.y - nw.y) <= usableHeight) {
      return { center, zoom: z };
    }
  }

  return { center, zoom: MIN_ZOOM };
}

/**
 * Shared HTML map canvas: OpenStreetMap raster tiles, custom brand markers,
 * accessible marker buttons, popups, category/list sync and no WebGL dependency.
 */
export function MapCanvas({
  points,
  center,
  zoom,
  activePointId,
  onSelect,
  fitToPoints = false,
  heightClass = "h-105",
  trackingSource,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [manualZoom, setManualZoom] = useState<number | null>(null);

  const baseView = useMemo(
    () => fitView(points, { center, zoom }, size, fitToPoints),
    [center, fitToPoints, points, size, zoom],
  );
  const view = { ...baseView, zoom: manualZoom ?? baseView.zoom };
  const z = zoomLevel(view.zoom);
  const activePoint = points.find((p) => p.id === activePointId) ?? null;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resize = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (openedRef.current || size.width === 0 || size.height === 0) return;
    openedRef.current = true;
    track("map_opened", { source: trackingSource });
  }, [size, trackingSource]);

  useEffect(() => {
    setManualZoom(null);
  }, [baseView.center, baseView.zoom]);

  const centerPx = project(view.center[0], view.center[1], z);
  const origin = {
    x: centerPx.x - size.width / 2,
    y: centerPx.y - size.height / 2,
  };
  const tileMinX = Math.floor(origin.x / TILE_SIZE);
  const tileMaxX = Math.floor((origin.x + size.width) / TILE_SIZE);
  const tileMinY = Math.floor(origin.y / TILE_SIZE);
  const tileMaxY = Math.floor((origin.y + size.height) / TILE_SIZE);
  const worldTiles = 2 ** z;

  const tiles = [];
  for (let x = tileMinX; x <= tileMaxX; x += 1) {
    for (let y = tileMinY; y <= tileMaxY; y += 1) {
      if (y < 0 || y >= worldTiles) continue;
      const wrappedX = ((x % worldTiles) + worldTiles) % worldTiles;
      tiles.push({
        key: `${z}-${x}-${y}`,
        src: getMapTileUrl({ x: wrappedX, y, z }),
        left: x * TILE_SIZE - origin.x,
        top: y * TILE_SIZE - origin.y,
      });
    }
  }

  const markerPosition = (point: MapPoint) => {
    const px = project(point.longitude, point.latitude, z);
    return {
      left: px.x - origin.x,
      top: px.y - origin.y,
    };
  };

  const resetView = () => {
    setManualZoom(null);
    onSelect?.("");
  };

  const setZoom = (nextZoom: number) => {
    setManualZoom(clamp(nextZoom, MIN_ZOOM, MAX_ZOOM));
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${heightClass} overflow-hidden border border-parchment bg-sand`}
      aria-label="Interactive destination map"
    >
      {size.width > 0 ? (
        <>
          <div className="absolute inset-0" aria-hidden>
            {tiles.map((tile) => (
              <div
                key={tile.key}
                className="absolute bg-cover bg-center"
                style={{
                  left: tile.left,
                  top: tile.top,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  backgroundImage: `url(${tile.src})`,
                }}
              />
            ))}
          </div>

          {points.map((point) => {
            const pos = markerPosition(point);
            const active = activePointId === point.id;
            return (
              <button
                key={point.id}
                type="button"
                aria-label={`${point.name} - show details`}
                aria-pressed={active}
                onClick={() => {
                  onSelect?.(active ? "" : point.id);
                  track("map_marker_selected", { source: trackingSource, point: point.id });
                }}
                className="absolute z-10 rounded-full border-[2.5px] border-ivory shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: active ? 24 : 18,
                  height: active ? 24 : 18,
                  backgroundColor: CATEGORY_META[point.category].color,
                  transform: "translate(-50%, -50%)",
                  outline: active ? "3px solid rgba(233,180,76,0.85)" : "none",
                }}
              />
            );
          })}

          {activePoint ? (
            <div
              className="absolute z-20 w-64 border border-parchment bg-ivory p-4 text-left shadow-lg"
              style={{
                ...markerPosition(activePoint),
                transform: "translate(-50%, calc(-100% - 18px))",
              }}
            >
              <p className="eyebrow text-[10px] text-ochre">
                {CATEGORY_META[activePoint.category].label}
              </p>
              <h3 className="mt-1 font-bold">{activePoint.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {activePoint.shortDescription}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-stone">
                Useful for {CATEGORY_META[activePoint.category].label.toLowerCase()} planning.
              </p>
              {!activePoint.verified ? (
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-stone">
                  Demonstration location - to be verified
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                {activePoint.href ? (
                  <a href={activePoint.href} className="text-ochre hover:text-clay">
                    View details
                  </a>
                ) : null}
                <a
                  href={`/request-a-quote?service=safari&destination=${encodeURIComponent(activePoint.name)}`}
                  className="text-ink hover:text-clay"
                >
                  Add to my trip
                </a>
              </div>
            </div>
          ) : null}

          <div className="absolute left-3 top-3 z-30 flex overflow-hidden border border-parchment bg-ivory/95 shadow">
            <button
              type="button"
              onClick={resetView}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-sand"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setZoom(z + 1)}
              className="border-l border-parchment px-3 py-1.5 text-sm font-bold text-ink hover:bg-sand"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom(z - 1)}
              className="border-l border-parchment px-3 py-1.5 text-sm font-bold text-ink hover:bg-sand"
              aria-label="Zoom out"
            >
              -
            </button>
          </div>

          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-1 right-1 z-30 bg-ivory/90 px-1.5 py-0.5 text-[10px] text-stone hover:text-ink"
          >
            {MAP_TILE_ATTRIBUTION}
          </a>
        </>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-sand" aria-label="Map loading" />
      )}
    </div>
  );
}
