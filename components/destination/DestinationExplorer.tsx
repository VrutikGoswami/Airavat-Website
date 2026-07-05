"use client";

import { useMemo, useState } from "react";
import type { Destination } from "@/types";
import { DestinationCard } from "@/components/destination/DestinationCard";

const CATEGORIES = [
  { id: "safari", label: "Safari" },
  { id: "beach", label: "Beach" },
  { id: "city", label: "City" },
  { id: "short", label: "Short escapes" },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

const destinationCategory: Record<string, Category> = {
  "maasai-mara": "safari",
  amboseli: "safari",
  diani: "beach",
  mombasa: "beach",
  nairobi: "city",
  naivasha: "short",
};

export function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const [category, setCategory] = useState<Category | "">("");

  const filtered = useMemo(
    () =>
      destinations.filter((destination) => {
        if (!category) return true;
        return destinationCategory[destination.slug] === category;
      }),
    [destinations, category],
  );

  return (
    <div>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filter destinations"
      >
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`rounded-[3px] border px-4 py-2 text-sm font-bold ${
            category === "" ? "border-ochre bg-ochre text-cream" : "border-parchment"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-[3px] border px-4 py-2 text-sm font-bold ${
              category === item.id ? "border-ochre bg-ochre text-cream" : "border-parchment"
            }`}
          >
            {item.label}
          </button>
        ))}
      </form>

      <p className="mt-6 text-sm text-ink-soft" role="status">
        {filtered.length} destination{filtered.length === 1 ? "" : "s"}
        {category ? ` in ${CATEGORIES.find((item) => item.id === category)?.label.toLowerCase()}` : ""}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-parchment bg-sand/60 p-8">
          <p className="font-semibold">No destination is listed in this category yet.</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Send an enquiry with the place you have in mind and a consultant will suggest options.
          </p>
        </div>
      )}
    </div>
  );
}
