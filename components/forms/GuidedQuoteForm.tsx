"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  CheckboxField,
  OptionTile,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { track } from "@/lib/analytics";
import { enquirySummaryMessage } from "@/lib/whatsapp";
import {
  BUDGET_LABELS,
  QUOTE_STEPS,
  QUOTE_STEP_FIELDS,
  SERVICE_LABELS,
  STYLE_LABELS,
  TRAVELLER_TYPE_LABELS,
  budgetBands,
  enquiryServices,
  quoteDefaults,
  quoteSchema,
  travelStyles,
  travellerTypes,
  type QuoteFormValues,
} from "@/lib/validation/quote";
import { destinations } from "@/data/destinations";

const DRAFT_KEY = "travel-enquiry-draft-v1";

type SubmitState =
  | { status: "idle" | "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; reference: string };

function readDraft(): { values: Partial<QuoteFormValues>; step: number } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Guided, multi-stage enquiry flow. Consultative by design: every stage
 * allows "not sure", progress is saved locally, and submission clearly
 * creates an enquiry — never a booking.
 */
export function GuidedQuoteForm() {
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [resumedDraft, setResumedDraft] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaults,
    mode: "onTouched",
  });

  const service = watch("service");
  const flexibleDates = watch("flexibleDates");
  const step = QUOTE_STEPS[stepIndex];

  // Restore draft, then apply page-context preselection from the URL.
  useEffect(() => {
    const draft = readDraft();
    if (draft?.values) {
      reset({ ...quoteDefaults, ...draft.values, consent: false });
      if (typeof draft.step === "number" && draft.step > 0 && draft.step < QUOTE_STEPS.length) {
        setStepIndex(draft.step);
        setResumedDraft(true);
      }
    }
    const serviceParam = searchParams.get("service");
    if (serviceParam && (enquiryServices as readonly string[]).includes(serviceParam)) {
      setValue("service", serviceParam as QuoteFormValues["service"]);
    }
    const destinationParam = searchParams.get("destination");
    if (destinationParam) {
      const known = destinations.find((d) => d.slug === destinationParam);
      setValue("destination", known ? `${known.name}, ${known.country}` : destinationParam);
    }
    const whenParam = searchParams.get("when");
    if (whenParam && /^\d{4}-\d{2}-\d{2}$/.test(whenParam)) {
      setValue("departureDate", whenParam);
    }
    const whoParam = searchParams.get("who");
    if (whoParam && (travellerTypes as readonly string[]).includes(whoParam)) {
      setValue("travellerType", whoParam as QuoteFormValues["travellerType"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft while typing (never the consent checkbox).
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ values: { ...values, consent: false }, step: stepIndex }),
        );
      } catch {
        // Storage unavailable (private mode etc.) — the form still works.
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, stepIndex]);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("quote_started", { entry: searchParams.get("service") ?? "direct" });
    }
  }, [searchParams]);

  const focusHeading = useCallback(() => {
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      setStepIndex(index);
      focusHeading();
    },
    [focusHeading],
  );

  const next = useCallback(async () => {
    const valid = await trigger(QUOTE_STEP_FIELDS[step.id], { shouldFocus: true });
    if (!valid) {
      track("quote_validation_failed", { step: step.id });
      return;
    }
    track("quote_step_completed", { step: step.id });
    goToStep(Math.min(stepIndex + 1, QUOTE_STEPS.length - 1));
  }, [trigger, step.id, stepIndex, goToStep]);

  const back = useCallback(() => {
    goToStep(Math.max(stepIndex - 1, 0));
  }, [stepIndex, goToStep]);

  const onSubmit = handleSubmit(
    async (values) => {
      if (submitState.status === "submitting") return; // duplicate-submit guard
      setSubmitState({ status: "submitting" });
      try {
        const res = await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "The enquiry could not be sent.");
        }
        const body = (await res.json()) as { reference: string };
        track("quote_submitted", { service: values.service });
        if (values.service === "corporate") {
          track("corporate_enquiry_submitted");
        }
        if (values.service === "group") {
          track("group_enquiry_submitted");
        }
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          // ignore
        }
        setSubmitState({ status: "success", reference: body.reference });
        focusHeading();
      } catch (err) {
        setSubmitState({
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Something went wrong sending your enquiry. Please try again, or continue on WhatsApp.",
        });
      }
    },
    () => track("quote_validation_failed", { step: "review" }),
  );

  // ------------------------------------------------------------------ success
  if (submitState.status === "success") {
    const values = getValues();
    return (
      <div className="border border-parchment bg-sand/50 p-8 sm:p-12" role="status">
        <CheckCircle2 aria-hidden className="size-10 text-ochre" />
        <h2 ref={headingRef} tabIndex={-1} className="display-serif mt-5 text-3xl sm:text-4xl">
          Your enquiry has been received
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
          Reference <strong className="text-ink">{submitState.reference}</strong>. A travel
          consultant will review your request and contact you by{" "}
          {values.preferredContact === "whatsapp"
            ? "WhatsApp"
            : values.preferredContact === "phone"
              ? "phone"
              : "email"}{" "}
          with current options and prices.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
          <strong className="text-ink">This is not a booking.</strong> Nothing is reserved or
          purchased until you approve a quotation and we confirm availability with airlines,
          hotels or camps.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton
            trackingSource="quote-success"
            message={enquirySummaryMessage({
              reference: submitState.reference,
              service: SERVICE_LABELS[values.service].toLowerCase(),
              destination: values.destination || undefined,
              dates: values.flexibleDates
                ? "flexible"
                : values.departureDate || undefined,
              travellers: `${values.adults} adult(s), ${values.children} child(ren)`,
            })}
            label="Continue on WhatsApp"
            variant="primary"
          />
          <Link
            href="/destinations"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
          >
            Keep exploring destinations
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------- form
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      onKeyDown={(e) => {
        // Enter advances the current step instead of submitting the whole form.
        if (
          e.key === "Enter" &&
          step.id !== "review" &&
          !(e.target instanceof HTMLTextAreaElement) &&
          !(e.target instanceof HTMLButtonElement)
        ) {
          e.preventDefault();
          void next();
        }
      }}
    >
      {/* Progress */}
      <nav aria-label="Enquiry progress" className="mb-8">
        <p className="text-sm font-semibold text-ink-soft">
          Step {stepIndex + 1} of {QUOTE_STEPS.length}
        </p>
        <ol className="mt-3 flex gap-1.5">
          {QUOTE_STEPS.map((s, i) => (
            <li key={s.id} className="flex-1">
              <span className="sr-only">
                {s.short} — {i < stepIndex ? "completed" : i === stepIndex ? "current" : "upcoming"}
              </span>
              <span
                aria-hidden
                className={`block h-1 rounded-full ${
                  i <= stepIndex ? "bg-ochre" : "bg-parchment"
                }`}
              />
            </li>
          ))}
        </ol>
      </nav>

      {resumedDraft && stepIndex > 0 ? (
        <p className="mb-6 border-l-2 border-gold bg-gold/10 px-4 py-3 text-sm">
          We restored your earlier answers so you can pick up where you left off.
        </p>
      ) : null}

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="display-serif text-2xl outline-none sm:text-3xl"
      >
        {step.title}
      </h2>

      <div className="mt-7 space-y-5">
        {/* ---------------------------------------------------------- step 1 */}
        {step.id === "service" ? (
          <div role="radiogroup" aria-label="Type of help" className="grid gap-3 sm:grid-cols-2">
            {enquiryServices.map((s) => (
              <OptionTile
                key={s}
                selected={service === s}
                title={SERVICE_LABELS[s]}
                description={
                  s === "not-sure"
                    ? "A consultant will help you shape the trip first."
                    : undefined
                }
                onSelect={() => setValue("service", s, { shouldValidate: true })}
              />
            ))}
          </div>
        ) : null}

        {/* ---------------------------------------------------------- step 2 */}
        {step.id === "destination" ? (
          <>
            <TextField
              label="Where would you like to go?"
              hint="A country, city or park is ideal — “not sure yet” is completely fine."
              placeholder="e.g. Maasai Mara, Dubai, not sure yet"
              {...register("destination")}
              error={errors.destination?.message}
            />
            <button
              type="button"
              className="text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
              onClick={() =>
                setValue("destination", "Not sure yet — open to suggestions", {
                  shouldValidate: true,
                })
              }
            >
              I&apos;m not sure yet
            </button>
            {service === "flights" ? (
              <TextField
                label="Flying from"
                placeholder="e.g. Nairobi"
                {...register("departureCity")}
                error={errors.departureCity?.message}
              />
            ) : (
              <TextField
                label="Starting point"
                required={false}
                placeholder="e.g. Nairobi"
                {...register("departureCity")}
                error={errors.departureCity?.message}
              />
            )}
            <CheckboxField
              label="I'm open to alternative destinations if they fit better"
              {...register("flexibleDestination")}
            />
          </>
        ) : null}

        {/* ---------------------------------------------------------- step 3 */}
        {step.id === "dates" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Departure date (approximate)"
                type="date"
                required={!flexibleDates}
                {...register("departureDate")}
                error={errors.departureDate?.message}
              />
              <TextField
                label="Return date"
                type="date"
                required={false}
                {...register("returnDate")}
                error={errors.returnDate?.message}
              />
            </div>
            <CheckboxField
              label="My dates are flexible"
              {...register("flexibleDates")}
            />
            <p className="text-xs text-stone">
              Rough dates are enough — availability and prices are confirmed by a consultant
              before anything is booked.
            </p>
          </>
        ) : null}

        {/* ---------------------------------------------------------- step 4 */}
        {step.id === "travellers" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                label="Adults"
                type="number"
                min={1}
                max={99}
                inputMode="numeric"
                {...register("adults")}
                error={errors.adults?.message}
              />
              <TextField
                label="Children (2–11)"
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                {...register("children")}
                error={errors.children?.message}
              />
              <TextField
                label="Infants (under 2)"
                type="number"
                min={0}
                max={20}
                inputMode="numeric"
                {...register("infants")}
                error={errors.infants?.message}
              />
            </div>
            <SelectField
              label="Who is travelling?"
              {...register("travellerType")}
              error={errors.travellerType?.message}
            >
              {travellerTypes.map((t) => (
                <option key={t} value={t}>
                  {TRAVELLER_TYPE_LABELS[t]}
                </option>
              ))}
            </SelectField>
          </>
        ) : null}

        {/* ---------------------------------------------------------- step 5 */}
        {step.id === "details" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField label="Travel style" {...register("style")} error={errors.style?.message}>
                {travelStyles.map((s) => (
                  <option key={s} value={s}>
                    {STYLE_LABELS[s]}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Approximate total budget"
                hint="A band is enough — it helps us propose realistic options."
                {...register("budget")}
                error={errors.budget?.message}
              >
                {budgetBands.map((b) => (
                  <option key={b} value={b}>
                    {BUDGET_LABELS[b]}
                  </option>
                ))}
              </SelectField>
            </div>

            {service === "flights" ? (
              <fieldset className="space-y-5 border-t border-parchment pt-5">
                <legend className="eyebrow pt-5 text-ochre">Flight preferences</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField label="Trip type" {...register("tripType")} error={errors.tripType?.message}>
                    <option value="return">Return</option>
                    <option value="one-way">One-way</option>
                    <option value="multi-city">Multi-city</option>
                  </SelectField>
                  <SelectField
                    label="Cabin class"
                    {...register("cabinClass")}
                    error={errors.cabinClass?.message}
                  >
                    <option value="any">Any / best value</option>
                    <option value="economy">Economy</option>
                    <option value="premium-economy">Premium economy</option>
                    <option value="business">Business</option>
                    <option value="first">First</option>
                  </SelectField>
                </div>
                <TextField
                  label="Preferred airline"
                  required={false}
                  placeholder="e.g. Kenya Airways"
                  {...register("preferredAirline")}
                  error={errors.preferredAirline?.message}
                />
                <TextAreaField
                  label="Baggage or special requirements"
                  placeholder="Extra bags, sports equipment, wheelchair assistance…"
                  {...register("baggageNotes")}
                  error={errors.baggageNotes?.message}
                />
              </fieldset>
            ) : null}

            {service === "hotels" ? (
              <fieldset className="space-y-5 border-t border-parchment pt-5">
                <legend className="eyebrow pt-5 text-ochre">Stay preferences</legend>
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextField
                    label="Rooms"
                    type="number"
                    min={1}
                    max={50}
                    inputMode="numeric"
                    {...register("rooms")}
                    error={errors.rooms?.message}
                  />
                  <SelectField
                    label="Hotel category"
                    {...register("hotelCategory")}
                    error={errors.hotelCategory?.message}
                  >
                    <option value="any">Open to suggestions</option>
                    <option value="value">Value</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="premium">Premium</option>
                  </SelectField>
                  <SelectField label="Meal plan" {...register("mealPlan")} error={errors.mealPlan?.message}>
                    <option value="any">Open to suggestions</option>
                    <option value="room-only">Room only</option>
                    <option value="bed-breakfast">Bed & breakfast</option>
                    <option value="half-board">Half board</option>
                    <option value="full-board">Full board</option>
                    <option value="all-inclusive">All-inclusive</option>
                  </SelectField>
                </div>
                <TextField
                  label="Room configuration"
                  required={false}
                  placeholder="e.g. 1 double + 1 twin for the kids"
                  {...register("roomConfiguration")}
                  error={errors.roomConfiguration?.message}
                />
                <TextField
                  label="Preferred area"
                  required={false}
                  placeholder="e.g. Westlands, near the beach, close to the venue"
                  {...register("preferredArea")}
                  error={errors.preferredArea?.message}
                />
              </fieldset>
            ) : null}

            {service === "safari" || service === "holiday-package" || service === "transport" ? (
              <fieldset className="space-y-5 border-t border-parchment pt-5">
                <legend className="eyebrow pt-5 text-ochre">Trip preferences</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Road or fly-in?"
                    {...register("accessPreference")}
                    error={errors.accessPreference?.message}
                  >
                    <option value="either">Either — advise me</option>
                    <option value="road">By road</option>
                    <option value="fly-in">Fly-in</option>
                  </SelectField>
                  <SelectField
                    label="Accommodation style"
                    {...register("accommodationStyle")}
                    error={errors.accommodationStyle?.message}
                  >
                    <option value="not-sure">Not sure yet</option>
                    <option value="tented-camp">Tented camp</option>
                    <option value="lodge">Safari lodge</option>
                    <option value="conservancy">Conservancy camp</option>
                    <option value="mixed">A mix</option>
                  </SelectField>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-bold">What should we include?</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <CheckboxField label="Flights" {...register("includeFlights")} />
                    <CheckboxField label="Hotel or camp" {...register("includeAccommodation")} />
                    <CheckboxField label="Airport transfers" {...register("includeTransfers")} />
                    <CheckboxField label="Daily transport" {...register("includeDailyTransport")} />
                  </div>
                </fieldset>
                <TextAreaField
                  label="Tours and activities you'd like"
                  placeholder="Game drives, balloon safari, snorkelling…"
                  {...register("activities")}
                  error={errors.activities?.message}
                />
                <TextField
                  label="Special occasion"
                  required={false}
                  placeholder="Honeymoon, birthday, anniversary…"
                  {...register("specialOccasion")}
                  error={errors.specialOccasion?.message}
                />
              </fieldset>
            ) : null}

            {service === "corporate" || service === "group" ? (
              <fieldset className="space-y-5 border-t border-parchment pt-5">
                <legend className="eyebrow pt-5 text-ochre">
                  {service === "corporate" ? "Organisation details" : "Group details"}
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Organisation name"
                    required={false}
                    {...register("organisationName")}
                    error={errors.organisationName?.message}
                  />
                  <TextField
                    label="Approximate group size"
                    placeholder="e.g. 25 travellers"
                    {...register("groupSize")}
                    error={errors.groupSize?.message}
                  />
                </div>
                <TextField
                  label="Purpose of travel"
                  required={false}
                  placeholder="Conference, school trip, retreat, pilgrimage…"
                  {...register("travelPurpose")}
                  error={errors.travelPurpose?.message}
                />
                <TextField
                  label="Departure points"
                  required={false}
                  hint="Travelling from more than one city? List them here."
                  {...register("departurePoints")}
                  error={errors.departurePoints?.message}
                />
                {service === "corporate" ? (
                  <TextAreaField
                    label="Billing requirements"
                    placeholder="Invoicing needs, PO numbers, approval steps…"
                    {...register("billingRequirements")}
                    error={errors.billingRequirements?.message}
                  />
                ) : null}
                <TextAreaField
                  label="Coordination requirements"
                  placeholder="Rooming lists, meal requirements, equipment…"
                  {...register("coordinationNotes")}
                  error={errors.coordinationNotes?.message}
                />
              </fieldset>
            ) : null}

            <div className="grid gap-5 border-t border-parchment pt-5 sm:grid-cols-2">
              <TextField
                label="Accessibility requirements"
                required={false}
                {...register("accessibilityNeeds")}
                error={errors.accessibilityNeeds?.message}
              />
              <TextField
                label="Dietary requirements"
                required={false}
                {...register("dietaryNeeds")}
                error={errors.dietaryNeeds?.message}
              />
            </div>
          </>
        ) : null}

        {/* ---------------------------------------------------------- step 6 */}
        {step.id === "contact" ? (
          <>
            <TextField
              label="Full name"
              autoComplete="name"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="WhatsApp / phone number"
                type="tel"
                autoComplete="tel"
                placeholder="+254 7XX XXX XXX"
                {...register("whatsapp")}
                error={errors.whatsapp?.message}
              />
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
            <SelectField
              label="Preferred contact method"
              {...register("preferredContact")}
              error={errors.preferredContact?.message}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone call</option>
              <option value="email">Email</option>
            </SelectField>
            <TextAreaField
              label="Anything else we should know?"
              placeholder="Anything that helps us plan well."
              {...register("notes")}
              error={errors.notes?.message}
            />
            <CheckboxField
              label="I agree to be contacted about this enquiry. My details are used only to respond to it — see the Privacy Policy."
              {...register("consent")}
              error={errors.consent?.message}
            />
          </>
        ) : null}

        {/* ---------------------------------------------------------- step 7 */}
        {step.id === "review" ? (
          <ReviewSummary values={getValues()} onEdit={goToStep} />
        ) : null}
      </div>

      {submitState.status === "error" ? (
        <div role="alert" className="mt-6 border-l-2 border-clay bg-ochre/10 px-4 py-3">
          <p className="text-sm font-semibold text-clay">{submitState.message}</p>
        </div>
      ) : null}

      {/* Navigation */}
      <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-parchment pt-6">
        {stepIndex > 0 ? (
          <Button variant="outline" onClick={back}>
            <ChevronLeft aria-hidden className="size-4" /> Back
          </Button>
        ) : null}
        {step.id !== "review" ? (
          <Button onClick={next} size="lg">
            {stepIndex === 0 ? "Start my enquiry" : "Continue"}
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={submitState.status === "submitting"}>
            {submitState.status === "submitting" ? "Sending…" : "Send enquiry for review"}
          </Button>
        )}
        <p className="w-full text-xs text-stone sm:ml-auto sm:w-auto">
          An enquiry, not a booking — a consultant replies with current options.
        </p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function ReviewSummary({
  values,
  onEdit,
}: {
  values: QuoteFormValues;
  onEdit: (stepIndex: number) => void;
}) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Service", value: SERVICE_LABELS[values.service], step: 0 },
    {
      label: "Destination",
      value: values.destination + (values.flexibleDestination ? " (flexible)" : ""),
      step: 1,
    },
    ...(values.departureCity
      ? [{ label: "From", value: values.departureCity, step: 1 }]
      : []),
    {
      label: "Dates",
      value: values.flexibleDates
        ? `Flexible${values.departureDate ? ` — around ${values.departureDate}` : ""}`
        : `${values.departureDate}${values.returnDate ? ` → ${values.returnDate}` : ""}`,
      step: 2,
    },
    {
      label: "Travellers",
      value: `${values.adults} adult(s)${values.children ? `, ${values.children} child(ren)` : ""}${
        values.infants ? `, ${values.infants} infant(s)` : ""
      } · ${TRAVELLER_TYPE_LABELS[values.travellerType]}`,
      step: 3,
    },
    {
      label: "Style & budget",
      value: `${STYLE_LABELS[values.style]} · ${BUDGET_LABELS[values.budget]}`,
      step: 4,
    },
    {
      label: "Contact",
      value: `${values.fullName} · ${values.email} · ${values.whatsapp} (prefers ${values.preferredContact})`,
      step: 5,
    },
  ];

  return (
    <div>
      <p className="text-sm leading-relaxed text-ink-soft">
        Check everything looks right. Sending this creates an{" "}
        <strong className="text-ink">enquiry for a consultant to review</strong> — it does not
        reserve or purchase anything.
      </p>
      <dl className="mt-6 divide-y divide-parchment border-y border-parchment">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_1fr_auto] sm:gap-4">
            <dt className="text-sm font-bold">{row.label}</dt>
            <dd className="text-sm text-ink-soft">{row.value}</dd>
            <dd>
              <button
                type="button"
                onClick={() => onEdit(row.step)}
                className="text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
              >
                Edit<span className="sr-only"> {row.label}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
