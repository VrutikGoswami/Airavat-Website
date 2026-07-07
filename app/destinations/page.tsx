import type { Metadata } from "next";
import { destinationListings } from "@/data/travel-content";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationsExplorer } from "@/components/destination/DestinationsExplorer";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Kenyan and international destinations by region and experience — safari, beach or city — from the Maasai Mara to the Indian Ocean coast. Every destination leads to a personal quotation, not a booking engine.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        image="/images/mara-plains.jpg"
        imageAlt="Open savannah with wildebeest and acacia trees"
        eyebrow="Destinations"
        title="Kenyan and international trips Airavat can arrange"
        lede="Use the listed destinations as starting points. Only destinations with full editorial content get their own page; the rest open a focused enquiry."
      />
      <section className="container-site py-14 sm:py-20">
        <SectionHeading
          eyebrow="Browse destinations"
          title="Filter by experience, then tell us the trip"
          lede="Pick safari, beach or city — or browse everything by region. Flights, hotels, safaris, transport and complete holidays can be combined in one shared enquiry."
        />
        <div className="mt-10">
          <DestinationsExplorer listings={destinationListings} />
        </div>
      </section>
      <EditorialCTA
        title="Don't see your destination? We probably still arrange it."
        body="International holidays, regional business trips and multi-country itineraries are all normal requests. Tell us where you're headed."
        primaryLabel="Request a travel quote"
        primaryHref="/request-a-quote"
        whatsappContext="I would like to ask about a destination."
        trackingSource="destinations-cta"
      />
    </>
  );
}
