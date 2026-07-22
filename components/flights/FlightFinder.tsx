"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftRight, Search } from "lucide-react";
import { AirportAutocomplete } from "@/components/ui/AirportAutocomplete";
import { Button } from "@/components/ui/Button";
import { DateRangePicker } from "@/components/search/DateRangePicker";
import { OccupancyPicker, type Occupancy } from "@/components/search/OccupancyPicker";

export type FlightSearchValues = {
  origin: string;
  destination: string;
  tripType: "one-way" | "return";
  baggage: "0" | "1" | "2" | "extra";
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  cabinClass: "economy" | "premium-economy" | "business" | "first" | "any";
};

const defaultValues: FlightSearchValues = {
  origin: "Nairobi (NBO)",
  destination: "",
  tripType: "return",
  baggage: "0",
  departureDate: "",
  returnDate: "",
  adults: 1,
  children: 0,
  cabinClass: "economy",
};

export function FlightFinder({
  initial,
  onComplete,
  submitLabel = "Find flights",
}: {
  initial?: Partial<FlightSearchValues>;
  onComplete?: (values: FlightSearchValues) => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState<FlightSearchValues>({ ...defaultValues, ...initial });
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!value.origin.trim() || !value.destination.trim()) {
      setError("Choose both your departure and arrival airports.");
      return;
    }
    if (!value.departureDate || (value.tripType === "return" && !value.returnDate)) {
      setError(value.tripType === "return" ? "Choose departure and return dates." : "Choose a departure date.");
      return;
    }
    setError(null);
    const complete = value.tripType === "one-way" ? { ...value, returnDate: "" } : value;
    if (onComplete) {
      onComplete(complete);
      return;
    }
    const params = new URLSearchParams({
      service: "flights",
      origin: complete.origin,
      destination: complete.destination,
      tripType: complete.tripType,
      baggage: complete.baggage,
      checkIn: complete.departureDate,
      adults: String(complete.adults),
      children: String(complete.children),
      cabinClass: complete.cabinClass,
    });
    if (complete.returnDate) params.set("checkOut", complete.returnDate);
    router.push(`/request-a-quote?${params.toString()}`);
  }

  const occupancy: Occupancy = { adults: value.adults, children: value.children, rooms: 1 };

  return (
    <div className="bg-[#eef0ee] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-ink">
          <span className="sr-only">Trip type</span>
          <select
            value={value.tripType}
            onChange={(event) => {
              const tripType = event.target.value as FlightSearchValues["tripType"];
              setValue((current) => ({ ...current, tripType, returnDate: tripType === "one-way" ? "" : current.returnDate }));
            }}
            className="bg-transparent py-2 pr-2 font-semibold outline-none focus-visible:text-clay"
          >
            <option value="return">Return</option>
            <option value="one-way">One-way</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-ink">
          <span className="sr-only">Checked baggage</span>
          <select
            value={value.baggage}
            onChange={(event) => setValue((current) => ({ ...current, baggage: event.target.value as FlightSearchValues["baggage"] }))}
            className="bg-transparent py-2 pr-2 font-semibold outline-none focus-visible:text-clay"
          >
            <option value="0">0 bags</option>
            <option value="1">1 bag</option>
            <option value="2">2 bags</option>
            <option value="extra">Extra baggage</option>
          </select>
        </label>
      </div>

      <div className="grid gap-px overflow-visible bg-parchment shadow-lg lg:grid-cols-[1fr_auto_1fr_1.05fr_0.9fr_auto]">
        <AirportAutocomplete label="From" placeholder="City or airport" value={value.origin} onChange={(origin) => setValue((current) => ({ ...current, origin }))} variant="search" />
        <button
          type="button"
          onClick={() => setValue((current) => ({ ...current, origin: current.destination, destination: current.origin }))}
          className="inline-flex min-h-12 items-center justify-center bg-white px-3 text-ink hover:text-clay"
          aria-label="Swap departure and arrival airports"
          title="Swap airports"
        >
          <ArrowLeftRight aria-hidden className="size-5" />
        </button>
        <AirportAutocomplete label="To" placeholder="City or airport" value={value.destination} onChange={(destination) => setValue((current) => ({ ...current, destination }))} variant="search" />
        <DateRangePicker
          startDate={value.departureDate}
          endDate={value.returnDate}
          mode={value.tripType === "one-way" ? "single" : "range"}
          onChange={(departureDate, returnDate) => setValue((current) => ({ ...current, departureDate, returnDate }))}
          label={value.tripType === "one-way" ? "Departure" : "Departure - return"}
        />
        <div className="grid min-w-0 grid-cols-[1fr_auto] bg-white">
          <OccupancyPicker value={occupancy} includeRooms={false} onChange={(next) => setValue((current) => ({ ...current, adults: next.adults, children: next.children }))} />
          <label className="flex items-center border-l border-parchment px-3">
            <span className="sr-only">Cabin class</span>
            <select value={value.cabinClass} onChange={(event) => setValue((current) => ({ ...current, cabinClass: event.target.value as FlightSearchValues["cabinClass"] }))} className="max-w-28 bg-white text-xs font-bold text-ink outline-none">
              <option value="economy">Economy</option>
              <option value="premium-economy">Premium</option>
              <option value="business">Business</option>
              <option value="first">First</option>
              <option value="any">Any cabin</option>
            </select>
          </label>
        </div>
        <Button type="button" onClick={submit} className="min-h-16 rounded-none px-6 text-base lg:min-w-36">
          <Search aria-hidden className="size-5" /> {submitLabel}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-clay" role="alert">{error}</p> : null}
    </div>
  );
}
