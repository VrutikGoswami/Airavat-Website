import type { EnquiryService } from "@/types";

export type TravelOffer = {
  id: string;
  approved: boolean;
  title: string;
  destination: string;
  duration: string;
  description: string;
  startingPrice?: number;
  currency?: "KES" | "USD" | "AED" | "INR";
  eligibility: "resident" | "non-resident" | "all";
  inclusions: string[];
  exclusions: string[];
  validTravelDates: {
    start: string;
    end: string;
  };
  expiresOn: string;
  image: string;
  service: EnquiryService;
};

/**
 * Approved offers can be added here or mapped from Supabase later.
 * Keep this empty until Airavat has verified price, inclusions and validity.
 */
export const offers: TravelOffer[] = [];

export function activeOffers(now = new Date()): TravelOffer[] {
  const today = now.toISOString().slice(0, 10);
  return offers.filter((offer) => offer.approved && offer.expiresOn >= today);
}
