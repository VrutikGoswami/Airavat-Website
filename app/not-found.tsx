import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-forest-deep text-cream">
      <div className="container-site py-24">
        <p className="eyebrow text-gold">404 — off the map</p>
        <h1 className="display-serif mt-4 max-w-2xl text-4xl sm:text-5xl">
          This page has wandered off the reserve.
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-cream-soft">
          The address may have changed, or the link was mistyped. Everything worth finding is a
          click away below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/destinations" variant="light">
            Browse destinations
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-cream-soft">
          Looking for a quotation?{" "}
          <Link href="/request-a-quote" className="font-semibold text-gold underline underline-offset-4">
            Request a travel quote
          </Link>
        </p>
      </div>
    </section>
  );
}
