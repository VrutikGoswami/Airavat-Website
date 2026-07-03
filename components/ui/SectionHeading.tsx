import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  children?: ReactNode;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  children,
  as: Heading = "h2",
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  const eyebrowCls = tone === "dark" ? "text-gold" : "text-ochre";
  const ledeCls = tone === "dark" ? "text-cream-soft" : "text-ink-soft";

  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow ? <p className={`eyebrow ${eyebrowCls}`}>{eyebrow}</p> : null}
      <Heading className="display-serif mt-3 text-3xl sm:text-4xl lg:text-5xl text-balance">
        {title}
      </Heading>
      {lede ? <p className={`mt-5 text-base sm:text-lg leading-relaxed ${ledeCls}`}>{lede}</p> : null}
      {children}
    </div>
  );
}
