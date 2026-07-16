/**
 * Public pricing configuration for the hotel rate finder.
 *
 * Rack/published sheets are the hotel's own selling prices and are shown
 * as-is. Net/STO/contract sheets are confidential cost rates (their terms
 * prohibit publishing the raw figures), so `RATE_MARKUP_PERCENT` is applied
 * to them before display. Decision 2026-07-16: 2%.
 */
export const RATE_MARKUP_PERCENT = 2;

/** Marked-up selling prices are rounded up to this step for tidy display. */
export const RATE_ROUNDING_STEP = 50;

/** Upper bound on quotable stay length, to keep requests sane. */
export const RATE_MAX_NIGHTS = 30;
