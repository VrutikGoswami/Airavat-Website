import type { QuoteFormValues } from "@/lib/validation/quote";
import type { TravelEnquiry } from "@/types";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonRecord = Record<string, JsonValue>;

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
  switch (service) {
    case "flights":
      return "flight";
    case "hotels":
      return "hotel";
    case "safari":
      return "tour_safari";
    case "corporate":
    case "group":
      return service;
    case "holiday-package":
    case "transport":
    case "not-sure":
      return "holiday_package";
  }
}

function budgetValue(budget: QuoteFormValues["budget"]): number | null {
  switch (budget) {
    case "under-100k":
      return 100000;
    case "100k-300k":
      return 300000;
    case "300k-700k":
      return 700000;
    case "over-700k":
      return 1000000;
    case "not-sure":
      return null;
  }
}

function configured(value: string | undefined): value is string {
  return Boolean(value && !value.startsWith("PASTE_") && !value.endsWith("_HERE"));
}

function crmEnv(): { url: string; serviceKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!configured(url) || !configured(serviceKey)) return null;
  return { url: url.replace(/\/$/, ""), serviceKey };
}

async function crmFetch(path: string, init: RequestInit = {}) {
  const env = crmEnv();
  if (!env) return null;
  return fetch(`${env.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.serviceKey,
      Authorization: `Bearer ${env.serviceKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function readRows<T extends JsonRecord>(table: string, query: string): Promise<T[]> {
  const response = await crmFetch(`${table}?${query}`);
  if (!response) return [];
  if (!response.ok) {
    throw new Error((await response.text().catch(() => "")) || `Could not read ${table}.`);
  }
  return await response.json() as T[];
}

async function insertRow<T extends JsonRecord>(table: string, row: JsonRecord): Promise<T> {
  const response = await crmFetch(table, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!response?.ok) {
    throw new Error((await response?.text().catch(() => "")) || `Could not insert ${table}.`);
  }
  const rows = await response.json() as T[];
  return rows[0];
}

async function updateRow<T extends JsonRecord>(table: string, id: string, row: JsonRecord): Promise<T> {
  const response = await crmFetch(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!response?.ok) {
    throw new Error((await response?.text().catch(() => "")) || `Could not update ${table}.`);
  }
  const rows = await response.json() as T[];
  return rows[0];
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
      dietary_needs: values.dietaryNeeds,
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
  if (!crmEnv()) return null;

  const payload = buildCrmPayload(values, source);
  const phone = String(payload.customer.whatsapp);
  const email = typeof payload.customer.email === "string" ? payload.customer.email : undefined;
  const [consultant] = await readRows<{ id: string; role: string }>(
    "users",
    "select=id,role&role=eq.consultant&order=created_at.asc&limit=1",
  );
  const [fallbackUser] = consultant
    ? []
    : await readRows<{ id: string; role: string }>("users", "select=id,role&order=created_at.asc&limit=1");
  const assignedTo = consultant?.id ?? fallbackUser?.id ?? null;

  const [phoneMatch] = await readRows<{ id: string }>(
    "customers",
    `select=*&whatsapp_number=eq.${encodeURIComponent(phone)}&order=updated_at.desc&limit=1`,
  );
  const [emailMatch] = phoneMatch || !email
    ? []
    : await readRows<{ id: string }>(
        "customers",
        `select=*&email=eq.${encodeURIComponent(email)}&order=updated_at.desc&limit=1`,
      );

  const customerPayload: JsonRecord = {
    name: String(payload.customer.name),
    whatsapp_number: phone,
    email: email ?? null,
    customer_type: String(payload.customer.type ?? "individual"),
    preferred_channel: String(payload.customer.preferred_contact ?? "whatsapp"),
    preferences: null,
    assigned_to: assignedTo,
    created_by: assignedTo,
  };

  const customer = phoneMatch ?? emailMatch
    ? await updateRow<{ id: string }>("customers", (phoneMatch ?? emailMatch).id, customerPayload)
    : await insertRow<{ id: string }>("customers", customerPayload);

  const enquiry = await insertRow<{ id: string }>("enquiries", {
    customer_id: customer.id,
    service_type: String(payload.enquiry.service),
    origin: typeof payload.enquiry.origin === "string" ? payload.enquiry.origin : null,
    destination: String(payload.enquiry.destination ?? "Not sure"),
    travel_start: typeof payload.enquiry.departure_date === "string" ? payload.enquiry.departure_date : null,
    travel_end: typeof payload.enquiry.return_date === "string" ? payload.enquiry.return_date : null,
    travellers: Number(payload.enquiry.adults ?? 1) + Number(payload.enquiry.children ?? 0) + Number(payload.enquiry.infants ?? 0),
    budget: budgetValue(values.budget),
    budget_currency: "KES",
    requirements: JSON.stringify({ reference, ...payload.enquiry, source: payload.source }, null, 2),
    lead_source: "website",
    stage: "new_enquiry",
    waiting_on: "our_team",
    next_action: "Review website enquiry",
    next_action_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    assigned_to: assignedTo,
    created_by: assignedTo,
  });

  await insertRow("tasks", {
    title: `Follow up website enquiry ${reference}`,
    task_type: "follow_up_call",
    customer_id: customer.id,
    enquiry_id: enquiry.id,
    assigned_to: assignedTo,
    due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: "normal",
    status: "open",
    auto_generated: true,
    created_by: assignedTo,
  });

  await insertRow("activity_logs", {
    entity_type: "enquiry",
    entity_id: enquiry.id,
    action: "website-form",
    detail: {
      summary: `Website enquiry ${reference} received`,
      customer_id: customer.id,
      enquiry_id: enquiry.id,
      source: payload.source,
    },
    actor: null,
  });

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
