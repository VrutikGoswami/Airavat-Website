"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/forms/fields";

/**
 * "Build your own trip" — a light multi-stop planner. It doesn't need its own
 * backend: it assembles the choices into the existing enquiry (service +
 * primary destination + party) plus a structured free-text `note`, so a
 * consultant receives everything needed to plan the whole trip.
 */

const transportOptions = [
  { value: "flights", label: "Flights between stops" },
  { value: "road", label: "Road transfers / self-drive" },
  { value: "fly-in", label: "Fly-in safari (light aircraft)" },
  { value: "mixed", label: "A mix — advise me" },
] as const;

const styleOptions = [
  { value: "value", label: "Value-conscious" },
  { value: "comfort", label: "Comfortable mid-range" },
  { value: "premium", label: "Premium / luxury" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const budgetOptions = [
  { value: "under-100k", label: "Under KES 100,000" },
  { value: "100k-300k", label: "KES 100,000 – 300,000" },
  { value: "300k-700k", label: "KES 300,000 – 700,000" },
  { value: "over-700k", label: "Over KES 700,000" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export type TripPlan = {
  stops: string[];
  startDate: string;
  nights: string;
  flexible: boolean;
  adults: number;
  children: number;
  childAges: string;
  transport: (typeof transportOptions)[number]["value"];
  style: (typeof styleOptions)[number]["value"];
  budget: (typeof budgetOptions)[number]["value"];
  activities: string;
  note: string;
};

export function TripBuilder({
  initialDestination,
  onComplete,
  submitLabel = "Review and send my trip",
}: {
  initialDestination?: string;
  onComplete?: (plan: TripPlan) => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [stops, setStops] = useState<string[]>([initialDestination ?? "", ""]);
  const [startDate, setStartDate] = useState("");
  const [nights, setNights] = useState("");
  const [flexible, setFlexible] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState("");
  const [transport, setTransport] = useState<(typeof transportOptions)[number]["value"]>("mixed");
  const [style, setStyle] = useState<(typeof styleOptions)[number]["value"]>("not-sure");
  const [budget, setBudget] = useState<(typeof budgetOptions)[number]["value"]>("not-sure");
  const [activities, setActivities] = useState("");
  const [error, setError] = useState<string | null>(null);

  function setStop(index: number, value: string) {
    setStops((prev) => prev.map((s, i) => (i === index ? value : s)));
  }
  function addStop() {
    setStops((prev) => [...prev, ""]);
  }
  function removeStop(index: number) {
    setStops((prev) => prev.filter((_, i) => i !== index));
  }

  function onSubmit() {
    const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
    if (cleanStops.length === 0) {
      setError("Add at least one place you'd like to go.");
      return;
    }

    const transportLabel = transportOptions.find((t) => t.value === transport)?.label ?? transport;
    const noteParts = [
      `Custom trip plan — stops: ${cleanStops.join(" → ")}`,
      startDate ? `Start: ${startDate}` : flexible ? "Dates flexible" : null,
      nights ? `Duration: ${nights} nights` : null,
      `Travel between stops: ${transportLabel}`,
      activities.trim() ? `Interests: ${activities.trim()}` : null,
    ].filter(Boolean);

    const note = noteParts.join(" · ");
    const plan: TripPlan = {
      stops: cleanStops,
      startDate,
      nights,
      flexible,
      adults,
      children,
      childAges,
      transport,
      style,
      budget,
      activities,
      note,
    };
    if (onComplete) {
      onComplete(plan);
      return;
    }

    const params = new URLSearchParams({
      service: "holiday-package",
      destination: cleanStops[0],
      adults: String(adults),
      children: String(children),
      style,
      budget,
      note,
    });
    if (childAges.trim()) params.set("childAges", childAges.trim());
    if (startDate) params.set("checkIn", startDate);

    router.push(`/request-a-quote?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-ink">Where do you want to go?</legend>
        <p className="text-xs text-ink-soft">Add each stop in order. One place is fine; add more for a multi-stop trip.</p>
        <div className="space-y-3">
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-sm font-bold text-stone">{i + 1}.</span>
              <input
                value={stop}
                onChange={(e) => setStop(i, e.target.value)}
                placeholder={i === 0 ? "e.g. Maasai Mara" : "e.g. Diani Beach"}
                className="w-full rounded-[3px] border border-parchment bg-ivory px-3.5 py-2.5 text-base text-ink placeholder:text-stone focus-visible:outline-2 focus-visible:outline-ochre"
              />
              {stops.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeStop(i)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-[3px] border border-parchment text-stone hover:border-clay hover:text-clay"
                  aria-label={`Remove stop ${i + 1}`}
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStop}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ochre hover:text-clay"
        >
          <Plus aria-hidden className="size-4" /> Add another stop
        </button>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Approx. start date"
          type="date"
          required={false}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Roughly how many nights?"
          type="number"
          min={1}
          max={90}
          required={false}
          placeholder="e.g. 7"
          value={nights}
          onChange={(e) => setNights(e.target.value)}
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={flexible}
          onChange={(e) => setFlexible(e.target.checked)}
          className="size-4 accent-ochre"
        />
        My dates are flexible
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Adults"
          type="number"
          min={1}
          max={20}
          value={adults}
          onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
        />
        <TextField
          label="Children"
          type="number"
          min={0}
          max={20}
          required={false}
          value={children}
          onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
        />
        {children > 0 ? (
          <TextField
            label="Children's ages"
            required={false}
            placeholder="e.g. 4, 9"
            value={childAges}
            onChange={(e) => setChildAges(e.target.value)}
          />
        ) : (
          <div className="hidden sm:block" aria-hidden />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="How do you want to travel?"
          value={transport}
          onChange={(e) => setTransport(e.target.value as typeof transport)}
        >
          {transportOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Travel style" value={style} onChange={(e) => setStyle(e.target.value as typeof style)}>
          {styleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Budget guide" value={budget} onChange={(e) => setBudget(e.target.value as typeof budget)}>
          {budgetOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <label htmlFor="trip-activities" className="mb-1.5 block text-sm font-bold">
          Anything you&apos;d love to include?{" "}
          <span className="font-normal text-stone">(optional)</span>
        </label>
        <textarea
          id="trip-activities"
          rows={3}
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          placeholder="Hot-air balloon, honeymoon, kids' club, diving, cultural visits…"
          className="w-full rounded-[3px] border border-parchment bg-ivory px-3.5 py-3 text-base text-ink placeholder:text-stone focus-visible:outline-2 focus-visible:outline-ochre"
        />
      </div>

      {error ? (
        <p className="text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" size="lg" onClick={onSubmit}>
          {submitLabel}
        </Button>
        <p className="text-xs text-ink-soft">
          You&apos;ll see everything to confirm on the next step — this creates an enquiry, not a
          booking.
        </p>
      </div>
    </div>
  );
}
