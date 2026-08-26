import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import type { Testimonial } from "@/lib/site-config";
import { useSiteData } from "@/lib/site-data";

function TestimonialCard({
  item,
}: {
  item: Testimonial;
}) {
  return (
    <figure className="glass-card relative w-[320px] shrink-0 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 sm:w-[360px]">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-foreground/10" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={s}
            className={
              s < item.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-border"
            }
          />
        ))}
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
        “{item.text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-black text-gold-foreground"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {item.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold">{item.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {item.handle} · Örnek yorum
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const { testimonials } = useSiteData();
  const duplicated = [...testimonials, ...testimonials];

  return (
    <section id="yorumlar" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Yorumlar"
          title="Müşteri değerlendirmeleri"
          description="Aşağıdaki yorumlar örnek (placeholder) içeriktir ve gerçek müşteri yorumlarıyla değiştirilmelidir."
        />
      </div>

      <Reveal delay={100}>
        <div className="relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max animate-marquee gap-5 py-2 hover:[animation-play-state:paused]">
            {duplicated.map((item, i) => (
              <TestimonialCard key={`${item.handle}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
