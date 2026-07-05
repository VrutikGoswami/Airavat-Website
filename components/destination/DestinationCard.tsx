import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types";

/**
 * Published destinations link to their page; unpublished ones lead straight
 * into the quote flow with the destination preselected (no thin pages).
 */
export function DestinationCard({ destination }: { destination: Destination }) {
  const exploreHref = destination.published ? `/destinations/${destination.slug}` : "/destinations";
  const planHref = `/request-a-quote?service=safari&destination=${destination.slug}`;

  return (
    <article className="group block">
      <div className="img-frame relative aspect-[4/3]">
        <Image
          src={destination.heroImage}
          alt={`${destination.name}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        {destination.featured ? (
          <p className="eyebrow absolute left-4 top-4 bg-ochre px-2.5 py-1 text-[10px] text-cream">
            Seasonal focus
          </p>
        ) : null}
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-4">
        <div>
          <p className="eyebrow text-[10px] text-stone">{destination.eyebrow}</p>
          <h3 className="display-serif mt-1 text-2xl group-hover:text-clay">
            {destination.name}
          </h3>
          <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-ink-soft">
            {destination.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link href={exploreHref} className="text-ink underline underline-offset-4 hover:text-clay">
              Explore
            </Link>
            <Link href={planHref} className="text-ochre underline underline-offset-4 hover:text-clay">
              Plan this trip
              <ArrowRight aria-hidden className="ml-1 inline size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
