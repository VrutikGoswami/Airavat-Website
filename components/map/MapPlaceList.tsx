"use client";

import type { MapPoint } from "@/types";
import { CATEGORY_META } from "@/components/map/MapCanvas";

type Props = {
  points: MapPoint[];
  activePointId: string | null;
  onSelect: (id: string) => void;
  layout?: "column" | "rail";
};

/**
 * Keyboard-accessible place list paired with a map. This list is the
 * canonical, non-visual source of the same information — the map is never
 * the only way to reach it.
 */
export function MapPlaceList({ points, activePointId, onSelect, layout = "column" }: Props) {
  const isRail = layout === "rail";

  return (
    <ul
      className={
        isRail
          ? "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3"
          : "divide-y divide-parchment"
      }
    >
      {points.map((point) => {
        const active = point.id === activePointId;
        return (
          <li key={point.id} className={isRail ? "w-64 shrink-0 snap-start" : ""}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? "" : point.id)}
              className={`h-full w-full px-4 py-4 text-left transition-colors ${
                isRail ? "border border-parchment" : ""
              } ${active ? "bg-sand" : "bg-transparent hover:bg-sand/60"}`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_META[point.category].color }}
                />
                <span className="eyebrow text-[10px] text-stone">
                  {CATEGORY_META[point.category].label}
                </span>
                {!point.verified ? (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-stone/80">
                    Demo
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block font-bold">{point.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                {point.shortDescription}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
