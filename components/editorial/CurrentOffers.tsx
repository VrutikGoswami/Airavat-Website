import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { activeOffers } from "@/data/offers";
import { enquiryHref } from "@/data/travel-content";

function priceLabel(price?: number, currency?: string) {
  if (!price || !currency) return null;
  return `From ${currency} ${price.toLocaleString()}`;
}

export function CurrentOffers() {
  const offers = activeOffers();

  if (!offers.length) return null;

  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Current offers"
        title="Approved offers available now"
        lede="Each offer is checked before publishing and disappears automatically after expiry."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {offers.map((offer) => {
          const price = priceLabel(offer.startingPrice, offer.currency);
          return (
            <article key={offer.id} className="border border-parchment bg-ivory">
              <div className="relative aspect-[4/3]">
                <Image
                  src={offer.image}
                  alt={offer.destination}
                  fill
                  sizes="(min-width: 1024px) 30vw, 92vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="eyebrow text-[10px] text-stone">
                  {offer.destination} · {offer.duration}
                </p>
                <h3 className="display-serif mt-1 text-2xl">{offer.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{offer.description}</p>
                {price ? <p className="mt-4 font-bold text-ochre">{price}</p> : null}
                <dl className="mt-4 space-y-2 text-xs leading-relaxed text-ink-soft">
                  <div>
                    <dt className="inline font-bold text-ink">Eligibility: </dt>
                    <dd className="inline">{offer.eligibility.replace("-", " ")}</dd>
                  </div>
                  <div>
                    <dt className="inline font-bold text-ink">Travel: </dt>
                    <dd className="inline">
                      {offer.validTravelDates.start} to {offer.validTravelDates.end}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <ButtonLink
                    href={enquiryHref({
                      service: offer.service,
                      destination: offer.destination,
                      offer: offer.id,
                    })}
                  >
                    Enquire about this offer
                  </ButtonLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
