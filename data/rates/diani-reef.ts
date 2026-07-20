import type { HotelRateSheet, RateBoard, RatePeriod } from "@/types/rates";

/**
 * Diani Reef Beach Resort & Spa — 2026 room rates, commissionable 10%
 * (gross ⇒ displayed unchanged). KES card taken as the resident tariff,
 * USD card as non-resident. Four board bases per market.
 * The card's 1st (5 Jan–30 Jun) and 2nd (1 Jul–19 Dec) seasons carry
 * identical prices, so they're merged around the Easter carve-out.
 * Third adult +40% on the double rate (computed). Child grid is titled
 * 5–11 yrs while the policy text says 6–12 — transcribed per the grid.
 */

const CALENDAR = [
  { start: "2026-01-05", end: "2026-03-31", season: "regular" },
  { start: "2026-04-01", end: "2026-04-05", season: "easter" },
  { start: "2026-04-06", end: "2026-12-19", season: "regular" },
  { start: "2026-12-20", end: "2027-01-03", season: "festive" },
] as const;

/** [pgSgl, pgDbl, psSgl, psDbl, dxSgl, dxDbl, zsSgl, zsDbl, penthouse, presidential] */
type Row = [number, number, number, number, number, number, number, number, number, number];

type BoardGrid = { regular: Row; easter: Row; festive: Row; child: [number, number, number] };

function periods(grid: BoardGrid): RatePeriod[] {
  const childIndex = { regular: 0, easter: 1, festive: 2 } as const;
  return CALENDAR.map((slot) => {
    const [pgS, pgD, psS, psD, dxS, dxD, zsS, zsD, ph, pr] = grid[slot.season];
    const child = grid.child[childIndex[slot.season]];
    const room = (single: number, double: number) => ({
      single,
      double,
      triple: Math.round(double * 1.4),
      childSharing: child,
    });
    return {
      start: slot.start,
      end: slot.end,
      season: slot.season,
      rates: {
        "premium-garden": room(pgS, pgD),
        "premium-sea": room(psS, psD),
        deluxe: room(dxS, dxD),
        "zuri-suite": room(zsS, zsD),
        penthouse: room(ph, ph),
        presidential: room(pr, pr),
      },
    };
  });
}

function sheet(
  suffix: string,
  currency: "KES" | "USD",
  market: HotelRateSheet["market"],
  board: RateBoard,
  grid: BoardGrid,
): HotelRateSheet {
  return {
    hotelSlug: `diani-reef-${suffix}`,
    hotelName: "Diani Reef Beach Resort & Spa",
    websiteUrl: "https://dianireef.com",
    destinationSlug: "diani",
    destinationName: "Diani Beach",
    currency,
    market,
    basis: "rack",
    board,
    validFrom: "2026-01-05",
    validTo: "2027-01-03",
    roomTypes: [
      { id: "premium-garden", name: "Premium Garden Room" },
      { id: "premium-sea", name: "Premium Sea Facing Room" },
      { id: "deluxe", name: "Deluxe Room" },
      { id: "zuri-suite", name: "Zuri Suite" },
      { id: "penthouse", name: "Penthouse" },
      { id: "presidential", name: "Presidential Suite" },
    ],
    periods: periods(grid),
    childPolicy: {
      freeUpToAge: 4,
      maxFreeChildrenPerRoom: 1,
      childRateFromAge: 5,
      childRateToAge: 11,
      adultRateFromAge: 12,
      ownRoomPercentOfRoomRate: 75,
    },
    notes: [
      "Third adult: +40% on the double rate (computed in the triple column).",
      "Minimum 3 nights over the festive season; no check-out on 24 or 31 Dec 2026.",
    ],
  };
}

export const dianiReefRateSheets: HotelRateSheet[] = [
  // East African residents (KES)
  sheet("bb", "KES", "east-african-resident", "bed-breakfast", {
    regular: [19500, 22000, 22000, 25000, 25000, 28000, 30000, 40000, 60000, 75000],
    easter: [21000, 26000, 26000, 29000, 26000, 31000, 35000, 45000, 65000, 80000],
    festive: [38000, 48000, 40000, 51000, 51000, 56000, 57000, 65000, 81000, 106000],
    child: [4000, 4000, 6000],
  }),
  sheet("hb", "KES", "east-african-resident", "half-board", {
    regular: [22000, 25000, 25000, 28000, 28000, 31000, 34000, 44000, 65000, 80000],
    easter: [24000, 29000, 29000, 32000, 29000, 33000, 39000, 49000, 70000, 85000],
    festive: [41000, 53000, 44000, 57000, 56000, 60000, 60000, 68000, 95000, 126000],
    child: [5000, 5000, 7000],
  }),
  sheet("fb", "KES", "east-african-resident", "full-board", {
    regular: [25000, 28000, 28000, 31000, 31000, 33000, 38000, 48000, 70000, 85000],
    easter: [27000, 32000, 32000, 35000, 32000, 36000, 44000, 54000, 75000, 90000],
    festive: [44000, 57000, 54000, 61000, 60000, 63000, 63000, 72000, 99000, 145000],
    child: [6000, 6000, 8000],
  }),
  sheet("ai", "KES", "east-african-resident", "all-inclusive", {
    regular: [33000, 41000, 38000, 48000, 42000, 52000, 45000, 56000, 119000, 128000],
    easter: [36000, 46000, 47000, 59000, 50000, 63000, 48000, 60000, 141000, 160000],
    festive: [58000, 73000, 62000, 78000, 64000, 80000, 62000, 76000, 169000, 187000],
    child: [7000, 7000, 10000],
  }),
  // Non-residents (USD)
  sheet("nr-bb", "USD", "non-resident", "bed-breakfast", {
    regular: [163, 188, 188, 211, 211, 234, 276, 334, 499, 624],
    easter: [181, 220, 192, 243, 220, 263, 310, 341, 489, 607],
    festive: [316, 402, 335, 431, 425, 464, 476, 531, 678, 889],
    child: [40, 50, 60],
  }),
  sheet("nr-hb", "USD", "non-resident", "half-board", {
    regular: [188, 211, 211, 239, 234, 258, 289, 351, 540, 668],
    easter: [200, 243, 210, 263, 243, 287, 324, 356, 527, 646],
    festive: [345, 437, 368, 473, 464, 497, 500, 562, 790, 1051],
    child: [50, 60, 70],
  }),
  sheet("nr-fb", "USD", "non-resident", "full-board", {
    regular: [211, 230, 230, 258, 258, 278, 303, 369, 581, 713],
    easter: [210, 263, 239, 287, 263, 307, 341, 372, 565, 687],
    festive: [368, 473, 450, 508, 497, 522, 524, 596, 828, 1213],
    child: [60, 70, 80],
  }),
  sheet("nr-ai", "USD", "non-resident", "all-inclusive", {
    regular: [275, 340, 320, 400, 350, 440, 375, 465, 992, 1076],
    easter: [305, 380, 400, 490, 420, 530, 400, 500, 1177, 1334],
    festive: [490, 610, 520, 650, 537, 670, 515, 700, 1410, 1555],
    child: [70, 70, 100],
  }),
];
