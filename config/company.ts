/**
 * Central company configuration.
 *
 * Every bracketed value is a placeholder that MUST be replaced before launch.
 * Nothing else in the codebase hard-codes company identity or contact
 * details — change them here and they change everywhere.
 */
export const companyConfig = {
  name: "Airavat Tours and Travels",
  legalName: "Airavat Tours and Travel Limited",
  shortName: "Airavat",
  /** One line under the logo and in metadata. */
  tagline: "Tours & travel from Kenya",
  description:
    "A Kenya-based tours and travel company arranging flights, hotels, safaris, transport and complete holidays through personal consultants.",
  phone: "+254101490033",
  /** International format without +, e.g. 2547XXXXXXXX. Used in wa.me links. */
  whatsapp: "254101490033",
  email: "info@airavat.biz",
  address: "602, NML Towers, Tsavo Road, South B, Nairobi, Kenya, 18815-00500",
  city: "Nairobi, Kenya",
  openingHours: "6 AM to 8 PM",
  /** Placeholder — confirm the real target reply time before launch. */
  responseTime: "[a few hours]",
  currency: "KES",
  socialLinks: {
    instagram: "https://www.instagram.com/airavatltd/",
    facebook: "https://www.facebook.com/airavattoursandtravel/",
    linkedin: "",
    tiktok: "",
  },
  socialLabels: {
    instagram: "@airavatltd",
    facebook: "Airavat Tours and Travel limited.",
  },
} as const;

/**
 * True once real contact details are in place. Gates the WhatsApp deep links
 * so the site never opens a chat to a placeholder number.
 */
export function hasRealWhatsAppNumber(): boolean {
  return !companyConfig.whatsapp.startsWith("[");
}

/** Display name that degrades gracefully while the brand is unconfirmed. */
export function displayName(): string {
  return companyConfig.name.startsWith("[") ? "Safari Meridian (working title)" : companyConfig.name;
}
