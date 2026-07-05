"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { getActiveCampaign } from "@/config/campaigns";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Accessible mobile drawer: focus is moved in on open and restored on
 * close, Escape and backdrop close it, Tab is trapped inside, and body
 * scroll is locked while open. Closes automatically on route change.
 */
export function MobileNavigation({ solidHeader }: { solidHeader: boolean }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const campaign = getActiveCampaign();

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus();
  }, []);

  // Close when the route changes (link tapped inside the drawer).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={openerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className={`inline-flex size-11 items-center justify-center rounded-[3px] ${
          solidHeader ? "text-ink" : "text-cream"
        }`}
      >
        <Menu aria-hidden className="size-6" />
        <span className="sr-only">Open menu</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 bg-ink/60"
            tabIndex={-1}
          />
          <div
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-y-0 right-0 flex w-[min(24rem,100%)] flex-col overflow-y-auto bg-forest-deep px-6 pb-10 pt-4 text-cream shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <BrandLogo tone="light" />
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center text-cream"
              >
                <X aria-hidden className="size-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            {campaign ? (
              <Link
                href={`/destinations/${campaign.destinationSlug}`}
                className="mt-8 block border border-gold/40 px-4 py-3"
              >
                <span className="eyebrow text-gold">{campaign.label}</span>
                <span className="mt-1 block font-semibold">Maasai Mara →</span>
              </Link>
            ) : null}

            <nav aria-label="Primary" className="mt-8">
              <ul className="space-y-1">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="block py-3 text-lg font-semibold hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="More" className="mt-6 border-t border-cream/15 pt-6">
              <ul className="grid grid-cols-2 gap-x-4">
                {secondaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-2.5 text-sm text-cream-soft hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-3 pt-10">
              <ButtonLink href="/request-a-quote" variant="primary" size="lg" className="w-full">
                Get a Quote
              </ButtonLink>
              <WhatsAppButton
                trackingSource="mobile-nav"
                variant="light"
                size="lg"
                className="w-full"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
