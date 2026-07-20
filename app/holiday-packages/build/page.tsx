import type { Metadata } from "next";
import { TripBuilder } from "@/components/packages/TripBuilder";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";

export const metadata: Metadata = {
  title: "Build Your Own Trip",
  description:
    "Plan a custom multi-stop holiday — choose your destinations, how you travel, dates and who's coming. We turn it into a complete quotation, fast, with a clear price before you commit.",
};

export default async function BuildTripPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const destinationParam = params.destination;
  const initialDestination = Array.isArray(destinationParam) ? destinationParam[0] : destinationParam;

  return (
    <>
      <PageHero
        image="/images/itinerary-coast.jpg"
        imageAlt="Coastline meeting turquoise water from above"
        eyebrow="Build your own trip"
        title="Your trip, your way — planned by us"
        lede="Tell us the stops, how you'd like to travel and who's coming. A consultant shapes the whole thing and sends a clear quotation — usually within hours."
        size="compact"
      />
      <section className="container-site max-w-3xl py-14 sm:py-20">
        <TripBuilder initialDestination={initialDestination} />
      </section>
      <EditorialCTA
        title="Prefer to talk it through?"
        body="Message us on WhatsApp with your rough idea and we'll build the plan with you."
        primaryLabel="Browse ready-made packages"
        primaryHref="/holiday-packages"
        whatsappContext="I'd like to plan a custom trip."
        trackingSource="trip-builder-cta"
      />
    </>
  );
}
