import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import { useSiteData } from "@/lib/site-data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { faqs } = useSiteData();

  return (
    <section id="sss" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading
          eyebrow="SSS"
          title="Sıkça sorulan sorular"
          description="Aklına takılan bir şey mi var? En çok merak edilenleri burada topladık."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={Math.min(i, 4) * 60}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-surface/60 transition-colors duration-300",
                    isOpen ? "border-gold/45 bg-surface-2/70" : "border-border hover:border-border",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-surface-2/60 active:scale-[0.995]"
                  >
                    <span className="min-w-0 flex-1 font-display text-base font-bold">
                      {item.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 shrink-0 text-gold transition-transform duration-300",
                        isOpen && "rotate-45",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
