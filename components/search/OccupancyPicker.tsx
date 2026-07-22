"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";

export type Occupancy = { adults: number; children: number; rooms: number };

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="inline-flex size-8 items-center justify-center border border-parchment text-ink hover:border-ochre hover:text-clay disabled:opacity-35" aria-label={`Remove one ${label.toLowerCase()}`}>
          <Minus aria-hidden className="size-4" />
        </button>
        <span className="w-5 text-center text-sm font-bold">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="inline-flex size-8 items-center justify-center border border-parchment text-ink hover:border-ochre hover:text-clay disabled:opacity-35" aria-label={`Add one ${label.toLowerCase()}`}>
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function OccupancyPicker({ value, onChange, includeRooms = true }: { value: Occupancy; onChange: (value: Occupancy) => void; includeRooms?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="flex min-h-16 w-full items-center gap-3 bg-white px-4 text-left outline-none transition-colors hover:bg-ochre/5">
        <Users aria-hidden className="size-5 shrink-0 text-ochre" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold text-stone">Select occupancy</span>
          <span className="block truncate text-sm font-bold text-ink">
            {value.adults} {value.adults === 1 ? "adult" : "adults"} · {value.children} {value.children === 1 ? "child" : "children"}{includeRooms ? ` · ${value.rooms} ${value.rooms === 1 ? "room" : "rooms"}` : ""}
          </span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 border border-parchment bg-white px-4 py-2 shadow-xl" role="dialog" aria-label="Select occupancy">
          <Counter label="Adults" value={value.adults} min={1} max={20} onChange={(adults) => onChange({ ...value, adults })} />
          <Counter label="Children" value={value.children} min={0} max={20} onChange={(children) => onChange({ ...value, children })} />
          {includeRooms ? <Counter label="Rooms" value={value.rooms} min={1} max={20} onChange={(rooms) => onChange({ ...value, rooms })} /> : null}
          <button type="button" onClick={() => setOpen(false)} className="my-2 w-full bg-ochre px-4 py-2 text-sm font-bold text-cream hover:bg-clay">Done</button>
        </div>
      ) : null}
    </div>
  );
}
