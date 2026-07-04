import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
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
        title="Start with a place, or start with a feeling"
        lede="Our destination list is a starting point, not a limit — we arrange travel across Kenya, East Africa and internationally. Filter below, or tell us what you're imagining and we'll suggest where it lives."
      />
      <section className="container-site py-14 sm:py-20">
        <DestinationExplorer destinations={destinations} experiences={experiences} />
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
