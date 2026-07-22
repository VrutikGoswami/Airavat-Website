import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type {
  HotelRateSheet,
  OccupancyKey,
  RateDestinationOption,
  RateBasis,
  RateBoard,
  RateMarket,
  RatePeriod,
  RateSeasonName,
} from "@/types/rates";

type RawHotel = {
  slug: string;
  name: string;
  destination_slug: string;
  destination_name: string;
  hotel_group: string | null;
  website_url: string | null;
  image_urls: string[] | null;
};

type RawDocument = {
  pricing_basis: "rack" | "net" | "unknown";
  status: string;
};

type RawRateRow = {
  id: string;
  rate_type: string;
  season_name: string | null;
  valid_from: string;
  valid_to: string;
  blackout_dates: string[] | null;
  room_type: string;
  meal_plan: string;
  occupancy: string;
  adults: number | null;
  children: number | null;
  amount: number | string;
  currency: string;
  market: string;
  unit_basis: string;
  minimum_stay: number | null;
  tax_included: "Yes" | "No" | "Unknown";
  conditions: string | null;
  approved_at: string | null;
  hotel: RawHotel | RawHotel[];
  document: RawDocument | RawDocument[];
};

const PAGE_SIZE = 1_000;

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function one<T>(value: T | T[]): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "rate";
}

function mapMarket(value: string): RateMarket | null {
  const market = value.toLowerCase().replace(/[_-]+/g, " ").trim();
  if (!market || market === "all" || market === "not stated" || market === "worldwide") return "all";
  if (/non\s*resident|international|overseas/.test(market)) return "non-resident";
  if (/east african|east africa|\beac\b|resident|citizen/.test(market)) return "east-african-resident";
  return null;
}

function mapBoard(value: string): RateBoard | null {
  const board = value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (/\ball inclusive\b|^ai$/.test(board)) return "all-inclusive";
  if (/\bfull board\b|^fb$/.test(board)) return "full-board";
  if (/\bhalf board\b|^hb$/.test(board)) return "half-board";
  if (/bed.*breakfast|^bb$|^b b$/.test(board)) return "bed-breakfast";
  if (/room only|^ro$/.test(board)) return "room-only";
  return null;
}

function mapSeason(value: string | null): RateSeasonName {
  const season = (value || "").toLowerCase();
  if (season.includes("christmas") || season.includes("new year")) return "christmas";
  if (season.includes("festive")) return "festive";
  if (season.includes("easter")) return "easter";
  if (season.includes("premium")) return "premium";
  if (season.includes("peak")) return "peak";
  if (season.includes("shoulder")) return "shoulder";
  if (season.includes("green")) return "green";
  if (season.includes("low")) return "low";
  if (season.includes("mid")) return "mid";
  if (season.includes("high")) return "high";
  return "regular";
}

function occupancyKey(row: RawRateRow): OccupancyKey | null {
  const occupancy = row.occupancy.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const rateType = row.rate_type.toLowerCase();
  if (rateType.includes("child")) {
    if (/teen|12\s*(?:to|-|–)\s*17|13\s*(?:to|-|–)/.test(occupancy)) return "childTeenSharing";
    if (/third|3rd|extra bed/.test(occupancy)) return "childThirdBed";
    return "childSharing";
  }
  if (/single|\bsgl\b|one adult|1 adult/.test(occupancy) || row.adults === 1) return "single";
  if (/triple|\btrpl\b|three adult|3 adult/.test(occupancy) || row.adults === 3) return "triple";
  if (/double|\bdbl\b|\bpps\b|twin|two adult|2 adult/.test(occupancy) || row.adults === 2) return "double";
  if (/unit|villa|house|cottage|apartment|whole room/.test(occupancy)) return "perUnit";
  if (row.unit_basis === "Per Room Per Night") return "perUnit";
  return null;
}

function nightlyAmount(row: RawRateRow, occupancy: OccupancyKey): number | null {
  const amount = Number(row.amount);
  const rateType = row.rate_type.toLowerCase();
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (rateType.includes("child") || row.unit_basis === "Per Child Per Night") return amount;
  if (rateType !== "accommodation") return null;
  if (row.unit_basis === "Per Room Per Night") return amount;
  if (row.unit_basis === "Per Person Per Night" || row.unit_basis === "Per Person Sharing Per Night") {
    const guests = row.adults ?? (occupancy === "single" ? 1 : occupancy === "double" ? 2 : occupancy === "triple" ? 3 : 0);
    return guests > 0 ? amount * guests : null;
  }
  return null;
}

function buildSheets(rows: RawRateRow[]): HotelRateSheet[] {
  type MutableSheet = HotelRateSheet & {
    _roomIds: Set<string>;
    _periods: Map<string, RatePeriod>;
    _notes: Set<string>;
  };
  const sheets = new Map<string, MutableSheet>();

  for (const row of rows) {
    const hotel = one(row.hotel);
    const document = one(row.document);
    if (!hotel || !document || document.status !== "approved") continue;
    if (document.pricing_basis !== "rack" && document.pricing_basis !== "net") continue;
    if (row.currency !== "KES" && row.currency !== "USD") continue;

    const market = mapMarket(row.market);
    const board = mapBoard(row.meal_plan);
    const occupancy = occupancyKey(row);
    if (!market || !board || !occupancy || !row.valid_from || !row.valid_to) continue;
    const amount = nightlyAmount(row, occupancy);
    if (amount === null || !row.room_type || row.room_type === "N/A") continue;

    const basis = document.pricing_basis as RateBasis;
    const sheetKey = [hotel.slug, row.currency, market, basis, board].join("|");
    const sheetSlug = `${hotel.slug}-${board}-${market}-${basis}`;
    let sheet = sheets.get(sheetKey);
    if (!sheet) {
      sheet = {
        hotelSlug: sheetSlug,
        hotelName: hotel.name,
        destinationSlug: hotel.destination_slug,
        destinationName: hotel.destination_name,
        group: hotel.hotel_group ?? undefined,
        websiteUrl: hotel.website_url ?? undefined,
        images: hotel.image_urls ?? [],
        currency: row.currency,
        market,
        basis,
        board,
        validFrom: row.valid_from,
        validTo: row.valid_to,
        roomTypes: [],
        periods: [],
        notes: [],
        _roomIds: new Set<string>(),
        _periods: new Map<string, RatePeriod>(),
        _notes: new Set<string>(),
      };
      sheets.set(sheetKey, sheet);
    }

    const roomId = slugify(row.room_type);
    if (!sheet._roomIds.has(roomId)) {
      sheet._roomIds.add(roomId);
      sheet.roomTypes.push({ id: roomId, name: row.room_type });
    }
    const season = mapSeason(row.season_name);
    const periodKey = `${row.valid_from}|${row.valid_to}|${season}`;
    let period = sheet._periods.get(periodKey);
    if (!period) {
      period = { start: row.valid_from, end: row.valid_to, season, rates: {} };
      sheet._periods.set(periodKey, period);
    }
    const occupancies = period.rates[roomId] ?? {};
    if (occupancies[occupancy] === undefined) occupancies[occupancy] = amount;
    period.rates[roomId] = occupancies;

    if (row.minimum_stay && row.minimum_stay > 1) {
      sheet._notes.add(`A minimum stay of ${row.minimum_stay} nights may apply.`);
    }
    if ((row.blackout_dates ?? []).length > 0) sheet._notes.add("Blackout dates may apply.");
    if (row.tax_included === "No") sheet._notes.add("Some taxes or levies are excluded and will be confirmed before booking.");
    sheet.validFrom = sheet.validFrom < row.valid_from ? sheet.validFrom : row.valid_from;
    sheet.validTo = sheet.validTo > row.valid_to ? sheet.validTo : row.valid_to;
  }

  return [...sheets.values()].map((sheet) => ({
    hotelSlug: sheet.hotelSlug,
    hotelName: sheet.hotelName,
    destinationSlug: sheet.destinationSlug,
    destinationName: sheet.destinationName,
    currency: sheet.currency,
    market: sheet.market,
    basis: sheet.basis,
    board: sheet.board,
    validFrom: sheet.validFrom,
    validTo: sheet.validTo,
    roomTypes: [...sheet.roomTypes].sort((a, b) => a.name.localeCompare(b.name)),
    periods: [...sheet._periods.values()].sort(
      (a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end),
    ),
    notes: [...sheet._notes],
  }));
}

async function databaseRateSheets(destinationSlug?: string): Promise<HotelRateSheet[]> {
  const supabase = serverClient();
  if (!supabase) return [];
  const rows: RawRateRow[] = [];

  try {
    for (let page = 0; page < 20; page += 1) {
      let query = supabase
        .from("hotel_rate_rows")
        .select(`
          id,rate_type,season_name,valid_from,valid_to,blackout_dates,room_type,meal_plan,
          occupancy,adults,children,amount,currency,market,unit_basis,minimum_stay,
          tax_included,conditions,approved_at,
          hotel:rate_hotels!inner(slug,name,destination_slug,destination_name,hotel_group,website_url,image_urls),
          document:rate_documents!inner(pricing_basis,status)
        `)
        .eq("active", true)
        .eq("review_status", "approved")
        .eq("hotel.active", true)
        .eq("document.status", "approved")
        .order("approved_at", { ascending: false })
        .order("id", { ascending: true })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (destinationSlug) query = query.eq("hotel.destination_slug", destinationSlug);
      const { data, error } = await query;
      if (error) throw error;
      const pageRows = (data ?? []) as unknown as RawRateRow[];
      rows.push(...pageRows);
      if (pageRows.length < PAGE_SIZE) break;
    }
    return buildSheets(rows);
  } catch (error) {
    console.error("Could not load published hotel rates from Supabase.", error);
    return [];
  }
}

export async function getRateSheetsForDestination(destinationSlug: string): Promise<HotelRateSheet[]> {
  noStore();
  return databaseRateSheets(destinationSlug);
}

export async function getRateDestinations(): Promise<RateDestinationOption[]> {
  noStore();
  const catalog = await databaseRateSheets();
  const destinations = new Map<string, { name: string; hotels: Set<string> }>();
  for (const sheet of catalog) {
    const entry = destinations.get(sheet.destinationSlug) ?? {
      name: sheet.destinationName,
      hotels: new Set<string>(),
    };
    entry.hotels.add(sheet.hotelName);
    destinations.set(sheet.destinationSlug, entry);
  }
  return [...destinations.entries()]
    .map(([slug, entry]) => ({ slug, name: entry.name, hotelCount: entry.hotels.size }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
