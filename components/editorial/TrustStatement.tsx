import {
  MessageSquareText,
  Route,
  UserRound,
  FileCheck2,
  LifeBuoy,
  Layers,
} from "lucide-react";

/**
 * Defensible operational benefits only — no invented statistics, awards or
 * partner logos.
 */
const points = [
  {
    icon: UserRound,
    title: "One point of contact",
    body: "A named consultant handles your enquiry from first message to travel documents.",
  },
  {
    icon: MessageSquareText,
    title: "Personal travel planning",
    body: "Options are chosen for your dates and budget, not pulled from a fixed catalogue.",
  },
  {
    icon: Layers,
    title: "Everything coordinated",
    body: "Flights, hotels, transfers and activities planned together so the pieces actually fit.",
  },
  {
    icon: Route,
    title: "Complex itineraries welcome",
    body: "Multi-city routings, groups and mixed business-and-leisure trips are normal work here.",
  },
  {
    icon: FileCheck2,
    title: "A clear quotation process",
    body: "Written options, written prices, and nothing confirmed until you approve it.",
  },
  {
    icon: LifeBuoy,
    title: "Support beyond confirmation",
    body: "Plans change. When they do, you message the same person who planned the trip.",
  },
];

export function TrustStatement() {
  return (
    <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {points.map((point) => (
        <li key={point.title} className="flex gap-4">
          <point.icon aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
          <div>
            <h3 className="font-bold">{point.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{point.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
