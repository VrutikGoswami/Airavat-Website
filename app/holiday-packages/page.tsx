import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Ready-made and fully custom holidays from Kenya — safari, beach and international breaks. Browse sample packages or build your own multi-stop trip, with a clear quotation before you commit.",
};

/**
 * Placeholder sample packages until the company supplies the real catalogue.
 * Each is clearly labelled as a starting point that a consultant tailors.
 */
const samplePackages = [
  {
    title: "Maasai Mara & Diani",
    eyebrow: "Safari + beach · ~7 nights",
    summary: "Big-cat country then the south coast — the classic Kenyan combination, fly-in or by road.",
    destination: "Maasai Mara, then Diani",
  },
  {
    title: "Amboseli & Mombasa",
    eyebrow: "Safari + beach · ~6 nights",
    summary: "Elephants under Kilimanjaro, then north-coast resorts. Easy pairing for families.",
    destination: "Amboseli, then Mombasa",
  },
  {
    title: "Dubai City Break",
    eyebrow: "International · ~5 nights",
    summary: "Flights, hotel and transfers for shopping, theme parks and desert experiences.",
    destination: "Dubai",
  },
  {
    title: "Zanzibar Beach Escape",
    eyebrow: "Indian Ocean · ~5 nights",
    summary: "Flights and a beachfront stay on the spice island — honeymoons and family holidays.",
    destination: "Zanzibar",
  },
  {
    title: "Naivasha Weekend",
    eyebrow: "Rift Valley · ~2 nights",
    summary: "A quick reset — boat rides, Hell's Gate and a lakeside lodge, close to Nairobi.",
    destination: "Naivasha",
  },
  {
    title: "Mauritius Honeymoon",
    eyebrow: "International · ~7 nights",
    summary: "Island luxury with flights, transfers and a hand-picked resort for special occasions.",
    destination: "Mauritius",
  },
];

export default function HolidayPackagesPage() {
  return (
    <>
      <PageHero
        image="/images/itinerary-mara.jpg"
        imageAlt="Safari vehicle on the plains at golden hour"
        eyebrow="Holiday packages"
        title="Ready-made holidays, or build your own"
        lede="Start from a sample package below, or design a trip from scratch. Either way you get a clear quotation before anything is confirmed — and we move fast."
        size="standard"
      >
        <ButtonLink href="/holiday-packages/build" size="lg">
          Build your own trip
        </ButtonLink>
        <ButtonLink href="#samples" size="lg" variant="light">
          Browse sample packages
        </ButtonLink>
      </PageHero>

      {/* Build-your-own highlight */}
      <section className="border-b border-parchment bg-forest text-cream">
        <div className="container-site flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Compass aria-hidden className="mt-1 size-8 shrink-0 text-gold" />
            <div>
              <h2 className="display-serif text-2xl sm:text-3xl">Have something specific in mind?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/85">
                Choose your stops, how you travel, dates and travellers. Our trip builder gives us
                everything we need to plan the whole holiday and quote it quickly.
              </p>
            </div>
          </div>
          <ButtonLink href="/holiday-packages/build" variant="primary" size="lg" className="shrink-0">
            Start building
          </ButtonLink>
        </div>
      </section>

      {/* Sample packages */}
      <section id="samples" className="container-site scroll-mt-24 py-14 sm:py-20">
        <SectionHeading
          eyebrow="Sample packages"
          title="Starting points we tailor to you"
          lede="These are examples to spark ideas — every package is adjusted to your dates, budget and travellers before we quote. Our full seasonal catalogue is on the way."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {samplePackages.map((pkg) => (
            <article key={pkg.title} className="flex flex-col border border-parchment bg-ivory p-6">
              <p className="eyebrow text-[10px] text-stone">{pkg.eyebrow}</p>
              <h3 className="display-serif mt-1 text-2xl text-ink">{pkg.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{pkg.summary}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/request-a-quote?service=holiday-package&destination=${encodeURIComponent(pkg.destination)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ochre hover:text-clay"
                >
                  Enquire about this <ArrowRight aria-hidden className="size-4" />
                </Link>
                <Link
                  href={`/holiday-packages/build?destination=${encodeURIComponent(pkg.destination)}`}
                  className="text-sm font-semibold text-ink-soft underline decoration-parchment underline-offset-4 hover:text-clay"
                >
                  Customise it
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 rounded-[3px] border border-parchment bg-cream/60 px-4 py-3 text-xs text-ink-soft">
          Sample itineraries and prices are illustrative starting points, not fixed products. A
          consultant confirms current availability and a full quotation before you commit.
        </p>
      </section>

      <EditorialCTA
        title="Tell us your idea — we'll shape the trip"
        body="Ready-made or fully custom, you get real options and a clear quotation before anything is booked."
        primaryLabel="Build your own trip"
        primaryHref="/holiday-packages/build"
        whatsappContext="I would like help planning a holiday package."
        trackingSource="packages-cta"
      />
    </>
  );
}
