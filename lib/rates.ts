import type {
  HotelRateSheet,
  OccupancyKey,
  RateBasis,
  RateBoard,
  RateMarket,
  RateSeasonName,
} from "@/types/rates";
import { RATE_MARKUP_PERCENT, RATE_ROUNDING_STEP } from "@/config/rates";

/**
 * Quote engine: turns confidential contract rate sheets into public selling
 * prices for a stay. Server-side only — quotes returned to the client carry
 * computed prices and guest-facing policy text, never raw sheet internals
 * such as commission.
 */

export type OccupancyQuote = {
  /** Selling price for the whole stay. */
  total: number;
  /** Average selling price per night (stays can span rate seasons). */
  perNight: number;
};

export type RoomTypeQuote = {
  roomTypeId: string;
  roomTypeName: string;
  occupancies: Partial<Record<OccupancyKey, OccupancyQuote>>;
};

export type FamilySupplementQuote = {
  name: string;
  maxPax: number;
  perAdultPerNight: number;
  perChildPerNight: number;
};

export type HotelQuote = {
  hotelSlug: string;
  hotelName: string;
  group?: string;
  destinationSlug: string;
  destinationName: string;
  websiteUrl?: string;
  images: string[];
  currency: "KES" | "USD";
  board: RateBoard;
  market: RateMarket;
  checkIn: string;
  checkOut: string;
  nights: number;
  available: boolean;
  unavailableReason?: string;
  /** Rate seasons the stay touches, in order of first appearance. */
  seasons: RateSeasonName[];
  rooms: RoomTypeQuote[];
  familySupplements: FamilySupplementQuote[];
  childPolicySummary?: string;
  notes: string[];
};

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Every night of the stay as an ISO date (check-out night excluded). */
export function stayNights(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return nights;
}

/**
 * Sheet figure → public selling price. Rack sheets are already selling
 * prices; net/STO sheets get the configured markup.
 */
function sellingPrice(amount: number, basis: RateBasis): number {
  if (basis === "rack" || RATE_MARKUP_PERCENT <= 0) return amount;
  const marked = amount * (1 + RATE_MARKUP_PERCENT / 100);
  return Math.ceil(marked / RATE_ROUNDING_STEP) * RATE_ROUNDING_STEP;
}

function childPolicySummary(sheet: HotelRateSheet): string | undefined {
  const p = sheet.childPolicy;
  if (!p) return undefined;
  const parts = [
    `Children 0–${p.freeUpToAge} stay free when sharing with adults` +
      (p.maxFreeChildrenPerRoom ? ` (max ${p.maxFreeChildrenPerRoom} per room)` : ""),
    `ages ${p.childRateFromAge}–${p.childRateToAge} pay the child-sharing rate`,
    `from ${p.adultRateFromAge} years the full adult rate applies`,
  ];
  if (p.ownRoomPercentOfRoomRate) {
    parts.push(`children in their own room pay ${p.ownRoomPercentOfRoomRate}% of the room rate`);
  }
  return `${parts.join("; ")}.`;
}

const OCCUPANCY_KEYS: OccupancyKey[] = [
  "single",
  "double",
  "triple",
  "perUnit",
  "childSharing",
  "childTeenSharing",
  "childThirdBed",
];

export function quoteHotel(
  sheet: HotelRateSheet,
  checkIn: string,
  checkOut: string,
): HotelQuote {
  const nights = stayNights(checkIn, checkOut);

  const base: HotelQuote = {
    hotelSlug: sheet.hotelSlug,
    hotelName: sheet.hotelName,
    group: sheet.group,
    destinationSlug: sheet.destinationSlug,
    destinationName: sheet.destinationName,
    websiteUrl: sheet.websiteUrl,
    images: sheet.images ?? [],
    currency: sheet.currency,
    board: sheet.board,
    market: sheet.market,
    checkIn,
    checkOut,
    nights: nights.length,
    available: false,
    seasons: [],
    rooms: [],
    familySupplements: (sheet.familySupplements ?? []).map((s) => ({
      name: s.name,
      maxPax: s.maxPax,
      perAdultPerNight: sellingPrice(s.perAdultPerNight, sheet.basis),
      perChildPerNight: sellingPrice(s.perChildPerNight, sheet.basis),
    })),
    childPolicySummary: childPolicySummary(sheet),
    notes: sheet.notes ?? [],
  };

  if (nights.length === 0) {
    return { ...base, unavailableReason: "Check-out must be after check-in." };
  }

  // A hotel may publish distinct date bands for different room types. Resolve
  // coverage per room and occupancy below instead of choosing one global
  // period for the entire hotel night.
  const uncovered = nights.filter(
    (night) => !sheet.periods.some((period) => period.start <= night && night <= period.end),
  );
  if (uncovered.length > 0) {
    return {
      ...base,
      unavailableReason: `No contracted rates for ${
        uncovered.length === nights.length ? "these dates" : `some nights (${uncovered.join(", ")})`
      } — rates are loaded from ${sheet.validFrom} to ${sheet.validTo}.`,
    };
  }

  const seasons: RateSeasonName[] = [];
  for (const night of nights) {
    for (const period of sheet.periods) {
      if (period.start <= night && night <= period.end && !seasons.includes(period.season)) {
        seasons.push(period.season);
      }
    }
  }

  const rooms: RoomTypeQuote[] = sheet.roomTypes.map((roomType) => {
    const occupancies: RoomTypeQuote["occupancies"] = {};
    for (const key of OCCUPANCY_KEYS) {
      let total = 0;
      let covered = true;
      for (const night of nights) {
        const period = sheet.periods.find(
          (candidate) =>
            candidate.start <= night &&
            night <= candidate.end &&
            typeof candidate.rates[roomType.id]?.[key] === "number",
        );
        const net = period?.rates[roomType.id]?.[key];
        if (typeof net !== "number") {
          covered = false;
          break;
        }
        total += sellingPrice(net, sheet.basis);
      }
      if (covered) {
        occupancies[key] = {
          total,
          perNight: Math.round(total / nights.length),
        };
      }
    }
    return { roomTypeId: roomType.id, roomTypeName: roomType.name, occupancies };
  });

  const hasAnyPrice = rooms.some((r) => Object.keys(r.occupancies).length > 0);
  if (!hasAnyPrice) {
    return { ...base, unavailableReason: "No rates available for these dates." };
  }

  return { ...base, available: true, seasons, rooms };
}

/** Quotes every hotel with a rate sheet in the destination for one market. */
export function quoteDestination(
  sheets: HotelRateSheet[],
  destinationSlug: string,
  checkIn: string,
  checkOut: string,
  market: RateMarket = "east-african-resident",
): HotelQuote[] {
  return sheets
    .filter((sheet) => sheet.destinationSlug === destinationSlug)
    .filter((sheet) => sheet.market === market || sheet.market === "all")
    .map((sheet) => quoteHotel(sheet, checkIn, checkOut))
    .sort((a, b) => {
      const aMin = cheapestDouble(a);
      const bMin = cheapestDouble(b);
      return aMin - bMin;
    });
}

/** Cheapest double-room total, used to order results (unavailable last). */
function cheapestDouble(quote: HotelQuote): number {
  if (!quote.available) return Number.POSITIVE_INFINITY;
  const totals = quote.rooms
    .map((r) => r.occupancies.double?.total ?? r.occupancies.single?.total)
    .filter((t): t is number => typeof t === "number");
  return totals.length ? Math.min(...totals) : Number.POSITIVE_INFINITY;
}
