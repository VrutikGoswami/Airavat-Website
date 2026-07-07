import { Clock } from "lucide-react";
import { companyConfig } from "@/config/company";

/**
 * Honest, editable response-time expectation. The target time is a placeholder
 * in companyConfig (`responseTime`) to confirm before launch; opening hours are
 * sourced from the same config so this line never drifts.
 */
export function ResponseTimeNote({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft ${className}`}>
      <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ochre" />
      <span>
        A consultant usually replies within{" "}
        <strong className="font-semibold text-ink">{companyConfig.responseTime}</strong> during
        opening hours ({companyConfig.openingHours}).
      </span>
    </p>
  );
}
