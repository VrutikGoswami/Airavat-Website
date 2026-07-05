"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { getActiveCampaign } from "@/config/campaigns";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Fixed header that overlays page heroes while at the top of the page and
 * transitions to a solid ivory bar once scrolled. Every page opens with a
 * dark hero band, so the transparent state always has enough contrast.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const campaign = getActiveCampaign();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;
  const textCls = "text-ink";
  const linkHover = "hover:text-clay";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${
        solid
          ? "border-clay/20 bg-[#f6b36f]/80 shadow-sm"
          : "border-clay/15 bg-[#f6b36f]/62"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
        <BrandLogo tone="dark" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {campaign ? (
              <li>
                <Link
                  href={`/destinations/${campaign.destinationSlug}`}
                  className={`text-sm font-semibold ${textCls} ${linkHover} transition-colors`}
                >
                  <span className="text-gold" aria-hidden>
                    ●{" "}
                  </span>
                  Maasai Mara
                </Link>
              </li>
            ) : null}
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`text-sm font-semibold ${textCls} ${linkHover} transition-colors ${
                    pathname === item.href ? "underline underline-offset-8 decoration-ochre decoration-2" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <WhatsAppButton
            trackingSource="header"
            variant="outline"
            label="WhatsApp"
            className="border-[#25D366]/70 bg-[#25D366]/15 text-[#075E54] hover:border-[#25D366] hover:bg-[#25D366] hover:text-ink"
          />
          <ButtonLink href="/request-a-quote" variant="dark">
            Request a Quote
          </ButtonLink>
        </div>

        <MobileNavigation solidHeader />
      </div>
    </header>
  );
}
