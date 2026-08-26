import { Rocket, ShieldCheck, Clock, Users, Eye, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const features = [
  {
    icon: Rocket,
    title: "Hızlı teslimat",
    text: "Ödeme onayından sonra siparişlerin %90'ı 10 dakika içinde tamamlanıyor. Yoğun saatlerde bile sıradaki yerini botta canlı görebilirsin.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli ödeme",
    text: "Ödemeler yalnızca sunucuda duyurulan doğrulanmış hesaplara yapılır. Hiçbir yetkili sana özel mesajdan ödeme bilgisi göndermez.",
  },
  {
    icon: Clock,
    title: "7/24 destek",
    text: "Gece yarısı da olsa nöbetçi bir yetkili var. Destek taleplerine ortalama ilk yanıt süremiz 5 dakikanın altında.",
  },
  {
    icon: Users,
    title: "Deneyimli ekip",
    text: "İki yılı aşkın süredir oyun içi bakiye teslimatı yapan, binlerce işlem tamamlamış bir ekiple çalışıyorsun.",
  },
  {
    icon: Eye,
    title: "Şeffaf süreç",
    text: "Sipariş, ödeme ve teslimat adımları sana özel talep kanalında kayıt altına alınır. Her aşamayı kendi gözünle takip edersin.",
  },
  {
    icon: BadgeCheck,
    title: "Memnuniyet garantisi",
    text: "Eksik ya da gecikmeli teslimat olursa fark anında tamamlanır; çözülemeyen durumlarda ödemen koşulsuz iade edilir.",
  },
];

export function Features() {
  return (
    <section id="neden-biz" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Güven"
          title="Neden bizi seçmelisin?"
          description="Dijital alışverişte en önemli şey güven. İşte binlerce siparişin arkasındaki çalışma prensiplerimiz."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 90} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald/40">
                <span
                  className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                  style={{ backgroundImage: "var(--gradient-value)" }}
                />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-border bg-surface-2 text-emerald">
                  <feature.icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold">{feature.title}</h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
