"use client";

import { useState } from "react";
import Link from "next/link";
import type { MapPoint } from "@/types";
import { MapCanvas } from "@/components/map/MapCanvas";
import { MapPlaceList } from "@/components/map/MapPlaceList";
import { KENYA_VIEW, MAP_ATTRIBUTION_NOTE } from "@/config/map";

/**
 * Homepage Kenya preview: on mobile a horizontally scrollable place rail
 * followed by a compact map; on desktop the list sits beside the map.
 */
export function KenyaMapPreview({ points }: { points: MapPoint[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
        <div className="order-2 lg:order-1">
          <div className="lg:hidden">
            <MapPlaceList
              points={points}
              activePointId={activeId}
              onSelect={(id) => setActiveId(id || null)}
              layout="rail"
            />
          </div>
          <div className="hidden max-h-120 overflow-y-auto border border-parchment lg:block">
            <MapPlaceList
              points={points}
              activePointId={activeId}
              onSelect={(id) => setActiveId(id || null)}
            />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <MapCanvas
            points={points}
            center={KENYA_VIEW.center}
            zoom={KENYA_VIEW.zoom}
            activePointId={activeId}
            onSelect={(id) => setActiveId(id || null)}
            heightClass="h-72 sm:h-96 lg:h-120"
            trackingSource="homepage-kenya-preview"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone">{MAP_ATTRIBUTION_NOTE}</p>
        <Link
          href="/destinations/maasai-mara#map"
          className="text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
        >
          Open the full Maasai Mara map →
        </Link>
      </div>
    </div>
  );
}
