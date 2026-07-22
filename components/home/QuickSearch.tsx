"use client";

import Link from "next/link";
import { useState } from "react";
import { BedDouble, Plane, Sparkles } from "lucide-react";
import type { RateDestinationOption } from "@/types/rates";
import { RateFinder } from "@/components/rates/RateFinder";
import { FlightFinder } from "@/components/flights/FlightFinder";

type Tab = "hotels" | "flights" | "packages";

const tabs: { id: Tab; label: string; icon: typeof BedDouble }[] = [
  { id: "hotels", label: "Hotels", icon: BedDouble },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "packages", label: "Packages", icon: Sparkles },
];

/**
 * Shared booking surfaces on the homepage. Hotel results stay inline while
 * flight and package selections carry their complete context into the quote.
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
  return <RateFinder destinations={destinations} />;
}

function FlightsTab() {
  return <FlightFinder submitLabel="Continue" />;
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
