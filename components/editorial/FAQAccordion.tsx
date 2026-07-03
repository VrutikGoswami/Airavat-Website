import type { FAQItem } from "@/types";
import { ChevronDown } from "lucide-react";

/**
 * Native details/summary accordion: keyboard-accessible, no JS payload,
 * and every answer remains in the DOM for search engines and find-in-page.
 */
export function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.id} className="group rule-top">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold marker:hidden sm:text-lg [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-ochre transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="max-w-3xl pb-6 text-sm leading-relaxed text-ink-soft sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
