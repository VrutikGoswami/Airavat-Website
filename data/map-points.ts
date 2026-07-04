import type { MapPoint } from "@/types";

/**
 * Demonstration map points — the single source of truth for the maps.
 *
 * Coordinates are approximate, taken from public reference maps for
 * development only: every entry is `verified: false` until the business
 * confirms it. Do not launch with unverified points. To add a location,
 * append an entry here and (if it belongs on a map) add its id to the
 * relevant id list below. Images are optional and reference /public/images.
 */
export const mapPoints: MapPoint[] = [
  // --- Homepage destinations (Explore Kenya) ------------------------------
  {
    id: "nairobi",
    name: "Nairobi",
    category: "destination",
    latitude: -1.286,
    longitude: 36.817,
    shortDescription:
      "Capital and gateway — international flights, city hotels and onward connections by road or air.",
    image: "/images/dest-nairobi.jpg",
    href: "/destinations",
    destinationSlug: "nairobi",
    verified: false,
  },
  {
    id: "maasai-mara-overview",
    name: "Maasai Mara",
    category: "destination",
    latitude: -1.49,
    longitude: 35.14,
    shortDescription:
      "Kenya's best-known reserve — open savannah, big cats and the seasonal wildebeest migration.",
    image: "/images/mara-hero.jpg",
    href: "/destinations/maasai-mara",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "amboseli",
    name: "Amboseli",
    category: "destination",
    latitude: -2.65,
    longitude: 37.26,
    shortDescription:
      "Elephant herds against the backdrop of Kilimanjaro — compact, photogenic and easy to combine.",
    image: "/images/dest-amboseli.jpg",
    href: "/destinations",
    destinationSlug: "amboseli",
    verified: false,
  },
  {
    id: "naivasha",
    name: "Lake Naivasha",
    category: "destination",
    latitude: -0.77,
    longitude: 36.35,
    shortDescription:
      "Rift Valley lake known for boat trips and birdlife — a gentle stop between Nairobi and the Mara.",
    image: "/images/dest-naivasha.jpg",
    href: "/destinations",
    destinationSlug: "naivasha",
    verified: false,
  },
  {
    id: "diani",
    name: "Diani Beach",
    category: "destination",
    latitude: -4.28,
    longitude: 39.59,
    shortDescription:
      "White-sand coast south of Mombasa — a popular way to end a safari with slow days by the sea.",
    image: "/images/experience-coast.jpg",
    href: "/destinations",
    destinationSlug: "diani",
    verified: false,
  },
  {
    id: "mombasa",
    name: "Mombasa",
    category: "destination",
    latitude: -4.05,
    longitude: 39.67,
    shortDescription:
      "Coastal hub with direct domestic flights, old-town history and access to north and south coast stays.",
    image: "/images/dest-mombasa.jpg",
    href: "/destinations",
    destinationSlug: "mombasa",
    verified: false,
  },

  // --- Maasai Mara detail (destination page) ------------------------------
  {
    id: "mara-national-reserve",
    name: "Maasai Mara National Reserve",
    category: "reserve",
    latitude: -1.49,
    longitude: 35.14,
    shortDescription:
      "The core protected area. Classic open plains and the highest density of game drives.",
    image: "/images/mara-plains.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "mara-triangle",
    name: "Mara Triangle",
    category: "reserve",
    latitude: -1.42,
    longitude: 34.98,
    shortDescription:
      "The quieter western third of the reserve, managed separately, with dramatic escarpment views.",
    image: "/images/mara-plains.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "mara-river",
    name: "Mara River",
    category: "experience",
    latitude: -1.34,
    longitude: 35.03,
    shortDescription:
      "The river the migration must cross. Crossing points shift with the herds — sightings are never guaranteed.",
    image: "/images/mara-river.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "sekenani-gate",
    name: "Sekenani Gate",
    category: "gate",
    latitude: -1.53,
    longitude: 35.36,
    shortDescription:
      "The main eastern entry gate for road arrivals from Nairobi via Narok.",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "talek",
    name: "Talek area",
    category: "town",
    latitude: -1.44,
    longitude: 35.22,
    shortDescription:
      "Staging village at the Talek Gate with a wide range of camps close to central game-viewing areas.",
    image: "/images/experience-conservancy.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "keekorok-airstrip",
    name: "Keekorok Airstrip",
    category: "airstrip",
    latitude: -1.585,
    longitude: 35.257,
    shortDescription:
      "One of several Mara airstrips served by scheduled light aircraft from Nairobi Wilson.",
    image: "/images/experience-flyin.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "mara-conservancies",
    name: "Northern conservancies",
    category: "conservancy",
    latitude: -1.25,
    longitude: 35.25,
    shortDescription:
      "Community-owned conservancies bordering the reserve, with lower vehicle densities and walking options.",
    image: "/images/experience-conservancy.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
  {
    id: "nairobi-departure",
    name: "Nairobi (departure point)",
    category: "departure",
    latitude: -1.286,
    longitude: 36.817,
    shortDescription:
      "Road safaris depart Nairobi and reach the Mara in roughly a day's drive; fly-in guests use Wilson Airport.",
    image: "/images/dest-nairobi.jpg",
    destinationSlug: "maasai-mara",
    verified: false,
  },
];

/** The six destinations shown on the homepage "Explore Kenya" map. */
export const kenyaOverviewPointIds = [
  "nairobi",
  "maasai-mara-overview",
  "amboseli",
  "naivasha",
  "diani",
  "mombasa",
];

/** Locations shown on the Maasai Mara destination-page explorer. */
export const maraPointIds = [
  "mara-national-reserve",
  "mara-triangle",
  "mara-river",
  "sekenani-gate",
  "talek",
  "keekorok-airstrip",
  "mara-conservancies",
  "nairobi-departure",
];

export function getMapPoints(ids: string[]): MapPoint[] {
  return ids
    .map((id) => mapPoints.find((p) => p.id === id))
    .filter((p): p is MapPoint => Boolean(p));
}
