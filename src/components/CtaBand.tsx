import { ArrowUpRight, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DiscordButton } from "@/components/DiscordButton";

export function CtaBand() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-[2rem] border border-border px-6 py-16 text-center sm:px-12 sm:py-20"
          style={{ backgroundImage: "var(--gradient-band)" }}
        >
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
            style={{ backgroundImage: "var(--gradient-value)" }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3.5 py-1.5 text-xs font-bold">
              <Users className="h-3.5 w-3.5 text-gold" />
              Topluluğa katılan 500+ oyuncu
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-black leading-tight sm:text-5xl">
              Siparişini vermek için sadece <span className="text-gradient-gold">bir tık</span>{" "}
              uzağındasın
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-foreground/80">
              Sunucuya katıl, sipariş botunu başlat ve bakiyeni dakikalar içinde teslim al. Kayıt
              yok, bekleme yok.
            </p>
            <DiscordButton size="lg" icon="arrow-up-right" className="mt-9" pulse>
              Hemen Discord'a Katıl
            </DiscordButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
