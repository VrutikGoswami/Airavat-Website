import type { MapPoint } from "@/types";

/**
 * Demonstration map points. Coordinates are approximate, taken from public
 * reference maps for development only — every entry is `verified: false`
 * until the business confirms it. Do not launch with unverified points.
 */
export const mapPoints: MapPoint[] = [
  // --- Kenya overview (homepage preview) ----------------------------------
  {
    id: "nairobi",
    name: "Nairobi",
    category: "departure",
    latitude: -1.286,
    longitude: 36.817,
    shortDescription:
      "Capital city and the usual starting point — international flights, city hotels and onward connections by road or air.",
    href: "/destinations",
    verified: false,
  },
  {
    id: "maasai-mara-overview",
    name: "Maasai Mara",
    category: "reserve",
    latitude: -1.49,
    longitude: 35.14,
    shortDescription:
      "Kenya's best-known reserve. Open savannah, big cats and the seasonal wildebeest migration.",
    href: "/destinations/maasai-mara",
    verified: false,
  },
  {
    id: "amboseli",
    name: "Amboseli",
    category: "reserve",
    latitude: -2.65,
    longitude: 37.26,
    shortDescription:
      "Elephant herds against the backdrop of Kilimanjaro. A future destination page — enquiries welcome now.",
    verified: false,
  },
  {
    id: "naivasha",
    name: "Lake Naivasha",
    category: "town",
    latitude: -0.77,
    longitude: 36.35,
    shortDescription:
      "Rift Valley lake known for boat trips and birdlife. Works well as a stop between Nairobi and the Mara.",
    verified: false,
  },
  {
    id: "diani",
    name: "Diani Beach",
    category: "town",
    latitude: -4.28,
    longitude: 39.59,
    shortDescription:
      "White-sand coast south of Mombasa. A popular way to end a safari with a few slow days by the sea.",
    verified: false,
  },
  {
    id: "mombasa",
    name: "Mombasa",
    category: "town",
    latitude: -4.05,
    longitude: 39.67,
    shortDescription:
      "Coastal hub with direct domestic flights, old-town history and access to north and south coast stays.",
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
    verified: false,
  },
];

export const kenyaOverviewPointIds = [
  "nairobi",
  "maasai-mara-overview",
  "amboseli",
  "naivasha",
  "diani",
  "mombasa",
];

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
