import type { HotelRateSheet, RateBoard, RatePeriod, RateSeasonName } from "@/types/rates";

/**
 * Jacaranda Indian Ocean Beach Resort (JIOBR), Diani — 2026 tariff rates,
 * East African residents, KES (commissionable 10% ⇒ displayed unchanged).
 * Per-room single/double plus a third-bed-adult supplement (converted to a
 * triple total here). Four board bases ⇒ four sheets; no B&B during Easter
 * as printed. Children: 0–5 free; 6–10 at 50% sharing, 75% in own room.
 */

/** [single, double, thirdBedAdult] as printed. */
type Row = [number, number, number];

function rooms(garden: Row, seaView: Row, beachFront: Row) {
  const occ = ([single, double, third]: Row) => ({
    single,
    double,
    triple: double + third,
  });
  return {
    garden: occ(garden),
    "sea-view": occ(seaView),
    "beach-front": occ(beachFront),
  };
}

/** Season calendar shared by all boards; Easter omitted for B&B. */
const CALENDAR: Array<{ start: string; end: string; season: RateSeasonName }> = [
  { start: "2026-01-06", end: "2026-04-02", season: "high" },
  { start: "2026-04-03", end: "2026-04-06", season: "easter" },
  { start: "2026-04-07", end: "2026-07-15", season: "low" },
  { start: "2026-07-16", end: "2026-08-31", season: "high" },
  { start: "2026-09-01", end: "2026-12-22", season: "shoulder" },
  { start: "2026-12-23", end: "2027-01-05", season: "festive" },
];

function periods(bySeason: Partial<Record<RateSeasonName, [Row, Row, Row]>>): RatePeriod[] {
  return CALENDAR.flatMap((slot) => {
    const rows = bySeason[slot.season];
    if (!rows) return [];
    return [{ start: slot.start, end: slot.end, season: slot.season, rates: rooms(...rows) }];
  });
}

function sheet(board: RateBoard, slugSuffix: string, ps: RatePeriod[]): HotelRateSheet {
  return {
    hotelSlug: `jacaranda-iobr-${slugSuffix}`,
    hotelName: "Jacaranda Indian Ocean Beach Resort",
    group: "Jacaranda Hotels",
    websiteUrl: "https://jacarandahotels.com",
    destinationSlug: "diani",
    destinationName: "Diani Beach",
    currency: "KES",
    market: "east-african-resident",
    basis: "rack",
    board,
    validFrom: "2026-01-06",
    validTo: "2027-01-05",
    roomTypes: [
      { id: "garden", name: "Garden Room" },
      { id: "sea-view", name: "Sea View Room" },
      { id: "beach-front", name: "Beach Front Room" },
    ],
    periods: ps,
    childPolicy: {
      freeUpToAge: 5,
      childRateFromAge: 6,
      childRateToAge: 10,
      adultRateFromAge: 11,
      ownRoomPercentOfRoomRate: 75,
    },
    notes: [
      "Children 6–10 sharing with adults pay 50% of the adult rate.",
      "Ukunda transfers from Kshs 2,500 one way; Mombasa/Miritini from Kshs 10,500.",
    ],
  };
}

export const jacarandaIobrRateSheets: HotelRateSheet[] = [
  sheet(
    "bed-breakfast",
    "bb",
    periods({
      high: [[13700, 18800, 7220], [16650, 23000, 8900], [17900, 25500, 9900]],
      low: [[11000, 14500, 5750], [14000, 18000, 7000], [15500, 20000, 8150]],
      shoulder: [[12000, 16000, 6400], [15000, 19500, 7900], [17350, 21500, 8700]],
      festive: [[22050, 34050, 13050], [32100, 46700, 18050], [34500, 50350, 19500]],
      // No B&B rates during Easter, as printed on the tariff.
    }),
  ),
  sheet(
    "half-board",
    "hb",
    periods({
      high: [[15200, 21800, 8720], [18150, 26000, 10400], [19400, 28500, 11400]],
      easter: [[15000, 21000, 8400], [18000, 25200, 10080], [19500, 27300, 10920]],
      low: [[13500, 16500, 6750], [15000, 20000, 8000], [16500, 22000, 9150]],
      shoulder: [[14550, 19500, 7800], [17500, 23500, 9400], [18850, 25500, 10200]],
      festive: [[25050, 40050, 16050], [35100, 52700, 21050], [37500, 56350, 22500]],
    }),
  ),
  sheet(
    "full-board",
    "fb",
    periods({
      high: [[18200, 27800, 11720], [21150, 32000, 13400], [22400, 34500, 14400]],
      easter: [[18000, 27000, 11400], [21000, 31200, 13080], [22500, 33300, 13920]],
      low: [[16500, 22500, 9750], [18000, 26000, 11000], [19500, 28000, 12150]],
      shoulder: [[17550, 25500, 10800], [20500, 29500, 12400], [21850, 31500, 13200]],
      festive: [[28050, 46050, 19050], [38100, 58700, 24050], [40500, 62350, 25500]],
    }),
  ),
  sheet(
    "all-inclusive",
    "ai",
    periods({
      high: [[29000, 39000, 15600], [34800, 46800, 18720], [37700, 50700, 20280]],
      easter: [[31900, 42900, 17160], [38280, 51480, 20592], [41470, 55770, 22308]],
      low: [[25000, 35000, 14000], [30000, 42000, 16800], [32500, 45500, 18200]],
      shoulder: [[29000, 39000, 15600], [34800, 46800, 18720], [37700, 50700, 20280]],
      festive: [[35050, 60050, 26050], [45100, 72700, 31050], [47500, 76350, 32500]],
    }),
  ),
];
