export type NavLink = { label: string; href: string; description?: string };

/** A top-nav item is either a direct link or a group with a dropdown of links. */
export type NavItem = { label: string; href?: string; children?: NavLink[] };

export const primaryNav: NavItem[] = [
  { label: "Holidays", href: "/holiday-packages" },
  {
    label: "Flights & Hotels",
    children: [
      { label: "Flights", href: "/flights" },
      { label: "Hotels", href: "/hotels" },
      { label: "Hotel Rates", href: "/#hotel-rates" },
      { label: "Transport & Transfers", href: "/transport" },
    ],
  },
  { label: "Safaris", href: "/tours-and-safaris" },
  {
    label: "Business & Groups",
    children: [
      { label: "Corporate Travel", href: "/corporate-travel" },
      { label: "Group Travel", href: "/group-travel" },
    ],
  },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
];

/** Extra links for the mobile drawer (services now live under primary groups). */
export const secondaryNav: NavLink[] = [
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
