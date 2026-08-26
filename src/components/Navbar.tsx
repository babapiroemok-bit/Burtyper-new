import { useEffect, useState } from "react";
import { Menu, X, Gem, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND, NAV_LINKS } from "@/lib/site-config";
import { DiscordButton } from "@/components/DiscordButton";
import { SecurityBar } from "@/components/SecurityBar";
import { useSiteData } from "@/lib/site-data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { announcement } = useSiteData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {announcement.enabled && announcement.text.trim() && (
        <div className="flex items-center justify-center gap-2 border-b border-border bg-gold/10 px-4 py-2 text-center text-xs font-bold text-gold">
          <Megaphone className="h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
          <span className="min-w-0">{announcement.text}</span>
        </div>
      )}
      <SecurityBar />
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 transition-all duration-300",
          scrolled ? "py-2" : "py-3.5",
        )}
      >
        <nav
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 lg:flex lg:justify-between",
            scrolled ? "glass-card" : "border border-transparent",
          )}
        >
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-gold-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              <Gem className="h-4.5 w-4.5" strokeWidth={2.4} />
            </span>
            <span className="truncate font-display text-lg font-extrabold tracking-tight">
              {BRAND.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <DiscordButton size="sm" icon="zap" className="hidden sm:inline-flex">
              Discord'a Katıl / Sipariş Ver
            </DiscordButton>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-2 active:scale-95 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="glass-card mt-2 animate-in fade-in slide-in-from-top-2 rounded-2xl p-3 lg:hidden">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground/90 transition-colors hover:bg-surface-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <DiscordButton
              size="lg"
              icon="zap"
              className="mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Discord'a Katıl / Sipariş Ver
            </DiscordButton>
          </div>
        )}
      </div>
    </header>
  );
}
