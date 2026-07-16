import type { HotelRateSheet } from "@/types/rates";
import { maishaGroupRateSheets } from "@/data/rates/maisha-group";
import { almanaraRateSheets } from "@/data/rates/almanara";
import { jacarandaIobrRateSheets } from "@/data/rates/jacaranda-iobr";
import { lantanaGaluBeachRateSheets } from "@/data/rates/lantana-galu-beach";
import { majiBeachRateSheets } from "@/data/rates/maji-beach";
import { kinondoKwetuRateSheets } from "@/data/rates/kinondo-kwetu";
import { swahiliBeachRateSheets } from "@/data/rates/swahili-beach";
import { diamondsLeisureRateSheets } from "@/data/rates/diamonds-leisure";
import { dianiReefRateSheets } from "@/data/rates/diani-reef";

/**
 * Registry of every transcribed hotel rate sheet. Add new contracts here as
 * they are transcribed (one file per hotel group) and they automatically
 * appear in the rate finder's destination list and results.
 *
 * Server-side only: net sheets are confidential contract rates. Import from
 * API routes or server components — never from client components.
 */
export const rateSheets: HotelRateSheet[] = [
  ...maishaGroupRateSheets,
  // Diani
  ...almanaraRateSheets,
  ...jacarandaIobrRateSheets,
  ...lantanaGaluBeachRateSheets,
  ...majiBeachRateSheets,
  ...kinondoKwetuRateSheets,
  ...swahiliBeachRateSheets,
  ...diamondsLeisureRateSheets,
  ...dianiReefRateSheets,
];

export type RateDestinationOption = { slug: string; name: string; hotelCount: number };

/** Destinations that currently have at least one rate sheet loaded. */
export function rateDestinations(): RateDestinationOption[] {
  const hotelsBySlug = new Map<string, { name: string; hotels: Set<string> }>();
  for (const sheet of rateSheets) {
    const entry = hotelsBySlug.get(sheet.destinationSlug) ?? {
      name: sheet.destinationName,
      hotels: new Set<string>(),
    };
    entry.hotels.add(sheet.hotelName);
    hotelsBySlug.set(sheet.destinationSlug, entry);
  }
  return [...hotelsBySlug.entries()]
    .map(([slug, { name, hotels }]) => ({ slug, name, hotelCount: hotels.size }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function sheetsForDestination(destinationSlug: string): HotelRateSheet[] {
  return rateSheets.filter((s) => s.destinationSlug === destinationSlug);
}
