import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Single source of the "what to send" basics, shown on every service page.
 * A base list applies everywhere; each service passes 1–2 tailored extras so
 * the block is de-duplicated and more useful per page.
 */
export const BASE_SEND_BASICS = [
  "Destination or route",
  "Approximate dates",
  "Number of travellers",
  "Budget range",
];

export function UsefulBasics({ extras = [] }: { extras?: string[] }) {
  const items = [...BASE_SEND_BASICS, ...extras];
  return (
    <div>
      <SectionHeading eyebrow="What to send" title="The useful basics" />
      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-ink-soft">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-ochre" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
