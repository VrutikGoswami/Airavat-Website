import type {
  HotelRateSheet,
  OccupancyKey,
  RateBoard,
  RateMarket,
  RateSeasonName,
} from "@/types/rates";
import { sheetsForDestination } from "@/data/rates";
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

/** Net contract rate → public selling price. */
function sellingPrice(net: number): number {
  if (RATE_MARKUP_PERCENT === 0) return net;
  const marked = net * (1 + RATE_MARKUP_PERCENT / 100);
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

const OCCUPANCY_KEYS: OccupancyKey[] = ["single", "double", "triple", "childSharing"];

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
      perAdultPerNight: sellingPrice(s.perAdultPerNight),
      perChildPerNight: sellingPrice(s.perChildPerNight),
    })),
    childPolicySummary: childPolicySummary(sheet),
    notes: sheet.notes ?? [],
  };

  if (nights.length === 0) {
    return { ...base, unavailableReason: "Check-out must be after check-in." };
  }

  // Resolve the rate period covering each night; dates compare lexically.
  const nightPeriods = nights.map((night) => ({
    night,
    period: sheet.periods.find((p) => p.start <= night && night <= p.end),
  }));

  const uncovered = nightPeriods.filter((n) => !n.period).map((n) => n.night);
  if (uncovered.length > 0) {
    return {
      ...base,
      unavailableReason: `No contracted rates for ${
        uncovered.length === nights.length ? "these dates" : `some nights (${uncovered.join(", ")})`
      } — rates are loaded from ${sheet.validFrom} to ${sheet.validTo}.`,
    };
  }

  const seasons: RateSeasonName[] = [];
  for (const { period } of nightPeriods) {
    if (period && !seasons.includes(period.season)) seasons.push(period.season);
  }

  const rooms: RoomTypeQuote[] = sheet.roomTypes.map((roomType) => {
    const occupancies: RoomTypeQuote["occupancies"] = {};
    for (const key of OCCUPANCY_KEYS) {
      let total = 0;
      let covered = true;
      for (const { period } of nightPeriods) {
        const net = period?.rates[roomType.id]?.[key];
        if (typeof net !== "number") {
          covered = false;
          break;
        }
        total += sellingPrice(net);
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

/** Quotes every hotel with a rate sheet in the destination. */
export function quoteDestination(
  destinationSlug: string,
  checkIn: string,
  checkOut: string,
): HotelQuote[] {
  return sheetsForDestination(destinationSlug)
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
