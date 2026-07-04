import type { Service, ServiceSlug } from "@/types";

export const services: Service[] = [
  {
    slug: "flights",
    name: "Flight bookings",
    shortName: "Flights",
    eyebrow: "Domestic & international",
    headline: "Flight options found by a person, not a search box",
    summary:
      "One-way, return or multi-city — we search current fares through our airline systems and send you options with the trade-offs explained, then handle ticketing and changes.",
    heroImage: "/images/service-flights.jpg",
    requestables: [
      "Domestic and international tickets",
      "One-way, return and multi-city routings",
      "Family bookings with children and infants",
      "Cabin class and airline preferences",
      "Baggage-heavy itineraries",
      "Changes and re-bookings on tickets we issue",
    ],
    audiences: [
      "Kenyan residents flying internationally",
      "Visitors flying within East Africa",
      "Families and groups on one booking",
      "Business travellers with changing plans",
    ],
    editorial: [
      {
        title: "Why book flights through a consultant?",
        body: "Fare rules, baggage allowances and connection risks rarely fit in a comparison table. We use professional airline reservation systems in-house to check live fares, then explain your options in plain language — including when a slightly costlier ticket is the safer buy. When plans change, you message one person instead of an airline call centre.",
      },
      {
        title: "How it works",
        body: "Send your route, dates and passenger details. A consultant replies with current options and holds a fare where the airline allows it. Ticketing happens only after you approve the quotation and pay — nothing is bought automatically.",
      },
    ],
    faqIds: ["flight-changes", "visas", "flights-and-hotels-together", "booking-confirmed"],
    relatedServiceSlugs: ["hotels", "transport", "holiday-packages"],
    cta: {
      label: "Request flight options",
      whatsappMessage: "Hello, I need a flight quotation.",
    },
  },
  {
    slug: "hotels",
    name: "Hotel reservations",
    shortName: "Hotels",
    eyebrow: "Kenya & worldwide",
    headline: "The right room, not just any room",
    summary:
      "City hotels, beach resorts, safari lodges and apartments — shortlisted for your budget and reason for travel, and confirmed directly with the property.",
    heroImage: "/images/service-hotels.jpg",
    requestables: [
      "Hotels in Kenya and internationally",
      "Family rooms and multi-room configurations",
      "Meal plans from room-only to all-inclusive",
      "Business stays near meetings and venues",
      "Group room blocks",
      "Stays combined with transfers and activities",
    ],
    audiences: [
      "Holiday-makers across budgets",
      "Business travellers",
      "Families needing connecting or triple rooms",
      "Event and group organisers",
    ],
    editorial: [
      {
        title: "Shortlists over search results",
        body: "Tell us the destination, dates, who is travelling and your budget band. Instead of two hundred listings, you get a short list of properties we would actually put our own clients in, with honest notes on location and what the rate includes.",
      },
      {
        title: "Confirmed, in writing",
        body: "Once you choose, we confirm the reservation with the property and send written confirmation. Room availability and rates are always checked at the time of quotation — we never present cached prices as live ones.",
      },
    ],
    faqIds: ["hotel-categories", "flights-and-hotels-together", "booking-confirmed"],
    relatedServiceSlugs: ["flights", "transport", "holiday-packages"],
    cta: {
      label: "Request hotel options",
      whatsappMessage: "Hello, I need help booking a hotel.",
    },
  },
  {
    slug: "tours-and-safaris",
    name: "Tours & safaris",
    shortName: "Safaris",
    eyebrow: "Maasai Mara & beyond",
    headline: "Safaris built around your dates, not a brochure",
    summary:
      "Private and small-group safaris across Kenya — the Mara first among them — with vehicles, guides, park logistics and accommodation coordinated as one plan.",
    heroImage: "/images/mara-plains.jpg",
    requestables: [
      "Maasai Mara safaris, road or fly-in",
      "Multi-park Kenya itineraries",
      "Private family safaris",
      "Photographic trips with flexible hours",
      "Small-group departures",
      "Safari and beach combinations",
    ],
    audiences: [
      "First-time safari travellers",
      "Families with children of any age",
      "Photographers",
      "Groups of friends and celebration trips",
    ],
    editorial: [
      {
        title: "Honest expectations, better trips",
        body: "Wildlife does not perform on schedule, and we will never sell you a guaranteed sighting. What we plan carefully are the things that can be controlled: where you stay relative to the game, how long you spend in the park, who guides you and how the days flow. That is what separates a good safari from a rushed one.",
      },
      {
        title: "Road or fly-in?",
        body: "Road safaris cost less and show you the Rift Valley on the way; fly-in safaris trade the drive for an extra game drive. Many trips mix both. We lay out the real numbers for your dates so you can choose with clear eyes.",
      },
    ],
    faqIds: ["wildlife-guarantee", "mara-when", "children-safari", "transport-from-nairobi"],
    relatedServiceSlugs: ["holiday-packages", "transport", "flights"],
    cta: {
      label: "Plan a safari",
      whatsappMessage: "Hello, I would like help planning a safari.",
    },
  },
  {
    slug: "transport",
    name: "Transport & transfers",
    shortName: "Transport",
    eyebrow: "Airport, city & overland",
    headline: "A vehicle and driver you can rely on",
    summary:
      "Airport pickups, hotel transfers, chauffeured days and multi-day overland transport — arranged with vetted drivers and confirmed timings.",
    heroImage: "/images/service-transport.jpg",
    requestables: [
      "Airport transfers in Nairobi and Mombasa",
      "Hotel-to-hotel transfers",
      "Private vehicle with driver by the day",
      "Multi-day safari transport",
      "Group movements for events and delegations",
      "Corporate staff transport",
    ],
    audiences: [
      "Arriving international visitors",
      "Business travellers between meetings",
      "Safari clients travelling by road",
      "Event and conference organisers",
    ],
    editorial: [
      {
        title: "Small detail, big difference",
        body: "A confirmed pickup with a named driver changes how a trip starts. We match the vehicle to the job — saloon for a city transfer, van for a family with luggage, 4x4 with a pop-up roof for park roads — and we track your flight so a delay never strands you.",
      },
      {
        title: "Vetted partners",
        body: "We work with licensed, insured drivers and operators we know. Vehicle assignments are confirmed per booking, and every quotation states exactly what vehicle class and mileage is included.",
      },
    ],
    faqIds: ["transport-from-nairobi", "booking-confirmed"],
    relatedServiceSlugs: ["flights", "hotels", "tours-and-safaris"],
    cta: {
      label: "Arrange transport",
      whatsappMessage: "Hello, I need airport or private transport.",
    },
  },
  {
    slug: "holiday-packages",
    name: "Holiday packages",
    shortName: "Holidays",
    eyebrow: "Everything, coordinated",
    headline: "One quotation for the whole holiday",
    summary:
      "Flights, stays, transfers and activities planned together, priced together and managed by one consultant from first idea to your return home.",
    heroImage: "/images/itinerary-coast.jpg",
    requestables: [
      "Complete Kenya holidays",
      "Safari and coast combinations",
      "International holiday packages",
      "Honeymoons and anniversaries",
      "Family holidays across school breaks",
      "Festive-season trips",
    ],
    audiences: [
      "Couples and honeymooners",
      "Families planning around school terms",
      "Friends travelling together",
      "Kenyan residents holidaying abroad",
    ],
    editorial: [
      {
        title: "Why package with us?",
        body: "When one team books the flight, the lodge and the transfer, the pieces fit: pickup times match arrivals, checkout matches departure, and if something moves, everything downstream is adjusted for you. You also see one clear price for the whole trip instead of five receipts that never quite add up.",
      },
      {
        title: "Built from your brief",
        body: "There is no fixed catalogue. Tell us the occasion, dates, budget band and travel style; we assemble a plan, you refine it, and nothing is confirmed until you approve the final quotation.",
      },
    ],
    faqIds: ["flights-and-hotels-together", "quotation-process", "payment-methods"],
    relatedServiceSlugs: ["tours-and-safaris", "flights", "hotels"],
    cta: {
      label: "Build a complete holiday",
      whatsappMessage: "Hello, I would like a complete holiday package quotation.",
    },
  },
  {
    slug: "corporate-travel",
    name: "Corporate travel",
    shortName: "Corporate",
    eyebrow: "Business travel desk",
    headline: "Business travel with one point of contact",
    summary:
      "Flights, hotels near the work, airport transfers and fast changes — handled by a consultant who learns how your organisation travels.",
    heroImage: "/images/service-corporate.jpg",
    requestables: [
      "Business flights, including short-notice tickets",
      "Hotels near offices, sites and venues",
      "Airport and meeting transfers",
      "Delegation and team movements",
      "Traveller support while on the road",
      "A consistent booking contact for your admin team",
    ],
    audiences: [
      "SMEs without an internal travel desk",
      "NGOs and project teams",
      "Executive assistants and office managers",
      "Regional teams travelling into or out of Kenya",
    ],
    editorial: [
      {
        title: "Built for how organisations actually travel",
        body: "Plans change, approvals take time and finance needs clean paperwork. We hold options where airlines allow, act fast when travel is approved, and keep documentation consistent so reconciliation is painless. Your travellers get one number to call when anything shifts.",
      },
      {
        title: "Start with one trip",
        body: "No contracts or minimums to begin. Send your next trip's details, see how we handle it, and we will discuss ongoing arrangements — billing preferences included — once we have earned the next one.",
      },
    ],
    faqIds: ["corporate-billing", "flight-changes", "booking-confirmed"],
    relatedServiceSlugs: ["flights", "hotels", "transport"],
    cta: {
      label: "Discuss corporate travel",
      whatsappMessage: "Hello, I would like to discuss corporate travel for my organisation.",
    },
  },
  {
    slug: "group-travel",
    name: "Group travel",
    shortName: "Groups",
    eyebrow: "Schools, teams & communities",
    headline: "Group logistics, quietly handled",
    summary:
      "Schools, companies, faith groups and celebrations — seat blocks, room blocks, coach transport and a coordinator who keeps every name on the right list.",
    heroImage: "/images/service-group.jpg",
    requestables: [
      "School and university trips",
      "Company retreats and incentive travel",
      "Religious and community group journeys",
      "Weddings, reunions and celebrations",
      "Conference and event delegations",
      "Sports team travel",
    ],
    audiences: [
      "Teachers and school administrators",
      "HR and events teams",
      "Faith and community group leaders",
      "Family organisers of large gatherings",
    ],
    editorial: [
      {
        title: "Groups are a different craft",
        body: "Twenty travellers is not ten couples. Group fares, rooming lists, dietary needs, payment collection deadlines and the one passenger whose passport needs renewing — the value of a coordinator is keeping all of it moving without the organiser losing sleep.",
      },
      {
        title: "Lead time matters",
        body: "Airlines and hotels confirm groups person by person, so the earlier we start, the better the terms. Come to us with rough numbers and dates; we will tell you honestly what is achievable and what deadlines the suppliers will set.",
      },
    ],
    faqIds: ["group-travel", "payment-methods", "booking-confirmed"],
    relatedServiceSlugs: ["corporate-travel", "transport", "tours-and-safaris"],
    cta: {
      label: "Ask about group arrangements",
      whatsappMessage: "Hello, I would like to discuss group travel.",
    },
  },
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function getServices(slugs: ServiceSlug[]): Service[] {
  return slugs.map((s) => getService(s));
}
