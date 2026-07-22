"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { BedDouble, Plane, Sparkles } from "lucide-react";
import type { RateDestinationOption } from "@/types/rates";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/forms/fields";
import { AirportAutocomplete } from "@/components/ui/AirportAutocomplete";

type Tab = "hotels" | "flights" | "packages";

const tabs: { id: Tab; label: string; icon: typeof BedDouble }[] = [
  { id: "hotels", label: "Hotels", icon: BedDouble },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "packages", label: "Packages", icon: Sparkles },
];

/**
 * Home hero search: three tabs that each hand off to the dedicated finder
 * with the search pre-seeded, so the home page stays light and every path
 * reaches a real booking flow in one step.
 */
export function QuickSearch({ destinations }: { destinations: RateDestinationOption[] }) {
  const [tab, setTab] = useState<Tab>("hotels");

  return (
    <div className="rounded-[4px] border border-parchment bg-ivory/95 shadow-lg backdrop-blur">
      <div className="flex border-b border-parchment" role="tablist" aria-label="What are you booking?">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${
              tab === id
                ? "border-b-2 border-ochre text-clay"
                : "border-b-2 border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </button>
        ))}
      </div>
      <div className="p-5 sm:p-6">
        {tab === "hotels" ? <HotelsTab destinations={destinations} /> : null}
        {tab === "flights" ? <FlightsTab /> : null}
        {tab === "packages" ? <PackagesTab /> : null}
      </div>
    </div>
  );
}

function HotelsTab({ destinations }: { destinations: RateDestinationOption[] }) {
  const router = useRouter();
  const [destination, setDestination] = useState(destinations[0]?.slug ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      setError("Pick a destination and your dates.");
      return;
    }
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/hotels/rates?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <SelectField label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
        {destinations.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.name}
          </option>
        ))}
      </SelectField>
      <TextField label="Check-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      <TextField
        label="Check-out"
        type="date"
        value={checkOut}
        min={checkIn || undefined}
        onChange={(e) => setCheckOut(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Adults"
          type="number"
          min={1}
          max={20}
          value={adults}
          onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
        />
        <TextField
          label="Children"
          type="number"
          min={0}
          max={20}
          required={false}
          value={children}
          onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
        />
      </div>
      {error ? <p className="text-sm font-semibold text-clay sm:col-span-2 lg:col-span-4">{error}</p> : null}
      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" className="w-full sm:w-auto">
          Show hotel rates
        </Button>
      </div>
    </form>
  );
}

function FlightsTab() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Nairobi (NBO)");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Tell us where you're flying from and to.");
      return;
    }
    const params = new URLSearchParams({ service: "flights", origin, destination });
    if (checkIn) params.set("checkIn", checkIn);
    router.push(`/request-a-quote?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <AirportAutocomplete label="Flying from" value={origin} onChange={setOrigin} />
      <AirportAutocomplete
        label="Flying to"
        placeholder="Type a city, e.g. Dubai"
        value={destination}
        onChange={setDestination}
      />
      <TextField
        label="Departure (approx.)"
        type="date"
        required={false}
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Book in 2 minutes
        </Button>
      </div>
      {error ? <p className="text-sm font-semibold text-clay sm:col-span-2 lg:col-span-4">{error}</p> : null}
      <p className="text-xs text-ink-soft sm:col-span-2 lg:col-span-4">
        Prefer to browse first?{" "}
        <Link href="/flights" className="font-semibold text-ochre hover:text-clay">
          See the routes we fly
        </Link>
        .
      </p>
    </form>
  );
}

function PackagesTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[3px] border border-parchment bg-cream/60 p-5">
        <h3 className="font-bold text-ink">Ready-made holidays</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          Browse curated safari, beach and city breaks we can tailor to your dates.
        </p>
        <Link
          href="/holiday-packages"
          className="mt-4 inline-flex text-sm font-semibold text-ochre hover:text-clay"
        >
          Browse packages →
        </Link>
      </div>
      <div className="rounded-[3px] border border-ochre/40 bg-ochre/5 p-5">
        <h3 className="font-bold text-ink">Build your own trip</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          Choose your stops, how you travel and who&apos;s coming — we plan the whole thing.
        </p>
        <Link
          href="/holiday-packages/build"
          className="mt-4 inline-flex text-sm font-semibold text-ochre hover:text-clay"
        >
          Start building →
        </Link>
      </div>
    </div>
  );
}
