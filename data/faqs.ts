import type { FAQItem } from "@/types";

export const faqs: FAQItem[] = [
  {
    id: "live-booking",
    question: "Is this a live booking website?",
    answer:
      "No. Submitting a form here sends an enquiry to our team — it does not reserve seats, rooms or park entry. A consultant checks current fares and availability with airlines, hotels and camps, then sends you real options to choose from.",
    tags: ["general"],
  },
  {
    id: "quotation-process",
    question: "How does the quotation process work?",
    answer:
      "Tell us what you need through the planner, the quote form or WhatsApp. A consultant reviews your request, checks current prices and availability, and replies with options. Nothing is booked until you approve an option and payment and supplier confirmation are complete.",
    tags: ["general"],
  },
  {
    id: "flights-and-hotels-together",
    question: "Can you arrange flights and hotels together?",
    answer:
      "Yes — that is most of what we do. One enquiry can cover flights, accommodation, airport transfers and activities, and you deal with one consultant for all of it.",
    tags: ["general", "flights", "hotels", "holiday-packages"],
  },
  {
    id: "group-travel",
    question: "Can you organise group travel?",
    answer:
      "Yes. We coordinate schools, companies, faith groups, events and family reunions. Larger groups need more lead time because seats and rooms are confirmed with each supplier, so contact us early with rough numbers.",
    tags: ["general", "group-travel"],
  },
  {
    id: "transport-from-nairobi",
    question: "Can you arrange transport from Nairobi?",
    answer:
      "Yes. Airport pickups, hotel transfers, private vehicles with a driver for the day, and overland transport for safaris — tell us your arrival details and we will plan around them.",
    tags: ["general", "transport"],
  },
  {
    id: "wildlife-guarantee",
    question: "Are wildlife sightings guaranteed?",
    answer:
      "No — and be cautious of anyone who says otherwise. Migration timing, river crossings and individual sightings are natural events. Good guides, good timing and enough days in the park improve your chances; guarantees are not possible.",
    tags: ["general", "mara", "tours-and-safaris"],
  },
  {
    id: "visas",
    question: "Can you assist with visas?",
    answer:
      "We can point you to the official application channels and tell you what documents trips normally require. Visa decisions are made solely by the relevant authorities — we cannot influence or guarantee an outcome.",
    tags: ["general", "flights"],
  },
  {
    id: "booking-confirmed",
    question: "When is a booking confirmed?",
    answer:
      "Only after three things happen: you approve a quotation, payment is received as agreed, and the airline, hotel or camp confirms to us in writing. We then send your tickets or confirmation documents.",
    tags: ["general"],
  },
  {
    id: "flight-changes",
    question: "What if my flight plans change?",
    answer:
      "Contact your consultant as soon as possible. Change and cancellation rules are set by each airline and fare type — we will explain what your ticket allows and handle the change with the airline.",
    tags: ["flights"],
  },
  {
    id: "hotel-categories",
    question: "What kind of hotels can you book?",
    answer:
      "Anything from practical business hotels to beach resorts and safari lodges, in Kenya and internationally. Tell us your budget band and what matters most — location, breakfast, a pool, meeting rooms — and we shortlist accordingly.",
    tags: ["hotels"],
  },
  {
    id: "mara-when",
    question: "When should I visit the Maasai Mara?",
    answer:
      "July to October is generally associated with migration activity, but the Mara holds resident wildlife all year, and quieter months have their own advantages — fewer vehicles and softer rates. Tell us your dates and we will set honest expectations.",
    tags: ["mara", "tours-and-safaris"],
  },
  {
    id: "corporate-billing",
    question: "How does corporate billing work?",
    answer:
      "For regular corporate travel we agree a simple process with your finance team — per-trip invoicing to start, with consolidated arrangements discussed as volume grows. Tell us your requirements in the corporate enquiry.",
    tags: ["corporate-travel"],
  },
  {
    id: "payment-methods",
    question: "How do I pay?",
    answer:
      "Payment details are confirmed on each quotation before you commit. Accepted methods are being finalised for this website and your consultant will state them clearly in writing — no payment is ever requested through this site.",
    tags: ["general"],
  },
  {
    id: "children-safari",
    question: "Is a safari suitable for children?",
    answer:
      "Usually yes, with the right camp. Some camps have minimum ages while others are built for families. Tell us the ages travelling and we will only propose places that genuinely welcome them.",
    tags: ["tours-and-safaris", "mara"],
  },
];

export function getFaqs(ids: string[]): FAQItem[] {
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is FAQItem => Boolean(f));
}

export function faqsByTag(tag: FAQItem["tags"][number]): FAQItem[] {
  return faqs.filter((f) => f.tags.includes(tag));
}
