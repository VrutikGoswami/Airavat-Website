import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors duration-200 rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ochre text-cream hover:bg-clay",
  dark: "bg-ink text-cream hover:bg-forest",
  outline:
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  light:
    "border border-cream/40 text-cream hover:bg-cream hover:text-ink",
  ghost: "text-ink underline underline-offset-4 decoration-ochre hover:text-clay",
};

const sizes: Record<Size, string> = {
  md: "text-sm px-5 py-2.5 min-h-11",
  lg: "text-base px-7 py-3.5 min-h-12",
};

export function cls(variant: Variant = "primary", size: Size = "md"): string {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${cls(variant, size)} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${cls(variant, size)} ${className}`} {...rest} />
  );
}
