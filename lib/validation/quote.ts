import { z } from "zod";

/**
 * Validation for the guided quotation flow. One schema drives every step;
 * `QUOTE_STEP_FIELDS` lists which fields each step validates so the form
 * can gate progression with react-hook-form's `trigger`.
 */

export const enquiryServices = [
  "flights",
  "hotels",
  "safari",
  "holiday-package",
  "transport",
  "corporate",
  "group",
  "not-sure",
] as const;

export const travellerTypes = [
  "solo",
  "couple",
  "family",
  "friends",
  "business",
  "group",
] as const;

export const travelStyles = ["value", "comfort", "premium", "not-sure"] as const;

export const budgetBands = [
  "under-100k",
  "100k-300k",
  "300k-700k",
  "over-700k",
  "not-sure",
] as const;

const optionalTrimmed = z
  .string()
  .trim()
  .max(1000, "Please keep this under 1000 characters")
  .optional()
  .or(z.literal(""));

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");

export const quoteSchema = z
  .object({
    // Step 1 — what
    service: z.enum(enquiryServices, {
      errorMap: () => ({ message: "Choose the closest match — “I’m not sure yet” is fine" }),
    }),

    // Step 2 — where
    destination: z
      .string()
      .trim()
      .min(2, "Tell us roughly where — a country, city or “not sure yet”")
      .max(120),
    departureCity: optionalTrimmed,
    flexibleDestination: z.boolean(),

    // Step 3 — when
    departureDate: isoDate.optional().or(z.literal("")),
    returnDate: isoDate.optional().or(z.literal("")),
    flexibleDates: z.boolean(),

    // Step 4 — who
    adults: z.coerce.number().int().min(1, "At least one adult traveller").max(99),
    children: z.coerce.number().int().min(0).max(99),
    infants: z.coerce.number().int().min(0).max(20),
    travellerType: z.enum(travellerTypes),

    // Step 5 — style, budget & service details
    style: z.enum(travelStyles),
    budget: z.enum(budgetBands),

    tripType: z.enum(["one-way", "return", "multi-city"]).optional(),
    cabinClass: z
      .enum(["economy", "premium-economy", "business", "first", "any"])
      .optional(),
    preferredAirline: optionalTrimmed,
    baggageNotes: optionalTrimmed,

    rooms: z.coerce.number().int().min(1).max(50).optional(),
    roomConfiguration: optionalTrimmed,
    hotelCategory: z.enum(["value", "mid-range", "premium", "any"]).optional(),
    mealPlan: z
      .enum(["room-only", "bed-breakfast", "half-board", "full-board", "all-inclusive", "any"])
      .optional(),
    preferredArea: optionalTrimmed,

    accessPreference: z.enum(["road", "fly-in", "either"]).optional(),
    accommodationStyle: z
      .enum(["tented-camp", "lodge", "conservancy", "mixed", "not-sure"])
      .optional(),
    includeFlights: z.boolean().optional(),
    includeAccommodation: z.boolean().optional(),
    includeTransfers: z.boolean().optional(),
    includeDailyTransport: z.boolean().optional(),
    activities: optionalTrimmed,
    specialOccasion: optionalTrimmed,

    organisationName: optionalTrimmed,
    groupSize: optionalTrimmed,
    travelPurpose: optionalTrimmed,
    departurePoints: optionalTrimmed,
    billingRequirements: optionalTrimmed,
    coordinationNotes: optionalTrimmed,

    accessibilityNeeds: optionalTrimmed,
    dietaryNeeds: optionalTrimmed,

    // Step 6 — contact
    fullName: z.string().trim().min(2, "Enter your full name").max(120),
    whatsapp: z
      .string()
      .trim()
      .min(7, "Enter the number we can reach you on")
      .max(20)
      .regex(/^\+?[0-9\s-]+$/, "Digits, spaces and + only"),
    email: z.string().trim().email("Enter a valid email address"),
    preferredContact: z.enum(["whatsapp", "phone", "email"]),
    notes: optionalTrimmed,
    consent: z
      .boolean()
      .refine((v) => v === true, {
        message: "We need your consent to contact you about this enquiry",
      }),
  })
  .superRefine((data, ctx) => {
    // Dates: require either a rough date or the flexible flag.
    if (!data.flexibleDates && !data.departureDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departureDate"],
        message: "Pick an approximate date, or tick “My dates are flexible”",
      });
    }
    if (data.departureDate && data.returnDate && data.returnDate < data.departureDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Return date can’t be before departure",
      });
    }
    if (data.departureDate && !data.flexibleDates) {
      const today = new Date().toISOString().slice(0, 10);
      if (data.departureDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["departureDate"],
          message: "Departure date is in the past",
        });
      }
    }
    if (data.infants > data.adults) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["infants"],
        message: "Each infant needs an accompanying adult",
      });
    }
    if (data.service === "flights" && !data.departureCity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departureCity"],
        message: "Tell us which city you are flying from",
      });
    }
    if ((data.service === "corporate" || data.service === "group") && !data.groupSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["groupSize"],
        message: "A rough group size helps us respond usefully",
      });
    }
  });

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const quoteDefaults: QuoteFormValues = {
  service: "not-sure",
  destination: "",
  departureCity: "",
  flexibleDestination: false,
  departureDate: "",
  returnDate: "",
  flexibleDates: false,
  adults: 2,
  children: 0,
  infants: 0,
  travellerType: "couple",
  style: "not-sure",
  budget: "not-sure",
  preferredAirline: "",
  baggageNotes: "",
  roomConfiguration: "",
  preferredArea: "",
  activities: "",
  specialOccasion: "",
  organisationName: "",
  groupSize: "",
  travelPurpose: "",
  departurePoints: "",
  billingRequirements: "",
  coordinationNotes: "",
  accessibilityNeeds: "",
  dietaryNeeds: "",
  fullName: "",
  whatsapp: "",
  email: "",
  preferredContact: "whatsapp",
  notes: "",
  consent: false,
};

export type QuoteStepId =
  | "service"
  | "destination"
  | "dates"
  | "travellers"
  | "details"
  | "contact"
  | "review";

export const QUOTE_STEPS: { id: QuoteStepId; title: string; short: string }[] = [
  { id: "service", title: "What would you like help with?", short: "Service" },
  { id: "destination", title: "Where are you travelling?", short: "Where" },
  { id: "dates", title: "When do you want to travel?", short: "When" },
  { id: "travellers", title: "Who is travelling?", short: "Who" },
  { id: "details", title: "Style, budget and details", short: "Details" },
  { id: "contact", title: "How do we reach you?", short: "Contact" },
  { id: "review", title: "Review and send", short: "Review" },
];

/** Fields each step must pass before the form advances. */
export const QUOTE_STEP_FIELDS: Record<QuoteStepId, (keyof QuoteFormValues)[]> = {
  service: ["service"],
  destination: ["destination", "departureCity", "flexibleDestination"],
  dates: ["departureDate", "returnDate", "flexibleDates"],
  travellers: ["adults", "children", "infants", "travellerType"],
  details: [
    "style",
    "budget",
    "tripType",
    "cabinClass",
    "rooms",
    "hotelCategory",
    "mealPlan",
    "accessPreference",
    "accommodationStyle",
    "groupSize",
    "travelPurpose",
  ],
  contact: ["fullName", "whatsapp", "email", "preferredContact", "consent"],
  review: [],
};

/** Human labels for the review step and WhatsApp summaries. */
export const SERVICE_LABELS: Record<(typeof enquiryServices)[number], string> = {
  flights: "Flight booking",
  hotels: "Hotel reservation",
  safari: "Tour or safari",
  "holiday-package": "Complete holiday package",
  transport: "Transport or transfers",
  corporate: "Corporate travel",
  group: "Group travel",
  "not-sure": "Not sure yet — advise me",
};

export const BUDGET_LABELS: Record<(typeof budgetBands)[number], string> = {
  "under-100k": "Under KES 100,000",
  "100k-300k": "KES 100,000 – 300,000",
  "300k-700k": "KES 300,000 – 700,000",
  "over-700k": "Over KES 700,000",
  "not-sure": "Not sure yet",
};

export const STYLE_LABELS: Record<(typeof travelStyles)[number], string> = {
  value: "Value-conscious",
  comfort: "Comfortable mid-range",
  premium: "Premium",
  "not-sure": "Not sure yet",
};

export const TRAVELLER_TYPE_LABELS: Record<(typeof travellerTypes)[number], string> = {
  solo: "Travelling solo",
  couple: "A couple",
  family: "A family",
  friends: "Friends",
  business: "Business travel",
  group: "A group (10+)",
};
