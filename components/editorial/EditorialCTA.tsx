import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

type Props = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  whatsappContext: string;
  trackingSource: string;
  image?: string;
};

/** Full-width closing call to action used at the foot of major pages. */
export function EditorialCTA({
  eyebrow = "Next step",
  title,
  body,
  primaryLabel,
  primaryHref,
  whatsappContext,
  trackingSource,
  image = "/images/mara-hero.svg",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-forest-deep text-cream">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 to-ink/50" aria-hidden />
      <div className="container-site relative py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="display-serif mt-3 text-3xl sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-cream/90 sm:text-lg">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primaryHref} size="lg">
              {primaryLabel}
            </ButtonLink>
            <WhatsAppButton
              trackingSource={trackingSource}
              context={whatsappContext}
              variant="light"
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
