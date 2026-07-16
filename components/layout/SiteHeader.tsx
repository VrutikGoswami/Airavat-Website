"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { primaryNav, type NavItem } from "@/config/navigation";
import { getActiveCampaign } from "@/config/campaigns";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ButtonLink } from "@/components/ui/Button";

/** Accessible top-nav dropdown: opens on hover and on keyboard focus, closes on
 *  Escape or blur, with a correct aria-expanded reflecting real state. */
function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const children = item.children ?? [];
  const active = children.some((c) => pathname === c.href);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={`inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-clay ${
          active ? "underline underline-offset-8 decoration-ochre decoration-2" : ""
        }`}
      >
        {item.label}
        <ChevronDown aria-hidden className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        hidden={!open}
        className="absolute left-0 top-full z-50 min-w-56 border border-clay/20 bg-[#f6b36f] p-1 pt-3 shadow-lg"
      >
        {children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              aria-current={pathname === child.href ? "page" : undefined}
              className="block rounded-[3px] px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ochre/25 hover:text-clay"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Fixed header that stays available near the top, then clears the page while
 * scrolling down and returns when the visitor scrolls back up.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const campaign = getActiveCampaign();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 12);
      setHidden(currentY > 24 && currentY > lastScrollY.current + 4);
      if (currentY < lastScrollY.current - 4 || currentY <= 12) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHidden(false);
    lastScrollY.current = window.scrollY;
  }, [pathname]);

  const solid = scrolled;
  const textCls = "text-ink";
  const linkHover = "hover:text-clay";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur transition-[background-color,border-color,box-shadow,transform] duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
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
            {primaryNav.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} pathname={pathname} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`text-sm font-semibold ${textCls} ${linkHover} transition-colors ${
                      pathname === item.href ? "underline underline-offset-8 decoration-ochre decoration-2" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
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
