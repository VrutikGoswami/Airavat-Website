import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation/quote";
import { enquiryStore } from "@/lib/integrations";
import { generateEnquiryReference } from "@/lib/enquiry-reference";
import type { TravelEnquiry } from "@/types";

/**
 * Demonstration enquiry intake. Validates the submission, assigns a
 * reference and stores it in the in-memory demo store. Replace the store
 * with a CRM/email implementation via `lib/integrations` — the request and
 * response shapes are the stable contract.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please review the highlighted fields and try again.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  const v = parsed.data;
  const reference = generateEnquiryReference();

  const enquiry: TravelEnquiry = {
    reference,
    service: v.service,
    destination: v.destination,
    flexibleDestination: v.flexibleDestination,
    departureDate: v.departureDate || undefined,
    returnDate: v.returnDate || undefined,
    flexibleDates: v.flexibleDates,
    travellers: { adults: v.adults, children: v.children, infants: v.infants },
    travellerType: v.travellerType,
    style: v.style,
    budget: v.budget,
    notes: v.notes || undefined,
    customer: {
      fullName: v.fullName,
      email: v.email,
      whatsapp: v.whatsapp,
      preferredContact: v.preferredContact,
    },
    consent: v.consent,
    flight:
      v.service === "flights"
        ? {
            tripType: v.tripType ?? "return",
            departureCity: v.departureCity ?? "",
            destinationCity: v.destination,
            cabinClass: v.cabinClass ?? "any",
            preferredAirline: v.preferredAirline || undefined,
            baggageNotes: v.baggageNotes || undefined,
          }
        : undefined,
    hotel:
      v.service === "hotels"
        ? {
            destination: v.destination,
            rooms: v.rooms ?? 1,
            roomConfiguration: v.roomConfiguration || undefined,
            hotelCategory: v.hotelCategory ?? "any",
            mealPlan: v.mealPlan ?? "any",
            preferredArea: v.preferredArea || undefined,
          }
        : undefined,
    safari:
      v.service === "safari" || v.service === "holiday-package" || v.service === "transport"
        ? {
            origin: v.departureCity || "",
            accessPreference: v.accessPreference ?? "either",
            accommodationStyle: v.accommodationStyle ?? "not-sure",
            includeFlights: v.includeFlights ?? false,
            includeAccommodation: v.includeAccommodation ?? false,
            includeTransfers: v.includeTransfers ?? false,
            includeDailyTransport: v.includeDailyTransport ?? false,
            activities: v.activities || undefined,
            specialOccasion: v.specialOccasion || undefined,
          }
        : undefined,
    group:
      v.service === "group"
        ? {
            organisationName: v.organisationName || undefined,
            groupSize: v.groupSize ?? "",
            travelPurpose: v.travelPurpose || "",
            departurePoints: v.departurePoints || undefined,
            coordinationNotes: v.coordinationNotes || undefined,
          }
        : undefined,
    corporate:
      v.service === "corporate"
        ? {
            organisationName: v.organisationName || undefined,
            groupSize: v.groupSize ?? "",
            travelPurpose: v.travelPurpose || "",
            departurePoints: v.departurePoints || undefined,
            coordinationNotes: v.coordinationNotes || undefined,
            billingRequirements: v.billingRequirements || undefined,
          }
        : undefined,
    accessibilityNeeds: v.accessibilityNeeds || undefined,
    dietaryNeeds: v.dietaryNeeds || undefined,
    source: "website-quote-form",
    submittedAt: new Date().toISOString(),
    status: "new",
  };

  await enquiryStore.save(enquiry);

  return NextResponse.json({ reference }, { status: 201 });
}
