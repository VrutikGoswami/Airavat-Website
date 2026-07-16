import type { HotelRateSheet, OccupancyRates, RatePeriod, RateSeasonName } from "@/types/rates";

/**
 * Kinondo Kwetu, Diani (Galu Beach) — rack rates in USD.
 * Residents (EA + Ethiopia): 2026 + 2027 cards share identical prices, so
 * one sheet per board spans both years. Non-residents: 2026 contract card's
 * published rack column (All Inclusive), including its two child bands
 * (6–11 and 12–17) and third-bed child prices.
 * Hotel closes for the rainy season: May until ~21 June each year (no
 * rates loaded for those dates). Full Board is not offered at Christmas.
 */

const CALENDAR: Array<{ start: string; end: string; season: RateSeasonName }> = [
  // 2026
  { start: "2026-01-07", end: "2026-03-01", season: "high" },
  { start: "2026-03-02", end: "2026-04-30", season: "mid" },
  { start: "2026-06-22", end: "2026-10-17", season: "mid" },
  { start: "2026-10-18", end: "2026-11-02", season: "high" },
  { start: "2026-11-03", end: "2026-12-18", season: "mid" },
  { start: "2026-12-19", end: "2027-01-10", season: "christmas" },
  // 2027 (same prices, shifted calendar)
  { start: "2027-01-11", end: "2027-03-07", season: "high" },
  { start: "2027-03-08", end: "2027-04-30", season: "mid" },
  { start: "2027-06-22", end: "2027-10-22", season: "mid" },
  { start: "2027-10-23", end: "2027-11-07", season: "high" },
  { start: "2027-11-08", end: "2027-12-17", season: "mid" },
  { start: "2027-12-18", end: "2028-01-09", season: "christmas" },
];

const ROOM_TYPES = [
  { id: "standard", name: "Cottages & Mama Taa Villa" },
  { id: "premium", name: "Beach Cottage 5, Andersson, Borelius & Alex House" },
  { id: "main-house", name: "Mama Tina Villa (Main House)" },
];

type SeasonRates = Partial<Record<RateSeasonName, Record<string, OccupancyRates>>>;

function periods(bySeason: SeasonRates, until?: string): RatePeriod[] {
  return CALENDAR.filter((slot) => !until || slot.start <= until).flatMap((slot) => {
    const rates = bySeason[slot.season];
    if (!rates) return [];
    return [{ start: slot.start, end: slot.end, season: slot.season, rates }];
  });
}

const shared = {
  hotelName: "Kinondo Kwetu",
  destinationSlug: "diani",
  destinationName: "Diani Beach",
  currency: "USD",
  basis: "rack",
  roomTypes: ROOM_TYPES,
  childPolicy: {
    freeUpToAge: 5,
    childRateFromAge: 6,
    childRateToAge: 11,
    adultRateFromAge: 18,
  },
} satisfies Partial<HotelRateSheet>;

export const kinondoKwetuRateSheets: HotelRateSheet[] = [
  {
    ...shared,
    hotelSlug: "kinondo-kwetu-ai",
    market: "east-african-resident",
    board: "all-inclusive",
    validFrom: "2026-01-07",
    validTo: "2028-01-09",
    periods: periods({
      mid: {
        standard: { single: 400, double: 670 },
        premium: { double: 1320 },
        "main-house": { single: 330, double: 460 },
      },
      high: {
        standard: { single: 565, double: 950 },
        premium: { double: 1460 },
        "main-house": { single: 465, double: 650 },
      },
      christmas: {
        standard: { single: 825, double: 1430 },
        premium: { double: 1550 },
        "main-house": { single: 475, double: 840 },
      },
    }),
    notes: [
      "All-inclusive: meals, house drinks and most activities included.",
      "Closed for the rainy season each year from May until around 21 June.",
      "Guests aged 12–17 pay a teen rate and 6–11 a child rate — confirmed on enquiry.",
    ],
  },
  {
    ...shared,
    hotelSlug: "kinondo-kwetu-fb",
    market: "east-african-resident",
    board: "full-board",
    validFrom: "2026-01-07",
    validTo: "2028-01-09",
    periods: periods({
      mid: {
        standard: { single: 355, double: 580 },
        premium: { double: 1230 },
        "main-house": { single: 285, double: 370 },
      },
      high: {
        standard: { single: 520, double: 860 },
        premium: { double: 1370 },
        "main-house": { single: 420, double: 560 },
      },
      // Christmas is all-inclusive only.
    }),
    notes: [
      "Full board is not offered over the Christmas season (all-inclusive only).",
      "Closed for the rainy season each year from May until around 21 June.",
    ],
  },
  {
    ...shared,
    hotelSlug: "kinondo-kwetu-nr",
    market: "non-resident",
    board: "all-inclusive",
    validFrom: "2026-01-07",
    validTo: "2027-01-10",
    periods: periods(
      {
        mid: {
          standard: { single: 645, double: 1080, childSharing: 325, childTeenSharing: 380, childThirdBed: 250 },
          premium: { double: 1180, childSharing: 325, childTeenSharing: 380 },
          "main-house": { single: 295, childSharing: 220, childTeenSharing: 220 },
        },
        high: {
          standard: { single: 680, double: 1200, childSharing: 370, childTeenSharing: 410, childThirdBed: 275 },
          premium: { double: 1300, childSharing: 370, childTeenSharing: 420 },
          "main-house": { single: 345, childSharing: 270, childTeenSharing: 270 },
        },
        christmas: {
          standard: { single: 735, double: 1280, childSharing: 405, childTeenSharing: 455, childThirdBed: 300 },
          premium: { double: 1390, childSharing: 370, childTeenSharing: 455 },
          "main-house": { single: 375, childSharing: 320, childTeenSharing: 320 },
        },
      },
      "2026-12-19",
    ),
    notes: [
      "All-inclusive: meals, house drinks and most activities included.",
      "Closed for the rainy season each year from May until around 21 June.",
    ],
  },
];
