import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  /** tall = homepage-style cinematic hero; standard = interior pages. */
  size?: "tall" | "standard" | "compact";
  priority?: boolean;
  footnote?: ReactNode;
};

/**
 * Full-bleed dark hero used at the top of every page so the overlay header
 * always has contrast. Content sits on a legibility gradient, never on raw
 * imagery.
 */
export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  lede,
  children,
  size = "standard",
  priority = false,
  footnote,
}: Props) {
  const height =
    size === "tall"
      ? "min-h-[92svh]"
      : size === "compact"
        ? "min-h-[38svh]"
        : "min-h-[62svh]";

  return (
    <section className={`relative flex ${height} items-end overflow-hidden bg-forest-deep text-cream`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/25"
      />
      <div className="container-site relative pb-14 pt-36 sm:pb-20">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow rise-in text-gold">{eyebrow}</p> : null}
          <h1 className="display-serif rise-in mt-4 text-4xl leading-[1.04] sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
            {title}
          </h1>
          {lede ? (
            <p className="rise-in-late mt-6 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
              {lede}
            </p>
          ) : null}
          {children ? <div className="rise-in-late mt-8 flex flex-wrap gap-3">{children}</div> : null}
          {footnote ? (
            <p className="rise-in-late mt-6 text-xs text-cream/70">{footnote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
