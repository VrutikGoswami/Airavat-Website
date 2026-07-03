"use client";

import dynamic from "next/dynamic";

function MapSkeleton({ heightClass }: { heightClass: string }) {
  return (
    <div className={`${heightClass} animate-pulse border border-parchment bg-sand`} aria-hidden />
  );
}

/**
 * Client-side-only map bundles: MapLibre touches window/WebGL, so both
 * composites load dynamically with ssr disabled and a skeleton while the
 * chunk downloads.
 */
export const LazyKenyaMapPreview = dynamic(
  () => import("@/components/map/KenyaMapPreview").then((m) => m.KenyaMapPreview),
  { ssr: false, loading: () => <MapSkeleton heightClass="h-72 sm:h-96 lg:h-120" /> },
);

export const LazyMaraMapExplorer = dynamic(
  () => import("@/components/map/MaraMapExplorer").then((m) => m.MaraMapExplorer),
  { ssr: false, loading: () => <MapSkeleton heightClass="h-80 sm:h-100 lg:h-150" /> },
);
