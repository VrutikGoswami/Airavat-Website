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
    childAges: optionalTrimmed,
    infants: z.coerce.number().int().min(0).max(20),
    travellerType: z.enum(travellerTypes),

    // Stage 2 — preferences & service details
    style: z.enum(travelStyles),
    budget: z.enum(budgetBands),
    residency: z.enum(["resident", "non-resident", "not-sure"]).optional(),

    tripType: z.enum(["one-way", "return"]).optional(),
    cabinClass: z
      .enum(["economy", "premium-economy", "business", "first", "any"])
      .optional(),
    checkedBaggage: z.enum(["yes", "no", "not-sure"]).optional(),
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

    // Stage 3 — contact
    fullName: z.string().trim().min(2, "Enter your full name").max(120),
    whatsapp: z
      .string()
      .trim()
      .min(7, "Enter the number we can reach you on")
      .max(20)
      .regex(/^\+?[0-9\s-]+$/, "Digits, spaces and + only"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .optional()
      .or(z.literal("")),
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
    if (data.service === "hotels" && !data.returnDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Choose a check-out date",
      });
    }
    if (data.service === "flights" && data.tripType === "return" && !data.returnDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Choose a return date",
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
    if (data.children > 0 && !data.childAges) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childAges"],
        message: "Add the children's ages so we can quote correctly",
      });
    }
    if (data.service === "flights" && !data.departureCity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departureCity"],
        message: "Tell us which city you are flying from",
      });
    }
    if (data.preferredContact === "email" && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Add an email address if you prefer email contact",
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
  childAges: "",
  infants: 0,
  travellerType: "couple",
  style: "not-sure",
  budget: "not-sure",
  residency: "not-sure",
  checkedBaggage: "not-sure",
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
  | "trip"
  | "preferences"
  | "contact";

export const QUOTE_STEPS: { id: QuoteStepId; title: string; short: string }[] = [
  { id: "trip", title: "Trip", short: "Trip" },
  { id: "preferences", title: "Travellers and preferences", short: "Preferences" },
  { id: "contact", title: "Contact and review", short: "Contact" },
];

/** Fields each step must pass before the form advances. */
export const QUOTE_STEP_FIELDS: Record<QuoteStepId, (keyof QuoteFormValues)[]> = {
  trip: [
    "service",
    "destination",
    "departureCity",
    "departureDate",
    "returnDate",
    "flexibleDates",
  ],
  preferences: [
    "adults",
    "children",
    "childAges",
    "budget",
    "tripType",
    "cabinClass",
    "checkedBaggage",
    "rooms",
    "hotelCategory",
    "mealPlan",
    "accessPreference",
    "accommodationStyle",
    "groupSize",
    "travelPurpose",
  ],
  contact: ["fullName", "whatsapp", "email", "preferredContact", "consent"],
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
