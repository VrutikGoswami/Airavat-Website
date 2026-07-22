import type { Metadata } from "next";
import { Clock, ShieldCheck } from "lucide-react";
import { flightRoutes } from "@/data/flight-routes";
import { FlightRouteExplorer } from "@/components/flights/FlightRouteExplorer";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FlightFinder } from "@/components/flights/FlightFinder";

export const metadata: Metadata = {
  title: "Flight Finder — Routes from Kenya",
  description:
    "Browse the flight routes Airavat arranges from Nairobi and Mombasa — India, Dubai, London, the Middle East, Asia and the Indian Ocean. Get a price in two minutes, with a clear quotation before you commit.",
};

export default function FlightsPage() {
  return (
    <>
      <PageHero
        image="/images/service-flights.jpg"
        imageAlt="Aircraft wing above the clouds at sunset"
        eyebrow="Flight finder"
        title="Book a flight in 2 minutes"
        lede="Tell us where you're headed and a consultant sends real fares — usually within hours. You approve a quotation before anything is booked. No call centres, no waiting."
        size="standard"
      >
        <ButtonLink href="/request-a-quote?service=flights" size="lg">
          Book a flight in 2 minutes
        </ButtonLink>
        <WhatsAppButton trackingSource="flights-hero" variant="light" size="lg" label="Chat on WhatsApp" />
      </PageHero>

      <section className="border-b border-parchment bg-sand/40">
        <div className="container-site grid gap-6 py-8 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-ochre" />
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-bold text-ink">The fastest team you&apos;ll deal with.</span>{" "}
              Send an enquiry and get options back fast — most quotations within hours, not days.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-ochre" />
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-bold text-ink">A quotation before you commit.</span> We confirm
              fares, baggage and timings in writing first — you only pay once you&apos;re happy.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-parchment bg-ivory">
        <div className="container-site py-10 sm:py-12">
          <p className="eyebrow text-ochre">Flight finder</p>
          <h2 className="display-serif mt-2 text-3xl text-ink sm:text-4xl">Where are you flying?</h2>
          <div className="mt-6">
            <FlightFinder submitLabel="Continue" />
          </div>
        </div>
      </section>

      <section className="container-site py-14 sm:py-20">
        <SectionHeading
          eyebrow="Popular routes"
          title="Pick a route, get a price"
          lede="These are routes we arrange most often. Tap “Get a price” and we prefill your enquiry — you just add passengers, dates and any baggage or airline preferences."
        />
        <div className="mt-10">
          <FlightRouteExplorer routes={flightRoutes} />
        </div>
        <p className="mt-8 text-sm text-ink-soft">
          Flying somewhere not listed? We arrange flights worldwide —{" "}
          <a
            href="/request-a-quote?service=flights"
            className="font-semibold text-ochre hover:text-clay"
          >
            start a flight enquiry
          </a>{" "}
          and tell us your route.
        </p>
      </section>

      <EditorialCTA
        title="Know where you're going? Let's price it."
        body="Start a two-minute flight enquiry or message us on WhatsApp — either way you get real fares and a clear quotation before you commit."
        primaryLabel="Book a flight in 2 minutes"
        primaryHref="/request-a-quote?service=flights"
        whatsappContext="I would like flight options."
        trackingSource="flights-cta"
      />
    </>
  );
}
