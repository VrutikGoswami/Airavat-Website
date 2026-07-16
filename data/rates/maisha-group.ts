import type {
  HotelRateSheet,
  OccupancyRates,
  RatePeriod,
  RateSeasonName,
} from "@/types/rates";

/**
 * Maisha Group — 2026 East African resident rates (contract dated 18 June
 * 2026, AIRAVAT TOURS AND TRAVEL LTD). Full board, per room, KES, inclusive
 * of service charge and taxes. Source: "Maisha Group Resident Rates 2026"
 * rate card. All three camps share the Club/Deluxe room split and the same
 * seasonal calendar; only the prices differ.
 */

/** [single, double, triple, childSharing(4–11)] per night. */
type Row = [number, number, number, number];

function occ([single, double, triple, childSharing]: Row): OccupancyRates {
  return { single, double, triple, childSharing };
}

function period(
  start: string,
  end: string,
  season: RateSeasonName,
  club: Row,
  deluxe: Row,
): RatePeriod {
  return { start, end, season, rates: { club: occ(club), deluxe: occ(deluxe) } };
}

const sharedSheet = {
  group: "Maisha Group",
  currency: "KES",
  market: "east-african-resident",
  board: "full-board",
  validFrom: "2026-01-04",
  validTo: "2027-01-03",
  roomTypes: [
    { id: "club", name: "Club" },
    { id: "deluxe", name: "Deluxe" },
  ],
  meals: {
    extraLunchOrDinnerPerPerson: 4500,
    extraPackedLunchPerPerson: 4000,
    halfBoardReductionPerPerson: 500,
  },
  childPolicy: {
    freeUpToAge: 3,
    maxFreeChildrenPerRoom: 2,
    childRateFromAge: 4,
    childRateToAge: 11,
    adultRateFromAge: 12,
    ownRoomPercentOfRoomRate: 80,
  },
  notes: [
    "Rates are per room per night on full board, inclusive of service charge and current taxes.",
    "Valid for residents of East Africa.",
  ],
} satisfies Partial<HotelRateSheet>;

export const kiboSafariCamp: HotelRateSheet = {
  ...sharedSheet,
  hotelSlug: "kibo-safari-camp",
  hotelName: "Kibo Safari Camp",
  destinationSlug: "amboseli",
  destinationName: "Amboseli",
  commissionPercent: 10,
  periods: [
    period("2026-01-04", "2026-02-28", "high", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-03-01", "2026-04-02", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-04-03", "2026-04-06", "easter", [42900, 57200, 78650, 14300], [33000, 44000, 60500, 11000]),
    period("2026-04-07", "2026-05-31", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-06-01", "2026-06-14", "high", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-06-15", "2026-09-30", "peak", [42900, 57200, 78650, 14300], [33000, 44000, 60500, 11000]),
    period("2026-10-01", "2026-10-31", "high", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-11-01", "2026-12-22", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-12-23", "2027-01-03", "festive", [39000, 52000, 71500, 13000], [30000, 40000, 55000, 10000]),
  ],
  familySupplements: [
    { name: "Family Club Tent", maxPax: 5, perAdultPerNight: 6500, perChildPerNight: 3250 },
    { name: "Family Deluxe Tent", maxPax: 4, perAdultPerNight: 5200, perChildPerNight: 2600 },
  ],
};

export const maraMaishaCamp: HotelRateSheet = {
  ...sharedSheet,
  hotelSlug: "mara-maisha-camp",
  hotelName: "Mara Maisha Camp",
  destinationSlug: "maasai-mara",
  destinationName: "Maasai Mara",
  commissionPercent: 10,
  periods: [
    period("2026-01-04", "2026-02-28", "high", [37050, 49400, 67925, 12350], [28500, 38000, 52250, 9500]),
    period("2026-03-01", "2026-04-02", "green", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-04-03", "2026-04-06", "easter", [39000, 52000, 71500, 13000], [30000, 40000, 55000, 10000]),
    period("2026-04-07", "2026-05-31", "green", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-06-01", "2026-06-14", "high", [37050, 49400, 67925, 12350], [28500, 38000, 52250, 9500]),
    period("2026-06-15", "2026-09-30", "peak", [59475, 79300, 109000, 19825], [45750, 61000, 83875, 15250]),
    period("2026-10-01", "2026-10-31", "high", [37050, 49400, 67925, 12350], [28500, 38000, 52250, 9500]),
    period("2026-11-01", "2026-12-22", "green", [34125, 45500, 62550, 11375], [26250, 35000, 48125, 8750]),
    period("2026-12-23", "2027-01-03", "festive", [39000, 52000, 71500, 13000], [30000, 40000, 55000, 10000]),
  ],
  familySupplements: [
    { name: "Family Club Tent", maxPax: 5, perAdultPerNight: 7800, perChildPerNight: 3900 },
    { name: "Family Deluxe Tent", maxPax: 4, perAdultPerNight: 6500, perChildPerNight: 3250 },
  ],
};

export const maishaSweetwatersCamp: HotelRateSheet = {
  ...sharedSheet,
  hotelSlug: "maisha-sweetwaters-camp",
  hotelName: "Maisha Sweetwaters Camp",
  destinationSlug: "ol-pejeta",
  destinationName: "Ol Pejeta Conservancy",
  commissionPercent: 15,
  periods: [
    period("2026-01-04", "2026-02-28", "high", [35100, 46800, 64350, 11700], [27000, 36000, 49500, 9000]),
    period("2026-03-01", "2026-04-02", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-04-03", "2026-04-06", "easter", [43875, 58500, 80450, 14625], [33750, 45000, 61875, 11250]),
    period("2026-04-07", "2026-05-31", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-06-01", "2026-06-14", "high", [35100, 46800, 64350, 11700], [27000, 36000, 49500, 9000]),
    period("2026-06-15", "2026-09-30", "peak", [43875, 58500, 80450, 14625], [33750, 45000, 61875, 11250]),
    period("2026-10-01", "2026-10-31", "high", [35100, 46800, 64350, 11700], [27000, 36000, 49500, 9000]),
    period("2026-11-01", "2026-12-22", "green", [31200, 41600, 57200, 10400], [24000, 32000, 44000, 8000]),
    period("2026-12-23", "2027-01-03", "festive", [43875, 58500, 80450, 14625], [33750, 45000, 61875, 11250]),
  ],
  familySupplements: [
    { name: "Family Morani Tent", maxPax: 5, perAdultPerNight: 6500, perChildPerNight: 3250 },
    { name: "Family Deluxe Tent", maxPax: 4, perAdultPerNight: 5200, perChildPerNight: 2600 },
  ],
};

export const maishaGroupRateSheets: HotelRateSheet[] = [
  kiboSafariCamp,
  maraMaishaCamp,
  maishaSweetwatersCamp,
];
