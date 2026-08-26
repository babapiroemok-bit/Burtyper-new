import { MessagesSquare, ListChecks, Wallet, PackageCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const steps = [
  {
    icon: MessagesSquare,
    title: "Discord sunucusuna katıl",
    text: "Tek tıkla sunucuya gir, kuralları oku ve #sipariş kanalına geç. Kayıt formu yok, üyelik ücreti yok.",
  },
  {
    icon: ListChecks,
    title: "Sipariş botuyla miktarı seç",
    text: "Botu başlat, almak istediğin Robux miktarını listeden seç. Bot tutarı ve tahmini teslim süresini anında gösterir.",
  },
  {
    icon: Wallet,
    title: "Ödemeni gönder ve onaylat",
    text: "Sana özel açılan talep kanalındaki ödeme bilgilerini kullan, dekontu paylaş. Yetkili ödemeni dakikalar içinde onaylar.",
  },
  {
    icon: PackageCheck,
    title: "Siparişin hızlıca teslim edilir",
    text: "Onaydan sonra bakiyen belirtilen yöntemle aktarılır ve teslimat kanalda kayıt altına alınır.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Süreç"
          title="Nasıl çalışır?"
          description="Siparişten teslimata kadar tamamı Discord içinde ilerleyen, dört adımlık şeffaf bir süreç."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-glow-gold)]">
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-8xl font-black text-foreground/5 transition-colors group-hover:text-gold/15">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-surface-2 text-gold transition-colors group-hover:border-gold/40">
                  <step.icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
