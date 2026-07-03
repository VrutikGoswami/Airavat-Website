import type { MonthRating } from "@/types";

const MONTH_LABELS: Record<MonthRating["month"], string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
  jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

const RATING_STYLES: Record<MonthRating["rating"], { bar: string; label: string }> = {
  excellent: { bar: "bg-ochre h-16", label: "Excellent" },
  good: { bar: "bg-sage h-10", label: "Good" },
  mixed: { bar: "bg-parchment h-5", label: "Mixed" },
};

/**
 * "When to go" chart. Month-level guidance only — presented as typical
 * conditions, never as a guarantee.
 */
export function MonthSeasonality({ seasonality }: { seasonality: MonthRating[] }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-12" role="img" aria-label={seasonalityAlt(seasonality)}>
        {seasonality.map((m) => (
          <div key={m.month} className="flex flex-col items-center justify-end gap-1.5">
            <span className="sr-only">
              {MONTH_LABELS[m.month]}: {RATING_STYLES[m.rating].label}
              {m.note ? ` — ${m.note}` : ""}
            </span>
            <div
              aria-hidden
              title={`${MONTH_LABELS[m.month]}: ${RATING_STYLES[m.rating].label}${m.note ? ` — ${m.note}` : ""}`}
              className={`w-full rounded-t-[2px] ${RATING_STYLES[m.rating].bar}`}
            />
            <span aria-hidden className="text-[11px] font-semibold text-ink-soft">
              {MONTH_LABELS[m.month]}
            </span>
          </div>
        ))}
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-soft" aria-hidden>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 bg-ochre" /> Excellent
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 bg-sage" /> Good
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 bg-parchment" /> Mixed
        </li>
      </ul>
      <p className="mt-4 text-xs text-stone">
        Typical conditions by month, for planning only — weather and wildlife are natural and vary
        year to year.
      </p>
    </div>
  );
}

function seasonalityAlt(seasonality: MonthRating[]): string {
  return (
    "Typical month-by-month conditions: " +
    seasonality
      .map((m) => `${MONTH_LABELS[m.month]} ${RATING_STYLES[m.rating].label.toLowerCase()}`)
      .join(", ")
  );
}
