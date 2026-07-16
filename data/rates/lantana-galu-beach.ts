import type { HotelRateSheet, RateBoard, RatePeriod } from "@/types/rates";

/**
 * Lantana Galu Beach (LGB), Diani — 2027 rack rates.
 * Residents: KES per whole suite/villa per night, accommodation only, with
 * meal supplements. Non-residents: USD per person per night by board basis
 * (flat across unit types, min 2 guests) ⇒ one sheet per board with a single
 * per-person row converted to double/triple totals.
 * Season calendar (2027): High 04 Jan–02 May & 05 Jul–31 Aug; Low 03 May–
 * 04 Jul & 01 Sep–20 Dec; Peak 21 Dec–04 Jan 2028.
 */

const CALENDAR = [
  { start: "2027-01-04", end: "2027-05-02", season: "high" },
  { start: "2027-05-03", end: "2027-07-04", season: "low" },
  { start: "2027-07-05", end: "2027-08-31", season: "high" },
  { start: "2027-09-01", end: "2027-12-20", season: "low" },
  { start: "2027-12-21", end: "2028-01-04", season: "peak" },
] as const;

const shared = {
  hotelName: "Lantana Galu Beach",
  destinationSlug: "diani",
  destinationName: "Diani Beach",
  basis: "rack",
  validFrom: "2027-01-04",
  validTo: "2028-01-04",
} satisfies Partial<HotelRateSheet>;

/** Resident sheet: per-unit KES prices, room only. [low, high, peak]. */
const residentUnits: Array<{ id: string; name: string; prices: [number, number, number] }> = [
  { id: "penthouse-1br", name: "1-Bedroom Penthouse Suite (max 2)", prices: [30000, 34000, 45000] },
  { id: "suite-2br", name: "2-Bedroom Suite / Bungalow Suite (max 4)", prices: [36500, 42500, 63000] },
  { id: "suite-3br", name: "3-Bedroom Suite / Bungalow (max 6)", prices: [42000, 48000, 73500] },
  { id: "villa-3br", name: "3-Bedroom Villa (max 6)", prices: [55500, 63000, 102000] },
  { id: "beach-villa-3br", name: "3-Bedroom Beach Front Villa (max 6)", prices: [63000, 72000, 114000] },
];

const seasonIndex = { low: 0, high: 1, peak: 2 } as const;

const residentPeriods: RatePeriod[] = CALENDAR.map((slot) => ({
  start: slot.start,
  end: slot.end,
  season: slot.season,
  rates: Object.fromEntries(
    residentUnits.map((u) => [u.id, { perUnit: u.prices[seasonIndex[slot.season]] }]),
  ),
}));

const lgbResident: HotelRateSheet = {
  ...shared,
  hotelSlug: "lantana-galu-beach-resident",
  currency: "KES",
  market: "east-african-resident",
  board: "room-only",
  roomTypes: residentUnits.map(({ id, name }) => ({ id, name })),
  periods: residentPeriods,
  childPolicy: {
    freeUpToAge: 3,
    childRateFromAge: 4,
    childRateToAge: 12,
    adultRateFromAge: 13,
  },
  notes: [
    "Prices are for the whole suite/villa per night, accommodation only.",
    "Meal supplements per person per night: breakfast Kshs 2,000 (child 1,400), half board 5,600 (3,900), full board 9,200 (6,400).",
    "Minimum 2 nights; 7 nights over the peak season.",
  ],
};

/** Non-resident: USD per person per night by board. [low, high, peak]. */
function nonResidentSheet(board: RateBoard, suffix: string, pp: [number, number, number]): HotelRateSheet {
  return {
    ...shared,
    hotelSlug: `lantana-galu-beach-${suffix}`,
    currency: "USD",
    market: "non-resident",
    board,
    roomTypes: [{ id: "per-person", name: "All suites & villas (per person)" }],
    periods: CALENDAR.map((slot) => {
      const rate = pp[seasonIndex[slot.season]];
      return {
        start: slot.start,
        end: slot.end,
        season: slot.season,
        rates: { "per-person": { double: rate * 2, triple: rate * 3 } },
      };
    }),
    notes: [
      "Rates are per person per night; minimum 2 guests per unit.",
      "Children 4–12 count towards unit occupancy; child meal pricing on request.",
      "Minimum 2 nights; 7 nights over the peak season.",
    ],
  };
}

export const lantanaGaluBeachRateSheets: HotelRateSheet[] = [
  lgbResident,
  nonResidentSheet("room-only", "nr-ao", [135, 145, 195]),
  nonResidentSheet("bed-breakfast", "nr-bb", [160, 170, 220]),
  nonResidentSheet("half-board", "nr-hb", [195, 205, 255]),
  nonResidentSheet("full-board", "nr-fb", [230, 240, 290]),
];
