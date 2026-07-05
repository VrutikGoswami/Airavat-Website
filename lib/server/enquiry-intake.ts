import type { QuoteFormValues } from "@/lib/validation/quote";
import type { TravelEnquiry } from "@/types";

type SourceContext = {
  landingPage?: string;
  referrer?: string;
  utm?: Record<string, string>;
  selectedDestination?: string;
  selectedItinerary?: string;
  selectedOffer?: string;
};

type IntakeResult = {
  reference: string;
  storedIn: "supabase" | "memory";
};

export function normalizeEmail(email?: string): string | undefined {
  const trimmed = email?.trim().toLowerCase();
  return trimmed || undefined;
}

export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return `${plus}${trimmed.replace(/\D/g, "")}`;
}

function compactObject<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  ) as Partial<T>;
}

function customerType(service: QuoteFormValues["service"]): "individual" | "family" | "corporate" | "group" {
  if (service === "corporate") return "corporate";
  if (service === "group") return "group";
  return "individual";
}

function crmService(service: QuoteFormValues["service"]) {
  if (service === "hotels") return "hotel";
  if (service === "not-sure") return "holiday-package";
  return service;
}

export function buildCrmPayload(values: QuoteFormValues, source: SourceContext = {}) {
  const serviceSpecific =
    values.service === "flights"
      ? compactObject({
          tripType: values.tripType ?? "return",
          cabinClass: values.cabinClass ?? "any",
          checkedBaggage: values.checkedBaggage ?? "not-sure",
          preferredAirline: values.preferredAirline,
          baggageNotes: values.baggageNotes,
        })
      : values.service === "hotels"
        ? compactObject({
            rooms: values.rooms ?? 1,
            roomConfiguration: values.roomConfiguration,
            hotelCategory: values.hotelCategory ?? "any",
            mealPlan: values.mealPlan ?? "any",
            residency: values.residency,
            preferredArea: values.preferredArea,
          })
        : values.service === "safari" || values.service === "holiday-package" || values.service === "transport"
          ? compactObject({
              accommodationCategory: values.accommodationStyle ?? "not-sure",
              roadOrFlyIn: values.accessPreference ?? "either",
              transportRequired: values.includeDailyTransport ?? false,
              includeFlights: values.includeFlights ?? false,
              includeAccommodation: values.includeAccommodation ?? false,
              includeTransfers: values.includeTransfers ?? false,
              activities: values.activities,
              residency: values.residency,
              travelStyle: values.style,
              specialOccasion: values.specialOccasion,
            })
          : values.service === "corporate" || values.service === "group"
            ? compactObject({
                organisationName: values.organisationName,
                groupSize: values.groupSize,
                travelPurpose: values.travelPurpose,
                departurePoints: values.departurePoints,
                billingRequirements: values.billingRequirements,
                coordinationNotes: values.coordinationNotes,
              })
            : {};

  return {
    customer: compactObject({
      name: values.fullName.trim(),
      whatsapp: normalizePhone(values.whatsapp),
      email: normalizeEmail(values.email),
      preferred_contact: values.preferredContact,
      type: customerType(values.service),
      company: values.organisationName,
    }),
    enquiry: compactObject({
      service: crmService(values.service),
      origin: values.departureCity,
      destination: values.destination,
      departure_date: values.departureDate,
      return_date: values.returnDate,
      flexible_dates: values.flexibleDates,
      adults: values.adults,
      children: values.children,
      infants: values.infants,
      child_ages: values.childAges,
      budget: values.budget,
      notes: values.notes,
      accessibility: values.accessibilityNeeds,
      service_details: serviceSpecific,
    }),
    source: compactObject({
      leadSource: "website",
      landingPage: source.landingPage,
      referrer: source.referrer,
      utm: source.utm,
      selectedDestination: source.selectedDestination,
      selectedItinerary: source.selectedItinerary,
      selectedOffer: source.selectedOffer,
      consentTimestamp: new Date().toISOString(),
      initialStage: "New enquiry",
      followUpDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date().toISOString(),
    }),
  };
}

export async function saveToSupabaseCrm(
  reference: string,
  values: QuoteFormValues,
  source: SourceContext = {},
): Promise<IntakeResult | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const payload = buildCrmPayload(values, source);
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/create_website_enquiry`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_reference: reference,
      p_customer: payload.customer,
      p_enquiry: payload.enquiry,
      p_source: payload.source,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Could not save enquiry to CRM.");
  }

  return { reference, storedIn: "supabase" };
}

export function buildDemoEnquiry(reference: string, values: QuoteFormValues): TravelEnquiry {
  const normalizedEmail = normalizeEmail(values.email);
  return {
    reference,
    service: values.service,
    destination: values.destination,
    flexibleDestination: values.flexibleDestination,
    departureDate: values.departureDate || undefined,
    returnDate: values.returnDate || undefined,
    flexibleDates: values.flexibleDates,
    travellers: { adults: values.adults, children: values.children, infants: values.infants },
    travellerType: values.travellerType,
    style: values.style,
    budget: values.budget,
    notes: values.notes || undefined,
    customer: {
      fullName: values.fullName,
      email: normalizedEmail,
      whatsapp: normalizePhone(values.whatsapp),
      preferredContact: values.preferredContact,
    },
    consent: values.consent,
    flight:
      values.service === "flights"
        ? {
            tripType: values.tripType ?? "return",
            departureCity: values.departureCity ?? "",
            destinationCity: values.destination,
            cabinClass: values.cabinClass ?? "any",
            preferredAirline: values.preferredAirline || undefined,
            baggageNotes: values.baggageNotes || undefined,
          }
        : undefined,
    hotel:
      values.service === "hotels"
        ? {
            destination: values.destination,
            rooms: values.rooms ?? 1,
            roomConfiguration: values.roomConfiguration || undefined,
            hotelCategory: values.hotelCategory ?? "any",
            mealPlan: values.mealPlan ?? "any",
            preferredArea: values.preferredArea || undefined,
          }
        : undefined,
    safari:
      values.service === "safari" || values.service === "holiday-package" || values.service === "transport"
        ? {
            origin: values.departureCity || "",
            accessPreference: values.accessPreference ?? "either",
            accommodationStyle: values.accommodationStyle ?? "not-sure",
            includeFlights: values.includeFlights ?? false,
            includeAccommodation: values.includeAccommodation ?? false,
            includeTransfers: values.includeTransfers ?? false,
            includeDailyTransport: values.includeDailyTransport ?? false,
            activities: values.activities || undefined,
            specialOccasion: values.specialOccasion || undefined,
          }
        : undefined,
    group:
      values.service === "group"
        ? {
            organisationName: values.organisationName || undefined,
            groupSize: values.groupSize ?? "",
            travelPurpose: values.travelPurpose || "",
            departurePoints: values.departurePoints || undefined,
            coordinationNotes: values.coordinationNotes || undefined,
          }
        : undefined,
    corporate:
      values.service === "corporate"
        ? {
            organisationName: values.organisationName || undefined,
            groupSize: values.groupSize ?? "",
            travelPurpose: values.travelPurpose || "",
            departurePoints: values.departurePoints || undefined,
            coordinationNotes: values.coordinationNotes || undefined,
            billingRequirements: values.billingRequirements || undefined,
          }
        : undefined,
    accessibilityNeeds: values.accessibilityNeeds || undefined,
    source: "website-quote-form",
    submittedAt: new Date().toISOString(),
    status: "new",
  };
}
