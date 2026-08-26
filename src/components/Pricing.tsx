import { useRef, useState } from "react";
import { Check, Crown, AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import { useSiteData } from "@/lib/site-data";

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    setGlow({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
  };

  const handleLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlow({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative transition-transform duration-200 ease-out", className)}
      style={{ transform: transform }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, oklch(0.83 0.166 90 / 0.18), transparent 50%)`,
          opacity: glow.opacity,
        }}
      />
      {children}
    </div>
  );
}

export function Pricing() {
  const { packages, discordInvite } = useSiteData();

  return (
    <section id="paketler" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-72 max-w-3xl rounded-full opacity-10 blur-[120px]"
        style={{ backgroundImage: "var(--gradient-value)" }}
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Paketler"
          title="Fiyatlandırma"
          description="Aşağıdaki paketler örnek olarak listelenmiştir. Güncel fiyatlar ve kampanyalar sunucudaki sipariş botunda görünür."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.amount} delay={i * 80} className="h-full">
              <TiltCard className="h-full">
                <div
                  className={cn(
                    "group relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300",
                    pkg.popular
                      ? "border-gold/60 bg-surface-2/80 shadow-[var(--shadow-glow-gold)]"
                      : "border-border bg-surface/60 hover:border-accent/50 hover:shadow-[var(--shadow-glow-violet)]",
                  )}
                >
                  {pkg.popular && (
                    <span
                      className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-gold-foreground"
                      style={{ backgroundImage: "var(--gradient-gold)" }}
                    >
                      <Crown className="h-3.5 w-3.5" /> En Popüler
                    </span>
                  )}

                  <h3 className="font-display text-xl font-black">{pkg.amount}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{pkg.note}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    {/* PLACEHOLDER_PRICE */}
                    <span className="font-display text-3xl font-black text-gradient-gold">
                      {pkg.price}
                    </span>
                  </div>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Tek seferlik ödeme
                  </span>

                  {pkg.inStock === false && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5" /> Stokta Yok
                    </span>
                  )}

                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" strokeWidth={3} />
                        <span className="text-foreground/90">{perk}</span>
                      </li>
                    ))}
                  </ul>

                  {pkg.inStock === false ? (
                    <button
                      disabled
                      className={cn(
                        "mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm font-extrabold text-muted-foreground",
                        "cursor-not-allowed opacity-70",
                      )}
                    >
                      Şu an Stokta Yok
                    </button>
                  ) : (
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(discordInvite, "_blank", "noopener,noreferrer");
                      }}
                      className={cn(
                        "mt-7 inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-extrabold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]",
                        pkg.popular
                          ? "text-gold-foreground shadow-[var(--shadow-glow-gold)] hover:brightness-110"
                          : "border border-border bg-surface-2 text-foreground hover:border-gold/50 hover:text-gold",
                      )}
                      style={pkg.popular ? { backgroundImage: "var(--gradient-gold)" } : undefined}
                    >
                      Sipariş Ver
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Listede olmayan bir miktar mı lazım? Sunucuda özel tutar talebi oluşturabilirsin.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
