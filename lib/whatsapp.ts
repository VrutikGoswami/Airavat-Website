import { companyConfig, hasRealWhatsAppNumber } from "@/config/company";

/**
 * Builds context-aware WhatsApp deep links. All links use the central
 * config number. While the number is still a placeholder the helpers
 * return null, and WhatsApp UI degrades to pointing at the contact page —
 * the site never opens a chat to a bracketed placeholder.
 *
 * Keep messages short and non-sensitive: a wa.me URL is visible in
 * history/logs, so never encode contact details or personal data.
 */
export function buildWhatsAppUrl(message: string): string | null {
  if (!hasRealWhatsAppNumber()) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${companyConfig.whatsapp}?text=${text}`;
}

export function whatsappGreeting(context?: string): string {
  const name = companyConfig.name.startsWith("[") ? "" : ` ${companyConfig.name}`;
  return context
    ? `Hello${name}, ${context}`
    : `Hello${name}, I would like help planning a trip.`;
}

/** Short, non-sensitive summary for continuing an enquiry on WhatsApp. */
export function enquirySummaryMessage(input: {
  reference?: string;
  service: string;
  destination?: string;
  dates?: string;
  travellers?: string;
}): string {
  const parts = [
    whatsappGreeting(`I would like help with ${input.service}.`),
    input.destination ? `Destination: ${input.destination}.` : null,
    input.dates ? `Dates: ${input.dates}.` : null,
    input.travellers ? `Travellers: ${input.travellers}.` : null,
    input.reference ? `My enquiry reference is ${input.reference}.` : null,
  ];
  return parts.filter(Boolean).join(" ");
}
