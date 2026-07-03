"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { ItineraryIdea } from "@/types";
import { track } from "@/lib/analytics";
import { STYLE_LABELS } from "@/lib/validation/quote";

const styleLabel: Record<ItineraryIdea["style"], string> = {
  value: STYLE_LABELS.value,
  comfort: STYLE_LABELS.comfort,
  premium: STYLE_LABELS.premium,
  "not-sure": "Flexible",
};

/**
 * Itinerary ideas are concepts, not products: no prices, no discounts —
 * every idea leads to a custom quotation.
 */
export function ItineraryCard({ idea }: { idea: ItineraryIdea }) {
  return (
    <article className="group flex flex-col">
      <div className="img-frame relative aspect-[3/2]">
        <Image
          src={idea.image}
          alt={`${idea.title} — illustrative placeholder image`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5 text-ochre" />
            {idea.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3.5 text-ochre" />
            {idea.places.join(" · ")}
          </span>
          <span className="rounded-[2px] bg-sand px-2 py-0.5 uppercase tracking-wider text-[10px]">
            {styleLabel[idea.style]}
          </span>
        </div>
        <h3 className="display-serif mt-3 text-2xl">{idea.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{idea.summary}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone">
          Custom quotation available
        </p>
        <div className="mt-4 flex gap-5 text-sm font-semibold">
          <Link
            href={`/request-a-quote?service=${idea.travellerTypes.includes("business") ? "corporate" : "holiday-package"}&destination=${idea.destinationSlugs[0] ?? ""}&idea=${idea.slug}`}
            className="text-ochre underline underline-offset-4 hover:text-clay"
            onClick={() => track("itinerary_viewed", { idea: idea.slug })}
          >
            Plan something similar
          </Link>
        </div>
      </div>
    </article>
  );
}
