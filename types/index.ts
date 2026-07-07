/**
 * Central domain models. These types are the contract between the public
 * website (this release) and the future operations platform (CRM, Amadeus,
 * WhatsApp Business, payments). Keep them serialisable.
 */

// ---------------------------------------------------------------------------
// Geography & destinations
// ---------------------------------------------------------------------------

export type MapPointCategory =
  | "reserve"
  | "conservancy"
  | "gate"
  | "airstrip"
  | "town"
  | "experience"
  | "departure";

export type MapPoint = {
  id: string;
  name: string;
  category: MapPointCategory;
  latitude: number;
  longitude: number;
  shortDescription: string;
  image?: string;
  href?: string;
  /** Coordinates confirmed by the business. Demo entries are `false`. */
  verified: boolean;
};

export type MonthKey =
  | "jan" | "feb" | "mar" | "apr" | "may" | "jun"
  | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

export type MonthRatingValue = "excellent" | "good" | "mixed";

export type MonthRating = {
  month: MonthKey;
  rating: MonthRatingValue;
  note?: string;
};

export type Experience = {
  id: string;
  name: string;
  summary: string;
  image: string;
  /** Traveller types this experience tends to suit. */
  suits: TravellerType[];
};

export type ItineraryIdea = {
  slug: string;
  title: string;
  duration: string;
  places: string[];
  style: TravelStyle;
  summary: string;
  image: string;
  destinationSlugs: string[];
  travellerTypes: TravellerType[];
  /** Months in which this idea works especially well. */
  bestMonths: MonthKey[];
};

export type Destination = {
  slug: string;
  name: string;
  country: string;
  region?: string;
  eyebrow: string;
  headline: string;
  summary: string;
  /** Longer editorial introduction shown on the destination page. */
  narrative: string[];
  heroImage: string;
  gallery: string[];
  idealFor: string[];
  quickFacts: { label: string; value: string }[];
  seasonalStory?: {
    title: string;
    paragraphs: string[];
    disclaimer: string;
  };
  accommodationStyles: { name: string; description: string }[];
  experienceIds: string[];
  itinerarySlugs: string[];
  seasonality: MonthRating[];
  mapPointIds: string[];
  faqIds: string[];
  featured: boolean;
  /**
   * Only published destinations get their own page. Unpublished entries
   * appear in the explorer as enquiry-first cards — this keeps the first
   * release free of thin, half-written destination pages.
   */
  published: boolean;
  /** Filter helpers for the destination explorer. */
  travellerTypes: TravellerType[];
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export type ServiceSlug =
  | "flights"
  | "hotels"
  | "tours-and-safaris"
  | "transport"
  | "holiday-packages"
  | "corporate-travel"
  | "group-travel";

export type Service = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  eyebrow: string;
  headline: string;
  summary: string;
  heroImage: string;
  /** Distinct one-line intro for the "What we arrange" section (never the hero summary). */
  arrangeIntro: string;
  /** What a customer can ask this desk to arrange. */
  requestables: string[];
  audiences: string[];
  /** 1–2 bullets tailored to this service, appended to the shared "What to send" basics. */
  sendBasics?: string[];
  editorial: { title: string; body: string }[];
  faqIds: string[];
  /**
   * Indicative (never priced) guidance shown on the top service pages so
   * customers understand what a quotation will contain before enquiring.
   */
  quotationGuide?: {
    covers: string[];
    indicative?: string;
    leadTime: string;
    excludes?: string[];
  };
  relatedServiceSlugs: ServiceSlug[];
  cta: { label: string; whatsappMessage: string };
};

// ---------------------------------------------------------------------------
// Seasonal campaigns
// ---------------------------------------------------------------------------

export type SeasonalCampaign = {
  id: string;
  enabled: boolean;
  destinationSlug: string;
  label: string;
  headline: string;
  summary: string;
  /** ISO dates. Outside this window the campaign hides automatically. */
  startDate: string;
  endDate: string;
  image: string;
  primaryCta: { label: string; href: string };
  disclaimer: string;
};

// ---------------------------------------------------------------------------
// Enquiries (assisted booking — never a live reservation)
// ---------------------------------------------------------------------------

export type EnquiryService =
  | "flights"
  | "hotels"
  | "safari"
  | "holiday-package"
  | "transport"
  | "corporate"
  | "group"
  | "not-sure";

export type TravellerType =
  | "solo"
  | "couple"
  | "family"
  | "friends"
  | "business"
  | "group";

export type TravelStyle = "value" | "comfort" | "premium" | "not-sure";

export type BudgetBand =
  | "under-100k"
  | "100k-300k"
  | "300k-700k"
  | "over-700k"
  | "not-sure";

export type ContactMethod = "whatsapp" | "phone" | "email";

export type TravellerCount = {
  adults: number;
  children: number;
  infants: number;
};

export type FlightRequest = {
  tripType: "one-way" | "return" | "multi-city";
  departureCity: string;
  destinationCity: string;
  cabinClass: "economy" | "premium-economy" | "business" | "first" | "any";
  preferredAirline?: string;
  baggageNotes?: string;
};

export type HotelRequest = {
  destination: string;
  rooms: number;
  roomConfiguration?: string;
  hotelCategory: "value" | "mid-range" | "premium" | "any";
  mealPlan: "room-only" | "bed-breakfast" | "half-board" | "full-board" | "all-inclusive" | "any";
  preferredArea?: string;
};

export type SafariRequest = {
  origin: string;
  accessPreference: "road" | "fly-in" | "either";
  accommodationStyle: "tented-camp" | "lodge" | "conservancy" | "mixed" | "not-sure";
  includeFlights: boolean;
  includeAccommodation: boolean;
  includeTransfers: boolean;
  includeDailyTransport: boolean;
  activities?: string;
  specialOccasion?: string;
};

export type PackageRequest = SafariRequest;

export type GroupTravelRequest = {
  organisationName?: string;
  groupSize: string;
  travelPurpose: string;
  departurePoints?: string;
  coordinationNotes?: string;
};

export type CorporateTravelRequest = GroupTravelRequest & {
  billingRequirements?: string;
};

export type LeadSource =
  | "website-quote-form"
  | "website-planner"
  | "whatsapp"
  | "phone"
  | "email"
  | "referral";

export type EnquiryStatus =
  | "new"
  | "in-review"
  | "quoted"
  | "confirmed"
  | "closed";

export type Customer = {
  fullName: string;
  email?: string;
  whatsapp: string;
  preferredContact: ContactMethod;
};

/** The single record the quote flow produces. Sent to /api/enquiries. */
export type TravelEnquiry = {
  reference: string;
  service: EnquiryService;
  destination: string;
  flexibleDestination: boolean;
  departureDate?: string;
  returnDate?: string;
  flexibleDates: boolean;
  travellers: TravellerCount;
  travellerType: TravellerType;
  style: TravelStyle;
  budget: BudgetBand;
  notes?: string;
  customer: Customer;
  consent: boolean;
  flight?: FlightRequest;
  hotel?: HotelRequest;
  safari?: SafariRequest;
  group?: GroupTravelRequest;
  corporate?: CorporateTravelRequest;
  accessibilityNeeds?: string;
  dietaryNeeds?: string;
  source: LeadSource;
  submittedAt: string;
  status: EnquiryStatus;
};

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  /** Where this FAQ may surface. */
  tags: ("general" | ServiceSlug | "destination" | "mara")[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  /** Demo entries must be true and are visibly labelled on the site. */
  isSample: boolean;
};
