import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <span className="inline-flex items-center rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-gold">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}
