import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteDestination, isIsoDate, stayNights, ISO_DATE_PATTERN, type HotelQuote } from "@/lib/rates";
import { getHotelMediaCatalog, getRateDestinations, getRateSheetsForDestination } from "@/lib/rate-catalog";
import { RATE_MAX_NIGHTS } from "@/config/rates";

/**
 * Public rate lookup. Computes selling prices server-side so the raw
 * contract sheets (net rates, commissions) never reach the browser.
 *
 * GET /api/rates/quote?destination=amboseli&checkIn=2026-07-10&checkOut=2026-07-13
 */

const querySchema = z.object({
  destination: z.string().min(1),
  checkIn: z.string().regex(ISO_DATE_PATTERN, "Use YYYY-MM-DD."),
  checkOut: z.string().regex(ISO_DATE_PATTERN, "Use YYYY-MM-DD."),
  market: z.enum(["east-african-resident", "non-resident"]).default("east-african-resident"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    destination: searchParams.get("destination") ?? "",
    checkIn: searchParams.get("checkIn") ?? "",
    checkOut: searchParams.get("checkOut") ?? "",
    market: searchParams.get("market") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please choose a destination and valid dates." },
      { status: 422 },
    );
  }

  const { destination, checkIn, checkOut, market } = parsed.data;

  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) {
    return NextResponse.json({ error: "Those dates don't exist — please check them." }, { status: 422 });
  }
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 422 });
  }
  const nights = stayNights(checkIn, checkOut).length;
  if (nights > RATE_MAX_NIGHTS) {
    return NextResponse.json(
      { error: `We can quote up to ${RATE_MAX_NIGHTS} nights online — for longer stays, send an enquiry.` },
      { status: 422 },
    );
  }
  const destinations = await getRateDestinations();
  if (!destinations.some((d) => d.slug === destination)) {
    return NextResponse.json({ error: "We don't have rates loaded for that destination yet." }, { status: 404 });
  }

  const [sheets, mediaCatalog] = await Promise.all([
    getRateSheetsForDestination(destination),
    getHotelMediaCatalog(),
  ]);
  const quotes = quoteDestination(sheets, destination, checkIn, checkOut, market);
  const quotedHotelNames = new Set(quotes.map((quote) => quote.hotelName.trim().toLowerCase()));
  const mediaOnlyQuotes: HotelQuote[] = mediaCatalog
    .filter((hotel) => hotel.destinationSlug === destination)
    .filter((hotel) => !quotedHotelNames.has(hotel.name.trim().toLowerCase()))
    .map((hotel) => ({
      hotelSlug: `${hotel.slug}-media`,
      hotelName: hotel.name,
      destinationSlug: hotel.destinationSlug,
      destinationName: hotel.destinationName,
      websiteUrl: hotel.websiteUrl,
      images: hotel.images,
      currency: "KES",
      board: "room-only",
      market,
      checkIn,
      checkOut,
      nights,
      available: false,
      unavailableReason: "Current rates for this hotel are confirmed on request.",
      seasons: [],
      rooms: [],
      familySupplements: [],
      notes: [],
    }));
  return NextResponse.json({
    destination,
    checkIn,
    checkOut,
    market,
    nights,
    quotes: [...quotes, ...mediaOnlyQuotes],
  });
}
