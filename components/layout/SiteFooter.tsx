import Link from "next/link";
import {
  footerCompanyNav,
  footerLegalNav,
  footerServiceNav,
} from "@/config/navigation";
import { companyConfig } from "@/config/company";
import { destinationListings, enquiryHref } from "@/data/travel-content";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const socialEntries = Object.entries(companyConfig.socialLinks).filter(
  ([, url]) => url,
);

// Same source as the /destinations hub, so the two lists always match.
const footerDestinations = destinationListings.slice(0, 6);

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-site grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div className="max-w-sm">
          <BrandLogo tone="light" size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-cream-soft">
            {companyConfig.description}
          </p>
          <div className="mt-6">
            <WhatsAppButton trackingSource="footer" variant="light" />
          </div>
          {socialEntries.length > 0 ? (
            <ul className="mt-6 flex gap-4">
              {socialEntries.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    className="text-sm capitalize text-cream-soft hover:text-gold"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {name in companyConfig.socialLabels
                      ? companyConfig.socialLabels[name as keyof typeof companyConfig.socialLabels]
                      : name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-xs text-cream-soft/70">
              Social links will appear here once confirmed.
            </p>
          )}
        </div>

        <nav aria-label="Services">
          <h2 className="eyebrow text-gold">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {footerServiceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-cream-soft hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Destinations">
          <h2 className="eyebrow text-gold">Destinations</h2>
          <ul className="mt-4 space-y-2.5">
            {footerDestinations.map((d) => (
              <li key={d.slug}>
                <Link
                  href={
                    d.published
                      ? `/destinations/${d.slug}`
                      : enquiryHref({ service: d.service, destination: d.name })
                  }
                  className="text-sm text-cream-soft hover:text-gold"
                >
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/destinations" className="text-sm font-semibold hover:text-gold">
                All destinations →
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <nav aria-label="Company">
            <h2 className="eyebrow text-gold">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {footerCompanyNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-cream-soft hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <h2 className="eyebrow mt-8 text-gold">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-cream-soft">
            <li>{companyConfig.phone}</li>
            <li>
              <a href={`mailto:${companyConfig.email}`} className="hover:text-gold">
                {companyConfig.email}
              </a>
            </li>
            <li>{companyConfig.address}</li>
            <li>{companyConfig.openingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-cream-soft/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {companyConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {footerLegalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
