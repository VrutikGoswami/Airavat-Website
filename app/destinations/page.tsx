import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { DestinationExplorer } from "@/components/destination/DestinationExplorer";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Kenyan destinations by traveller type, experience and travel month — from the Maasai Mara to the Indian Ocean coast. Every destination leads to a personal quotation, not a booking engine.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        image="/images/mara-plains.jpg"
        imageAlt="Open savannah with wildebeest and acacia trees"
        eyebrow="Destinations"
        title="Explore Kenya by trip style"
        lede="Start with safari, beach, city or a short escape. If your place is not listed yet, send an enquiry and we will advise."
      />
      <section className="container-site py-14 sm:py-20">
        <DestinationExplorer destinations={destinations} />
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
