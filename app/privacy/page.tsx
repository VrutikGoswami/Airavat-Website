import type { Metadata } from "next";
import { PageHero } from "@/components/editorial/PageHero";
import { companyConfig } from "@/config/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Draft privacy policy: what personal information the enquiry forms collect, how it is used to respond to travel requests, and your choices.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        image="/images/dest-naivasha.svg"
        imageAlt="Calm lake scene — illustrative placeholder image"
        eyebrow="Legal"
        title="Privacy Policy"
        lede="Draft for review — this text must be checked by a qualified professional against Kenya's Data Protection Act, 2019 before launch."
        size="compact"
      />
      <section className="container-site max-w-3xl py-14 sm:py-20">
        <div className="border-l-2 border-gold bg-gold/10 px-5 py-4 text-sm leading-relaxed">
          <strong>Draft status:</strong> editable placeholder wording. Replace bracketed values
          from the central company configuration and obtain professional legal review before
          production use.
        </div>

        <div className="prose-editorial mt-10 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base [&_h2]:font-bold [&_h2]:text-lg [&_h2]:text-ink">
          <section>
            <h2>1. Who we are</h2>
            <p className="mt-3">
              {companyConfig.legalName} (&ldquo;we&rdquo;) is a tours and travel company based in
              Kenya.
            </p>
          </section>
          <section>
            <h2>2. What we collect</h2>
            <p className="mt-3">
              When you submit an enquiry we collect the details you provide: your name, email
              address, WhatsApp or phone number, preferred contact method, and the travel
              information you describe (destinations, dates, traveller numbers, budget band,
              accessibility and dietary notes you choose to share). We do not request passport
              numbers or payment details through this website.
            </p>
          </section>
          <section>
            <h2>3. How we use it</h2>
            <p className="mt-3">
              Your information is used to respond to your enquiry, prepare quotations, and — once
              you approve a quotation — to make bookings with airlines, hotels and other suppliers
              on your behalf. We contact you only about your enquiry unless you separately agree
              to receive other communication.
            </p>
          </section>
          <section>
            <h2>4. Sharing</h2>
            <p className="mt-3">
              Details are shared with travel suppliers only as needed to obtain options or, after
              your approval, to confirm bookings. We do not sell personal information. Third-party
              processors used by this website (hosting, analytics, messaging) will be listed here
              before launch: [PROCESSOR LIST].
            </p>
          </section>
          <section>
            <h2>5. Retention</h2>
            <p className="mt-3">
              Enquiry records are kept for as long as needed to serve you and meet legal and
              accounting obligations, then deleted or anonymised. Specific retention periods will
              be confirmed here: [RETENTION PERIODS].
            </p>
          </section>
          <section>
            <h2>6. Your rights</h2>
            <p className="mt-3">
              Subject to applicable law, you may request access to, correction of, or deletion of
              your personal information, and you may withdraw consent to be contacted at any time
              by telling your consultant or writing to {companyConfig.email}.
            </p>
          </section>
          <section>
            <h2>7. Cookies and analytics</h2>
            <p className="mt-3">
              This website currently operates without third-party advertising cookies. If
              analytics tools are enabled at launch they will be listed here together with any
              consent controls required.
            </p>
          </section>
          <section>
            <h2>8. Contact</h2>
            <p className="mt-3">
              Privacy questions: {companyConfig.email} · {companyConfig.address}. Last updated:
              [DATE — set at launch].
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
