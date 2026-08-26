import { CreditCard, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useSiteData } from "@/lib/site-data";

export function PaymentMethods() {
  const { paymentMethods } = useSiteData();
  const active = paymentMethods.filter((p) => p.enabled);

  if (active.length === 0) return null;

  return (
    <section id="odeme-yontemleri" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-72 max-w-3xl rounded-full opacity-10 blur-[120px]"
        style={{ backgroundImage: "var(--gradient-value)" }}
      />
      <div className="relative mx-auto max-w-5xl px-4">
        <SectionHeading
          eyebrow="Ödeme"
          title="Ödeme Yöntemleri"
          description="Yalnızca aşağıdaki yöntemlerle çalışıyoruz. Başka kanal isteyen herkesi sahte kabul et ve yetkililere bildir."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((method, i) => (
            <Reveal key={method.name} delay={i * 80} className="h-full">
              <div className="glass-card flex h-full flex-col justify-between rounded-3xl p-6">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl text-gold-foreground"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <CreditCard className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold">{method.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{method.note}</p>
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald">
                  <ShieldCheck className="h-4 w-4" /> Güvenli & doğrulanmış
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
