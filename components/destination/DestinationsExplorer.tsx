"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  DESTINATION_EXPERIENCE_LABELS,
  enquiryHref,
  type DestinationExperience,
  type DestinationListing,
} from "@/data/travel-content";

const EXPERIENCES: DestinationExperience[] = ["safari", "beach", "city"];

/**
 * Destinations hub: a photo-led, explorative grid with working experience
 * filters. Each tile leads to an enquiry (never a booking) and, where we have
 * one, links out to the official tourism site for that country or region.
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

      <div className="mt-8 space-y-12">
        {(Object.entries(grouped) as [string, DestinationListing[]][])
          .filter(([, items]) => items.length > 0)
          .map(([region, items]) => (
            <section key={region} aria-labelledby={`${region.toLowerCase()}-destinations`}>
              <h2 id={`${region.toLowerCase()}-destinations`} className="display-serif text-3xl">
                {region}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((destination) => (
                  <DestinationTile key={destination.slug} destination={destination} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

function DestinationTile({ destination }: { destination: DestinationListing }) {
  const planHref = enquiryHref({
    service: destination.service,
    destination: destination.published ? destination.slug : destination.name,
    origin: destination.name === "India" ? "Nairobi" : undefined,
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-[3px] border border-parchment bg-ivory">
      <div className="relative aspect-[4/3] overflow-hidden bg-forest-deep">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-forest to-forest-deep" />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <h3 className="display-serif text-2xl text-cream text-balance">{destination.name}</h3>
          <span className="rounded-full bg-cream/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
            {DESTINATION_EXPERIENCE_LABELS[destination.experience]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">{destination.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={planHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ochre hover:text-clay"
          >
            Plan this trip <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          {destination.published ? (
            <Link
              href={`/destinations/${destination.slug}`}
              className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-clay"
            >
              View guide
            </Link>
          ) : null}
          {destination.officialUrl ? (
            <a
              href={destination.officialUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone hover:text-clay"
            >
              {destination.officialLabel ?? "Tourism site"}
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
