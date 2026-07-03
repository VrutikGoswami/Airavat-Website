import type { Metadata } from "next";
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/editorial/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ContactLink } from "@/components/ui/ContactLink";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { companyConfig } from "@/config/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach our travel consultants by WhatsApp, phone or email — or send a structured enquiry through the quotation form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/images/service-transport.svg"
        imageAlt="City street scene — illustrative placeholder image"
        eyebrow="Contact"
        title="Talk to a person about your trip"
        lede="For anything with dates and details, the quotation form gives our consultants the best head start. For everything else, the channels below reach the same small team."
        size="compact"
      />

      <section className="container-site grid gap-14 py-14 sm:py-20 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 className="display-serif text-2xl sm:text-3xl">Direct channels</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
            Use the channels below to reach Airavat Tours and Travels. The quotation flow works
            end to end today; remaining placeholder business details will be replaced before
            launch.
          </p>
          <dl className="mt-8 space-y-6">
            <div id="whatsapp" className="flex gap-4 scroll-mt-28">
              <MessageCircle aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">WhatsApp</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  Usually the fastest channel for planning conversations.
                  <div className="mt-3">
                    <WhatsAppButton trackingSource="contact-page" variant="primary" />
                  </div>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Phone</dt>
                <dd className="mt-1 text-sm text-ink-soft">{companyConfig.phone}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Email</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  <ContactLink kind="email" value={companyConfig.email} className="hover:text-clay">
                    {companyConfig.email}
                  </ContactLink>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Instagram aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Instagram</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  <a
                    href={companyConfig.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-clay"
                  >
                    {companyConfig.socialLabels.instagram}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Facebook aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Facebook</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  <a
                    href={companyConfig.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-clay"
                  >
                    {companyConfig.socialLabels.facebook}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Office</dt>
                <dd className="mt-1 text-sm text-ink-soft">{companyConfig.address}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock aria-hidden className="mt-1 size-5 shrink-0 text-ochre" />
              <div>
                <dt className="font-bold">Hours</dt>
                <dd className="mt-1 text-sm text-ink-soft">{companyConfig.openingHours}</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="self-start border border-parchment bg-sand/50 p-8 lg:p-10">
          <h2 className="display-serif text-2xl sm:text-3xl">Planning something specific?</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            The guided quotation form captures routes, dates, travellers and preferences in one
            pass, so a consultant can reply with usable options rather than a list of follow-up
            questions.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <li>· Flights — domestic and international</li>
            <li>· Hotels and safari accommodation</li>
            <li>· Complete holidays and safari packages</li>
            <li>· Corporate and group travel</li>
          </ul>
          <ButtonLink href="/request-a-quote" size="lg" className="mt-8">
            Request a travel quote
          </ButtonLink>
          <p className="mt-4 text-xs text-stone">
            Submitting the form creates an enquiry for review — never a booking or a charge.
          </p>
        </div>
      </section>
    </>
  );
}
