import type { Metadata } from "next";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { TestimonialSection } from "@/components/editorial/TestimonialSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Customer feedback will be published here with permission. The current entries are labelled samples demonstrating the layout — we don't publish invented reviews.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        image="/images/experience-dining.jpg"
        imageAlt="Bush dinner under the stars"
        eyebrow="Reviews"
        title="Real feedback only — which is why this page is honest about being new"
        lede="We publish reviews with the traveller's permission, exactly as given. Until launch, the entries below are clearly-labelled samples that show how this page will work."
        size="compact"
      />

      <section className="container-site py-14 sm:py-20">
        <SectionHeading
          eyebrow="What travellers say"
          title="Sample layout — awaiting real voices"
          lede="No ratings schema, no invented star counts. When genuine feedback replaces these samples, each entry will carry the traveller's context."
        />
        <div className="mt-10">
          <TestimonialSection />
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Travelled with us? We&rsquo;d value a few honest sentences — including what we could do
          better. Send it through the contact page or WhatsApp and tell us whether we may publish
          it with your first name.
        </p>
      </section>

      <EditorialCTA
        title="Be the review this page is waiting for."
        body="Plan a trip with us and tell us how it went — praise or criticism, we publish honestly."
        primaryLabel="Request a travel quote"
        primaryHref="/request-a-quote"
        whatsappContext="I would like to plan a trip."
        trackingSource="reviews-cta"
      />
    </>
  );
}
