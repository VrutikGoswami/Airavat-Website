import { NextResponse } from "next/server";
import { z } from "zod";
import type { PublicFlightLeg, PublicFlightOffer, PublicFlightSearchResponse } from "@/types/flight-options";

export const runtime = "nodejs";

const schema = z.object({
  origin: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  destination: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  departureDate: z.string().date(),
  returnDate: z.string().date().optional().or(z.literal("")),
  adults: z.number().int().min(1).max(9),
  children: z.number().int().min(0).max(8),
  cabin: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]),
}).refine((value) => value.origin !== value.destination, { message: "Origin and destination must be different." });

type Segment = {
  departure?: { iataCode?: string; at?: string };
  arrival?: { iataCode?: string; at?: string };
  carrierCode?: string;
  number?: string;
};

type AmadeusOffer = {
  id?: string;
  numberOfBookableSeats?: number;
  itineraries?: Array<{ duration?: string; segments?: Segment[] }>;
  price?: { currency?: string; total?: string; grandTotal?: string };
  pricingOptions?: { fareType?: string[] };
  travelerPricings?: Array<{ fareDetailsBySegment?: Array<{ cabin?: string; includedCheckedBags?: { quantity?: number; weight?: number; weightUnit?: string } }> }>;
};

let tokenCache: { token: string; expiresAt: number; baseUrl: string } | null = null;

function duration(value = ""): number {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  return match ? Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0) : 0;
}

function baggage(offer: AmadeusOffer): string {
  const allowance = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags;
  if (allowance?.quantity != null) return `${allowance.quantity} checked bag${allowance.quantity === 1 ? "" : "s"}`;
  if (allowance?.weight != null) return `${allowance.weight}${allowance.weightUnit ?? "KG"} checked baggage`;
  return "Confirm with airline";
}

async function token(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
  if (tokenCache && tokenCache.baseUrl === baseUrl && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;
  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json() as { access_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !body.access_token) throw new Error(body.error_description || "Live fares are temporarily unavailable.");
  tokenCache = { token: body.access_token, expiresAt: Date.now() + (body.expires_in ?? 1_800) * 1_000, baseUrl };
  return body.access_token;
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the flight details." }, { status: 400 });
    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Live fares are temporarily unavailable. Continue and a consultant will check matching options." }, { status: 503 });
    }
    const input = parsed.data;
    const baseUrl = process.env.AMADEUS_ENV === "production" ? "https://api.amadeus.com" : "https://test.api.amadeus.com";
    const accessToken = await token(baseUrl, clientId, clientSecret);
    const query = new URLSearchParams({
      originLocationCode: input.origin,
      destinationLocationCode: input.destination,
      departureDate: input.departureDate,
      adults: String(input.adults),
      travelClass: input.cabin,
      currencyCode: "KES",
      max: "20",
    });
    if (input.returnDate) query.set("returnDate", input.returnDate);
    if (input.children) query.set("children", String(input.children));
    const response = await fetch(`${baseUrl}/v2/shopping/flight-offers?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    const body = await response.json() as { data?: AmadeusOffer[]; dictionaries?: { carriers?: Record<string, string> }; errors?: Array<{ detail?: string; title?: string }> };
    if (!response.ok) throw new Error(body.errors?.[0]?.detail || body.errors?.[0]?.title || "Live fares are temporarily unavailable.");
    const carriers = body.dictionaries?.carriers ?? {};
    const offers = (body.data ?? []).flatMap((offer, index): PublicFlightOffer[] => {
      const first = offer.itineraries?.[0]?.segments?.[0];
      const total = Number(offer.price?.grandTotal ?? offer.price?.total ?? 0);
      if (!first || !total) return [];
      const legs = (offer.itineraries ?? []).map((itinerary): PublicFlightLeg => {
        const segments = itinerary.segments ?? [];
        const start = segments[0];
        const end = segments[segments.length - 1];
        return {
          origin: start?.departure?.iataCode ?? input.origin,
          destination: end?.arrival?.iataCode ?? input.destination,
          departure: start?.departure?.at ?? "",
          arrival: end?.arrival?.at ?? "",
          durationMinutes: duration(itinerary.duration),
          stops: Math.max(0, segments.length - 1),
          flightNumbers: segments.map((segment) => `${segment.carrierCode ?? ""}${segment.number ?? ""}`).filter(Boolean),
        };
      });
      const code = first.carrierCode ?? "";
      return [{
        id: offer.id ?? `offer-${index}`,
        airline: carriers[code] || code || "Multiple airlines",
        currency: offer.price?.currency ?? "KES",
        total,
        cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ?? input.cabin,
        baggage: baggage(offer),
        meals: "Confirm with airline",
        fareType: offer.pricingOptions?.fareType?.join(", ") || "Published fare",
        seatsRemaining: offer.numberOfBookableSeats,
        legs,
      }];
    });
    const result: PublicFlightSearchResponse = { offers, searchedAt: new Date().toISOString() };
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Live fares are temporarily unavailable." }, { status: 502 });
  }
}
