export type NavLink = { label: string; href: string; description?: string };

/** A top-nav item is either a direct link or a group with a dropdown of links. */
export type NavItem = { label: string; href?: string; children?: NavLink[] };

/**
 * Booking-first top navigation. Flattened from the old grouped dropdowns to
 * five direct links so the header reads as a set of actions: find a flight,
 * find a hotel, plan a package, explore, learn about us. The Maasai Mara
 * seasonal-special link is prepended by the header when a campaign is live,
 * and the WhatsApp + Get-a-quote buttons sit to the right.
 */
export const primaryNav: NavItem[] = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels", href: "/hotels/rates" },
  { label: "Packages", href: "/holiday-packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
];

/** Secondary links for the mobile drawer and footer overflow. */
export const secondaryNav: NavLink[] = [
  { label: "Safaris", href: "/tours-and-safaris" },
  { label: "Transport & Transfers", href: "/transport" },
  { label: "Corporate Travel", href: "/corporate-travel" },
  { label: "Group Travel", href: "/group-travel" },
  { label: "Contact", href: "/contact" },
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
