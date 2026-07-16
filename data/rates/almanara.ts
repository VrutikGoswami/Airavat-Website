import type { HotelRateSheet } from "@/types/rates";

/**
 * Almanara Luxury Boutique Hotel & Villas, Diani — 2026 rack rates (USD,
 * per person per night, published card valid 6 Jan 2026 – 5 Jan 2027).
 * Rates include all meals, selected beverages and airport transfers.
 * Converted to per-room figures: villas have no single occupancy (min 2
 * guests); Ocean View rooms/suites take a 25% single supplement; children
 * under 12 pay 50% (Garden/Residence villas only — Ocean View rooms and
 * suites are adults/12+). No rates published for May (hotel closed).
 */

const half = (pp: number) => Math.round(pp / 2);

function villa(pp: number) {
  return { double: pp * 2, triple: pp * 3, childSharing: half(pp) };
}

function oceanView(pp: number) {
  return { single: Math.round(pp * 1.25), double: pp * 2 };
}

export const almanara: HotelRateSheet = {
  hotelSlug: "almanara-diani",
  hotelName: "Almanara Luxury Boutique Hotel & Villas",
  destinationSlug: "diani",
  destinationName: "Diani Beach",
  currency: "USD",
  market: "all",
  basis: "rack",
  board: "full-board",
  validFrom: "2026-01-06",
  validTo: "2027-01-05",
  roomTypes: [
    { id: "garden-villa", name: "Garden Villa (2–6 guests)" },
    { id: "residence-villa", name: "Residence Villa (2–6 guests)" },
    { id: "ov-suite", name: "Ocean View Suite" },
    { id: "ov-room", name: "Ocean View Room" },
  ],
  periods: [
    ...[
      ["2026-01-06", "2026-04-30"],
      ["2026-06-01", "2026-06-30"],
      ["2026-09-01", "2026-12-19"],
    ].map(([start, end]) => ({
      start,
      end,
      season: "regular" as const,
      rates: {
        "garden-villa": villa(490),
        "residence-villa": villa(510),
        "ov-suite": oceanView(420),
        "ov-room": oceanView(370),
      },
    })),
    {
      start: "2026-07-01",
      end: "2026-08-31",
      season: "premium",
      rates: {
        "garden-villa": villa(720),
        "residence-villa": villa(755),
        "ov-suite": oceanView(630),
        "ov-room": oceanView(550),
      },
    },
    {
      start: "2026-12-20",
      end: "2027-01-05",
      season: "christmas",
      rates: {
        "garden-villa": villa(770),
        "residence-villa": villa(805),
        "ov-suite": oceanView(680),
        "ov-room": oceanView(605),
      },
    },
  ],
  childPolicy: {
    freeUpToAge: 2,
    childRateFromAge: 3,
    childRateToAge: 11,
    adultRateFromAge: 12,
  },
  notes: [
    "Rates are per person, converted here to room totals; villas require a minimum of 2 guests.",
    "All meals, selected beverages and airport transfers included.",
    "Ocean View rooms and suites host adults and children over 12 only.",
    "The hotel publishes no May rates (closed for the rainy season).",
  ],
};

export const almanaraRateSheets: HotelRateSheet[] = [almanara];
