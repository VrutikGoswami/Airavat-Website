"use client";

import maplibregl, { Map as MLMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { MapPoint } from "@/types";
import { getMapStyleUrl } from "@/config/map";
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

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function popupHtml(point: MapPoint): string {
  const category = CATEGORY_META[point.category].label;
  const verification = point.verified
    ? ""
    : `<p style="margin:6px 12px 0;font-size:10px;color:#8A8273;">Demonstration location — to be verified</p>`;
  const link = point.href
    ? `<p style="margin:8px 12px 0;"><a href="${point.href}" style="color:#B4531F;font-weight:600;font-size:12px;">View details →</a></p>`
    : "";
  return `<div style="max-width:230px;padding-bottom:12px;background:#F7F2E9;">
    <p style="margin:10px 12px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:#93441A;">${category}</p>
    <p style="margin:2px 12px 0;font-weight:700;font-size:14px;color:#26221B;">${point.name}</p>
    <p style="margin:6px 12px 0;font-size:12px;line-height:1.5;color:#57503F;">${point.shortDescription}</p>
    ${verification}${link}
  </div>`;
}

/**
 * Shared MapLibre canvas: custom brand markers, popups, fit-to-points,
 * reset + zoom controls, loading skeleton and a graceful fallback when
 * WebGL or the style fails (the accessible place list always exists
 * outside this component).
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
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());
  const popupRef = useRef<Popup | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Keep callback fresh without re-creating the map.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!supportsWebGL()) {
      setStatus("error");
      return;
    }

    let map: MLMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: getMapStyleUrl(),
        center,
        zoom,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
    } catch {
      setStatus("error");
      return;
    }

    mapRef.current = map;
    const markers = markersRef.current;
    let loaded = false;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => {
      loaded = true;
      setStatus("ready");
      track("map_opened", { source: trackingSource });
    });
    map.on("error", () => {
      // Only fail hard if the style never loaded (tile hiccups are tolerable).
      if (!loaded) setStatus("error");
    });

    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; view changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Markers.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    points.forEach((point) => {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `${point.name} — show details`);
      el.style.cssText = `width:16px;height:16px;border-radius:50%;border:2.5px solid #F7F2E9;cursor:pointer;background:${CATEGORY_META[point.category].color};box-shadow:0 1px 6px rgb(38 34 27 / 0.45);padding:0;`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(point.id);
        track("map_marker_selected", { source: trackingSource, point: point.id });
      });
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
      markersRef.current.set(point.id, marker);
    });

    if (fitToPoints && points.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.longitude, p.latitude]));
      map.fitBounds(bounds, { padding: 56, animate: false, maxZoom: 11 });
    }
  }, [points, status, fitToPoints, trackingSource]);

  // Active point: emphasise marker, open popup, centre view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    popupRef.current?.remove();
    popupRef.current = null;

    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const isActive = id === activePointId;
      el.style.width = isActive ? "22px" : "16px";
      el.style.height = isActive ? "22px" : "16px";
      el.style.zIndex = isActive ? "5" : "1";
      el.style.outline = isActive ? "3px solid rgba(233,180,76,0.85)" : "none";
    });

    if (!activePointId) return;
    const point = points.find((p) => p.id === activePointId);
    if (!point) return;

    popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: true })
      .setLngLat([point.longitude, point.latitude])
      .setHTML(popupHtml(point))
      .addTo(map);

    const target: [number, number] = [point.longitude, point.latitude];
    if (prefersReducedMotion()) {
      map.jumpTo({ center: target });
    } else {
      map.easeTo({ center: target, duration: 650 });
    }
  }, [activePointId, points, status]);

  const resetView = () => {
    const map = mapRef.current;
    if (!map) return;
    if (fitToPoints && points.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.longitude, p.latitude]));
      map.fitBounds(bounds, { padding: 56, animate: !prefersReducedMotion(), maxZoom: 11 });
    } else {
      map.jumpTo({ center, zoom });
    }
    popupRef.current?.remove();
    onSelectRef.current?.("");
  };

  if (status === "error") {
    return (
      <div
        className={`flex ${heightClass} flex-col items-center justify-center border border-parchment bg-sand p-8 text-center`}
        role="note"
      >
        <p className="font-semibold">The interactive map could not load on this device.</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          All locations are listed alongside this map, so no information is missing.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${heightClass} overflow-hidden border border-parchment`}>
      <div ref={containerRef} className="absolute inset-0" aria-hidden={status !== "ready"} />
      {status === "loading" ? (
        <div className="absolute inset-0 animate-pulse bg-sand" aria-label="Map loading">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-stone">
            Loading map…
          </div>
        </div>
      ) : null}
      {status === "ready" ? (
        <button
          type="button"
          onClick={resetView}
          className="absolute left-3 top-3 rounded-[3px] bg-ivory/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink shadow hover:bg-ivory"
        >
          Reset map
        </button>
      ) : null}
    </div>
  );
}
