import { lazy, Suspense } from "react";
import { ArrowDown, ShieldCheck, Zap, Headphones, Coins, AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DiscordButton } from "@/components/DiscordButton";
import { ParticleField } from "@/components/ParticleField";
import { useSiteData } from "@/lib/site-data";

const Coin3D = lazy(() => import("@/components/Coin3D"));

const chips = [
  { icon: Coins, label: "500+ Başarılı Sipariş" },
  { icon: Headphones, label: "7/24 Aktif Destek" },
  { icon: Zap, label: "Anlık Teslimat" },
];

/** Abstract, original coin/orb motif — no trademarked assets. */
function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <Suspense
        fallback={
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="h-40 w-40 rounded-full shadow-[var(--shadow-glow-gold)] sm:h-48 sm:w-48"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
          </div>
        }
      >
        <Coin3D />
      </Suspense>

      <div className="glass-card absolute left-0 top-8 z-10 flex items-center gap-2 rounded-2xl px-3 py-2 animate-float-orb">
        <ShieldCheck className="h-4 w-4 text-emerald" />
        <span className="text-xs font-bold">Güvenli Teslimat</span>
      </div>
      <div
        className="glass-card absolute bottom-4 right-0 z-10 flex items-center gap-2 rounded-2xl px-3 py-2 animate-float-orb"
        style={{ animationDelay: "1.5s" }}
      >
        <Zap className="h-4 w-4 text-gold" />
        <span className="text-xs font-bold">Ort. 4 dakika</span>
      </div>
    </div>
  );
}

export function Hero() {
  const { ordersClosed, siteLocked, hero } = useSiteData();

  const statusLabel = siteLocked
    ? "Site bakımda · Siparişler geçici olarak kapalı"
    : ordersClosed
      ? "Sunucu Aktif ama Bot çalışmıyor veya Siparişler Geçici Olarak kapalıdır."
      : "Sunucu şu anda aktif · Sipariş botu çalışıyor";

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44">
      <ParticleField />
      <div className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ backgroundImage: "var(--gradient-value)" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold ${
                ordersClosed || siteLocked
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                  : "border-border bg-surface/70 text-muted-foreground"
              }`}
            >
              {ordersClosed || siteLocked ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
              )}
              {statusLabel}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-4xl font-black leading-[1.05] sm:text-6xl">
              {hero.titlePart1} <br className="hidden sm:block" />
              <span className="text-gradient-gold">{hero.titlePart2}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DiscordButton size="lg" icon="zap" pulse>
                {hero.ctaLabel}
              </DiscordButton>
              <a
                href="#nasil-calisir"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface/70 px-7 py-4 text-base font-bold text-foreground transition-all duration-200 hover:border-accent/60 hover:bg-surface-2 active:scale-[0.98]"
              >
                {hero.secondaryLabel}
                <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <li
                  key={chip.label}
                  className="glass-card flex items-center gap-2 rounded-full px-4 py-2.5"
                >
                  <chip.icon className="h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm font-bold">{chip.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <HeroArt />
        </Reveal>
      </div>
    </section>
  );
}
