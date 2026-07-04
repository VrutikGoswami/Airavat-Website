"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MapPoint, MapPointCategory } from "@/types";
import { MapCanvasLazy } from "@/components/map/MapCanvasLazy";
import { MapPlaceList } from "@/components/map/MapPlaceList";
import { CATEGORY_META, MARA_VIEW, MAP_ATTRIBUTION_NOTE } from "@/config/map";

/**
 * Audley-inspired list-and-map explorer for a destination page.
 *
 * Desktop: a filterable, scrollable locations list beside a sticky map.
 * Mobile: the map first, then a horizontally scrollable rail of location
 * cards — no cramped split screen. Cards and markers stay in sync, and
 * popups carry image + enquiry actions (with `defaultDestinationSlug`
 * driving "Plan this trip" for sub-locations).
 */
export function MaraMapExplorer({
  points,
  seasonalId,
  defaultDestinationSlug = "maasai-mara",
}: {
  points: MapPoint[];
  seasonalId?: string | null;
  defaultDestinationSlug?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [category, setCategory] = useState<MapPointCategory | "">("");
  const rootRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () =>
      (Object.keys(CATEGORY_META) as MapPointCategory[]).filter((c) =>
        points.some((p) => p.category === c),
      ),
    [points],
  );

  const filtered = useMemo(
    () => (category ? points.filter((p) => p.category === category) : points),
    [points, category],
  );

  const select = (id: string) => setActiveId(id || null);

  useEffect(() => {
    if (!activeId || !rootRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rootRef.current
      .querySelectorAll<HTMLElement>(`[data-point-id="${activeId}"]`)
      .forEach((el) =>
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "nearest" }),
      );
  }, [activeId]);

  return (
    <div ref={rootRef}>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter map places by category">
        <button
          type="button"
          aria-pressed={category === ""}
          onClick={() => {
            setCategory("");
            setActiveId(null);
          }}
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            category === "" ? "border-ink bg-ink text-cream" : "border-parchment text-ink-soft hover:border-ink"
          }`}
        >
          All places
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setActiveId(null);
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === c ? "border-ink bg-ink text-cream" : "border-parchment text-ink-soft hover:border-ink"
            }`}
          >
            <span
              aria-hidden
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: CATEGORY_META[c].color }}
            />
            {CATEGORY_META[c].label}
          </button>
        ))}
      </div>

      {/* Desktop: list + sticky map. Mobile: map only (rail follows below). */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="order-2 hidden max-h-150 overflow-y-auto border border-parchment lg:order-1 lg:block">
          <MapPlaceList
            points={filtered}
            activePointId={activeId}
            onSelect={select}
            seasonalId={seasonalId}
            withThumbnails
          />
        </div>
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <MapCanvasLazy
              points={filtered}
              center={MARA_VIEW.center}
              zoom={MARA_VIEW.zoom}
              activePointId={activeId}
              onSelect={select}
              highlightId={seasonalId}
              defaultDestinationSlug={defaultDestinationSlug}
              fitToPoints
              heightClass="h-80 sm:h-100 lg:h-150"
              trackingSource="mara-explorer"
            />
            <p className="mt-3 text-xs text-stone">{MAP_ATTRIBUTION_NOTE}</p>
          </div>
        </div>
      </div>

      {/* Mobile rail of location cards under the map */}
      <div className="mt-5 lg:hidden">
        <MapPlaceList
          points={filtered}
          activePointId={activeId}
          onSelect={select}
          seasonalId={seasonalId}
          withThumbnails
          layout="rail"
        />
      </div>
    </div>
  );
}
