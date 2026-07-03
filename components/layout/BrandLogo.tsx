import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.jpg";
import { displayName } from "@/config/company";

type BrandLogoProps = {
  tone?: "light" | "dark";
  size?: "md" | "lg";
  href?: string;
  className?: string;
};

export function BrandLogo({
  tone = "dark",
  size = "md",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const textColor = tone === "light" ? "text-cream" : "text-ink";
  const imageSize = size === "lg" ? "size-16" : "size-12";
  const textSize = size === "lg" ? "text-2xl" : "text-xl lg:text-2xl";

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative ${imageSize} shrink-0 overflow-hidden rounded-full border border-cream/80 bg-cream shadow-sm`}
      >
        <Image
          src={logo}
          alt=""
          fill
          sizes={size === "lg" ? "64px" : "48px"}
          className="object-cover"
          priority={size === "md"}
        />
      </span>
      <span className={`display-serif ${textSize} ${textColor} leading-none`}>
        {displayName()}
      </span>
    </Link>
  );
}
