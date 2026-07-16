import type { Metadata } from "next";
import { rateDestinations } from "@/data/rates";
import { RateFinder } from "@/components/rates/RateFinder";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";

export const metadata: Metadata = {
  title: "Hotel & Camp Rates",
  description:
    "Check East African resident rates for safari camps and lodges by destination and travel dates — full-board prices per room, with seasonal pricing shown honestly.",
};

export default function HotelRatesPage() {
  const destinations = rateDestinations();

  return (
    <>
      <PageHero
        image="/images/service-hotels.jpg"
        imageAlt="Safari lodge room overlooking the savannah"
        eyebrow="Rates"
        title="Camp and lodge rates for your dates"
        lede="Pick a destination and your travel dates to see full-board resident rates for every property we hold contracts with — including how seasons change the price."
        size="compact"
      />
      <section className="container-site max-w-5xl py-14 sm:py-20">
        <RateFinder destinations={destinations} />
      </section>
      <EditorialCTA
        title="Found a rate that works?"
        body="Send an enquiry with your dates and a consultant confirms availability and holds space — no payment needed to ask."
        primaryLabel="Request a quote"
        primaryHref="/request-a-quote?service=hotels"
        whatsappContext="I checked hotel rates on your website and would like to enquire."
        trackingSource="hotel-rates-cta"
      />
    </>
  );
}
