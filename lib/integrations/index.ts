/**
 * Future-integration boundaries.
 *
 * These interfaces define where the operations platform (Amadeus, CRM,
 * WhatsApp Business Platform, email, M-Pesa/card payments) will plug in.
 * Only `InMemoryEnquiryStore` is implemented in this release — everything
 * else is a typed seam, deliberately NOT presented as a live feature.
 */

import type { TravelEnquiry } from "@/types";

// ---------------------------------------------------------------------------
// Enquiry intake (implemented: in-memory demo store behind /api/enquiries)
// ---------------------------------------------------------------------------

export interface EnquiryStore {
  save(enquiry: TravelEnquiry): Promise<{ reference: string }>;
}

/**
 * Demo store: keeps enquiries in server memory for the life of the process
 * and logs them so a developer can see submissions. Swap for a CRM-backed
 * implementation (see `CrmGateway`) without touching the form or API shape.
 */
export class InMemoryEnquiryStore implements EnquiryStore {
  private enquiries: TravelEnquiry[] = [];

  async save(enquiry: TravelEnquiry): Promise<{ reference: string }> {
    this.enquiries.push(enquiry);
    console.info(
      `[enquiry] ${enquiry.reference} · ${enquiry.service} · ${enquiry.destination} · ${enquiry.customer.email}`,
    );
    return { reference: enquiry.reference };
  }

  /** Test/debug helper. */
  all(): readonly TravelEnquiry[] {
    return this.enquiries;
  }
}

export const enquiryStore: EnquiryStore = new InMemoryEnquiryStore();

// ---------------------------------------------------------------------------
// Future seams (typed, unimplemented — do not present as live)
// ---------------------------------------------------------------------------

/** Amadeus: consultants use it internally today; a future release may search fares server-side. */
export interface FlightSearchGateway {
  searchFares(request: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: { adults: number; children: number; infants: number };
  }): Promise<never>; // No public fare search in this release.
}

export interface CrmGateway {
  createLead(enquiry: TravelEnquiry): Promise<{ crmId: string }>;
  updateStatus(reference: string, status: TravelEnquiry["status"]): Promise<void>;
}

export interface MessagingGateway {
  /** WhatsApp Business Platform / email confirmations. */
  sendEnquiryAcknowledgement(enquiry: TravelEnquiry): Promise<void>;
}

export interface PaymentGateway {
  /** M-Pesa / card payments — collected against approved quotations only. */
  createPaymentRequest(input: {
    reference: string;
    amount: number;
    currency: string;
  }): Promise<{ paymentUrl: string }>;
}

export interface HotelContractRepository {
  /** Future contracted-rates store; the public site never fakes inventory. */
  findContractedProperties(destinationSlug: string): Promise<never>;
}
