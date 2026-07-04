import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/editorial/PageHero";
import { GuidedQuoteForm } from "@/components/forms/GuidedQuoteForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Request a Travel Quote",
  description:
    "Tell us what you need — flights, hotels, safaris, transport or a complete holiday — and a travel consultant will reply with current options and prices. An enquiry, not a booking.",
};

export default function RequestAQuotePage() {
  return (
    <>
      <PageHero
        image="/images/itinerary-nairobi-mara.jpg"
        imageAlt="Nairobi skyline giving way to savannah at dusk"
        eyebrow="Request a quote"
        title="Tell us the trip. We'll come back with real options."
        lede="Seven short steps, and “I'm not sure yet” is an acceptable answer to most of them. A consultant reviews every enquiry personally."
        size="compact"
      />

      <section className="container-site grid gap-14 py-14 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="max-w-2xl">
          <Suspense fallback={<div className="h-96 animate-pulse bg-sand" aria-hidden />}>
            <GuidedQuoteForm />
          </Suspense>
        </div>

        <aside className="space-y-8 lg:pt-2">
          <div className="border border-parchment bg-sand/50 p-6">
            <h2 className="font-bold">What happens next</h2>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Your enquiry reaches a travel consultant — a person, not a queue.</li>
              <li>We check current fares, rooms and availability with suppliers.</li>
              <li>You receive clear options to compare, usually with alternatives.</li>
              <li>Nothing is booked until you approve a quotation and payment is agreed.</li>
            </ol>
          </div>
          <div className="border border-parchment p-6">
            <h2 className="font-bold">Prefer to talk it through?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Some trips are easier to describe in a conversation. Start on WhatsApp and a
              consultant will ask the right questions.
            </p>
            <div className="mt-5">
              <WhatsAppButton trackingSource="quote-page-aside" variant="outline" />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone">
            Your details are used only to respond to this enquiry. We don&rsquo;t ask for passport
            or payment information at this stage — anyone who does, isn&rsquo;t us.
          </p>
        </aside>
      </section>
    </>
  );
}
