import type { EnquiryService } from "@/types";

export type PopularRoute = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
  primaryAction: string;
  enquiry: {
    service: EnquiryService;
    destination: string;
    origin?: string;
  };
  whatsappMessage: string;
};

export type TravelCategory = {
  title: string;
  summary: string;
  href: string;
};

export type DestinationExperience = "safari" | "beach" | "city";

export type DestinationListing = {
  name: string;
  slug: string;
  region: "Kenya" | "International";
  /** Drives the hub's experience filter chips. */
  experience: DestinationExperience;
  summary: string;
  service: EnquiryService;
  published?: boolean;
};

export const DESTINATION_EXPERIENCE_LABELS: Record<DestinationExperience, string> = {
  safari: "Safari",
  beach: "Beach",
  city: "City",
};

export const popularRoutes: PopularRoute[] = [
  {
    id: "india-flights",
    title: "Flights to India",
    eyebrow: "Nairobi to India",
    summary: "Human-assisted flight options for major Indian cities, families and groups.",
    highlights: [
      "One-way and return travel",
      "Major Indian city routes",
      "Family and group bookings",
      "Baggage and airline preference support",
    ],
    primaryAction: "Request India flight options",
    enquiry: {
      service: "flights",
      destination: "India",
      origin: "Nairobi",
    },
    whatsappMessage: "Hello Airavat, I would like flight options from Nairobi to India.",
  },
  {
    id: "dubai-holidays",
    title: "Dubai Flights & Holidays",
    eyebrow: "Flights, hotels and transfers",
    summary: "Plan flight-only enquiries or complete Dubai holidays with hotel and transfers.",
    highlights: [
      "Flight-only enquiries",
      "Flight and hotel packages",
      "Airport transfers",
      "Family, shopping and group trips",
    ],
    primaryAction: "Plan a Dubai trip",
    enquiry: {
      service: "holiday-package",
      destination: "Dubai",
    },
    whatsappMessage: "Hello Airavat, I would like help planning a Dubai holiday.",
  },
  {
    id: "maasai-mara-safaris",
    title: "Maasai Mara Safaris",
    eyebrow: "Road and fly-in safaris",
    summary: "Shape a private, family or group safari with current camp and lodge options.",
    highlights: [
      "Road and fly-in options",
      "Accommodation choices",
      "Resident and non-resident enquiries",
      "Custom trip duration",
    ],
    primaryAction: "Plan a Maasai Mara safari",
    enquiry: {
      service: "safari",
      destination: "maasai-mara",
    },
    whatsappMessage: "Hello Airavat, I would like a quotation for a Maasai Mara safari.",
  },
];

export const travelCategories: TravelCategory[] = [
  {
    title: "Safaris",
    summary: "Maasai Mara and Kenyan safari planning by road or air.",
    href: "/request-a-quote?service=safari",
  },
  {
    title: "Beach holidays",
    summary: "Kenyan coast and island-style holiday enquiries.",
    href: "/request-a-quote?service=holiday-package&destination=Diani",
  },
  {
    title: "International holidays",
    summary: "Dubai, India, Zanzibar, Mauritius and more.",
    href: "/request-a-quote?service=holiday-package&destination=Dubai",
  },
  {
    title: "Flights",
    summary: "Flight options with baggage and airline preference support.",
    href: "/request-a-quote?service=flights&origin=Nairobi",
  },
  {
    title: "Weekend escapes",
    summary: "Short breaks in Naivasha, the coast and nearby favourites.",
    href: "/request-a-quote?service=holiday-package&destination=Naivasha",
  },
  {
    title: "Corporate and group travel",
    summary: "Business trips, retreats, school groups and group logistics.",
    href: "/request-a-quote?service=corporate",
  },
];

export const destinationListings: DestinationListing[] = [
  {
    name: "Maasai Mara",
    slug: "maasai-mara",
    region: "Kenya",
    experience: "safari",
    summary: "Flagship safari destination with a full guide, map and seasonal planning notes.",
    service: "safari",
    published: true,
  },
  {
    name: "Amboseli",
    slug: "amboseli",
    region: "Kenya",
    experience: "safari",
    summary: "Elephant-focused safaris, often paired with the Mara or a coast extension.",
    service: "safari",
  },
  {
    name: "Naivasha",
    slug: "naivasha",
    region: "Kenya",
    experience: "safari",
    summary: "Rift Valley weekend escapes, boat trips and gentle family breaks.",
    service: "holiday-package",
  },
  {
    name: "Samburu",
    slug: "samburu",
    region: "Kenya",
    experience: "safari",
    summary: "Northern Kenya safari enquiries with distinctive landscapes and wildlife.",
    service: "safari",
  },
  {
    name: "Diani",
    slug: "diani",
    region: "Kenya",
    experience: "beach",
    summary: "South coast beach holidays, family stays and safari-and-coast combinations.",
    service: "holiday-package",
  },
  {
    name: "Mombasa",
    slug: "mombasa",
    region: "Kenya",
    experience: "beach",
    summary: "North coast beach resorts, conferences and shorter domestic breaks.",
    service: "holiday-package",
  },
  {
    name: "Watamu",
    slug: "watamu",
    region: "Kenya",
    experience: "beach",
    summary: "Coastal holidays with reef, beach and family-friendly stay requests.",
    service: "holiday-package",
  },
  {
    name: "Dubai",
    slug: "dubai",
    region: "International",
    experience: "city",
    summary: "Flights, hotels, transfers, family holidays, shopping and group trips.",
    service: "holiday-package",
  },
  {
    name: "India",
    slug: "india",
    region: "International",
    experience: "city",
    summary: "Flight options from Nairobi to major Indian cities, including family and group travel.",
    service: "flights",
  },
  {
    name: "Zanzibar",
    slug: "zanzibar",
    region: "International",
    experience: "beach",
    summary: "Beach holiday enquiries with flights, hotels and airport transfers.",
    service: "holiday-package",
  },
  {
    name: "Mauritius",
    slug: "mauritius",
    region: "International",
    experience: "beach",
    summary: "Island holiday planning for couples, families and special occasions.",
    service: "holiday-package",
  },
  {
    name: "South Africa",
    slug: "south-africa",
    region: "International",
    experience: "city",
    summary: "City, coast and safari-style holiday enquiries with flight support.",
    service: "holiday-package",
  },
  {
    name: "Turkey",
    slug: "turkey",
    region: "International",
    experience: "city",
    summary: "Holiday enquiries for Istanbul, leisure trips and group travel.",
    service: "holiday-package",
  },
  {
    name: "Thailand",
    slug: "thailand",
    region: "International",
    experience: "beach",
    summary: "Leisure holiday enquiries with flights, hotels and transfers.",
    service: "holiday-package",
  },
];

export function enquiryHref(input: {
  service: EnquiryService;
  destination?: string;
  origin?: string;
  offer?: string;
}) {
  const params = new URLSearchParams();
  params.set("service", input.service);
  if (input.destination) params.set("destination", input.destination);
  if (input.origin) params.set("origin", input.origin);
  if (input.offer) params.set("offer", input.offer);
  return `/request-a-quote?${params.toString()}`;
}
