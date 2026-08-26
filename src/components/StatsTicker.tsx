import { useEffect, useRef, useState } from "react";
import { PackageCheck, Headphones, Clock, Users } from "lucide-react";

const stats = [
  { icon: PackageCheck, value: 500, suffix: "+", label: "Başarılı Sipariş" },
  { icon: Headphones, value: 24, suffix: "/7", label: "Aktif Destek" },
  { icon: Clock, value: 4, suffix: " dk", label: "Ortalama Teslimat" },
  { icon: Users, value: 1200, suffix: "+", label: "Topluluk Üyesi" },
];

function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * end));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
}: {
  icon: typeof PackageCheck;
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="flex items-center gap-4 px-6">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface text-gold">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <div>
        <div className="font-display text-2xl font-black text-gradient-gold">
          {count.toLocaleString("tr-TR")}
          {suffix}
        </div>
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function StatsTicker() {
  return (
    <section className="relative -mt-8 z-10 px-4 sm:-mt-10">
      <div className="mx-auto max-w-5xl">
        <div className="glass-card flex flex-wrap items-center justify-center gap-y-6 rounded-3xl px-4 py-6 shadow-[var(--shadow-card)] sm:justify-between sm:px-8 sm:py-7">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
