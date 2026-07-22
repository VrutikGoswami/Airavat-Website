"use client";

import { MapPin, Search } from "lucide-react";
import type { RateDestinationOption } from "@/types/rates";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/search/DateRangePicker";
import { OccupancyPicker, type Occupancy } from "@/components/search/OccupancyPicker";

export type HotelSearchValues = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  market: "east-african-resident" | "non-resident";
};

export function HotelSearchBar({
  destinations,
  value,
  onChange,
  onSubmit,
  submitLabel = "Show hotel rates",
  loading = false,
  error,
  showMarket = true,
}: {
  destinations: RateDestinationOption[];
  value: HotelSearchValues;
  onChange: (value: HotelSearchValues) => void;
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
  error?: string | null;
  showMarket?: boolean;
}) {
  const occupancy: Occupancy = { adults: value.adults, children: value.children, rooms: value.rooms };

  return (
    <div>
      <div className="grid gap-[3px] overflow-visible border-[3px] border-ochre bg-ochre shadow-lg lg:grid-cols-[1.15fr_1.2fr_1fr_auto]">
        <label className="relative flex min-h-16 items-center gap-3 bg-white px-4 hover:bg-ochre/5">
          <MapPin aria-hidden className="size-5 shrink-0 text-ochre" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-stone">Destination</span>
            <select
              aria-label="Destination"
              value={value.destination}
              onChange={(event) => onChange({ ...value, destination: event.target.value })}
              className="w-full appearance-none bg-transparent text-sm font-bold text-ink outline-none"
            >
              <option value="">Where are you going?</option>
              {destinations.map((destination) => (
                <option key={destination.slug} value={destination.slug}>
                  {destination.name} ({destination.hotelCount} {destination.hotelCount === 1 ? "property" : "properties"})
                </option>
              ))}
            </select>
          </span>
        </label>
        <DateRangePicker
          startDate={value.checkIn}
          endDate={value.checkOut}
          onChange={(checkIn, checkOut) => onChange({ ...value, checkIn, checkOut })}
          label="Select dates"
        />
        <OccupancyPicker
          value={occupancy}
          onChange={(next) => onChange({ ...value, ...next })}
        />
        <Button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="min-h-16 rounded-none px-6 text-base lg:min-w-40"
        >
          <Search aria-hidden className="size-5" />
          {loading ? "Checking..." : submitLabel}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {showMarket ? (
          <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
            Rate type
            <select
              value={value.market}
              onChange={(event) => onChange({ ...value, market: event.target.value as HotelSearchValues["market"] })}
              className="border border-parchment bg-white px-2.5 py-2 text-xs font-bold text-ink outline-none focus-visible:border-ochre"
            >
              <option value="east-african-resident">East African resident</option>
              <option value="non-resident">Overseas visitor</option>
            </select>
          </label>
        ) : null}
        <span className="text-xs text-ink-soft">Rates are checked for your exact dates and party.</span>
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-clay" role="alert">{error}</p> : null}
    </div>
  );
}
