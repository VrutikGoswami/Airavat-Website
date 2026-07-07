import type { Metadata } from "next";
import Link from "next/link";
import { destinationListings, enquiryHref } from "@/data/travel-content";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Kenyan destinations by traveller type, experience and travel month — from the Maasai Mara to the Indian Ocean coast. Every destination leads to a personal quotation, not a booking engine.",
};

export default function DestinationsPage() {
  const grouped = {
    Kenya: destinationListings.filter((destination) => destination.region === "Kenya"),
    International: destinationListings.filter((destination) => destination.region === "International"),
  };

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
          title="Choose the place, then tell us the trip"
          lede="Flights, hotels, safaris, transport and complete holidays can be combined in one shared enquiry."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {Object.entries(grouped).map(([region, destinations]) => (
            <section key={region} aria-labelledby={`${region.toLowerCase()}-destinations`}>
              <h2 id={`${region.toLowerCase()}-destinations`} className="display-serif text-3xl">
                {region}
              </h2>
              <div className="mt-5 grid gap-4">
                {destinations.map((destination) => (
                  <article key={destination.slug} className="border border-parchment bg-ivory p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-md">
                        <h3 className="font-bold">{destination.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {destination.summary}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-3">
                        {destination.published ? (
                          <Link
                            href={`/destinations/${destination.slug}`}
                            className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-clay"
                          >
                            View guide
                          </Link>
                        ) : null}
                        <ButtonLink
                          href={enquiryHref({
                            service: destination.service,
                            destination: destination.published
                              ? destination.slug
                              : destination.name,
                            origin: destination.name === "India" ? "Nairobi" : undefined,
                          })}
                          variant="ghost"
                          className="px-0 py-0"
                        >
                          Plan this trip
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
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
