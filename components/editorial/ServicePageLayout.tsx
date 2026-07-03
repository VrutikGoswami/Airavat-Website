import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Service, ServiceSlug } from "@/types";
import { getFaqs } from "@/data/faqs";
import { getServices } from "@/data/services";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EditorialCTA } from "@/components/editorial/EditorialCTA";
import { FAQAccordion } from "@/components/editorial/FAQAccordion";
import { PageHero } from "@/components/editorial/PageHero";
import { ProcessTimeline } from "@/components/editorial/ProcessTimeline";

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
  const relatedServices = getServices(service.relatedServiceSlugs);
  const serviceFaqs = getFaqs(service.faqIds);

  return (
    <>
      <PageHero
        image={service.heroImage}
        imageAlt={`${service.name} — illustrative placeholder image`}
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

      {/* Editorial explanation */}
      <section className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20">
        {service.editorial.map((block) => (
          <div key={block.title} className="max-w-xl">
            <h2 className="display-serif text-2xl sm:text-3xl">{block.title}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{block.body}</p>
          </div>
        ))}
      </section>

      {/* Who + what */}
      <section className="bg-sand/60">
        <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20">
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
            <SectionHeading eyebrow="What you can request" title="Ask us to arrange" />
            <ul className="mt-8 space-y-3">
              {service.requestables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-soft">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-ochre" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <SectionHeading
          eyebrow="How it works"
          title="From message to confirmed plan"
          lede="The same assisted process applies to every service — nothing is booked until you approve it."
        />
        <ProcessTimeline />
      </section>

      {/* FAQ */}
      {serviceFaqs.length > 0 ? (
        <section className="rule-top">
          <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <SectionHeading eyebrow="Questions" title={`${service.shortName} — common questions`} />
            <FAQAccordion items={serviceFaqs} />
          </div>
        </section>
      ) : null}

      {/* Related services */}
      <section className="bg-sand/60">
        <div className="container-site py-14 sm:py-16">
          <h2 className="eyebrow text-stone">Often combined with</h2>
          <ul className="mt-6 grid gap-px overflow-hidden border border-parchment bg-parchment sm:grid-cols-3">
            {relatedServices.map((related) => (
              <li key={related.slug} className="bg-ivory">
                <Link href={`/${related.slug}`} className="group flex h-full flex-col p-6 hover:bg-sand/70">
                  <div className="img-frame relative mb-4 aspect-[5/2]">
                    <Image
                      src={related.heroImage}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 30vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="display-serif text-xl group-hover:text-clay">
                    {related.name}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {related.summary.split("—")[0].trim()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
