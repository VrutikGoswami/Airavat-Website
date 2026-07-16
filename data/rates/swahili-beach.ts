import type { HotelRateSheet, RateBoard, RatePeriod, RateSeasonName } from "@/types/rates";

/**
 * Swahili Beach Resort, Diani — 2026 rack rates (STO contract also holds
 * net rates at −15%/−25%, kept off the site; rack is displayed).
 * Residents: KES. Non-residents: USD. Same season calendar and room mix:
 * Standard, Superior, Club Room (flat single-or-double), Executive & Club
 * Suite (flat). No B&B during Easter or Peak. No triples anywhere (no
 * extra beds). Note: the printed card leaves 31 Oct 2026 unassigned
 * between high (to 30 Oct) and shoulder (from 1 Nov) — transcribed as is.
 */

const CALENDAR: Array<{ start: string; end: string; season: RateSeasonName }> = [
  { start: "2026-01-04", end: "2026-04-02", season: "high" },
  { start: "2026-04-03", end: "2026-04-06", season: "easter" },
  { start: "2026-04-07", end: "2026-06-30", season: "low" },
  { start: "2026-07-01", end: "2026-08-31", season: "high" },
  { start: "2026-09-01", end: "2026-09-30", season: "shoulder" },
  { start: "2026-10-01", end: "2026-10-30", season: "high" },
  { start: "2026-11-01", end: "2026-12-22", season: "shoulder" },
  { start: "2026-12-23", end: "2027-01-03", season: "peak" },
];

/** [stdSgl, stdDbl, supSgl, supDbl, club, execSuite] + child sharing. */
type Row = [number, number, number, number, number, number];

function periods(
  bySeason: Partial<Record<RateSeasonName, Row>>,
  childSharing: number,
): RatePeriod[] {
  return CALENDAR.flatMap((slot) => {
    const row = bySeason[slot.season];
    if (!row) return [];
    const [stdSgl, stdDbl, supSgl, supDbl, club, exec] = row;
    return [
      {
        start: slot.start,
        end: slot.end,
        season: slot.season,
        rates: {
          standard: { single: stdSgl, double: stdDbl },
          superior: { single: supSgl, double: supDbl, childSharing },
          club: { single: club, double: club },
          "executive-suite": { single: exec, double: exec, childSharing },
        },
      },
    ];
  });
}

function sheet(
  suffix: string,
  currency: "KES" | "USD",
  market: HotelRateSheet["market"],
  board: RateBoard,
  bySeason: Partial<Record<RateSeasonName, Row>>,
  childSharing: number,
): HotelRateSheet {
  return {
    hotelSlug: `swahili-beach-${suffix}`,
    hotelName: "Swahili Beach Resort",
    destinationSlug: "diani",
    destinationName: "Diani Beach",
    currency,
    market,
    basis: "rack",
    board,
    validFrom: "2026-01-04",
    validTo: "2027-01-03",
    roomTypes: [
      { id: "standard", name: "Standard Room" },
      { id: "superior", name: "Superior Room" },
      { id: "club", name: "Club Room (adults only)" },
      { id: "executive-suite", name: "Executive & Club Suite" },
    ],
    periods: periods(bySeason, childSharing),
    childPolicy: {
      freeUpToAge: 3,
      childRateFromAge: 4,
      childRateToAge: 11,
      adultRateFromAge: 12,
    },
    notes: [
      "Child rates apply in Superior rooms and Executive Suites only; Club rooms/suites and the Beach Club are adults only.",
      "No third-adult occupancy or extra beds in any room.",
      "Easter and festive stays carry minimum-stay rules, a child supplement and gala-dinner supplements.",
      "Some dates are blacked out by the hotel across the year — always confirmed on enquiry.",
    ],
  };
}

export const swahiliBeachRateSheets: HotelRateSheet[] = [
  // East African residents (KES)
  sheet("bb", "KES", "east-african-resident", "bed-breakfast", {
    high: [23920, 31200, 31200, 38480, 48880, 59280],
    low: [19760, 27040, 27040, 34320, 44720, 55120],
    shoulder: [21840, 29120, 29120, 36400, 46800, 57200],
  }, 6500),
  sheet("hb", "KES", "east-african-resident", "half-board", {
    high: [27040, 37440, 34320, 44720, 55120, 65520],
    easter: [29120, 39520, 36400, 46800, 57200, 67600],
    low: [22880, 33280, 30160, 40560, 50960, 61360],
    shoulder: [24960, 35360, 32240, 42640, 53040, 63440],
    peak: [42640, 53040, 49920, 60320, 70720, 81120],
  }, 8450),
  sheet("fb", "KES", "east-african-resident", "full-board", {
    high: [30160, 43680, 37440, 50960, 61360, 71760],
    easter: [32240, 45760, 39520, 53040, 63440, 73840],
    low: [26000, 39520, 33280, 46800, 57200, 67600],
    shoulder: [28080, 41600, 35360, 48880, 59280, 69680],
    peak: [45760, 59280, 53040, 66560, 76960, 87360],
  }, 10400),
  // Non-residents (USD)
  sheet("nr-bb", "USD", "non-resident", "bed-breakfast", {
    high: [230, 300, 300, 370, 470, 570],
    low: [190, 260, 260, 330, 430, 530],
    shoulder: [210, 280, 280, 350, 450, 550],
  }, 50),
  sheet("nr-hb", "USD", "non-resident", "half-board", {
    high: [260, 360, 330, 430, 530, 630],
    easter: [280, 380, 350, 450, 550, 650],
    low: [220, 320, 290, 390, 490, 590],
    shoulder: [240, 340, 310, 410, 510, 610],
    peak: [410, 510, 480, 580, 680, 780],
  }, 65),
  sheet("nr-fb", "USD", "non-resident", "full-board", {
    high: [290, 420, 360, 490, 590, 690],
    easter: [310, 440, 380, 510, 610, 710],
    low: [250, 380, 320, 450, 550, 650],
    shoulder: [270, 400, 340, 470, 570, 670],
    peak: [440, 570, 510, 640, 740, 840],
  }, 80),
];
