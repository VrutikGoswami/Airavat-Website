"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  SERVICE_LABELS,
  TRAVELLER_TYPE_LABELS,
  enquiryServices,
  travellerTypes,
} from "@/lib/validation/quote";
import { destinations } from "@/data/destinations";
import { track } from "@/lib/analytics";

/**
 * Compact "start planning" module: four gentle questions that hand off
 * into the full guided quotation flow with context preselected. This is
 * an entry point to assisted planning — deliberately not styled like a
 * live-inventory search bar.
 */
export function PlanningStarter() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [destination, setDestination] = useState("");
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("");

  const begin = () => {
    track("quote_started", { entry: "planning-starter" });
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (destination) params.set("destination", destination);
    if (when) params.set("when", when);
    if (who) params.set("who", who);
    const query = params.toString();
    router.push(`/request-a-quote${query ? `?${query}` : ""}`);
  };

  const fieldCls =
    "w-full rounded-[3px] border border-parchment bg-ivory px-3 py-2.5 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-ochre";

  return (
    <form
      aria-label="Start planning your trip"
      className="border border-parchment bg-ivory p-6 shadow-[0_18px_50px_-28px_rgb(38_34_27_/_0.45)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        begin();
      }}
    >
      <p className="eyebrow text-ochre">Start planning</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Four quick questions, then a consultant takes it from there. Every answer can be
        &ldquo;not sure yet&rdquo;.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ps-service" className="eyebrow mb-1.5 block text-[10px] text-stone">
            What do you need?
          </label>
          <select
            id="ps-service"
            className={fieldCls}
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Not sure yet</option>
            {enquiryServices
              .filter((s) => s !== "not-sure")
              .map((s) => (
                <option key={s} value={s}>
                  {SERVICE_LABELS[s]}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="ps-destination" className="eyebrow mb-1.5 block text-[10px] text-stone">
            Where to?
          </label>
          <select
            id="ps-destination"
            className={fieldCls}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Not sure yet</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
            <option value="international">Somewhere international</option>
          </select>
        </div>
        <div>
          <label htmlFor="ps-when" className="eyebrow mb-1.5 block text-[10px] text-stone">
            When, roughly?
          </label>
          <input
            id="ps-when"
            type="date"
            className={fieldCls}
            value={when}
            onChange={(e) => setWhen(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ps-who" className="eyebrow mb-1.5 block text-[10px] text-stone">
            Who is travelling?
          </label>
          <select id="ps-who" className={fieldCls} value={who} onChange={(e) => setWho(e.target.value)}>
            <option value="">Not sure yet</option>
            {travellerTypes.map((t) => (
              <option key={t} value={t}>
                {TRAVELLER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[3px] bg-ochre px-6 text-base font-semibold text-cream transition-colors hover:bg-clay"
      >
        Continue planning <ArrowRight aria-hidden className="size-4" />
      </button>
      <p className="mt-3 text-center text-xs text-stone">
        No booking is made — this builds an enquiry for a human consultant.
      </p>
    </form>
  );
}
