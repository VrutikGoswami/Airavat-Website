import { Check } from "lucide-react";
import type { Service, ServiceSlug } from "@/types";
import { getFaqs } from "@/data/faqs";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { FAQAccordion } from "@/components/editorial/FAQAccordion";
import { PageHero } from "@/components/editorial/PageHero";

/** Which enquiry-service value each service page preselects in the quote flow. */
const SERVICE_TO_ENQUIRY: Record<ServiceSlug, string> = {
  flights: "flights",
  hotels: "hotels",
  "tours-and-safaris": "safari",
  transport: "transport",
  "holiday-packages": "holiday-package",
  "corporate-travel": "corporate",
  "group-travel": "group",
};

/**
 * Shared, data-driven layout for the seven service pages: hero, editorial
 * explanation, who it's for, what can be requested, process, FAQ, related
 * services and a contextual conversion path.
 */
export function ServicePageLayout({ service }: { service: Service }) {
  const quoteHref = `/request-a-quote?service=${SERVICE_TO_ENQUIRY[service.slug]}`;
  const serviceFaqs = getFaqs(service.faqIds).slice(0, 3);

  return (
    <>
      <PageHero
        image={service.heroImage}
        imageAlt={`${service.name}`}
        eyebrow={service.eyebrow}
        title={service.headline}
        lede={service.summary}
      >
        <ButtonLink href={quoteHref} size="lg">
          {service.cta.label}
        </ButtonLink>
        <WhatsAppButton
          trackingSource={`service-${service.slug}-hero`}
          context={service.cta.whatsappMessage.replace(/^Hello,\s*/, "")}
          variant="light"
          size="lg"
        />
      </PageHero>

      <section className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="What we arrange"
            title={service.shortName}
            lede={service.summary}
          />
          <ul className="mt-8 space-y-3">
            {service.requestables.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-ochre" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-10">
          <div>
            <SectionHeading eyebrow="Who this is for" title="Made for travellers like…" />
            <ul className="mt-8 space-y-3">
              {service.audiences.map((audience) => (
                <li key={audience} className="flex items-start gap-3 text-ink-soft">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ochre" />
                  {audience}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="What to send" title="The useful basics" />
            <ul className="mt-8 space-y-3">
              {[
                "Destination or route",
                "Approximate dates",
                "Number of travellers",
                "Budget range",
                "Any must-haves or constraints",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-ochre" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {serviceFaqs.length > 0 ? (
        <section className="rule-top bg-sand/40">
          <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <SectionHeading eyebrow="Questions" title="Useful answers" />
            <FAQAccordion items={serviceFaqs} />
          </div>
        </section>
      ) : null}

      <EditorialCTA
        title={`Ready to ${service.cta.label.toLowerCase()}?`}
        body="Send the details through the quotation form, or start on WhatsApp if that's easier — a consultant replies with current options."
        primaryLabel={service.cta.label}
        primaryHref={quoteHref}
        whatsappContext={service.cta.whatsappMessage.replace(/^Hello,\s*/, "")}
        trackingSource={`service-${service.slug}-cta`}
        image={service.heroImage}
      />
    </>
  );
}
