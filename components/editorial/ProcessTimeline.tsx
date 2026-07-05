const steps = [
  {
    title: "Tell us",
    body: "Share the service, destination, dates, travellers and budget in one short enquiry.",
  },
  {
    title: "We quote",
    body: "A consultant checks current options and sends clear choices for your approval.",
  },
  {
    title: "You confirm",
    body: "Nothing is booked until you approve the quotation and supplier availability is confirmed.",
  },
];

/** The assisted-planning process, presented as an editorial sequence. */
export function ProcessTimeline() {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => (
        <li key={step.title} className="group relative grid gap-2 border-t border-parchment py-7 sm:grid-cols-[6rem_1fr] sm:gap-8 lg:py-8">
          <p className="display-serif text-3xl text-ochre sm:text-4xl" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </p>
          <div>
            <h3 className="text-lg font-bold">{step.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
