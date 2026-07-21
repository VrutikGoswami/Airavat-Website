"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { getActiveCampaign } from "@/config/campaigns";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ButtonLink } from "@/components/ui/Button";

/** A nav link is active on its exact route and on any nested child route. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed header that stays put at the top of the viewport at all times — it
 * never hides on scroll — with the current section clearly highlighted.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const campaign = getActiveCampaign();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-clay/20 bg-[#f6b36f]/95 shadow-sm backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
        <BrandLogo tone="dark" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {campaign ? (
              <li className="mr-1">
                <Link
                  href={`/destinations/${campaign.destinationSlug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 py-1 pl-2 pr-2.5 transition-colors hover:bg-gold/25"
                  title="Maasai Mara — seasonal special"
                >
                  <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                  <span className="text-xs font-semibold text-ink">Maasai Mara</span>
                  <span className="hidden text-[10px] font-medium uppercase tracking-wide text-clay/80 xl:inline">
                    Special
                  </span>
                </Link>
              </li>
            ) : null}
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href!);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm font-semibold transition-colors ${
                      active
                        ? "text-clay underline decoration-ochre decoration-2 underline-offset-8"
                        : "text-ink hover:text-clay"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
            Get a Quote
          </ButtonLink>
        </div>

        <MobileNavigation solidHeader />
      </div>
    </header>
  );
}
