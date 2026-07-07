import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination, publishedDestinations } from "@/data/destinations";
import { getExperiences } from "@/data/experiences";
import { getFaqs } from "@/data/faqs";
import { getItineraries } from "@/data/itineraries";
import { getMapPoints } from "@/data/map-points";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FAQAccordion } from "@/components/editorial/FAQAccordion";
import { PageHero } from "@/components/editorial/PageHero";
import { ExperienceCard } from "@/components/destination/ExperienceCard";
import { ItineraryCard } from "@/components/destination/ItineraryCard";
import { MonthSeasonality } from "@/components/destination/MonthSeasonality";
import { LazyMaraMapExplorer } from "@/components/map/LazyMaps";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return publishedDestinations().map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return {};
  return {
    title: `${destination.name}, ${destination.country}`,
    description: destination.summary,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination || !destination.published) notFound();

  const experiences = getExperiences(destination.experienceIds);
  const itineraries = getItineraries(destination.itinerarySlugs);
  const mapPoints = getMapPoints(destination.mapPointIds);
  const destinationFaqs = getFaqs(destination.faqIds).slice(0, 3);
  const quoteHref = `/request-a-quote?service=safari&destination=${destination.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Destinations", item: "/destinations" },
      { "@type": "ListItem", position: 3, name: destination.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero
        image={destination.heroImage}
        imageAlt={`${destination.name} landscape`}
        eyebrow={destination.eyebrow}
        title={destination.name}
        lede={destination.summary}
        size="tall"
        priority
      >
        <ButtonLink href={quoteHref} size="lg">
          Plan this trip
        </ButtonLink>
        <WhatsAppButton
          trackingSource={`destination-${destination.slug}-hero`}
          context={`I would like help planning a ${destination.name} trip.`}
          variant="light"
          size="lg"
        />
      </PageHero>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-site pt-6">
        <ol className="flex flex-wrap gap-2 text-xs text-stone">
          <li>
            <Link href="/" className="hover:text-clay">Home</Link>
            <span aria-hidden> /</span>
          </li>
          <li>
            <Link href="/destinations" className="hover:text-clay">Destinations</Link>
            <span aria-hidden> /</span>
          </li>
          <li aria-current="page" className="font-semibold text-ink-soft">
            {destination.name}
          </li>
        </ol>
      </nav>

      <nav aria-label={`${destination.name} sections`} className="container-site pt-6">
        <ul className="flex flex-wrap gap-2 text-sm font-semibold">
          {[
            ["#overview", "Overview"],
            ["#when-to-go", "When to go"],
            ["#map", "Map"],
            ["#stays", "Stays"],
            ["#trip-ideas", "Trip ideas"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex rounded-[3px] border border-parchment px-3 py-2 hover:border-ochre hover:text-clay"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick planning facts */}
      <section id="overview" className="container-site scroll-mt-24 py-12 sm:py-16">
        <dl className="grid gap-x-10 gap-y-6 border-y border-parchment py-8 sm:grid-cols-2 lg:grid-cols-3">
          {destination.quickFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow text-[10px] text-ochre">{fact.label}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-stone">
          Planning guidance, not guarantees — travel times, fees and conditions are confirmed by a
          consultant for your dates.
        </p>
      </section>

      {/* Map */}
      <section id="map" className="rule-top scroll-mt-24">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            eyebrow="Orientation"
            title={`The ${destination.name} map`}
            lede="Select a place in the list or on the map to see how it fits your trip. Every location is also available as text below."
          />
          <div className="mt-10">
            <LazyMaraMapExplorer points={mapPoints} />
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="container-site grid gap-10 pb-16 sm:pb-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="The lay of the land" title={destination.headline} />
          <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ink-soft">
            {destination.narrative.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {destination.gallery.map((image, i) => (
            <div key={image} className={`img-frame relative ${i === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
              <Image
                src={image}
                alt={`${destination.name} scene ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal story */}
      {destination.seasonalStory ? (
        <section id="when-to-go" className="scroll-mt-24 bg-forest text-cream">
          <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Seasonality"
                title={destination.seasonalStory.title}
                tone="dark"
              />
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-cream/85 sm:text-base">
                {destination.seasonalStory.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
              <p className="mt-6 border-l-2 border-gold pl-4 text-xs leading-relaxed text-cream/70">
                {destination.seasonalStory.disclaimer}
              </p>
            </div>
            <div className="self-center bg-ivory p-6 text-ink sm:p-9">
              <h3 className="eyebrow text-ochre">When to go</h3>
              <div className="mt-6">
                <MonthSeasonality seasonality={destination.seasonality} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Experiences */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeading
          eyebrow="Experiences"
          title="Ways to spend your days"
          lede="Each of these can be built into your quotation — tell us which appeal and we'll plan around them."
        />
        <ul className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.slice(0, 4).map((experience) => (
            <li key={experience.id}>
              <ExperienceCard experience={experience} />
            </li>
          ))}
        </ul>
      </section>

      {/* Accommodation styles */}
      {destination.accommodationStyles.length > 0 ? (
        <section id="stays" className="scroll-mt-24 bg-sand/60">
          <div className="container-site py-16 sm:py-20">
            <SectionHeading
              eyebrow="Places to stay"
              title="Accommodation styles, not a fixed hotel list"
              lede="We match specific camps and lodges to your dates and budget at quotation time — availability in the Mara changes week to week."
            />
            <ul className="mt-12 grid gap-px overflow-hidden border border-parchment bg-parchment sm:grid-cols-2 lg:grid-cols-3">
              {destination.accommodationStyles.map((style) => (
                <li key={style.name} className="bg-ivory p-7">
                  <h3 className="display-serif text-xl">{style.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{style.description}</p>
                  <Link
                    href={`${quoteHref}&style=${encodeURIComponent(style.name)}`}
                    className="mt-4 inline-block text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
                  >
                    Enquire about {style.name.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Itinerary ideas */}
      {itineraries.length > 0 ? (
        <section id="trip-ideas" className="container-site scroll-mt-24 py-16 sm:py-20">
          <SectionHeading
            eyebrow="Itinerary ideas"
            title="Three ways this trip tends to take shape"
            lede="Ideas, not fixed packages — durations, camps and pace all flex around you."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((idea) => (
              <li key={idea.slug}>
                <ItineraryCard idea={idea} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* FAQ */}
      {destinationFaqs.length > 0 ? (
        <section className="bg-sand/60">
          <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Questions" title={`Planning ${destination.name}: asked often`} />
              <Link
                href="/faq"
                className="mt-6 inline-block text-sm font-semibold text-ochre underline underline-offset-4 hover:text-clay"
              >
                More questions → FAQ
              </Link>
            </div>
            <FAQAccordion items={destinationFaqs} />
          </div>
        </section>
      ) : null}

      {/* Planning CTA */}
      <section className="bg-forest-deep text-cream">
        <div className="container-site py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">Next step</p>
            <h2 className="display-serif mt-3 text-3xl sm:text-4xl lg:text-5xl">
              Ready to put dates on it?
            </h2>
            <p className="mt-5 leading-relaxed text-cream/85">
              Request current availability, tell us your accommodation preferences, or ask the
              road-versus-fly-in question — the quotation flow starts with {destination.name}{" "}
              already selected.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={quoteHref} size="lg">
                Request current availability
              </ButtonLink>
              <WhatsAppButton
                trackingSource={`destination-${destination.slug}-cta`}
                context={`I would like to discuss accommodation and travel options for ${destination.name}.`}
                variant="light"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
