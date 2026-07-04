"use client";

import maplibregl, { Map as MLMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { MapPoint } from "@/types";
import { CATEGORY_META, getMapStyleUrl } from "@/config/map";
import { track } from "@/lib/analytics";
import { buildWhatsAppUrl, whatsappGreeting } from "@/lib/whatsapp";

export type MapCanvasProps = {
  points: MapPoint[];
  center: [number, number];
  zoom: number;
  activePointId?: string | null;
  onSelect?: (id: string) => void;
  /** Persistent gold ring, e.g. the current seasonal destination. */
  highlightId?: string | null;
  /** Fallback slug for "Plan this trip" when a point has no destinationSlug. */
  defaultDestinationSlug?: string;
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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Lightweight, brand-styled popup with an image and enquiry actions. */
function popupHtml(point: MapPoint, defaultSlug?: string): string {
  const meta = CATEGORY_META[point.category];
  const slug = point.destinationSlug ?? defaultSlug;
  const planHref = slug
    ? `/request-a-quote?service=safari&destination=${encodeURIComponent(slug)}`
    : "/request-a-quote";
  const waMessage = whatsappGreeting(`I would like help planning a trip to ${point.name}.`);
  const waHref = buildWhatsAppUrl(waMessage) ?? "/contact#whatsapp";
  const waTarget = waHref.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";

  const imageBlock = point.image
    ? `<div style="height:118px;overflow:hidden;background:#EFE7D8;"><img src="/_next/image?url=${encodeURIComponent(
        point.image,
      )}&w=384&q=70" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>`
    : "";

  const verification = point.verified
    ? ""
    : `<p style="margin:8px 0 0;font-size:10px;color:#8A8273;">Demonstration location — to be verified</p>`;

  const btn =
    "display:block;text-align:center;padding:7px 8px;border-radius:3px;font-size:12px;font-weight:600;text-decoration:none;line-height:1;";
  const viewBtn = point.href
    ? `<a href="${point.href}" style="${btn}border:1px solid rgba(38,34,27,0.22);color:#26221B;">View destination</a>`
    : "";

  return `<div style="width:250px;background:#F7F2E9;font-family:inherit;">
    ${imageBlock}
    <div style="padding:11px 13px 13px;">
      <p style="margin:0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:#93441A;">${esc(meta.label)}</p>
      <p style="margin:3px 0 0;font-weight:700;font-size:15px;color:#26221B;">${esc(point.name)}</p>
      <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#57503F;">${esc(point.shortDescription)}</p>
      ${verification}
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:11px;">
        ${viewBtn}
        <a href="${planHref}" style="${btn}background:#B4531F;color:#F7F2E9;">Plan this trip</a>
        <a href="${waHref}"${waTarget} style="${btn}border:1px solid rgba(38,34,27,0.22);color:#26221B;">Chat on WhatsApp</a>
      </div>
    </div>
  </div>`;
}

/**
 * Shared MapLibre canvas: custom brand markers with hover/active/seasonal
 * states, image-rich popups with enquiry actions, fit-to-points, reset + zoom
 * controls, loading skeleton and a graceful fallback when WebGL or the style
 * fails (the accessible place list always exists outside this component).
 */
export function MapCanvas({
  points,
  center,
  zoom,
  activePointId,
  onSelect,
  highlightId,
  defaultDestinationSlug,
  fitToPoints = false,
  heightClass = "h-105",
  trackingSource,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());
  const popupRef = useRef<Popup | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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
      if (!loaded) setStatus("error");
    });

    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
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
      el.style.cssText = `width:16px;height:16px;border-radius:50%;border:2.5px solid #F7F2E9;cursor:pointer;background:${CATEGORY_META[point.category].color};box-shadow:0 1px 6px rgb(38 34 27 / 0.45);padding:0;transition:transform 140ms ease, width 140ms ease, height 140ms ease;`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(point.id);
        track("map_marker_selected", { source: trackingSource, point: point.id });
      });
      el.addEventListener("mouseenter", () => {
        if (point.id !== activePointId) el.style.transform = "scale(1.18)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, status, fitToPoints, trackingSource]);

  // Active + seasonal-highlight marker states, popup, and centring.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;

    popupRef.current?.remove();
    popupRef.current = null;

    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const isActive = id === activePointId;
      const isHighlight = id === highlightId;
      const size = isActive ? 24 : isHighlight ? 20 : 16;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = "";
      el.style.zIndex = isActive ? "6" : isHighlight ? "4" : "1";
      el.style.outline = isActive
        ? "3px solid rgba(233,180,76,0.95)"
        : isHighlight
          ? "3px solid rgba(233,180,76,0.65)"
          : "none";
      el.style.outlineOffset = "1px";
    });

    if (!activePointId) return;
    const point = points.find((p) => p.id === activePointId);
    if (!point) return;

    popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: true, maxWidth: "260px" })
      .setLngLat([point.longitude, point.latitude])
      .setHTML(popupHtml(point, defaultDestinationSlug))
      .addTo(map);
    popupRef.current.on("close", () => onSelectRef.current?.(""));

    const target: [number, number] = [point.longitude, point.latitude];
    if (prefersReducedMotion()) {
      map.jumpTo({ center: target });
    } else {
      map.easeTo({ center: target, duration: 650 });
    }
  }, [activePointId, highlightId, points, status, defaultDestinationSlug]);

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
          className="absolute left-3 top-3 z-[2] rounded-[3px] bg-ivory/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink shadow hover:bg-ivory"
        >
          Reset map
        </button>
      ) : null}
    </div>
  );
}
