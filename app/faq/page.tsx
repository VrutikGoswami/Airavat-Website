import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { FAQAccordion } from "@/components/editorial/FAQAccordion";
import { PageHero } from "@/components/editorial/PageHero";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How assisted booking works: quotations, confirmations, group travel, visas, wildlife expectations and what happens after you submit an enquiry.",
};

export default function FAQPage() {
  // FAQPage structured data reflects only the visible questions on this page.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        image="/images/experience-conservancy.jpg"
        imageAlt="Tented camp on the savannah"
        eyebrow="FAQ"
        title="Questions, answered plainly"
        lede="Everything here reflects how we actually work. If your question isn't covered, ask it on WhatsApp — that's what we're for."
        size="compact"
      />
      <section className="container-site max-w-4xl py-14 sm:py-20">
        <FAQAccordion items={faqs} />
      </section>
      <EditorialCTA
        title="Still wondering about something?"
        body="Ask directly — a consultant answers questions before you commit to anything."
        primaryLabel="Contact us"
        primaryHref="/contact"
        whatsappContext="I have a question about your services."
        trackingSource="faq-cta"
      />
    </>
  );
}
