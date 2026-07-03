export type NavLink = { label: string; href: string; description?: string };

export const primaryNav: NavLink[] = [
  { label: "Destinations", href: "/destinations" },
  { label: "Tours & Safaris", href: "/tours-and-safaris" },
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Extra links that only appear inside the mobile drawer and footer. */
export const secondaryNav: NavLink[] = [
  { label: "Transport & Transfers", href: "/transport" },
  { label: "Holiday Packages", href: "/holiday-packages" },
  { label: "Corporate Travel", href: "/corporate-travel" },
  { label: "Group Travel", href: "/group-travel" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

export const footerServiceNav: NavLink[] = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels" },
  { label: "Tours & Safaris", href: "/tours-and-safaris" },
  { label: "Transport & Transfers", href: "/transport" },
  { label: "Holiday Packages", href: "/holiday-packages" },
  { label: "Corporate Travel", href: "/corporate-travel" },
  { label: "Group Travel", href: "/group-travel" },
];

export const footerCompanyNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Request a Quote", href: "/request-a-quote" },
];

export const footerLegalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Booking Conditions", href: "/terms" },
];
