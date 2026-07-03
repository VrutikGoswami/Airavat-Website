import { testimonials } from "@/data/testimonials";

/**
 * Demonstration testimonials are visibly labelled as samples — no invented
 * customer identities are presented as genuine.
 */
export function TestimonialSection() {
  return (
    <ul className="grid gap-px overflow-hidden border border-parchment bg-parchment sm:grid-cols-3">
      {testimonials.map((t) => (
        <li key={t.id} className="relative flex flex-col bg-ivory p-7 lg:p-9">
          {t.isSample ? (
            <p className="mb-4 inline-flex w-fit items-center bg-gold/20 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-clay">
              Sample — replace before launch
            </p>
          ) : null}
          <blockquote className="display-serif text-lg leading-snug text-ink sm:text-xl">
            “{t.quote}”
          </blockquote>
          <footer className="mt-5 pt-2 text-sm text-ink-soft">
            <p className="font-semibold text-ink">{t.name}</p>
            <p>{t.context}</p>
          </footer>
        </li>
      ))}
    </ul>
  );
}
