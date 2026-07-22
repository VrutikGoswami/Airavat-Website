/**
 * Hotel rate-sheet types. Each hotel contract (rate card PDF) is transcribed
 * into a `HotelRateSheet`: seasonal date periods with per-room-type prices at
 * each occupancy, plus the supplements and policies printed on the card.
 *
 * Contract rates are net/commissionable and confidential — they must only be
 * read server-side (quote engine + API route). The client receives computed
 * selling prices, never the raw sheet.
 */

export type RateSeasonName =
  | "green"
  | "low"
  | "mid"
  | "regular"
  | "shoulder"
  | "high"
  | "premium"
  | "peak"
  | "easter"
  | "festive"
  | "christmas";

export type OccupancyKey =
  | "single"
  | "double"
  | "triple"
  | "perUnit"
  | "childSharing"
  | "childTeenSharing"
  | "childThirdBed";

/**
 * Per-night prices for one room type within one seasonal period. All values
 * are the nightly price for one room in that occupancy band. Stay totals are
 * calculated from room count and nights; per-child keys stay per child.
 */
export type OccupancyRates = {
  single?: number;
  double?: number;
  triple?: number;
  /** Whole unit/villa price where the sheet prices per unit, not per person. */
  perUnit?: number;
  /** Per child (younger band, typically 4–11) sharing with paying adults. */
  childSharing?: number;
  /** Per older child/teen (e.g. 12–17) where the sheet has a second band. */
  childTeenSharing?: number;
  /** Per child in an extra/third bed where priced separately. */
  childThirdBed?: number;
};

export type RatePeriod = {
  /** Inclusive ISO date (YYYY-MM-DD) — first night this rate applies to. */
  start: string;
  /** Inclusive ISO date — last night this rate applies to. */
  end: string;
  season: RateSeasonName;
  /** Keyed by room-type id declared in the hotel's `roomTypes`. */
  rates: Record<string, OccupancyRates>;
};

export type HotelRoomType = {
  id: string;
  name: string;
};

/** Family room/tent supplement charged on top of the room rate. */
export type FamilyRoomSupplement = {
  name: string;
  maxPax: number;
  /** Per adult (or child above the child-rate age band) per night. */
  perAdultPerNight: number;
  /** Per child under the family-supplement child age (typically under 12) per night. */
  perChildPerNight: number;
};

export type MealSupplements = {
  extraLunchOrDinnerPerPerson?: number;
  extraPackedLunchPerPerson?: number;
  halfBoardReductionPerPerson?: number;
};

export type ChildPolicy = {
  /** Children up to this age stay free when sharing with adults. */
  freeUpToAge: number;
  maxFreeChildrenPerRoom?: number;
  /** Age band charged at the child-sharing rate on the rate card. */
  childRateFromAge: number;
  childRateToAge: number;
  /** From this age children pay the full adult rate. */
  adultRateFromAge: number;
  /** Children in their own room pay this percent of the full room rate. */
  ownRoomPercentOfRoomRate?: number;
};

export type RateBoard =
  | "full-board"
  | "half-board"
  | "bed-breakfast"
  | "all-inclusive"
  | "room-only";

/** "all" = the sheet applies to every guest (no residency distinction). */
export type RateMarket = "east-african-resident" | "non-resident" | "all";

/**
 * What the sheet's figures are: "rack" = the hotel's published selling
 * prices, shown on the site unchanged; "net" = confidential contract/STO
 * cost rates, marked up before display.
 */
export type RateBasis = "rack" | "net";

export type HotelRateSheet = {
  hotelSlug: string;
  hotelName: string;
  /** Hotel group / chain the contract belongs to, e.g. "Maisha Group". */
  group?: string;
  destinationSlug: string;
  destinationName: string;
  /** Official hotel website, shown as an outbound link on the rate card. */
  websiteUrl?: string;
  /** Gallery image paths (public/ or absolute). Powers the name → lightbox. */
  images?: string[];
  currency: "KES" | "USD";
  market: RateMarket;
  basis: RateBasis;
  board: RateBoard;
  /** Overall contract validity (inclusive ISO dates). */
  validFrom: string;
  validTo: string;
  roomTypes: HotelRoomType[];
  periods: RatePeriod[];
  familySupplements?: FamilyRoomSupplement[];
  meals?: MealSupplements;
  childPolicy?: ChildPolicy;
  /**
   * Agent commission percent from the contract. Internal only — never
   * rendered on the site or returned by the API.
   */
  commissionPercent?: number;
  /** Short guest-facing notes worth showing alongside prices. */
  notes?: string[];
};

export type RateDestinationOption = { slug: string; name: string; hotelCount: number };
