import type { ItineraryIdea } from "@/types";

/**
 * Itinerary ideas, not fixed products. No prices are shown anywhere —
 * every idea leads to a custom quotation.
 */
export const itineraryIdeas: ItineraryIdea[] = [
  {
    slug: "mara-migration-escape",
    title: "Maasai Mara migration-season escape",
    duration: "3–4 nights",
    places: ["Nairobi", "Maasai Mara"],
    style: "comfort",
    summary:
      "A focused Mara stay timed for the migration months, with daily game drives and an optional balloon flight. Fly-in or road, depending on your time and budget.",
    image: "/images/itinerary-mara.svg",
    destinationSlugs: ["maasai-mara"],
    travellerTypes: ["couple", "friends", "solo"],
    bestMonths: ["jul", "aug", "sep", "oct"],
  },
  {
    slug: "nairobi-and-mara",
    title: "Nairobi & Maasai Mara",
    duration: "5–6 nights",
    places: ["Nairobi", "Maasai Mara"],
    style: "comfort",
    summary:
      "A night or two in Nairobi — giraffe centre, good restaurants, time to land — then out to the Mara for three nights of game viewing.",
    image: "/images/itinerary-nairobi-mara.svg",
    destinationSlugs: ["maasai-mara", "nairobi"],
    travellerTypes: ["couple", "family", "solo"],
    bestMonths: ["jan", "feb", "jun", "jul", "aug", "sep", "oct"],
  },
  {
    slug: "safari-and-coast",
    title: "Safari & coast",
    duration: "7–9 nights",
    places: ["Maasai Mara", "Diani Beach"],
    style: "premium",
    summary:
      "The classic combination: big-sky safari first, then a direct light-aircraft connection to the Indian Ocean for slow days on the sand.",
    image: "/images/itinerary-coast.svg",
    destinationSlugs: ["maasai-mara", "diani"],
    travellerTypes: ["couple", "family", "friends"],
    bestMonths: ["jan", "feb", "jul", "aug", "sep", "oct"],
  },
  {
    slug: "family-kenya-holiday",
    title: "Family Kenya holiday",
    duration: "6–8 nights",
    places: ["Nairobi", "Lake Naivasha", "Maasai Mara"],
    style: "comfort",
    summary:
      "A gentler road route built around children: short driving days, a boat trip on Naivasha, family rooms in the Mara and flexible mealtimes.",
    image: "/images/itinerary-family.svg",
    destinationSlugs: ["maasai-mara", "naivasha"],
    travellerTypes: ["family"],
    bestMonths: ["apr", "jul", "aug", "dec"],
  },
  {
    slug: "corporate-travel-support",
    title: "Corporate travel & transfer support",
    duration: "As required",
    places: ["Nairobi", "Regional & international"],
    style: "value",
    summary:
      "Flights, hotels near your meetings, airport pickups and a single point of contact for changes — arranged per trip or as ongoing support.",
    image: "/images/itinerary-corporate.svg",
    destinationSlugs: ["nairobi"],
    travellerTypes: ["business"],
    bestMonths: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  },
];

export function getItineraries(slugs: string[]): ItineraryIdea[] {
  return slugs
    .map((slug) => itineraryIdeas.find((i) => i.slug === slug))
    .filter((i): i is ItineraryIdea => Boolean(i));
}
