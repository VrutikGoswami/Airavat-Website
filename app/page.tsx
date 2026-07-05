import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveCampaign } from "@/config/campaigns";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { faqs } from "@/data/faqs";
import { itineraryIdeas } from "@/data/itineraries";
import { getMapPoints, kenyaOverviewPointIds } from "@/data/map-points";
import { services } from "@/data/services";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { FAQAccordion } from "@/components/editorial/FAQAccordion";
import { ProcessTimeline } from "@/components/editorial/ProcessTimeline";
import { ServiceIndex } from "@/components/editorial/ServiceIndex";
import { TrustStatement } from "@/components/editorial/TrustStatement";
import { DestinationExplorer } from "@/components/destination/DestinationExplorer";
import { ItineraryCard } from "@/components/destination/ItineraryCard";
import { LazyKenyaMapPreview } from "@/components/map/LazyMaps";

export const metadata: Metadata = {
  title: "Tours & Travel from Nairobi — Flights, Safaris, Hotels & Holidays",
  description:
    "Kenya-based travel consultants arranging flights, hotels, Maasai Mara safaris, transport and complete holidays. Tell us what you need and receive current options — assisted planning, not a booking engine.",
};

const homepageFaqIds = [
  "live-booking",
  "quotation-process",
  "flights-and-hotels-together",
  "group-travel",
  "transport-from-nairobi",
  "wildlife-guarantee",
  "visas",
  "booking-confirmed",
];

export default function HomePage() {
  const campaign = getActiveCampaign();
  const mara = destinations.find((d) => d.slug === "maasai-mara")!;
  const kenyaPoints = getMapPoints(kenyaOverviewPointIds);
  const homepageFaqs = homepageFaqIds
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative flex min-h-svh items-end overflow-hidden bg-forest-deep text-cream">
        <Image
          src={campaign?.image ?? mara.heroImage}
          alt="Savannah plains at dusk with acacia trees and wildebeest"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/30" />

        <div className="container-site relative pb-24 pt-40 sm:pb-28">
          <div className="max-w-3xl">
            {campaign ? (
              <p className="eyebrow rise-in inline-flex bg-[#f6b36f]/75 px-3 py-2 text-ink backdrop-blur">
                {campaign.label} · Maasai Mara
              </p>
            ) : (
              <p className="eyebrow rise-in text-gold">Kenya-based travel consultants</p>
            )}
            <h1 className="display-serif rise-in mt-4 text-4xl leading-[1.03] sm:text-6xl xl:text-7xl text-balance">
              The Mara is calling. We&rsquo;ll plan the rest.
            </h1>
            <p className="rise-in-late mt-6 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
              Custom safari arrangements, flights, hotels, transport and complete travel
              coordination — from one local team that answers when you call.
            </p>
            <p className="display-serif rise-in-late mt-6 max-w-2xl text-3xl leading-tight text-cream sm:text-5xl">
              Best prices, easiest process.
            </p>
            <div className="rise-in-late mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={campaign?.primaryCta.href ?? "/destinations/maasai-mara"}
                size="lg"
              >
                {campaign?.primaryCta.label ?? "Plan a Maasai Mara safari"}
              </ButtonLink>
              <ButtonLink href="#services" variant="light" size="lg">
                Explore all travel services
              </ButtonLink>
            </div>
            {campaign ? (
              <p className="rise-in-late mt-6 max-w-xl text-xs leading-relaxed text-cream/70">
                {campaign.disclaimer}{" "}
                <Link href="/faq" className="underline underline-offset-2 hover:text-gold">
                  How our planning works
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- seasonal Mara feature */}
      {campaign ? (
        <section className="bg-forest text-cream">
          <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:py-28">
            <div className="img-frame relative order-2 min-h-72 lg:order-1 lg:min-h-full">
              <Image
                src="/images/mara-plains.jpg"
                alt="Wildebeest herd crossing open Mara plains"
                fill
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 lg:py-6">
              <p className="eyebrow inline-flex bg-[#f6b36f]/75 px-3 py-2 text-ink backdrop-blur">
                {campaign.label} · Maasai Mara
              </p>
              <h2 className="display-serif mt-3 text-3xl sm:text-4xl lg:text-5xl text-balance">
                {campaign.headline}
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-cream/85 sm:text-base">
                <p>
                  Between July and October, migration activity generally moves through the Mara:
                  long columns on the plains, tension at the river, and predators never far
                  behind. It is the busiest and most spectacular window of the Kenyan year.
                </p>
                <p>
                  We arrange the whole trip around your dates — road safari or fly-in from
                  Wilson Airport, tented camp or lodge, park logistics, and the Nairobi nights
                  either side. Balloon flights, photographic vehicles and family-friendly camps
                  can all be built in.
                </p>
                <p className="text-xs text-cream/60">{campaign.disclaimer} Current pricing and
                  accommodation availability are confirmed by a consultant before you commit.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/destinations/maasai-mara#map" variant="light">
                  View the Mara map
                </ButtonLink>
                <ButtonLink
                  href={`/request-a-quote?service=safari&destination=maasai-mara`}
                  variant="primary"
                >
                  Request current availability
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------- Kenya map */}
      <section className="container-site py-16 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow="Kenya at a glance"
          title="Where trips begin"
          lede="Nairobi is the hub; the Mara is the headline. Select a place to see how it fits into a trip — every location is also listed for screen readers and slow connections."
        />
        <div className="mt-10">
          <LazyKenyaMapPreview points={kenyaPoints} />
        </div>
      </section>

      {/* ------------------------------------------------------- discovery */}
      <section className="container-site py-16 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow="Destination discovery"
          title="Browse by who you are and when you can travel"
          lede="Filter our starting list by traveller type, experience or month. If your destination isn't listed yet, the enquiry form covers anywhere we can reach."
        />
        <div className="mt-10">
          <DestinationExplorer destinations={destinations} experiences={experiences} />
        </div>
      </section>

      {/* -------------------------------------------------------- services */}
      <section id="services" className="bg-sand/60">
        <div className="container-site py-16 sm:py-20 lg:py-24">
          <SectionHeading
            eyebrow="Services"
            title="Eight ways we can carry the logistics"
            lede="Every service is handled by the same small team and links into one quotation — mix as many as your trip needs."
          />
          <div className="mt-12">
            <ServiceIndex services={services} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- process */}
      <section className="bg-forest-deep text-cream">
        <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-28">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="Assisted planning, step by step"
              lede="Clear stages, no surprises — and nothing becomes a booking without your explicit approval."
              tone="dark"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/request-a-quote">Request a travel quote</ButtonLink>
              <WhatsAppButton trackingSource="process-section" variant="light" />
            </div>
          </div>
          <div className="[&_li]:border-cream/15 [&_h3]:text-cream [&_p]:text-cream-soft [&_.text-ochre]:text-gold">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- itineraries */}
      <section className="container-site py-16 sm:py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Trip ideas"
            title="Starting points, not set menus"
            lede="Every idea below is editable — duration, camps, budget and pace. Prices are quoted fresh for your dates."
          />
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {itineraryIdeas.slice(0, 3).map((idea) => (
            <li key={idea.slug}>
              <ItineraryCard idea={idea} />
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------- trust */}
      <section className="rule-top">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            eyebrow="Why book with a consultant"
            title="What you can actually hold us to"
            lede="No invented awards or review scores — just the way we work, stated plainly."
          />
          <div className="mt-12">
            <TrustStatement />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Questions"
            title="Asked before you ask"
            lede="The essentials of how assisted booking works."
          />
          <ButtonLink href="/faq" variant="outline" className="mt-8">
            All questions & answers
          </ButtonLink>
        </div>
        <FAQAccordion items={homepageFaqs} />
      </section>

      {/* ------------------------------------------------------- final CTA */}
      <EditorialCTA
        eyebrow="Ready when you are"
        title="Tell us where you're pointing. We'll handle the moving parts."
        body="Send a quotation request or start the conversation on WhatsApp — either way, a consultant replies with real, current options and a clear next step."
        primaryLabel="Request a travel quote"
        primaryHref="/request-a-quote"
        whatsappContext="I would like help planning a trip."
        trackingSource="homepage-final-cta"
      />
    </>
  );
}
