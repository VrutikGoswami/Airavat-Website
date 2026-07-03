const steps = [
  {
    title: "Tell us what you need",
    body: "Use the planner, the quote form or WhatsApp — rough ideas are fine. “Somewhere with animals in August, two adults, mid-range” is a perfectly good brief.",
  },
  {
    title: "A consultant reviews your request",
    body: "A named person reads it the way a travel planner would: what you asked for, and what you will actually need alongside it.",
  },
  {
    title: "We prepare current options",
    body: "Fares, rooms and camp availability are checked with airlines and suppliers at that moment — then presented as clear options with honest trade-offs.",
  },
  {
    title: "You choose what fits",
    body: "Ask questions, adjust dates, mix and match. Nothing is committed while you decide.",
  },
  {
    title: "We confirm after payment and supplier confirmation",
    body: "Only when you approve an option, payment is made as agreed, and each supplier confirms in writing does anything become a booking.",
  },
  {
    title: "You receive your travel documents",
    body: "Tickets, vouchers and a contact who already knows your trip if anything changes along the way.",
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
