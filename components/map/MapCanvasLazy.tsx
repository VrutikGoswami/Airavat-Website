"use client";

import dynamic from "next/dynamic";
import type { MapCanvasProps } from "@/components/map/MapCanvas";
import { InViewLazy } from "@/components/map/InViewLazy";

/**
 * The MapLibre canvas, loaded only in the browser (ssr:false) AND only once
 * its section nears the viewport (InViewLazy). This keeps maplibre-gl out of
 * the initial bundle and off the network until needed, while the surrounding
 * list/legend still render on the server. A height-reserving wrapper prevents
 * layout shift during load.
 */
const MapCanvasInner = dynamic(
  () => import("@/components/map/MapCanvas").then((m) => m.MapCanvas),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-sand" aria-hidden /> },
);

export function MapCanvasLazy(props: MapCanvasProps) {
  const height = props.heightClass ?? "h-105";
  return (
    <div className={height}>
      <InViewLazy
        className="h-full"
        fallback={<div className="h-full w-full animate-pulse rounded-[2px] border border-parchment bg-sand" aria-hidden />}
      >
        <MapCanvasInner {...props} heightClass="h-full" />
      </InViewLazy>
    </div>
  );
}
