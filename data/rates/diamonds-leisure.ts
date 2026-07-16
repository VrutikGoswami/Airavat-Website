import type { HotelRateSheet, RatePeriod, RateSeasonName } from "@/types/rates";

/**
 * Diamonds Leisure Beach & Golf Resort, Diani.
 * Residents: 2025–2026 KES cards (All Inclusive + Half Board), per room per
 * night, valid 23 Dec 2025 – 23 Dec 2026. Triple = double + extra-adult
 * supplement (max 3 adults). Villas/suites priced per unit.
 * Non-residents: USD rack table from the 2026–27 season document, per person
 * per night (valid 1 Nov 2026 – 31 Oct 2027): single +50%, third adult −30%,
 * first child 2–11.99 sharing free, second child 50% (value shown per paying
 * child). Children 0–5.99 stay free on the resident cards.
 */

/** [double, single, extraAdult, child] per room as printed. */
type Row = [number, number, number, number];

const occ = ([double, single, extra, child]: Row) => ({
  single,
  double,
  triple: double + extra,
  childSharing: child,
});

type ResidentSeason = {
  start: string;
  end: string;
  season: RateSeasonName;
  bustani: Row;
  poolSide: Row;
  junior: Row;
  bahari: Row;
  seaView: Row;
  villa4: number;
  villa6: number;
  suite2: number;
};

function residentPeriods(seasons: ResidentSeason[]): RatePeriod[] {
  return seasons.map((s) => ({
    start: s.start,
    end: s.end,
    season: s.season,
    rates: {
      bustani: occ(s.bustani),
      "pool-side": occ(s.poolSide),
      "junior-suite": occ(s.junior),
      "bahari-pool": occ(s.bahari),
      "sea-view": occ(s.seaView),
      "villa-4br": { perUnit: s.villa4 },
      "villa-6br": { perUnit: s.villa6 },
      "suite-2br": { perUnit: s.suite2 },
    },
  }));
}

const residentShared = {
  hotelName: "Diamonds Leisure Beach & Golf Resort",
  group: "Planhotel / Diamonds Resorts",
  destinationSlug: "diani",
  destinationName: "Diani Beach",
  currency: "KES",
  market: "east-african-resident",
  basis: "rack",
  validFrom: "2025-12-23",
  validTo: "2026-12-23",
  roomTypes: [
    { id: "bustani", name: "Bustani Garden" },
    { id: "pool-side", name: "Pool Side" },
    { id: "junior-suite", name: "Junior Suite" },
    { id: "bahari-pool", name: "Bahari Pool" },
    { id: "sea-view", name: "Sea View" },
    { id: "suite-2br", name: "2-Bedroom Suite (per unit)" },
    { id: "villa-4br", name: "4-Bedroom Oasis Villa (per unit)" },
    { id: "villa-6br", name: "6-Bedroom Oasis Villa (per unit)" },
  ],
  childPolicy: {
    freeUpToAge: 5,
    childRateFromAge: 6,
    childRateToAge: 11,
    adultRateFromAge: 12,
  },
  notes: [
    "Maximum 3 adults, or 2 adults + 1 child per room; villa/suite prices are per whole unit.",
  ],
} satisfies Partial<HotelRateSheet>;

export const diamondsLeisureRateSheets: HotelRateSheet[] = [
  {
    ...residentShared,
    hotelSlug: "diamonds-leisure-ai",
    board: "all-inclusive",
    periods: residentPeriods([
      { start: "2025-12-23", end: "2025-12-27", season: "festive",
        bustani: [88660, 66495, 31030, 22165], poolSide: [95940, 71955, 33580, 23985],
        junior: [98800, 74100, 34580, 24700], bahari: [105535, 79150, 36940, 26385],
        seaView: [108940, 81705, 38130, 27235], villa4: 354640, villa6: 531960, suite2: 292500 },
      { start: "2025-12-28", end: "2026-01-03", season: "festive",
        bustani: [88660, 66495, 31030, 22165], poolSide: [95940, 71955, 33580, 23985],
        junior: [98800, 74100, 34580, 24700], bahari: [105535, 79150, 36940, 26385],
        seaView: [108940, 81705, 38130, 27235], villa4: 354640, villa6: 531960, suite2: 325000 },
      { start: "2026-01-04", end: "2026-04-06", season: "high",
        bustani: [37960, 28470, 13290, 9490], poolSide: [42380, 31785, 14835, 10595],
        junior: [45760, 34320, 16020, 11440], bahari: [46620, 34970, 16320, 11655],
        seaView: [48100, 36075, 16835, 12025], villa4: 151840, villa6: 227760, suite2: 247000 },
      { start: "2026-04-07", end: "2026-06-30", season: "low",
        bustani: [32760, 24570, 11470, 8190], poolSide: [37755, 28315, 13215, 9440],
        junior: [42435, 31825, 14850, 10610], bahari: [43415, 32560, 15195, 10855],
        seaView: [44305, 33230, 15510, 11080], villa4: 131040, villa6: 196560, suite2: 247000 },
      { start: "2026-07-01", end: "2026-12-23", season: "high",
        bustani: [37960, 28470, 13290, 9490], poolSide: [42380, 31785, 14835, 10595],
        junior: [45760, 34320, 16020, 11440], bahari: [46620, 34965, 16320, 11655],
        seaView: [48100, 36075, 16835, 12025], villa4: 151840, villa6: 227760, suite2: 247000 },
    ]),
  },
  {
    ...residentShared,
    hotelSlug: "diamonds-leisure-hb",
    board: "half-board",
    periods: residentPeriods([
      { start: "2025-12-23", end: "2025-12-27", season: "festive",
        bustani: [66500, 49875, 23275, 16625], poolSide: [71960, 53970, 25185, 17990],
        junior: [74100, 55575, 25935, 18525], bahari: [79150, 59365, 27705, 19790],
        seaView: [81710, 61280, 28600, 20430], villa4: 265980, villa6: 398970, suite2: 219375 },
      { start: "2025-12-28", end: "2026-01-03", season: "festive",
        bustani: [66500, 49875, 23275, 16625], poolSide: [71960, 53970, 25185, 17990],
        junior: [74100, 55575, 25935, 18525], bahari: [79150, 59365, 27705, 19790],
        seaView: [81710, 61280, 28600, 20430], villa4: 265980, villa6: 398970, suite2: 243750 },
      { start: "2026-01-04", end: "2026-04-06", season: "high",
        bustani: [28470, 21355, 9965, 7120], poolSide: [31790, 23840, 11130, 7950],
        junior: [34320, 25740, 12015, 8580], bahari: [34965, 26225, 12240, 8745],
        seaView: [36080, 27060, 12630, 9020], villa4: 113880, villa6: 170820, suite2: 185250 },
      { start: "2026-04-07", end: "2026-06-30", season: "low",
        bustani: [24570, 18430, 8600, 6145], poolSide: [28315, 21240, 9910, 7080],
        junior: [31825, 23870, 11140, 7960], bahari: [32560, 24420, 11340, 8140],
        seaView: [33230, 24920, 11630, 8310], villa4: 98280, villa6: 147420, suite2: 185250 },
      { start: "2026-07-01", end: "2026-12-23", season: "high",
        bustani: [28470, 21355, 9965, 7120], poolSide: [31790, 23840, 11125, 7950],
        junior: [34320, 25740, 12015, 8580], bahari: [34965, 26225, 12240, 8740],
        seaView: [36080, 27060, 12630, 9020], villa4: 113880, villa6: 170820, suite2: 185250 },
    ]),
  },
  {
    hotelSlug: "diamonds-leisure-nr",
    hotelName: "Diamonds Leisure Beach & Golf Resort",
    group: "Planhotel / Diamonds Resorts",
    destinationSlug: "diani",
    destinationName: "Diani Beach",
    currency: "USD",
    market: "non-resident",
    basis: "rack",
    board: "all-inclusive",
    validFrom: "2026-11-01",
    validTo: "2027-10-31",
    roomTypes: [
      { id: "bahari-pool", name: "Bahari Pool" },
      { id: "junior-suite", name: "Junior Suite" },
      { id: "sea-view", name: "Sea View" },
      { id: "suite-2br", name: "2-Bedroom Suite (per unit)" },
      { id: "villa-4br", name: "4-Bedroom Oasis Villa (per unit)" },
      { id: "villa-6br", name: "6-Bedroom Oasis Villa (per unit)" },
    ],
    periods: (
      [
        ["2026-11-01", "2026-12-20", "high", 232, 284, 1420, 1680, 2784],
        ["2026-12-21", "2026-12-27", "festive", 496, 608, 3040, 3600, 5952],
        ["2026-12-28", "2027-01-07", "festive", 640, 786, 3930, 4656, 7680],
        ["2027-01-08", "2027-02-28", "high", 276, 338, 1690, 2000, 3312],
        ["2027-03-01", "2027-03-31", "shoulder", 232, 284, 1420, 1680, 2784],
        ["2027-04-01", "2027-06-30", "low", 196, 246, 1230, 1456, 2352],
        ["2027-07-01", "2027-10-31", "high", 232, 284, 1420, 1680, 2784],
      ] as Array<[string, string, RateSeasonName, number, number, number, number, number]>
    ).map(([start, end, season, bahariPp, suitePp, suite2, villa4, villa6]) => {
      const pp = (rate: number) => ({
        single: Math.round(rate * 1.5),
        double: rate * 2,
        triple: Math.round(rate * 2.7),
        childSharing: Math.round(rate * 0.5),
      });
      return {
        start,
        end,
        season,
        rates: {
          "bahari-pool": pp(bahariPp),
          "junior-suite": pp(suitePp),
          "sea-view": pp(suitePp),
          "suite-2br": { perUnit: suite2 },
          "villa-4br": { perUnit: villa4 },
          "villa-6br": { perUnit: villa6 },
        },
      };
    }),
    childPolicy: {
      freeUpToAge: 1,
      childRateFromAge: 2,
      childRateToAge: 11,
      adultRateFromAge: 12,
    },
    notes: [
      "Per-person rack rates converted to room totals (single +50%, third adult −30%).",
      "First child 2–11 sharing with adults stays free; the child price shown applies to a second child.",
    ],
  },
];
