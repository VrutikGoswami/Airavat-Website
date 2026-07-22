import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/editorial/PageHero";
import { GuidedQuoteForm } from "@/components/forms/GuidedQuoteForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NoBookingNote } from "@/components/editorial/NoBookingNote";
import { ResponseTimeNote } from "@/components/editorial/ResponseTimeNote";
import { getRateDestinations } from "@/lib/rate-catalog";

export const metadata: Metadata = {
  title: "Request a Travel Quote",
  description:
    "Start a short travel enquiry for flights, hotels, safaris, groups or holidays. A consultant replies with current options.",
};

export default async function RequestAQuotePage() {
  const hotelDestinations = await getRateDestinations();
  return (
    <>
      <PageHero
        image="/images/itinerary-nairobi-mara.jpg"
        imageAlt="Nairobi skyline giving way to savannah at dusk"
        eyebrow="Request a quote"
        title="Start a 2-minute enquiry."
        lede="Tell us the basics. We will reply with current options for your dates and budget."
        size="compact"
      />

      <section className="container-site grid gap-14 py-14 sm:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div className="max-w-2xl">
          <Suspense fallback={<div className="h-96 animate-pulse bg-sand" aria-hidden />}>
            <GuidedQuoteForm hotelDestinations={hotelDestinations} />
          </Suspense>
        </div>

        <aside className="space-y-8 lg:pt-2">
          <div className="border border-parchment bg-sand/50 p-6">
            <h2 className="font-bold">What happens next</h2>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>We review your request.</li>
              <li>We send current options.</li>
              <li>You approve before anything is booked.</li>
            </ol>
            <ResponseTimeNote className="mt-5 border-t border-parchment pt-4" />
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
          <NoBookingNote variant="card" />
        </aside>
      </section>
    </>
  );
}
