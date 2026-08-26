import { Gem } from "lucide-react";
import { BRAND } from "@/lib/site-config";
import { DiscordButton } from "@/components/DiscordButton";

const secondaryLinks = [
  { label: "SSS", href: "#sss" },
  { label: "İletişim", href: "#iletisim" },
  { label: "Kullanım Şartları", href: "#kullanim-sartlari" },
  { label: "Gizlilik", href: "#gizlilik" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-gold-foreground"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                <Gem className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-extrabold">{BRAND.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {BRAND.tagline} Tüm siparişler Discord sunucumuzdaki sipariş botu üzerinden alınır.
            </p>
            {/* PLACEHOLDER_DISCORD_LINK */}
            <DiscordButton variant="outline" icon="arrow" className="mt-5">
              Discord Sunucusuna Katıl
            </DiscordButton>
          </div>

          <nav className="min-w-0">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              Bağlantılar
            </h3>
            <ul className="mt-4 space-y-2.5">
              {secondaryLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-foreground/85 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            Bu site Roblox Corporation ile ilişkili değildir.
          </p>
        </div>
      </div>
    </footer>
  );
}
