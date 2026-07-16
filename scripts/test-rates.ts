import assert from "node:assert/strict";
import { quoteHotel } from "../lib/rates";
import type { HotelRateSheet } from "../types/rates";

const baseSheet: HotelRateSheet = {
  hotelSlug: "test-lodge-fb",
  hotelName: "Test Lodge",
  destinationSlug: "test-destination",
  destinationName: "Test Destination",
  currency: "KES",
  market: "east-african-resident",
  basis: "rack",
  board: "full-board",
  validFrom: "2026-01-01",
  validTo: "2026-02-28",
  roomTypes: [
    { id: "deluxe", name: "Deluxe Room" },
    { id: "standard", name: "Standard Room" },
  ],
  periods: [
    {
      start: "2026-01-01",
      end: "2026-01-31",
      season: "low",
      rates: { deluxe: { double: 1_000 }, standard: { double: 900 } },
    },
    {
      start: "2026-02-01",
      end: "2026-02-28",
      season: "high",
      rates: { deluxe: { double: 1_500 } },
    },
    {
      start: "2026-02-01",
      end: "2026-02-28",
      season: "high",
      rates: { standard: { double: 1_100 } },
    },
  ],
};

const dateBandQuote = quoteHotel(baseSheet, "2026-01-31", "2026-02-02");
assert.equal(dateBandQuote.available, true);
assert.equal(dateBandQuote.rooms[0].occupancies.double?.total, 2_500);
assert.equal(dateBandQuote.rooms[1].occupancies.double?.total, 2_000);
assert.deepEqual(dateBandQuote.seasons, ["low", "high"]);

const netQuote = quoteHotel(
  {
    ...baseSheet,
    basis: "net",
    validFrom: "2026-01-01",
    validTo: "2026-01-01",
    roomTypes: [{ id: "deluxe", name: "Deluxe Room" }],
    periods: [
      {
        start: "2026-01-01",
        end: "2026-01-01",
        season: "regular",
        rates: { deluxe: { double: 1_000 } },
      },
    ],
  },
  "2026-01-01",
  "2026-01-02",
);
assert.equal(netQuote.rooms[0].occupancies.double?.total, 1_050);
assert.equal("basis" in netQuote, false, "Public quote objects must not expose pricing basis.");

console.log("Rate engine tests passed: date bands, room-specific periods, and private net markup.");
