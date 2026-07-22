"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ExternalLink, Images, X } from "lucide-react";
import type { RateDestinationOption } from "@/types/rates";
import type { HotelQuote, OccupancyQuote, RoomTypeQuote } from "@/lib/rates";
import type { OccupancyKey } from "@/types/rates";
import { Button, ButtonLink } from "@/components/ui/Button";
import { HotelSearchBar } from "@/components/search/HotelSearchBar";

type Market = "east-african-resident" | "non-resident";
export type RateFinderInitial = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  market?: Market;
};

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

const occupancyColumns: { key: OccupancyKey; label: string }[] = [
  { key: "single", label: "Single" },
  { key: "double", label: "Double" },
  { key: "triple", label: "Triple" },
  { key: "perUnit", label: "Whole unit" },
  { key: "childSharing", label: "Child sharing" },
  { key: "childTeenSharing", label: "Teen sharing" },
  { key: "childThirdBed", label: "Child 3rd bed" },
];

/** The occupancy that best matches the party's adult count. */
function recommendedOccupancy(adults: number): OccupancyKey {
  if (adults <= 1) return "single";
  if (adults === 2) return "double";
  return "triple";
}

function money(amount: number, currency: "KES" | "USD"): string {
  const formatted = new Intl.NumberFormat("en-KE").format(Math.round(amount));
  return currency === "KES" ? `Kshs ${formatted}` : `US$ ${formatted}`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function rateEnquiryHref(args: {
  quote: HotelQuote;
  room: RoomTypeQuote;
  occupancy: string;
  total: number;
  perNight: number;
  checkIn: string;
  checkOut: string;
  market: Market;
  adults: number;
  children: number;
  rooms: number;
  childAges: string;
}): string {
  const params = new URLSearchParams({
    service: "hotels",
    rateSelection: "1",
    destination: args.quote.destinationName,
    checkIn: args.checkIn,
    checkOut: args.checkOut,
    market: args.market,
    hotel: args.quote.hotelName,
    room: args.room.roomTypeName,
    occupancy: args.occupancy,
    board: args.quote.board,
    currency: args.quote.currency,
    total: String(args.total),
    perNight: String(args.perNight),
    adults: String(args.adults),
    children: String(args.children),
    rooms: String(args.rooms),
  });
  if (args.childAges.trim()) params.set("childAges", args.childAges.trim());
  return `/request-a-quote?${params.toString()}`;
}

function generalHotelEnquiryHref(
  quote: HotelQuote,
  checkIn: string,
  checkOut: string,
  market: Market,
  adults: number,
  children: number,
  rooms: number,
): string {
  const params = new URLSearchParams({
    service: "hotels",
    destination: quote.destinationName,
    checkIn,
    checkOut,
    market,
    hotel: quote.hotelName,
    adults: String(adults),
    children: String(children),
    rooms: String(rooms),
  });
  return `/request-a-quote?${params.toString()}`;
}

export function RateFinder({
  destinations,
  initial,
}: {
  destinations: RateDestinationOption[];
  initial?: RateFinderInitial;
}) {
  const [destination, setDestination] = useState(
    initial?.destination ?? "",
  );
  const [market, setMarket] = useState<Market>(initial?.market ?? "east-african-resident");
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? "");
  const [adults, setAdults] = useState(initial?.adults ?? 2);
  const [children, setChildren] = useState(initial?.children ?? 0);
  const [childAges, setChildAges] = useState("");
  const [rooms, setRooms] = useState(initial?.rooms ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResponse | null>(null);
  // The party the results were fetched for, so cards stay consistent if the
  // guest inputs change before the next search.
  const [party, setParty] = useState({ adults: 2, children: 0, rooms: 1, childAges: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(
    async (query: { destination: string; checkIn: string; checkOut: string; market: Market }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(query);
        const res = await fetch(`/api/rates/quote?${params}`);
        const body = await res.json();
        if (!res.ok) {
          setResult(null);
          setError(
            typeof body.error === "string" ? body.error : "Something went wrong — please try again.",
          );
          return;
        }
        setResult(body as QuoteResponse);
      } catch {
        setResult(null);
        setError("We couldn't fetch rates just now — please try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  function onSubmit() {
    if (!destination || !checkIn || !checkOut) {
      setError("Choose a destination, check-in and check-out date.");
      return;
    }
    setParty({ adults, children, rooms, childAges });
    void runSearch({ destination, checkIn, checkOut, market });
  }

  useEffect(() => {
    if (result) {
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [result]);

  // Auto-run once when the finder is opened pre-seeded from a search widget.
  useEffect(() => {
    if (initial?.destination && initial?.checkIn && initial?.checkOut) {
      setParty({
        adults: initial.adults ?? 2,
        children: initial.children ?? 0,
        rooms: initial.rooms ?? 1,
        childAges: "",
      });
      void runSearch({
        destination: initial.destination,
        checkIn: initial.checkIn,
        checkOut: initial.checkOut,
        market: initial.market ?? "east-african-resident",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (destinations.length === 0) {
    return (
      <div className="border-y border-parchment bg-ivory px-5 py-10 text-center sm:px-8">
        <h2 className="display-serif text-2xl text-ink">Supplier rates are being updated</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Our consultants can still check current hotel prices and availability for your dates.
        </p>
        <div className="mt-5">
          <ButtonLink href="/request-a-quote?service=hotels" variant="outline">
            Request a hotel quote
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HotelSearchBar
        destinations={destinations}
        value={{ destination, checkIn, checkOut, adults, children, rooms, market }}
        onChange={(next) => {
          setDestination(next.destination);
          setCheckIn(next.checkIn);
          setCheckOut(next.checkOut);
          setAdults(next.adults);
          setChildren(next.children);
          setRooms(next.rooms);
          setMarket(next.market);
        }}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
      {children > 0 ? (
        <label className="mt-3 block max-w-sm text-xs font-semibold text-ink-soft">
          Children&apos;s ages
          <input value={childAges} onChange={(event) => setChildAges(event.target.value)} placeholder="e.g. 4, 9" className="ml-2 border border-parchment bg-white px-2.5 py-2 text-sm text-ink outline-none focus-visible:border-ochre" />
        </label>
      ) : null}

      {result ? (
        <div ref={resultsRef} className="mt-10 scroll-mt-24 space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink-soft">
              {formatDate(result.checkIn)} – {formatDate(result.checkOut)} ·{" "}
              {result.nights} {result.nights === 1 ? "night" : "nights"} ·{" "}
              {party.adults} {party.adults === 1 ? "adult" : "adults"}
              {party.children > 0 ? `, ${party.children} ${party.children === 1 ? "child" : "children"}` : ""}{" "}
              · {party.rooms} {party.rooms === 1 ? "room" : "rooms"}{" "}
              · {hotelGroups.length} {hotelGroups.length === 1 ? "property" : "properties"}
            </p>
            <p className="text-xs font-semibold text-ochre">
              Select a room rate to send that exact stay for confirmation.
            </p>
          </div>

          {hotelGroups.map((group) => (
            <HotelCard
              key={group[0].hotelSlug}
              quotes={group}
              checkIn={result.checkIn}
              checkOut={result.checkOut}
              market={result.market}
              party={party}
            />
          ))}

          <p className="text-xs leading-relaxed text-stone">
            Prices are for the whole stay and include service charge and current taxes. Child
            pricing depends on ages and is confirmed on enquiry. Seasonal supplements, minimum-stay
            rules and hotel blackout dates can apply. Availability is not live — a consultant
            confirms space and the final price before anything is booked.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function HotelCard({
  quotes,
  checkIn,
  checkOut,
  market,
  party,
}: {
  quotes: HotelQuote[];
  checkIn: string;
  checkOut: string;
  market: Market;
  party: { adults: number; children: number; rooms: number; childAges: string };
}) {
  const [selectedSlug, setSelectedSlug] = useState(quotes[0].hotelSlug);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const quote = quotes.find((q) => q.hotelSlug === selectedSlug) ?? quotes[0];

  return (
    <article className="overflow-hidden rounded-[3px] border border-parchment bg-ivory">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-parchment px-5 py-4 sm:px-6">
        <div>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="group/name inline-flex items-center gap-1.5 text-left"
          >
            <h3 className="display-serif text-xl text-ink underline decoration-parchment decoration-2 underline-offset-4 transition-colors group-hover/name:text-clay group-hover/name:decoration-ochre sm:text-2xl">
              {quote.hotelName}
            </h3>
            <Images aria-hidden className="size-4 shrink-0 text-ochre" />
          </button>
          <p className="mt-1 text-xs text-ink-soft">
            {quote.destinationName}
            {quote.group ? ` · ${quote.group}` : ""} · Tap the name for photos
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {quote.available ? (
            <div className="flex flex-wrap justify-end gap-1.5">
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
          {quote.websiteUrl ? (
            <a
              href={quote.websiteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ochre hover:text-clay"
            >
              Official website <ExternalLink aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </div>
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

      {quote.available ? (
        <QuoteBody quote={quote} checkIn={checkIn} checkOut={checkOut} market={market} party={party} />
      ) : (
        <div className="px-5 py-4 text-sm text-ink-soft sm:px-6">
          <p>{quote.unavailableReason ?? "No rates available for these dates."}</p>
          <div className="mt-4">
            <ButtonLink
              href={generalHotelEnquiryHref(quote, checkIn, checkOut, market, party.adults, party.children, party.rooms)}
              variant="outline"
            >
              Ask us for these dates
            </ButtonLink>
          </div>
        </div>
      )}

      {galleryOpen ? (
        <HotelGallery quote={quote} onClose={() => setGalleryOpen(false)} />
      ) : null}
    </article>
  );
}

function QuoteBody({
  quote,
  checkIn,
  checkOut,
  market,
  party,
}: {
  quote: HotelQuote;
  checkIn: string;
  checkOut: string;
  market: Market;
  party: { adults: number; children: number; rooms: number; childAges: string };
}) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const columns = occupancyColumns.filter((col) =>
    quote.rooms.some((room) => room.occupancies[col.key]),
  );
  const recommended = recommendedOccupancy(party.adults);
  const recommendedLabel = occupancyColumns.find((c) => c.key === recommended)?.label ?? "Double";

  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5">
      <p className="mb-3 text-xs font-semibold text-ink-soft">
        Rates differ by room — <span className="text-clay">select a room type below to check
        availability</span>. For {party.adults} {party.adults === 1 ? "adult" : "adults"} the{" "}
        {recommendedLabel.toLowerCase()} rate usually fits best.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-stone">
              <th className="pb-2 pr-4 font-semibold">Room type</th>
              {columns.map((col) => (
                <th key={col.key} className="pb-2 pr-4 font-semibold">
                  {col.label}
                  {col.key === recommended ? (
                    <span className="ml-1 text-[10px] font-bold text-ochre">✓ your party</span>
                  ) : null}
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
                    <td key={col.key} className="p-0 align-middle">
                      {occ ? (
                        <Link
                          href={rateEnquiryHref({
                            quote,
                            room,
                            occupancy: col.label,
                            total: occ.total,
                            perNight: occ.perNight,
                            checkIn,
                            checkOut,
                            market,
                            adults: party.adults,
                            children: party.children,
                            rooms: party.rooms,
                            childAges: party.childAges,
                          })}
                          aria-label={`Select ${quote.hotelName}, ${room.roomTypeName}, ${col.label}, ${money(occ.total, quote.currency)} total`}
                          className={`group/rate block min-w-36 border-l-2 px-2 py-3 transition-colors hover:border-ochre hover:bg-ochre/10 focus-visible:border-ochre focus-visible:bg-ochre/10 ${
                            col.key === recommended ? "border-ochre/40 bg-ochre/5" : "border-transparent"
                          }`}
                        >
                          <span className="block font-semibold text-ink group-hover/rate:text-clay">
                            {money(occ.total, quote.currency)}
                          </span>
                          <span className="block text-xs text-stone">
                            {money(occ.perNight, quote.currency)}/night
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ochre">
                            Get availability <ArrowUpRight aria-hidden className="size-3.5" />
                          </span>
                        </Link>
                      ) : (
                        <span className="block px-2 py-3 text-stone">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setBreakdownOpen((o) => !o)}
          aria-expanded={breakdownOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-clay"
        >
          <ChevronDown
            aria-hidden
            className={`size-4 transition-transform ${breakdownOpen ? "rotate-180" : ""}`}
          />
          {breakdownOpen ? "Hide cost breakdown" : "Show cost breakdown"}
        </button>
        {breakdownOpen ? (
          <CostBreakdown quote={quote} recommended={recommended} recommendedLabel={recommendedLabel} />
        ) : null}
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
    </div>
  );
}

function CostBreakdown({
  quote,
  recommended,
  recommendedLabel,
}: {
  quote: HotelQuote;
  recommended: OccupancyKey;
  recommendedLabel: string;
}) {
  const rows = quote.rooms
    .map((room) => ({ room, occ: room.occupancies[recommended] as OccupancyQuote | undefined }))
    .filter((r): r is { room: RoomTypeQuote; occ: OccupancyQuote } => Boolean(r.occ));

  return (
    <div className="mt-3 rounded-[3px] border border-parchment bg-cream/60 px-4 py-3 text-xs leading-relaxed text-ink-soft">
      <p className="font-bold text-ink">
        {recommendedLabel} rate · {quote.nights} {quote.nights === 1 ? "night" : "nights"}
      </p>
      <p className="mt-0.5">
        Seasons in your dates: {quote.seasons.map((s) => seasonLabels[s] ?? s).join(", ")}. Where a
        stay spans seasons, each night is priced in its own season and summed.
      </p>
      {rows.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {rows.map(({ room, occ }) => (
            <li key={room.roomTypeId} className="flex flex-wrap justify-between gap-2">
              <span>
                {room.roomTypeName}: {quote.nights} × {money(occ.perNight, quote.currency)} (avg/night)
              </span>
              <span className="font-semibold text-ink">{money(occ.total, quote.currency)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">
          The {recommendedLabel.toLowerCase()} occupancy isn&apos;t sold here — use one of the rates
          in the table above.
        </p>
      )}
    </div>
  );
}

function HotelGallery({ quote, onClose }: { quote: HotelQuote; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${quote.hotelName} photos`}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink/90 p-4 sm:p-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4 text-cream">
          <div>
            <h3 className="display-serif text-2xl sm:text-3xl">{quote.hotelName}</h3>
            <p className="mt-1 text-sm text-cream/70">{quote.destinationName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-[3px] border border-cream/40 text-cream hover:bg-cream hover:text-ink"
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Close photos</span>
          </button>
        </div>

        {quote.images.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {quote.images.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-forest-deep">
                <Image
                  src={src}
                  alt={`${quote.hotelName} — photo ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[3px] border border-cream/25 bg-forest-deep/60 px-6 py-14 text-center text-cream">
            <Images aria-hidden className="mx-auto size-8 text-gold" />
            <p className="mt-3 font-semibold">Photos coming soon</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-cream/70">
              We&apos;re adding a gallery for {quote.hotelName}. In the meantime, a consultant can
              share current photos and room views with your quote.
            </p>
            {quote.websiteUrl ? (
              <a
                href={quote.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-cream"
              >
                Visit the official website <ExternalLink aria-hidden className="size-4" />
              </a>
            ) : null}
          </div>
        )}

        <div className="mt-8 flex justify-center pb-4">
          <Button type="button" variant="light" onClick={onClose}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
