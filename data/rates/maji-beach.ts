import type { HotelRateSheet, RateBoard, RatePeriod } from "@/types/rates";

/**
 * The Maji Beach Boutique Hotel, Diani — 2025/2026 rack rate cards
 * (valid 1 Nov 2025 – 31 Oct 2026). Published per person per night;
 * converted to room totals with the card's own rules: single +30%,
 * third adult 60% of the per-person rate. Children: minimum age 12,
 * adult rates apply (no child rates).
 * Residents: KES cards for Full Board and Half Board. Non-residents:
 * USD rack card (Half Board; +US$30 pp/night for Full Board).
 */

const CALENDAR = [
  { start: "2025-11-01", end: "2025-12-19", season: "mid" },
  { start: "2025-12-20", end: "2026-01-02", season: "peak" },
  { start: "2026-01-03", end: "2026-03-31", season: "high" },
  { start: "2026-04-01", end: "2026-06-30", season: "mid" },
  { start: "2026-07-01", end: "2026-08-31", season: "high" },
  { start: "2026-09-01", end: "2026-10-31", season: "mid" },
] as const;

const seasonIndex = { mid: 0, peak: 1, high: 2 } as const;

const ROOM_TYPES = [
  { id: "garden-single", name: "Garden View Single" },
  { id: "superior-garden", name: "Superior Garden View" },
  { id: "deluxe-ocean", name: "Deluxe Ocean View" },
  { id: "garden-suite", name: "Garden Suite" },
  { id: "jacuzzi-suite", name: "Jacuzzi Suite Ocean View" },
  { id: "ocean-suite", name: "Ocean Suite Ocean View" },
] as const;

/** Per-person prices [mid, peak, high]; garden-single is a room price. */
type Grid = Record<(typeof ROOM_TYPES)[number]["id"], [number, number, number]>;

function periods(grid: Grid): RatePeriod[] {
  return CALENDAR.map((slot) => {
    const i = seasonIndex[slot.season];
    const pp = (id: keyof Grid) => grid[id][i];
    const shared = (id: keyof Grid) => ({
      single: Math.round(pp(id) * 1.3),
      double: pp(id) * 2,
      triple: Math.round(pp(id) * 2.6),
    });
    return {
      start: slot.start,
      end: slot.end,
      season: slot.season,
      rates: {
        "garden-single": { single: pp("garden-single") },
        "superior-garden": shared("superior-garden"),
        "deluxe-ocean": shared("deluxe-ocean"),
        "garden-suite": shared("garden-suite"),
        "jacuzzi-suite": shared("jacuzzi-suite"),
        "ocean-suite": shared("ocean-suite"),
      },
    };
  });
}

function sheet(
  suffix: string,
  currency: "KES" | "USD",
  market: HotelRateSheet["market"],
  board: RateBoard,
  grid: Grid,
  extraNotes: string[] = [],
): HotelRateSheet {
  return {
    hotelSlug: `maji-beach-${suffix}`,
    hotelName: "The Maji Beach Boutique Hotel",
    destinationSlug: "diani",
    destinationName: "Diani Beach",
    currency,
    market,
    basis: "rack",
    board,
    validFrom: "2025-11-01",
    validTo: "2026-10-31",
    roomTypes: [...ROOM_TYPES],
    periods: periods(grid),
    notes: [
      "Adults and children from 12 years only; under-12s are not hosted.",
      "Per-person card converted to room totals (single +30%, third adult 60%).",
      "Minimum stay 7 nights over the peak season.",
      ...extraNotes,
    ],
  };
}

export const majiBeachRateSheets: HotelRateSheet[] = [
  sheet("fb", "KES", "east-african-resident", "full-board", {
    "garden-single": [23200, 34200, 28700],
    "superior-garden": [24300, 39700, 26000],
    "deluxe-ocean": [26000, 40800, 27000],
    "garden-suite": [28700, 43000, 29800],
    "jacuzzi-suite": [33700, 47000, 34800],
    "ocean-suite": [33700, 47000, 34800],
  }),
  sheet("hb", "KES", "east-african-resident", "half-board", {
    "garden-single": [18700, 29700, 24200],
    "superior-garden": [19800, 35200, 21500],
    "deluxe-ocean": [21500, 36300, 22500],
    "garden-suite": [24200, 38500, 25300],
    "jacuzzi-suite": [29200, 42500, 30300],
    "ocean-suite": [29200, 42500, 30300],
  }),
  sheet(
    "nr-hb",
    "USD",
    "non-resident",
    "half-board",
    {
      "garden-single": [207, 240, 225],
      "superior-garden": [308, 432, 357],
      "deluxe-ocean": [346, 482, 395],
      "garden-suite": [407, 544, 456],
      "jacuzzi-suite": [469, 605, 518],
      "ocean-suite": [469, 605, 518],
    },
    ["Full board supplement US$30 per person per night."],
  ),
];
