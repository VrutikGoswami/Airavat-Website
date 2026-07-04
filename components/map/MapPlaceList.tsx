"use client";

import Image from "next/image";
import type { MapPoint } from "@/types";
import { CATEGORY_META } from "@/config/map";

type Props = {
  points: MapPoint[];
  activePointId: string | null;
  onSelect: (id: string) => void;
  layout?: "column" | "rail";
  /** Point id to badge as the current seasonal focus. */
  seasonalId?: string | null;
  /** Show image thumbnails where a point has one. */
  withThumbnails?: boolean;
};

/**
 * Keyboard-accessible place list paired with a map. This list is the
 * canonical, non-visual source of the same information — the map is never
 * the only way to reach it. Each item carries `data-point-id` so a parent
 * can scroll the active card into view.
 */
export function MapPlaceList({
  points,
  activePointId,
  onSelect,
  layout = "column",
  seasonalId,
  withThumbnails = false,
}: Props) {
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
        const seasonal = point.id === seasonalId;
        const showImg = withThumbnails && point.image;
        return (
          <li key={point.id} className={isRail ? "w-64 shrink-0 snap-start" : ""}>
            <button
              type="button"
              data-point-id={point.id}
              aria-pressed={active}
              onClick={() => onSelect(active ? "" : point.id)}
              className={`flex h-full w-full gap-3 px-4 py-3.5 text-left transition-colors ${
                isRail ? "flex-col border border-parchment" : "items-start"
              } ${active ? "bg-sand" : "bg-transparent hover:bg-sand/60"}`}
            >
              {showImg ? (
                <span
                  className={`img-frame relative block overflow-hidden rounded-[3px] ${
                    isRail ? "aspect-[16/9] w-full" : "size-14 shrink-0"
                  }`}
                >
                  <Image
                    src={point.image as string}
                    alt=""
                    fill
                    sizes={isRail ? "256px" : "56px"}
                    className="object-cover"
                  />
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_META[point.category].color }}
                  />
                  <span className="eyebrow text-[10px] text-stone">
                    {CATEGORY_META[point.category].label}
                  </span>
                  {seasonal ? (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-clay">
                      Seasonal focus
                    </span>
                  ) : !point.verified ? (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-stone/80">
                      Demo
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block font-bold">{point.name}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {point.shortDescription}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
