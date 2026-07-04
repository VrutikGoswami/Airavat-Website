import type { Metadata } from "next";
import { PageHero } from "@/components/editorial/PageHero";
import { companyConfig } from "@/config/company";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions",
  description:
    "Draft terms distinguishing enquiries, quotations, payments and confirmed bookings — including what is and isn't guaranteed in wildlife travel.",
};

const stages = [
  {
    term: "Enquiry",
    definition:
      "Information you send us through this website, WhatsApp, phone or email. An enquiry commits neither party to anything and no payment is taken.",
  },
  {
    term: "Quotation",
    definition:
      "A written set of options with prices, prepared by a consultant after checking current fares and availability. Prices and availability can change until a booking is confirmed by the supplier.",
  },
  {
    term: "Provisional option",
    definition:
      "A fare or room a supplier allows us to hold for a limited time without payment. Holds expire automatically and are never guaranteed.",
  },
  {
    term: "Payment",
    definition:
      "Made only against a quotation you have approved, using the methods stated in writing on that quotation. Payment does not by itself create a booking.",
  },
  {
    term: "Booking confirmation",
    definition:
      "Exists only when the airline, hotel or other supplier confirms to us in writing after payment. We then send you the confirmation documents.",
  },
  {
    term: "Ticket issuance",
    definition:
      "For flights, the point at which the airline ticket is issued. Airline fare rules apply from this moment, including change and cancellation conditions.",
  },
  {
    term: "Supplier confirmation",
    definition:
      "Every element of a trip (flight, room, vehicle, activity) is subject to the terms of the supplier providing it, in addition to these conditions.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        image="/images/service-corporate.jpg"
        imageAlt="City skyline at night"
        eyebrow="Legal"
        title="Terms & Booking Conditions"
        lede="Draft for review — to be finalised with professional legal advice before launch. Written to be read, not skimmed."
        size="compact"
      />
      <section className="container-site max-w-3xl py-14 sm:py-20">
        <div className="border-l-2 border-gold bg-gold/10 px-5 py-4 text-sm leading-relaxed">
          <strong>Draft status:</strong> editable placeholder wording requiring professional legal
          review. Bracketed values come from the central company configuration.
        </div>

        <h2 className="display-serif mt-12 text-2xl sm:text-3xl">The stages, defined</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Assisted booking has distinct stages. These definitions are the backbone of these terms:
        </p>
        <dl className="mt-8 divide-y divide-parchment border-y border-parchment">
          {stages.map((stage) => (
            <div key={stage.term} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="font-bold">{stage.term}</dt>
              <dd className="text-sm leading-relaxed text-ink-soft">{stage.definition}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-ink">
          <section>
            <h2>1. A form submission is not a booking</h2>
            <p className="mt-3">
              Nothing on this website reserves seats, rooms, vehicles or park entry. Submitting
              any form creates an enquiry for a consultant to review. {companyConfig.legalName} is not
              liable for travel arrangements assumed but never confirmed under the process above.
            </p>
          </section>
          <section>
            <h2>2. Prices and availability may change before confirmation</h2>
            <p className="mt-3">
              Quotations reflect supplier prices at the time they are prepared. Airlines and
              hotels reprice continuously; until payment is made and the supplier confirms, any
              element of a quotation may change or sell out. We will always tell you before asking
              you to proceed at a different price.
            </p>
          </section>
          <section>
            <h2>3. Supplier terms apply</h2>
            <p className="mt-3">
              Each airline, hotel, camp, transport operator and activity provider applies its own
              conditions, including baggage rules, check-in deadlines, minimum ages and liability
              limits. Those terms bind your booking alongside these conditions and we will share
              them with your travel documents.
            </p>
          </section>
          <section>
            <h2>4. Changes and cancellations vary</h2>
            <p className="mt-3">
              Change and cancellation rules differ by supplier, fare type and timing, and may
              involve fees or non-refundable amounts. The applicable rules are stated on each
              quotation. Contact your consultant as early as possible when plans change — earlier
              almost always means cheaper.
            </p>
          </section>
          <section>
            <h2>5. Visas and travel documents</h2>
            <p className="mt-3">
              Visa and entry decisions are made solely by the relevant authorities. We can point
              you to official application channels and list commonly required documents, but we
              cannot influence or guarantee any outcome, and we accept no liability for refused
              entry or missed travel caused by documentation issues.
            </p>
          </section>
          <section>
            <h2>6. Wildlife and natural events</h2>
            <p className="mt-3">
              Wildlife sightings, migration movements, river crossings and weather are natural
              events. No operator can guarantee them and we will never claim otherwise. Itinerary
              descriptions reflect typical patterns, not promises.
            </p>
          </section>
          <section>
            <h2>7. Placeholders to finalise before launch</h2>
            <p className="mt-3">
              Governing law and jurisdiction: [JURISDICTION]. Complaints process: [PROCESS].
              Payment terms and accepted methods: [PAYMENT METHODS]. Insurance requirements:
              [INSURANCE POLICY]. This document requires professional legal review before
              production use.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
