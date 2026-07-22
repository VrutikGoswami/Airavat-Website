import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HotelMediaItem } from "@/types/rates";

export function HotelMediaGallery({ hotels }: { hotels: HotelMediaItem[] }) {
  if (!hotels.length) return null;
  return (
    <section className="rule-top bg-sand/30">
      <div className="container-site py-16 sm:py-20">
        <SectionHeading
          eyebrow="Property galleries"
          title="See the hotels before you choose"
          lede="Browse the current property images we hold. Rates and availability are confirmed separately for your travel dates."
        />
        <div className="mt-10 space-y-12">
          {hotels.map((hotel) => (
            <article key={hotel.slug} className="border-y border-parchment py-6">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="display-serif text-2xl text-ink sm:text-3xl">{hotel.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-clay">{hotel.destinationName}</p>
                </div>
                <p className="text-xs font-semibold text-stone">{hotel.images.length} photo{hotel.images.length === 1 ? "" : "s"}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hotel.images.map((src, index) => (
                  <div key={src} className={`relative min-h-56 overflow-hidden bg-forest-deep ${index === 0 ? "sm:col-span-2" : ""}`}>
                    <Image
                      src={src}
                      alt={`${hotel.name} in ${hotel.destinationName}, photo ${index + 1}`}
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
