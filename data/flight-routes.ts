/**
 * Flight routes Airavat actively arranges. These seed the route finder cards;
 * "Get a price" opens a prefilled flight enquiry (there is no live fares feed —
 * a consultant returns a quotation, usually within hours).
 *
 * Extend this list as new routes are confirmed. `origin` defaults to Nairobi.
 */

export type FlightRegion = "Asia" | "Middle East" | "Europe" | "Africa" | "Indian Ocean";

export type FlightRoute = {
  id: string;
  origin: string;
  city: string;
  country: string;
  region: FlightRegion;
  blurb: string;
  airlines: string[];
  popular?: boolean;
};

export const flightRegions: FlightRegion[] = [
  "Asia",
  "Middle East",
  "Europe",
  "Africa",
  "Indian Ocean",
];

export const flightRoutes: FlightRoute[] = [
  {
    id: "nbo-bom",
    origin: "Nairobi",
    city: "Mumbai",
    country: "India",
    region: "Asia",
    blurb: "Direct and one-stop options to Mumbai for families, students and business travel.",
    airlines: ["Kenya Airways", "Emirates", "Qatar Airways"],
    popular: true,
  },
  {
    id: "nbo-del",
    origin: "Nairobi",
    city: "Delhi",
    country: "India",
    region: "Asia",
    blurb: "Convenient connections to Delhi and onward domestic India routes.",
    airlines: ["Kenya Airways", "Emirates", "Etihad Airways"],
    popular: true,
  },
  {
    id: "nbo-dxb",
    origin: "Nairobi",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    blurb: "Frequent daily flights — ideal for shopping trips, holidays and connections beyond.",
    airlines: ["Emirates", "Kenya Airways", "flydubai"],
    popular: true,
  },
  {
    id: "nbo-lhr",
    origin: "Nairobi",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    blurb: "Direct and one-stop routes to London for business, study and family visits.",
    airlines: ["Kenya Airways", "British Airways", "Qatar Airways"],
    popular: true,
  },
  {
    id: "nbo-jed",
    origin: "Nairobi",
    city: "Jeddah",
    country: "Saudi Arabia",
    region: "Middle East",
    blurb: "Umrah and Hajj travel with group coordination and baggage support.",
    airlines: ["Saudia", "Kenya Airways", "Emirates"],
  },
  {
    id: "nbo-bkk",
    origin: "Nairobi",
    city: "Bangkok",
    country: "Thailand",
    region: "Asia",
    blurb: "Leisure and holiday connections to Bangkok and Thai beaches.",
    airlines: ["Kenya Airways", "Emirates", "Qatar Airways"],
  },
  {
    id: "nbo-can",
    origin: "Nairobi",
    city: "Guangzhou",
    country: "China",
    region: "Asia",
    blurb: "Business and trade travel to Guangzhou with flexible return options.",
    airlines: ["Kenya Airways", "Emirates", "Ethiopian Airlines"],
  },
  {
    id: "nbo-znz",
    origin: "Nairobi",
    city: "Zanzibar",
    country: "Tanzania",
    region: "Indian Ocean",
    blurb: "Short hops to Zanzibar for beach holidays and island getaways.",
    airlines: ["Kenya Airways", "Precision Air"],
  },
  {
    id: "nbo-mru",
    origin: "Nairobi",
    city: "Mauritius",
    country: "Mauritius",
    region: "Indian Ocean",
    blurb: "Honeymoon and family island holidays with flight-and-hotel options.",
    airlines: ["Kenya Airways", "Air Mauritius"],
  },
  {
    id: "nbo-jnb",
    origin: "Nairobi",
    city: "Johannesburg",
    country: "South Africa",
    region: "Africa",
    blurb: "Regional business travel and holidays across Southern Africa.",
    airlines: ["Kenya Airways", "South African Airways"],
  },
  {
    id: "nbo-ist",
    origin: "Nairobi",
    city: "Istanbul",
    country: "Turkey",
    region: "Europe",
    blurb: "Leisure and connecting travel through Istanbul into Europe.",
    airlines: ["Turkish Airlines", "Kenya Airways"],
  },
  {
    id: "mba-dxb",
    origin: "Mombasa",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    blurb: "Coast-based departures to Dubai without routing through Nairobi.",
    airlines: ["flydubai", "Emirates"],
  },
];
