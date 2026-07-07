import { ShieldCheck } from "lucide-react";

/**
 * Single source of the "this is an enquiry, not a booking" reassurance.
 * Kept only where it earns trust — the enquiry starter, the quote page and the
 * "How booking starts" step — rather than repeated incidentally site-wide.
 */
export const NO_BOOKING_TEXT =
  "This starts an enquiry, not a booking. No payment is taken on this site, and we never ask for passport details here.";

export function NoBookingNote({
  variant = "plain",
  className = "",
}: {
  /** `plain` = quiet caption; `card` = bordered reassurance block with icon. */
  variant?: "plain" | "card";
  className?: string;
}) {
  if (variant === "card") {
    return (
      <p className={`flex items-start gap-2.5 border border-parchment bg-sand/40 px-4 py-3 text-sm leading-relaxed text-ink-soft ${className}`}>
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-ochre" />
        <span>{NO_BOOKING_TEXT}</span>
      </p>
    );
  }
  return <p className={`text-xs leading-relaxed text-stone ${className}`}>{NO_BOOKING_TEXT}</p>;
}
