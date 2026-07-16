import type { HotelRateSheet } from "@/types/rates";
import { maishaGroupRateSheets } from "@/data/rates/maisha-group";

/**
 * Registry of every transcribed hotel rate sheet. Add new contracts here as
 * they are transcribed (one file per hotel group) and they automatically
 * appear in the rate finder's destination list and results.
 *
 * Server-side only: these are confidential contract rates. Import from API
 * routes or server components — never from client components.
 */
export const rateSheets: HotelRateSheet[] = [...maishaGroupRateSheets];

export type RateDestinationOption = { slug: string; name: string; hotelCount: number };

/** Destinations that currently have at least one rate sheet loaded. */
export function rateDestinations(): RateDestinationOption[] {
  const bySlug = new Map<string, RateDestinationOption>();
  for (const sheet of rateSheets) {
    const existing = bySlug.get(sheet.destinationSlug);
    if (existing) {
      existing.hotelCount += 1;
    } else {
      bySlug.set(sheet.destinationSlug, {
        slug: sheet.destinationSlug,
        name: sheet.destinationName,
        hotelCount: 1,
      });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function sheetsForDestination(destinationSlug: string): HotelRateSheet[] {
  return rateSheets.filter((s) => s.destinationSlug === destinationSlug);
}
