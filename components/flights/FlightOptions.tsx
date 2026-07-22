"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Clock3, Plane, Utensils } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PublicFlightOffer, PublicFlightSearchResponse } from "@/types/flight-options";

function code(value: string): string {
  return value.match(/\(([A-Z]{3})\)/)?.[1] ?? value.trim().slice(-3).toUpperCase();
}

function cabin(value?: string): "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" {
  if (value === "premium-economy") return "PREMIUM_ECONOMY";
  if (value === "business") return "BUSINESS";
  if (value === "first") return "FIRST";
  return "ECONOMY";
}

function when(value: string): string {
  if (!value) return "Time pending";
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function money(amount: number, currency: string): string {
  return `${currency} ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function FlightOptions({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
  childCount,
  cabinClass,
  onSelect,
  onContinueWithoutFare,
}: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  childCount: number;
  cabinClass?: string;
  onSelect: (offer: PublicFlightOffer) => void;
  onContinueWithoutFare: () => void;
}) {
  const [offers, setOffers] = useState<PublicFlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function search() {
      setLoading(true);
      try {
        const response = await fetch("/api/flights/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin: code(origin), destination: code(destination), departureDate, returnDate, adults, children: childCount, cabin: cabin(cabinClass) }),
          signal: controller.signal,
        });
        const body = await response.json() as PublicFlightSearchResponse & { error?: string };
        if (!response.ok) throw new Error(body.error || "Live fares are temporarily unavailable.");
        setOffers(body.offers);
        if (!body.offers.length) setError("No matching fares were returned for these dates.");
      } catch (searchError) {
        if (!controller.signal.aborted) setError(searchError instanceof Error ? searchError.message : "Live fares are temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void search();
    return () => controller.abort();
  }, [origin, destination, departureDate, returnDate, adults, childCount, cabinClass]);

  if (loading) return <div className="grid gap-4 lg:grid-cols-2">{[0, 1, 2, 3].map((item) => <div key={item} className="h-52 animate-pulse bg-sand" />)}</div>;

  if (error || offers.length === 0) {
    return (
      <div className="border border-parchment bg-cream/60 p-6">
        <p className="font-bold text-ink">Live flight options are not available yet</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{error ?? "A consultant will check the same route and dates for you."}</p>
        <Button className="mt-5" onClick={onContinueWithoutFare}>Continue to request options</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {offers.map((offer) => (
        <article key={offer.id} className="border border-parchment bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2"><Plane aria-hidden className="size-5 text-ochre" /><div><h3 className="font-bold text-ink">{offer.airline}</h3><p className="text-xs text-ink-soft">{offer.cabin.replaceAll("_", " ")} · {offer.fareType}</p></div></div>
            <p className="text-right text-lg font-bold text-ink">{money(offer.total, offer.currency)}</p>
          </div>
          <div className="mt-4 space-y-3">
            {offer.legs.map((leg, index) => (
              <div key={`${offer.id}-${index}`} className="grid grid-cols-[1fr_auto_1fr] gap-3 text-sm">
                <div><p className="font-bold">{leg.origin}</p><p className="text-xs text-ink-soft">{when(leg.departure)}</p></div>
                <div className="text-center text-xs text-stone"><p>{Math.floor(leg.durationMinutes / 60)}h {leg.durationMinutes % 60}m</p><p>{leg.stops === 0 ? "Direct" : `${leg.stops} stop${leg.stops === 1 ? "" : "s"}`}</p></div>
                <div className="text-right"><p className="font-bold">{leg.destination}</p><p className="text-xs text-ink-soft">{when(leg.arrival)}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 border-y border-parchment py-3 text-xs text-ink-soft sm:grid-cols-3">
            <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5" />{offer.baggage}</span>
            <span className="inline-flex items-center gap-1.5"><Utensils className="size-3.5" />{offer.meals}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{offer.legs.flatMap((leg) => leg.flightNumbers).join(" / ")}</span>
          </div>
          <Button className="mt-4 w-full" onClick={() => onSelect(offer)}>Select this fare</Button>
        </article>
      ))}
    </div>
  );
}
