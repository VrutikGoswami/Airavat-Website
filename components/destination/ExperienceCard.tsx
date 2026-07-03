import Image from "next/image";
import type { Experience } from "@/types";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="group">
      <div className="img-frame relative aspect-[5/4]">
        <Image
          src={experience.image}
          alt={`${experience.name} — illustrative placeholder image`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 85vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-3 font-bold">{experience.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{experience.summary}</p>
    </article>
  );
}
