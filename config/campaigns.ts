import type { SeasonalCampaign } from "@/types";

/**
 * Seasonal campaigns drive the homepage hero and the seasonal navigation
 * link. Edit dates/copy here; nothing is hard-coded in components.
 *
 * When the active campaign's window ends (or `enabled` is false) the site
 * automatically falls back to evergreen planning content — no stale
 * "happening now" language is left behind.
 */
export const seasonalCampaigns: SeasonalCampaign[] = [
  {
    id: "maasai-mara-migration-season",
    enabled: true,
    destinationSlug: "maasai-mara",
    label: "Seasonal focus",
    headline: "Maasai Mara migration season",
    summary:
      "Plan a tailor-made Mara safari with accommodation, transport and optional flight coordination.",
    startDate: "2026-07-01",
    endDate: "2026-10-31",
    image: "/images/mara-hero.jpg",
    primaryCta: {
      label: "Plan a Maasai Mara safari",
      href: "/request-a-quote?service=safari&destination=maasai-mara",
    },
    disclaimer:
      "Migration timing, river crossings and wildlife sightings are natural events and cannot be guaranteed.",
  },
];

/** The campaign currently inside its date window, if any. */
export function getActiveCampaign(now: Date = new Date()): SeasonalCampaign | null {
  const today = now.toISOString().slice(0, 10);
  return (
    seasonalCampaigns.find(
      (c) => c.enabled && c.startDate <= today && today <= c.endDate,
    ) ?? null
  );
}
