/**
 * Demonstration enquiry references, e.g. ENQ-7K2M4Q. Human-readable and
 * unambiguous (no 0/O or 1/I). Not globally unique — the future CRM will
 * issue authoritative references; this one just gives the customer and
 * consultant a shared handle for the conversation.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateEnquiryReference(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `ENQ-${code}`;
}
