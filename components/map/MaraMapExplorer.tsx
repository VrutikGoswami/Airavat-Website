"use client";

import { useMemo, useState } from "react";
import type { MapPoint, MapPointCategory } from "@/types";
import { MapCanvas, CATEGORY_META } from "@/components/map/MapCanvas";
import { MapPlaceList } from "@/components/map/MapPlaceList";
import { MARA_VIEW, MAP_ATTRIBUTION_NOTE } from "@/config/map";

/**
 * Audley-inspired list-and-map explorer. Desktop: sticky map beside a
 * scrolling list; mobile: category filters, an accessible list accordion
 * pattern and a compact map below — no tiny split screens.
 */
export function MaraMapExplorer({ points }: { points: MapPoint[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [category, setCategory] = useState<MapPointCategory | "">("");

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

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter map places by category"
      >
        <button
          type="button"
          aria-pressed={category === ""}
          onClick={() => {
            setCategory("");
            setActiveId(null);
          }}
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            category === ""
              ? "border-ink bg-ink text-cream"
              : "border-parchment text-ink-soft hover:border-ink"
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
              category === c
                ? "border-ink bg-ink text-cream"
                : "border-parchment text-ink-soft hover:border-ink"
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

      {/* Desktop: list + sticky map. Mobile: map after the list. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="order-2 max-h-150 overflow-y-auto border border-parchment lg:order-1">
          <MapPlaceList points={filtered} activePointId={activeId} onSelect={select} />
        </div>
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <MapCanvas
              points={filtered}
              center={MARA_VIEW.center}
              zoom={MARA_VIEW.zoom}
              activePointId={activeId}
              onSelect={select}
              fitToPoints
              heightClass="h-80 sm:h-100 lg:h-150"
              trackingSource="mara-explorer"
            />
            <p className="mt-3 text-xs text-stone">{MAP_ATTRIBUTION_NOTE}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
