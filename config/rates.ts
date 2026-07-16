/**
 * Public pricing configuration for the hotel rate finder.
 *
 * Contract rate cards are net, commissionable rates and their terms
 * (e.g. Maisha Group clause 13) prohibit onward distribution of the raw
 * figures to booking portals/third parties. `RATE_MARKUP_PERCENT` is the
 * uplift applied before a price is shown on the website; 0 displays the
 * contract rate unchanged — confirm with management what the site should
 * sell at before going live.
 */
export const RATE_MARKUP_PERCENT = 0;

/** Marked-up selling prices are rounded up to this step for tidy display. */
export const RATE_ROUNDING_STEP = 50;

/** Upper bound on quotable stay length, to keep requests sane. */
export const RATE_MAX_NIGHTS = 30;
