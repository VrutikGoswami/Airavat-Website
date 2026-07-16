"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { RateDestinationOption } from "@/data/rates";
import type { HotelQuote, RoomTypeQuote } from "@/lib/rates";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/forms/fields";

type Market = "east-african-resident" | "non-resident";

type QuoteResponse = {
  destination: string;
  checkIn: string;
  checkOut: string;
  market: Market;
  nights: number;
  quotes: HotelQuote[];
};

const seasonLabels: Record<string, string> = {
  green: "Green season",
  low: "Low season",
  mid: "Mid season",
  regular: "Regular season",
  shoulder: "Shoulder season",
  high: "High season",
  premium: "Premium season",
  peak: "Peak season",
  easter: "Easter",
  festive: "Festive season",
  christmas: "Christmas & New Year",
};

const boardLabels: Record<string, string> = {
  "full-board": "Full board",
  "half-board": "Half board",
  "bed-breakfast": "Bed & breakfast",
  "all-inclusive": "All inclusive",
  "room-only": "Room only",
};

const occupancyColumns = [
  { key: "single", label: "Single" },
  { key: "double", label: "Double" },
  { key: "triple", label: "Triple" },
  { key: "perUnit", label: "Whole unit" },
  { key: "childSharing", label: "Child sharing" },
  { key: "childTeenSharing", label: "Teen sharing" },
  { key: "childThirdBed", label: "Child 3rd bed" },
] as const;

function money(amount: number, currency: "KES" | "USD"): string {
  const formatted = new Intl.NumberFormat("en-KE").format(amount);
  return currency === "KES" ? `Kshs ${formatted}` : `US$ ${formatted}`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RateFinder({ destinations }: { destinations: RateDestinationOption[] }) {
  const [destination, setDestination] = useState(destinations[0]?.slug ?? "");
  const [market, setMarket] = useState<Market>("east-african-resident");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      setError("Choose a destination, check-in and check-out date.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ destination, checkIn, checkOut, market });
      const res = await fetch(`/api/rates/quote?${params}`);
      const body = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(typeof body.error === "string" ? body.error : "Something went wrong — please try again.");
        return;
      }
      setResult(body as QuoteResponse);
    } catch {
      setResult(null);
      setError("We couldn't fetch rates just now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  // One card per hotel; boards become tabs within the card.
  const hotelGroups: HotelQuote[][] = [];
  if (result) {
    const byName = new Map<string, HotelQuote[]>();
    for (const quote of result.quotes) {
      const group = byName.get(quote.hotelName);
      if (group) {
        group.push(quote);
      } else {
        const fresh = [quote];
        byName.set(quote.hotelName, fresh);
        hotelGroups.push(fresh);
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-[3px] border border-parchment bg-ivory/60 p-5 sm:grid-cols-3 sm:items-end sm:gap-5 sm:p-6"
      >
        <SelectField
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name} ({d.hotelCount} {d.hotelCount === 1 ? "property" : "properties"})
            </option>
          ))}
        </SelectField>
        <TextField
          label="Check-in"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <TextField
          label="Check-out"
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(e) => setCheckOut(e.target.value)}
        />
        <fieldset className="sm:col-span-3">
          <legend className="mb-1.5 block text-sm font-bold">Rates for</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {(
              [
                ["east-african-resident", "East African residents"],
                ["non-resident", "International visitors"],
              ] as Array<[Market, string]>
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={market === value}
                onClick={() => setMarket(value)}
                className={`rounded-[3px] border px-4 py-2 text-sm font-semibold transition-colors ${
                  market === value
                    ? "border-ochre bg-ochre/10 text-clay"
                    : "border-parchment bg-ivory text-ink hover:border-stone"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Checking rates…" : "Show rates"}
          </Button>
        </div>
      </form>

      {error ? (
        <p className="mt-5 text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-10 space-y-8">
          <p className="text-sm text-ink-soft">
            {formatDate(result.checkIn)} – {formatDate(result.checkOut)} ·{" "}
            {result.nights} {result.nights === 1 ? "night" : "nights"} ·{" "}
            {hotelGroups.length} {hotelGroups.length === 1 ? "property" : "properties"}
          </p>

          {hotelGroups.map((group) => (
            <HotelCard key={group[0].hotelSlug} quotes={group} />
          ))}

          <p className="text-xs leading-relaxed text-stone">
            Prices are for the whole stay and include service charge and current taxes.
            Seasonal supplements, minimum-stay rules and hotel blackout dates can apply.
            Availability is not live — a consultant confirms space and the final price
            before anything is booked.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function HotelCard({ quotes }: { quotes: HotelQuote[] }) {
  const [selectedSlug, setSelectedSlug] = useState(quotes[0].hotelSlug);
  const quote = quotes.find((q) => q.hotelSlug === selectedSlug) ?? quotes[0];

  return (
    <article className="overflow-hidden rounded-[3px] border border-parchment bg-ivory">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-parchment px-5 py-4 sm:px-6">
        <div>
          <h3 className="display-serif text-xl text-ink sm:text-2xl">{quote.hotelName}</h3>
          <p className="mt-1 text-xs text-ink-soft">
            {quote.destinationName}
            {quote.group ? ` · ${quote.group}` : ""}
          </p>
        </div>
        {quote.available ? (
          <div className="flex flex-wrap gap-1.5">
            {quote.seasons.map((season) => (
              <span
                key={season}
                className="rounded-full border border-parchment bg-cream px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
              >
                {seasonLabels[season] ?? season}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {quotes.length > 1 ? (
        <div className="flex flex-wrap gap-2 border-b border-parchment/70 px-5 pt-3 pb-3 sm:px-6" role="tablist">
          {quotes.map((q) => (
            <button
              key={q.hotelSlug}
              type="button"
              role="tab"
              aria-selected={q.hotelSlug === quote.hotelSlug}
              onClick={() => setSelectedSlug(q.hotelSlug)}
              className={`rounded-[3px] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                q.hotelSlug === quote.hotelSlug
                  ? "border-ochre bg-ochre/10 text-clay"
                  : "border-parchment bg-cream text-ink hover:border-stone"
              }`}
            >
              {boardLabels[q.board] ?? q.board}
            </button>
          ))}
        </div>
      ) : (
        <p className="border-b border-parchment/70 px-5 pt-3 pb-3 text-xs font-semibold text-ink-soft sm:px-6">
          {boardLabels[quote.board] ?? quote.board}
        </p>
      )}

      {quote.available ? <QuoteBody quote={quote} /> : (
        <div className="px-5 py-4 text-sm text-ink-soft sm:px-6">
          <p>{quote.unavailableReason ?? "No rates available for these dates."}</p>
          <div className="mt-4">
            <ButtonLink href="/request-a-quote?service=hotels" variant="outline">
              Ask us for these dates
            </ButtonLink>
          </div>
        </div>
      )}
    </article>
  );
}

function QuoteBody({ quote }: { quote: HotelQuote }) {
  const columns = occupancyColumns.filter((col) =>
    quote.rooms.some((room) => room.occupancies[col.key]),
  );

  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-stone">
              <th className="pb-2 pr-4 font-semibold">Room type</th>
              {columns.map((col) => (
                <th key={col.key} className="pb-2 pr-4 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quote.rooms.map((room: RoomTypeQuote) => (
              <tr key={room.roomTypeId} className="border-t border-parchment/70">
                <td className="py-3 pr-4 font-bold text-ink">{room.roomTypeName}</td>
                {columns.map((col) => {
                  const occ = room.occupancies[col.key];
                  return (
                    <td key={col.key} className="py-3 pr-4">
                      {occ ? (
                        <>
                          <span className="block font-semibold text-ink">
                            {money(occ.total, quote.currency)}
                          </span>
                          <span className="block text-xs text-stone">
                            {money(occ.perNight, quote.currency)}/night
                          </span>
                        </>
                      ) : (
                        <span className="text-stone">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quote.familySupplements.length > 0 ? (
        <div className="mt-4 rounded-[3px] bg-cream/70 px-4 py-3 text-xs leading-relaxed text-ink-soft">
          <p className="font-bold uppercase tracking-wide text-stone">Family rooms</p>
          <ul className="mt-1.5 space-y-1">
            {quote.familySupplements.map((s) => (
              <li key={s.name}>
                {s.name} (max {s.maxPax} guests): {money(s.perAdultPerNight, quote.currency)}{" "}
                per adult, {money(s.perChildPerNight, quote.currency)} per child under 12,
                per night on top of the room rate.
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {quote.childPolicySummary ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">{quote.childPolicySummary}</p>
      ) : null}

      {quote.notes.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-stone">
          {quote.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        <ButtonLink
          href={`/request-a-quote?service=hotels&destination=${encodeURIComponent(quote.destinationName)}`}
          variant="outline"
        >
          Enquire about {quote.hotelName}
        </ButtonLink>
      </div>
    </div>
  );
}
