import { ShieldCheck, ShieldBan, Lock, Eye, CreditCard } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "DDoS Koruması", color: "text-emerald" },
  { icon: ShieldBan, label: "Spam Koruması", color: "text-gold" },
  { icon: Lock, label: "SSL Şifreli Bağlantı", color: "text-emerald" },
  { icon: Eye, label: "7/24 Güvenlik İzleme", color: "text-gold" },
  { icon: CreditCard, label: "Güvenli Ödeme", color: "text-emerald" },
];

export function SecurityBar() {
  return (
    <div className="relative z-50 flex items-center justify-start gap-x-6 overflow-x-auto border-b border-border bg-surface px-4 py-1.5 whitespace-nowrap text-[11px] font-semibold text-muted-foreground sm:justify-center sm:gap-x-8 sm:text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-gold sm:text-[11px]">
        Güvenlik Sistemleri
      </span>
      {items.map((item) => (
        <span key={item.label} className="flex shrink-0 items-center gap-1.5">
          <item.icon className={`h-3.5 w-3.5 ${item.color}`} strokeWidth={2.2} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
