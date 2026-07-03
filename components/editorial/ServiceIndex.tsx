"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types";

/**
 * Editorial numbered service index: the list drives a single rotating
 * image panel on desktop. No cards, no icon grid.
 */
export function ServiceIndex({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <ol className="rule-top">
        {services.map((service, i) => (
          <li key={service.slug}>
            <Link
              href={`/${service.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`group flex items-baseline gap-5 border-b border-parchment py-5 transition-colors sm:gap-8 lg:py-6 ${
                active === i ? "text-clay" : "text-ink"
              }`}
            >
              <span className="display-serif w-10 shrink-0 text-xl text-stone" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span className="display-serif block text-2xl sm:text-3xl">
                  {service.shortName}
                </span>
                <span className="mt-1 block max-w-md text-sm leading-relaxed text-ink-soft">
                  {service.summary.split("—")[0].trim()}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-5 shrink-0 self-center text-ochre opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ol>

      <div className="img-frame relative hidden aspect-[4/5] lg:block" aria-hidden>
        {services.map((service, i) => (
          <Image
            key={service.slug}
            src={service.heroImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            className={`object-cover transition-opacity duration-500 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <p className="eyebrow absolute bottom-4 left-4 bg-ink/70 px-3 py-1.5 text-cream">
          {services[active].shortName}
        </p>
      </div>
    </div>
  );
}
