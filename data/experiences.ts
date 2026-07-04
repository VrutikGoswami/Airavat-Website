import type { Experience } from "@/types";

/** Editable demonstration experiences. Adjust as the product range firms up. */
export const experiences: Experience[] = [
  {
    id: "game-drives",
    name: "Game drives",
    summary:
      "Morning and late-afternoon drives with a professional guide, timed around animal activity rather than a fixed schedule.",
    image: "/images/experience-drive.jpg",
    suits: ["solo", "couple", "family", "friends", "group"],
  },
  {
    id: "balloon-safari",
    name: "Hot-air balloon safari",
    summary:
      "A dawn flight over the plains followed by a bush breakfast. Weather dependent and best reserved well ahead.",
    image: "/images/experience-balloon.jpg",
    suits: ["couple", "friends", "solo"],
  },
  {
    id: "photographic",
    name: "Photographic safari",
    summary:
      "Vehicles and guides chosen for photographers — flexible timings, good positioning and patience at sightings.",
    image: "/images/experience-photo.jpg",
    suits: ["solo", "couple", "friends"],
  },
  {
    id: "conservancy-stay",
    name: "Conservancy stays",
    summary:
      "Nights in community-owned conservancies bordering the reserve, with fewer vehicles and guided walks where permitted.",
    image: "/images/experience-conservancy.jpg",
    suits: ["couple", "family", "solo"],
  },
  {
    id: "family-safari",
    name: "Family safari",
    summary:
      "Family-friendly camps, flexible mealtimes and drives paced for children. We match the camp to the ages travelling.",
    image: "/images/experience-family.jpg",
    suits: ["family"],
  },
  {
    id: "bush-dining",
    name: "Bush dining",
    summary:
      "Breakfasts on the plains and sundowners arranged through your camp — simple, memorable and easy to add to most stays.",
    image: "/images/experience-dining.jpg",
    suits: ["couple", "family", "friends", "group"],
  },
  {
    id: "fly-in",
    name: "Fly-in safari",
    summary:
      "Scheduled light aircraft from Nairobi Wilson to a Mara airstrip. More time in the park, less time on the road.",
    image: "/images/experience-flyin.jpg",
    suits: ["couple", "business", "solo", "family"],
  },
  {
    id: "road-safari",
    name: "Road safari",
    summary:
      "A classic overland route through the Rift Valley. Better value, scenic and flexible for groups with their own pace.",
    image: "/images/experience-road.jpg",
    suits: ["family", "friends", "group"],
  },
  {
    id: "coast-time",
    name: "Beach & coast time",
    summary:
      "Finish a safari with the Indian Ocean coast — Diani, Watamu or Mombasa — connected by a short domestic flight.",
    image: "/images/experience-coast.jpg",
    suits: ["couple", "family", "friends"],
  },
];

export function getExperiences(ids: string[]): Experience[] {
  return ids
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is Experience => Boolean(e));
}
