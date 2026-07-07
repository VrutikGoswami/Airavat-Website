"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DESTINATION_EXPERIENCE_LABELS,
  enquiryHref,
  type DestinationExperience,
  type DestinationListing,
} from "@/data/travel-content";
import { ButtonLink } from "@/components/ui/Button";

const EXPERIENCES: DestinationExperience[] = ["safari", "beach", "city"];

/**
 * Destinations hub: functional experience filter chips over the shared
 * destination listings, grouped by region. Filtering is real (no dead
 * controls), and every card leads to an enquiry rather than a booking.
 */
export function DestinationsExplorer({ listings }: { listings: DestinationListing[] }) {
  const [experience, setExperience] = useState<DestinationExperience | "all">("all");

  const filtered = useMemo(
    () => (experience === "all" ? listings : listings.filter((d) => d.experience === experience)),
    [listings, experience],
  );

  const grouped = {
    Kenya: filtered.filter((d) => d.region === "Kenya"),
    International: filtered.filter((d) => d.region === "International"),
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
      active ? "border-ink bg-ink text-cream" : "border-parchment text-ink-soft hover:border-ink"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter destinations by experience">
        <button type="button" aria-pressed={experience === "all"} onClick={() => setExperience("all")} className={chip(experience === "all")}>
          All
        </button>
        {EXPERIENCES.map((exp) => (
          <button
            key={exp}
            type="button"
            aria-pressed={experience === exp}
            onClick={() => setExperience(exp)}
            className={chip(experience === exp)}
          >
            {DESTINATION_EXPERIENCE_LABELS[exp]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft" role="status">
        {filtered.length} destination{filtered.length === 1 ? "" : "s"}
        {experience !== "all" ? ` · ${DESTINATION_EXPERIENCE_LABELS[experience]}` : ""}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {(Object.entries(grouped) as [string, DestinationListing[]][])
          .filter(([, items]) => items.length > 0)
          .map(([region, items]) => (
            <section key={region} aria-labelledby={`${region.toLowerCase()}-destinations`}>
              <h2 id={`${region.toLowerCase()}-destinations`} className="display-serif text-3xl">
                {region}
              </h2>
              <div className="mt-5 grid gap-4">
                {items.map((destination) => (
                  <article key={destination.slug} className="border border-parchment bg-ivory p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-md">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{destination.name}</h3>
                          <span className="eyebrow text-[10px] text-stone">
                            {DESTINATION_EXPERIENCE_LABELS[destination.experience]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{destination.summary}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-3">
                        {destination.published ? (
                          <Link
                            href={`/destinations/${destination.slug}`}
                            className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-clay"
                          >
                            View guide
                          </Link>
                        ) : null}
                        <ButtonLink
                          href={enquiryHref({
                            service: destination.service,
                            destination: destination.published ? destination.slug : destination.name,
                            origin: destination.name === "India" ? "Nairobi" : undefined,
                          })}
                          variant="ghost"
                          className="px-0 py-0"
                        >
                          Plan this trip
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
