import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveCampaign } from "@/config/campaigns";
import { destinations } from "@/data/destinations";
import { rateDestinations } from "@/data/rates";
import { enquiryHref, popularRoutes, travelCategories } from "@/data/travel-content";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { RateFinder } from "@/components/rates/RateFinder";
import { CurrentOffers } from "@/components/editorial/CurrentOffers";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { ProcessTimeline } from "@/components/editorial/ProcessTimeline";
import { TrustStatement } from "@/components/editorial/TrustStatement";

export const metadata: Metadata = {
  title: "Tours & Travel from Nairobi — Flights, Safaris, Hotels & Holidays",
  description:
    "Kenya-based travel consultants arranging flights, hotels, Maasai Mara safaris, transport and complete holidays. Tell us what you need and receive current options — assisted planning, not a booking engine.",
};

export default function HomePage() {
  const campaign = getActiveCampaign();
  const mara = destinations.find((d) => d.slug === "maasai-mara")!;
  const hotelRateDestinations = rateDestinations();

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
              Flights, holidays and safaris planned by one local team.
            </h1>
            <p className="rise-in-late mt-6 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
              Nairobi-based consultants arranging flights, hotels, safaris, groups and complete
              holidays across Kenya and beyond.
            </p>
            <div className="rise-in-late mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/request-a-quote" size="lg">
                Start a 2-minute enquiry
              </ButtonLink>
              <WhatsAppButton trackingSource="homepage-hero" variant="light" size="lg" />
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

      {/* ------------------------------------------------ hotel rate finder */}
      <section id="hotel-rates" className="scroll-mt-20 bg-sand/60 lg:scroll-mt-24">
        <div className="container-site py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow text-ochre">Hotel rate finder</p>
            <h2 className="display-serif mt-2 text-3xl sm:text-4xl lg:text-5xl">
              Get hotel rates, quickly.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Choose your destination and dates to compare the hotel and camp rates we currently
              hold. Select any price to send that exact stay to our team for availability
              confirmation.
            </p>
          </div>
          <div className="mt-8 max-w-6xl">
            <RateFinder destinations={hotelRateDestinations} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- start here */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeading
          eyebrow="Start here"
          title="Pick a starting point, we'll shape the rest"
          lede="Each opens a short enquiry — a consultant then checks current airline, hotel, camp and transfer options for your dates."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {popularRoutes.map((route) => (
            <article key={route.id} className="border border-parchment bg-ivory p-6">
              <p className="eyebrow text-[10px] text-stone">{route.eyebrow}</p>
              <h3 className="display-serif mt-1 text-2xl">{route.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{route.summary}</p>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-ink-soft">
                {route.highlights.map((highlight) => (
                  <li key={highlight} className="border-l-2 border-gold/70 pl-3">
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={enquiryHref(route.enquiry)} className="w-full sm:w-auto">
                  {route.primaryAction}
                </ButtonLink>
                <WhatsAppButton
                  trackingSource={`popular-${route.id}`}
                  message={route.whatsappMessage}
                  label="WhatsApp"
                  variant="ghost"
                  className="w-full justify-start px-0 sm:w-auto"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-parchment pt-8">
          <p className="eyebrow text-stone">Or browse by need</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {travelCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group border border-parchment bg-ivory p-5 transition-colors hover:border-ochre hover:bg-cream"
              >
                <h3 className="font-bold group-hover:text-clay">{category.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{category.summary}</p>
              </Link>
            ))}
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
                  July to October is a popular window for Maasai Mara safaris, with migration
                  activity often moving through the reserve and nearby conservancies.
                </p>
                <p>
                  Tell us your dates, travellers and budget. We can shape a road or fly-in safari
                  with camp, lodge, transfers and activities.
                </p>
                <p className="text-xs text-cream/60">{campaign.disclaimer}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/destinations/maasai-mara#map" variant="light">
                  View the Mara map
                </ButtonLink>
                <ButtonLink
                  href={`/request-a-quote?service=safari&destination=maasai-mara`}
                  variant="primary"
                >
                  Plan Maasai Mara
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <CurrentOffers />

      {/* ----------------------------------------------------------- trust */}
      <section className="rule-top">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            eyebrow="Verified trust"
            title="What is confirmed"
            lede="Nairobi office, human travel consultants, and assistance by WhatsApp for flights, hotels, safaris and groups."
          />
          <div className="mt-12">
            <TrustStatement />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- process */}
      <section className="bg-forest-deep text-cream">
        <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading
            eyebrow="How booking starts"
            title="Send details. Receive options. Approve and confirm."
            lede="An enquiry is not a booking. Confirmation happens only after you approve a quotation."
            tone="dark"
          />
          <div className="[&_li]:border-cream/15 [&_h3]:text-cream [&_p]:text-cream-soft [&_.text-ochre]:text-gold">
            <ProcessTimeline />
          </div>
        </div>
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
