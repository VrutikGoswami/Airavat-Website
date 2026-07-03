import type { Testimonial } from "@/types";

/**
 * SAMPLE TESTIMONIALS — every entry is fictional demonstration content and
 * is labelled as such in the UI. Replace with real, permission-cleared
 * customer feedback before launch, then set `isSample: false`.
 */
export const testimonials: Testimonial[] = [
  {
    id: "sample-1",
    quote:
      "One consultant handled our flights, the camp and every transfer. When our arrival flight was delayed, the pickup simply adjusted — we never had to ask.",
    name: "Sample testimonial",
    context: "Replace before launch — safari customer",
    isSample: true,
  },
  {
    id: "sample-2",
    quote:
      "We sent one WhatsApp message with our dates and budget and got back three clear options with honest trade-offs. No pressure, no upselling.",
    name: "Sample testimonial",
    context: "Replace before launch — family holiday",
    isSample: true,
  },
  {
    id: "sample-3",
    quote:
      "They keep our team's flights and hotels organised trip after trip. Changes get handled fast and finance gets clean paperwork.",
    name: "Sample testimonial",
    context: "Replace before launch — corporate coordinator",
    isSample: true,
  },
];
