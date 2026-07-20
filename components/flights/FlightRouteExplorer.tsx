"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plane } from "lucide-react";
import type { FlightRoute, FlightRegion } from "@/data/flight-routes";
import { flightRegions } from "@/data/flight-routes";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

function enquiryHref(route: FlightRoute): string {
  const params = new URLSearchParams({
    service: "flights",
    origin: route.origin,
    destination: `${route.city}, ${route.country}`,
  });
  return `/request-a-quote?${params.toString()}`;
}

export function FlightRouteExplorer({ routes }: { routes: FlightRoute[] }) {
  const [region, setRegion] = useState<FlightRegion | "all">("all");
  const filtered = region === "all" ? routes : routes.filter((r) => r.region === region);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter routes by region">
        {(["all", ...flightRegions] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={region === value}
            onClick={() => setRegion(value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              region === value
                ? "border-ochre bg-ochre/10 text-clay"
                : "border-parchment bg-ivory text-ink hover:border-stone"
            }`}
          >
            {value === "all" ? "All routes" : value}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((route) => (
          <article
            key={route.id}
            className="flex flex-col border border-parchment bg-ivory p-6 transition-colors hover:border-ochre"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone">
              <Plane aria-hidden className="size-3.5" />
              {route.origin} → {route.city}
              {route.popular ? (
                <span className="ml-auto rounded-full bg-gold/20 px-2 py-0.5 text-[10px] text-clay">
                  Popular
                </span>
              ) : null}
            </div>
            <h3 className="display-serif mt-2 text-2xl text-ink">
              {route.city}
              <span className="ml-2 text-base font-normal text-ink-soft">{route.country}</span>
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{route.blurb}</p>
            <p className="mt-4 text-xs text-stone">
              Airlines we work with: {route.airlines.join(", ")}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={enquiryHref(route)}
                className="inline-flex items-center gap-1.5 rounded-[3px] bg-ochre px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay"
              >
                Get a price <ArrowUpRight aria-hidden className="size-4" />
              </Link>
              <WhatsAppButton
                trackingSource={`flight-route-${route.id}`}
                message={`Hello Airavat, please send flight options from ${route.origin} to ${route.city}, ${route.country}.`}
                label="WhatsApp"
                variant="ghost"
                className="px-0"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
