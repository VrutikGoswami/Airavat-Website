import type { Metadata } from "next";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustStatement } from "@/components/editorial/TrustStatement";
import { companyConfig } from "@/config/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "An owner-operated Kenyan tours and travel company arranging flights, hotels, safaris, transport and complete holidays through personal consultants.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/dest-nairobi.svg"
        imageAlt="Nairobi at dusk — illustrative placeholder image"
        eyebrow="About us"
        title="Small team. Full itineraries. Straight answers."
        lede={companyConfig.description}
      />

      <section className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-24">
        <div className="max-w-xl space-y-4 leading-relaxed text-ink-soft">
          <SectionHeading eyebrow="Who we are" title="Travel people, before travel websites" />
          <p className="pt-2">
            We are an owner-operated tours and travel company based in {companyConfig.city}. Long
            before this website existed, our work ran on relationships: airlines and fare systems
            on one side, camps, hotels and drivers on the other, and travellers in the middle who
            just wanted someone dependable to organise it all.
          </p>
          <p>
            That is still the model. This site doesn&rsquo;t sell tickets by itself — it starts
            conversations. Every enquiry lands with a consultant who plans your trip personally,
            using professional airline reservation systems for flights and direct supplier
            relationships for everything on the ground.
          </p>
          <p>
            We handle domestic and international flights, hotel reservations, airport transfers,
            private transport, safaris, complete holiday packages, corporate travel and group
            movements — for Kenyan travellers heading out and international visitors coming in.
          </p>
        </div>
        <div className="max-w-xl space-y-4 self-end leading-relaxed text-ink-soft">
          <h2 className="display-serif text-2xl text-ink sm:text-3xl">
            Why we work by quotation
          </h2>
          <p>
            High-value travel is full of judgement calls: a tight connection worth avoiding, a
            camp that suits toddlers, a fare rule that will matter the day plans change. Search
            engines don&rsquo;t make those calls — people do. So we quote each trip fresh, with
            current prices and honest trade-offs, and nothing is confirmed until you approve it.
          </p>
          <p>
            It also keeps us accountable. When one team books the whole journey, there is no
            &ldquo;call the airline&rdquo; or &ldquo;that was the hotel&rsquo;s system&rdquo; —
            there is just us, fixing it.
          </p>
        </div>
      </section>

      <section className="bg-sand/60">
        <div className="container-site py-16 sm:py-20">
          <SectionHeading
            eyebrow="How we work"
            title="Commitments we can stand behind"
            lede="No invented statistics or awards — company details, licences and registrations will be published here once finalised."
          />
          <div className="mt-12">
            <TrustStatement />
          </div>
        </div>
      </section>

      <EditorialCTA
        title="The easiest way to judge us is to send us a trip."
        body="Give us one itinerary — a flight, a weekend, a safari — and see how the process feels. No commitment until you approve a quotation."
        primaryLabel="Request a travel quote"
        primaryHref="/request-a-quote"
        whatsappContext="I would like to learn more about your services."
        trackingSource="about-cta"
      />
    </>
  );
}
