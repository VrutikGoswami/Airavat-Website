"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { MapPoint } from "@/types";
import { MapCanvasLazy } from "@/components/map/MapCanvasLazy";
import { MapPlaceList } from "@/components/map/MapPlaceList";
import { KENYA_VIEW, MAP_ATTRIBUTION_NOTE } from "@/config/map";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Homepage "Explore Kenya" section: a linked destination list and an
 * interactive map kept in two-way sync. Selecting a card moves + highlights
 * the marker and opens its popup; selecting a marker highlights and scrolls
 * to its card. Maasai Mara is flagged as the seasonal focus when active.
 */
export function ExploreKenyaMap({
  points,
  seasonalId,
}: {
  points: MapPoint[];
  seasonalId?: string | null;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keep the active card visible in whichever list is on screen.
  useEffect(() => {
    if (!activeId || !rootRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rootRef.current
      .querySelectorAll<HTMLElement>(`[data-point-id="${activeId}"]`)
      .forEach((el) =>
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "nearest" }),
      );
  }, [activeId]);

  const activePoint = points.find((p) => p.id === activeId);
  const planSlug = activePoint?.destinationSlug ?? "maasai-mara";
  const planLabel = activePoint ? `Plan a ${activePoint.name} trip` : "Plan this trip";

  return (
    <div ref={rootRef}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
        {/* List — column on desktop, rail on mobile */}
        <div className="order-2 lg:order-1">
          <div className="lg:hidden">
            <MapPlaceList
              points={points}
              activePointId={activeId}
              onSelect={(id) => setActiveId(id || null)}
              seasonalId={seasonalId}
              withThumbnails
              layout="rail"
            />
          </div>
          <div className="hidden max-h-[30rem] overflow-y-auto border border-parchment lg:block">
            <MapPlaceList
              points={points}
              activePointId={activeId}
              onSelect={(id) => setActiveId(id || null)}
              seasonalId={seasonalId}
              withThumbnails
            />
          </div>
        </div>

        {/* Map */}
        <div className="order-1 lg:order-2">
          <MapCanvasLazy
            points={points}
            center={KENYA_VIEW.center}
            zoom={KENYA_VIEW.zoom}
            activePointId={activeId}
            onSelect={(id) => setActiveId(id || null)}
            highlightId={seasonalId}
            heightClass="h-72 sm:h-96 lg:h-[30rem]"
            trackingSource="homepage-explore-kenya"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-parchment pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs text-stone">{MAP_ATTRIBUTION_NOTE}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/destinations/maasai-mara" variant="outline">
            View Maasai Mara
          </ButtonLink>
          <ButtonLink href={`/request-a-quote?service=safari&destination=${planSlug}`}>
            {planLabel}
          </ButtonLink>
        </div>
      </div>

      <Link
        href="/destinations/maasai-mara#map"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
      >
        Open the full Maasai Mara map <ArrowRight aria-hidden className="size-4" />
      </Link>
    </div>
  );
}
