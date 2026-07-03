"use client";

import { useMemo, useState } from "react";
import type { Destination, Experience, MonthKey, TravellerType } from "@/types";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { TRAVELLER_TYPE_LABELS } from "@/lib/validation/quote";

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: "jan", label: "January" }, { key: "feb", label: "February" },
  { key: "mar", label: "March" }, { key: "apr", label: "April" },
  { key: "may", label: "May" }, { key: "jun", label: "June" },
  { key: "jul", label: "July" }, { key: "aug", label: "August" },
  { key: "sep", label: "September" }, { key: "oct", label: "October" },
  { key: "nov", label: "November" }, { key: "dec", label: "December" },
];

type Props = {
  destinations: Destination[];
  experiences: Experience[];
};

/**
 * Exploratory destination discovery over local structured data: filter by
 * experience, traveller type and month. All filters actually filter.
 */
export function DestinationExplorer({ destinations, experiences }: Props) {
  const [travellerType, setTravellerType] = useState<TravellerType | "">("");
  const [experienceId, setExperienceId] = useState("");
  const [month, setMonth] = useState<MonthKey | "">("");

  const filtered = useMemo(
    () =>
      destinations.filter((d) => {
        if (travellerType && !d.travellerTypes.includes(travellerType)) return false;
        if (experienceId && !d.experienceIds.includes(experienceId)) return false;
        if (month) {
          const rating = d.seasonality.find((s) => s.month === month)?.rating;
          if (rating !== "excellent" && rating !== "good") return false;
        }
        return true;
      }),
    [destinations, travellerType, experienceId, month],
  );

  const hasFilters = Boolean(travellerType || experienceId || month);
  const selectCls =
    "w-full rounded-[3px] border border-parchment bg-ivory px-3 py-2.5 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-ochre";

  return (
    <div>
      <form
        className="grid gap-4 sm:grid-cols-3 lg:max-w-3xl"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Filter destinations"
      >
        <div>
          <label htmlFor="filter-traveller" className="eyebrow mb-1.5 block text-[10px] text-stone">
            Traveller type
          </label>
          <select
            id="filter-traveller"
            className={selectCls}
            value={travellerType}
            onChange={(e) => setTravellerType(e.target.value as TravellerType | "")}
          >
            <option value="">Any travellers</option>
            {Object.entries(TRAVELLER_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-experience" className="eyebrow mb-1.5 block text-[10px] text-stone">
            Experience
          </label>
          <select
            id="filter-experience"
            className={selectCls}
            value={experienceId}
            onChange={(e) => setExperienceId(e.target.value)}
          >
            <option value="">Any experience</option>
            {experiences.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-month" className="eyebrow mb-1.5 block text-[10px] text-stone">
            Travel month
          </label>
          <select
            id="filter-month"
            className={selectCls}
            value={month}
            onChange={(e) => setMonth(e.target.value as MonthKey | "")}
          >
            <option value="">Any month</option>
            {MONTHS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p className="mt-6 text-sm text-ink-soft" role="status">
        {filtered.length} destination{filtered.length === 1 ? "" : "s"}
        {hasFilters ? " match your filters" : ""}
        {hasFilters ? (
          <>
            {" · "}
            <button
              type="button"
              className="font-semibold text-ochre underline underline-offset-4 hover:text-clay"
              onClick={() => {
                setTravellerType("");
                setExperienceId("");
                setMonth("");
              }}
            >
              Clear filters
            </button>
          </>
        ) : null}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <li key={d.slug}>
              <DestinationCard destination={d} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-parchment bg-sand/60 p-8">
          <p className="font-semibold">No destination matches that exact combination yet.</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            That doesn&apos;t mean it can&apos;t be arranged — our list here is only a starting
            point. Tell us what you have in mind and a consultant will suggest options.
          </p>
        </div>
      )}
    </div>
  );
}
