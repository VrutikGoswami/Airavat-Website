import type { Metadata } from "next";
import { getRateDestinations } from "@/lib/rate-catalog";
import { RateFinder, type RateFinderInitial } from "@/components/rates/RateFinder";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";

export const metadata: Metadata = {
  title: "Hotel & Camp Rates",
  description:
    "Check hotel, camp and lodge rates across Kenya by destination and travel dates — resident and overseas prices per room, with seasonal pricing shown honestly.",
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Read a pre-seeded search from the URL (set by the home search widget). */
function readInitial(
  params: Record<string, string | string[] | undefined>,
  known: Set<string>,
): RateFinderInitial | undefined {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const destination = get("destination");
  const checkIn = get("checkIn");
  const checkOut = get("checkOut");
  if (!destination || !known.has(destination) || !checkIn || !checkOut) return undefined;
  if (!ISO.test(checkIn) || !ISO.test(checkOut)) return undefined;

  const adults = Number(get("adults"));
  const children = Number(get("children"));
  const market = get("market");
  return {
    destination,
    checkIn,
    checkOut,
    adults: Number.isFinite(adults) && adults > 0 ? adults : undefined,
    children: Number.isFinite(children) && children >= 0 ? children : undefined,
    market: market === "non-resident" ? "non-resident" : "east-african-resident",
  };
}

export default async function HotelRatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const destinations = await getRateDestinations();
  const initial = readInitial(await searchParams, new Set(destinations.map((d) => d.slug)));

  return (
    <>
      <PageHero
        image="/images/service-hotels.jpg"
        imageAlt="Safari lodge room overlooking the savannah"
        eyebrow="Rates"
        title="Camp and lodge rates for your dates"
        lede="Pick a destination, dates and guests to see the rates for every property we hold — resident or overseas, with seasons priced honestly. Select any rate to send it for confirmation."
        size="compact"
      />
      <section className="container-site max-w-6xl py-14 sm:py-20">
        <RateFinder destinations={destinations} initial={initial} />
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
