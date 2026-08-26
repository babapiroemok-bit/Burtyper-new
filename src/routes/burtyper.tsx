import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Lock,
  Unlock,
  Store,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Megaphone,
  Link2,
  Package,
  MessageCircleQuestion,
  Star,
  Send,
  Sparkles,
  BarChart3,
  CreditCard,
  PackageX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { verifyAdmin, setSiteStatus, getSiteStatus, updateStats, fetchDiscordBotData, type SiteState, type Announcement } from "@/lib/admin-store";
import { BRAND } from "@/lib/site-config";
import type { Pkg, FaqItem, Testimonial, PaymentMethod } from "@/lib/site-config";
import { Bot, Users, Zap, Hash, Crown, RefreshCw, Wifi, WifiOff, Settings } from "lucide-react";
import DiscordTab from "./burtyper-discord-tab";
import ServerTab from "./burtyper-server-tab";
import MembersTab from "./burtyper-members-tab";
import ChannelsTab from "./burtyper-channels-tab";
import RolesTab from "./burtyper-roles-tab";

export const Route = createFileRoute("/burtyper")({
  head: () => ({
    meta: [{ title: `Admin Paneli — ${BRAND.name}` }],
  }),
  component: AdminPage,
});

type Tab = "genel" | "hero" | "paketler" | "odeme" | "sss" | "yorumlar" | "istatistikler" | "discord" | "sunucu" | "uyeler" | "kanallar" | "roller";

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
  { id: "genel", label: "Genel", icon: Store },
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "paketler", label: "Paketler", icon: Package },
  { id: "odeme", label: "Ödeme", icon: CreditCard },
  { id: "sss", label: "SSS", icon: MessageCircleQuestion },
  { id: "yorumlar", label: "Yorumlar", icon: Star },
  { id: "istatistikler", label: "İstatistikler", icon: BarChart3 },
  { id: "discord", label: "Discord", icon: Bot },
  { id: "sunucu", label: "Sunucu", icon: Settings },
  { id: "uyeler", label: "Üye Yönetimi", icon: Users },
  { id: "kanallar", label: "Kanal Yönetimi", icon: Hash },
  { id: "roller", label: "Rol Yönetimi", icon: Crown },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60";
const textareaCls =
  "w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>("genel");
  const [draft, setDraft] = useState<SiteState | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      const res = await verifyAdmin({ data: { password } });
      if (!res.ok) {
        setError("Şifre hatalı. Tekrar dene.");
        return;
      }
      const status = await getSiteStatus();
      setDraft(status);
      setAuthed(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar dene.");
    } finally {
      setChecking(false);
    }
  }

  function patch(partial: Partial<SiteState>) {
    setDraft((d) => (d ? { ...d, ...partial } : d));
  }

  async function handleSave() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await setSiteStatus({
        data: {
          password,
          ordersClosed: draft.ordersClosed,
          siteLocked: draft.siteLocked,
          announcement: draft.announcement,
          discordInvite: draft.discordInvite,
          hero: draft.hero,
          packages: draft.packages,
          faqs: draft.faqs,
          testimonials: draft.testimonials,
          paymentMethods: draft.paymentMethods,
          botApiUrl: draft.botApiUrl,
          botApiSecret: draft.botApiSecret,
        },
      });
      if (res.ok && res.state) {
        setDraft(res.state);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError("Kaydetme başarısız. Şifreni kontrol et.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  if (!authed || !draft) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <form
          onSubmit={handleLogin}
          className="glass-card w-full max-w-sm rounded-2xl p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gold-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              <Lock className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold">Admin Paneli</h1>
              <p className="text-xs font-semibold text-muted-foreground">{BRAND.name}</p>
            </div>
          </div>

          <Field label="Şifre">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yönetici şifresi"
              className={inputCls}
              autoFocus
            />
          </Field>

          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={checking || !password}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-gold-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              <Store className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold">Admin Paneli</h1>
              <p className="text-sm font-semibold text-muted-foreground">
                {BRAND.name} · Site yönetimi
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Değişiklikleri Kaydet
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald/40 bg-emerald/10 px-4 py-3 text-sm font-semibold text-emerald">
            <ShieldCheck className="h-4 w-4" /> Değişiklikler kaydedildi.
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
                tab === t.id
                  ? "border-gold/60 bg-gold/10 text-gold"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          {tab === "genel" && <GeneralTab draft={draft} patch={patch} password={password} />}
          {tab === "hero" && <HeroTab draft={draft} patch={patch} />}
          {tab === "paketler" && <PackagesTab draft={draft} patch={patch} />}
          {tab === "odeme" && <PaymentTab draft={draft} patch={patch} />}
          {tab === "sss" && <FaqTab draft={draft} patch={patch} />}
          {tab === "yorumlar" && <TestimonialsTab draft={draft} patch={patch} />}
          {tab === "istatistikler" && <StatsTab draft={draft} patch={patch} password={password} />}
          {tab === "discord" && <DiscordTab draft={draft} patch={patch} password={password} />}
          {tab === "sunucu" && <ServerTab apiUrl={draft.botApiUrl || ""} apiSecret={draft.botApiSecret || "Ruhi321ka"} />}
          {tab === "uyeler" && <MembersTab apiUrl={draft.botApiUrl || ""} apiSecret={draft.botApiSecret || "Ruhi321ka"} />}
          {tab === "kanallar" && <ChannelsTab apiUrl={draft.botApiUrl || ""} apiSecret={draft.botApiSecret || "Ruhi321ka"} />}
          {tab === "roller" && <RolesTab apiUrl={draft.botApiUrl || ""} apiSecret={draft.botApiSecret || "Ruhi321ka"} />}
        </div>

        <a href="/" className="mt-8 inline-block text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          ← Siteye dön
        </a>
      </div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  activeLabel,
  inactiveLabel,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
        on ? "bg-emerald text-emerald-foreground" : "bg-destructive text-destructive-foreground",
      )}
    >
      {on ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      {on ? activeLabel : inactiveLabel}
    </button>
  );
}

function GeneralTab({
  draft,
  patch,
  password,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
  password: string;
}) {
  const announcement: Announcement = draft.announcement;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendAnnouncement() {
    if (!announcement.text.trim()) return;
    setSending(true);
    setSent(false);
    try {
      const res = await setSiteStatus({ data: { password, announcement } });
      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 2500);
      }
    } catch {
      setSent(false);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/50 p-5">
        <div>
          <h3 className="text-base font-bold">Siparişler</h3>
          <p className="text-sm font-semibold text-muted-foreground">
            {draft.ordersClosed
              ? "Kapalı — sitedeki durum metni değişir"
              : "Açık — siparişler alınıyor"}
          </p>
        </div>
        <Toggle
          on={!draft.ordersClosed}
          onChange={(v) => patch({ ordersClosed: !v })}
          activeLabel="Açık"
          inactiveLabel="Kapalı"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/50 p-5">
        <div>
          <h3 className="text-base font-bold">Site Kilidi</h3>
          <p className="text-sm font-semibold text-muted-foreground">
            {draft.siteLocked ? "Kilitli — site bakım ekranı gösterir" : "Açık — site normal görünüyor"}
          </p>
        </div>
        <Toggle
          on={!draft.siteLocked}
          onChange={(v) => patch({ siteLocked: !v })}
          activeLabel="Kilitli"
          inactiveLabel="Kilitli"
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-gold" />
          <h3 className="text-base font-bold">Duyuru Şeridi</h3>
        </div>
        <Toggle
          on={announcement.enabled}
          onChange={(v) => patch({ announcement: { ...announcement, enabled: v } })}
          activeLabel="Açık"
          inactiveLabel="Kapalı"
        />
        <Field label="Duyuru metni">
          <textarea
            value={announcement.text}
            onChange={(e) => patch({ announcement: { ...announcement, text: e.target.value } })}
            placeholder="Örn: 14 Ağustos'ta 800 Robux paketinde %20 indirim var!"
            rows={2}
            className={textareaCls}
          />
        </Field>
        <p className="text-xs font-semibold text-muted-foreground">
          Site açıkken bu metin en üstte görünür. Boş bırakılırsa şerit gizlenir.
        </p>
        <button
          onClick={handleSendAnnouncement}
          disabled={sending || !announcement.text.trim()}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Gönder
        </button>
        {sent && (
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald">
            <ShieldCheck className="h-4 w-4" /> Duyuru yayınlandı.
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-gold" />
          <h3 className="text-base font-bold">Discord Davet Linki</h3>
        </div>
        <Field label="Discord sunucu davet linki">
          <input
            value={draft.discordInvite}
            onChange={(e) => patch({ discordInvite: e.target.value })}
            placeholder="https://discord.gg/..."
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function HeroTab({
  draft,
  patch,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
}) {
  const hero = draft.hero;
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-gold" />
        <h3 className="text-base font-bold">Ana Sayfa Hero Bölümü</h3>
      </div>
      <p className="text-xs font-semibold text-muted-foreground">
        Ana sayfanın en üstündeki başlık ve metinler buradan düzenlenir. Değişiklikler
        "Değişiklikleri Kaydet" butonuyla yayınlanır.
      </p>
      <Field label="Başlık — 1. kısım (normal)">
        <input
          value={hero.titlePart1}
          onChange={(e) => patch({ hero: { ...hero, titlePart1: e.target.value } })}
          placeholder="Robux'a en hızlı,"
          className={inputCls}
        />
      </Field>
      <Field label="Başlık — 2. kısım (altın vurgulu)">
        <input
          value={hero.titlePart2}
          onChange={(e) => patch({ hero: { ...hero, titlePart2: e.target.value } })}
          placeholder="en güvenilir yol"
          className={inputCls}
        />
      </Field>
      <Field label="Alt başlık / açıklama">
        <textarea
          value={hero.subtitle}
          onChange={(e) => patch({ hero: { ...hero, subtitle: e.target.value } })}
          placeholder="Siparişini Discord sunucumuzdaki sipariş botuyla..."
          rows={4}
          className={textareaCls}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ana buton metni (Discord)">
          <input
            value={hero.ctaLabel}
            onChange={(e) => patch({ hero: { ...hero, ctaLabel: e.target.value } })}
            placeholder="Discord Sunucusuna Katıl"
            className={inputCls}
          />
        </Field>
        <Field label="İkincil buton metni">
          <input
            value={hero.secondaryLabel}
            onChange={(e) => patch({ hero: { ...hero, secondaryLabel: e.target.value } })}
            placeholder="Nasıl Çalışır?"
            className={inputCls}
          />
        </Field>
      </div>
    </div>
  );
}

function StatsTab({
  draft,
  patch,
  password,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
  password: string;
}) {
  const stats = draft.stats ?? { visits: 0, orders: 0 };
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function adjustOrders(delta: number) {
    setBusy(true);
    setSaved(false);
    try {
      const next = Math.max(0, stats.orders + delta);
      const res = await updateStats({ data: { password, orders: next } });
      if (res.ok && res.stats) {
        patch({ stats: res.stats });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setSaved(false);
    } finally {
      setBusy(false);
    }
  }

  async function resetVisits() {
    setBusy(true);
    setSaved(false);
    try {
      const res = await updateStats({ data: { password, orders: stats.orders, visits: 0 } });
      if (res.ok && res.stats) {
        patch({ stats: res.stats });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setSaved(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold" />
            <h3 className="text-base font-bold">Site Ziyareti</h3>
          </div>
          <p className="mt-3 font-display text-4xl font-black text-gradient-gold">
            {stats.visits.toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Her ziyaretçi oturum başına bir kez sayılır.
          </p>
          <button
            onClick={resetVisits}
            disabled={busy || stats.visits === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
          >
            Sıfırla
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gold" />
            <h3 className="text-base font-bold">Toplam Sipariş</h3>
          </div>
          <p className="mt-3 font-display text-4xl font-black text-gradient-gold">
            {stats.orders.toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Tamamlanan sipariş sayacı — manuel güncellenir.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => adjustOrders(1)}
              disabled={busy}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-foreground transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              <Plus className="h-3.5 w-3.5" /> Artır
            </button>
            <button
              onClick={() => adjustOrders(-1)}
              disabled={busy || stats.orders === 0}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Azalt
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald">
          <ShieldCheck className="h-4 w-4" /> Sayaç güncellendi.
        </p>
      )}
    </div>
  );
}

function PackagesTab({
  draft,
  patch,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
}) {
  function updatePkg(i: number, p: Partial<Pkg>) {
    const packages = draft.packages.map((x, idx) => (idx === i ? { ...x, ...p } : x));
    patch({ packages });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Fiyatlandırma sayfasında gösterilen paketler ({draft.packages.length})
        </p>
        <button
          onClick={() =>
            patch({
              packages: [
                ...draft.packages,
                { amount: "Yeni Paket", price: "Aktif!", note: "Açıklama", perks: ["Özellik 1"], popular: false },
              ],
            })
          }
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-gold/50 hover:text-gold active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Paket Ekle
        </button>
      </div>

      {draft.packages.map((pkg, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-extrabold text-gold">Paket #{i + 1}</span>
            <button
              onClick={() => patch({ packages: draft.packages.filter((_, idx) => idx !== i) })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Sil
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Paket adı (örn. 800 Robux)">
              <input value={pkg.amount} onChange={(e) => updatePkg(i, { amount: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Fiyat / durum (örn. 65₺, Aktif!, Stokta yok)">
              <input value={pkg.price} onChange={(e) => updatePkg(i, { price: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <Field label="Açıklama">
            <input value={pkg.note} onChange={(e) => updatePkg(i, { note: e.target.value })} className={inputCls} />
          </Field>

          <Field label="Özellikler (her satıra bir özellik)">
            <textarea
              value={pkg.perks.join("\n")}
              onChange={(e) => updatePkg(i, { perks: e.target.value.split("\n") })}
              rows={3}
              className={textareaCls}
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!pkg.popular}
              onChange={(e) => updatePkg(i, { popular: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            En popüler paket olarak işaretle
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
            <input
              type="checkbox"
              checked={pkg.inStock !== false}
              onChange={(e) => updatePkg(i, { inStock: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className={pkg.inStock === false ? "text-destructive" : "text-emerald"}>
              {pkg.inStock === false ? "Stokta yok — buton pasif" : "Stokta — sipariş alınabilir"}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}

function PaymentTab({
  draft,
  patch,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
}) {
  function updateMethod(i: number, m: Partial<PaymentMethod>) {
    const paymentMethods = draft.paymentMethods.map((x, idx) => (idx === i ? { ...x, ...m } : x));
    patch({ paymentMethods });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Kabul edilen ödeme yöntemleri — sitede "Ödeme Yöntemleri" bölümünde gösterilir (
          {draft.paymentMethods.filter((m) => m.enabled).length} aktif)
        </p>
        <button
          onClick={() =>
            patch({
              paymentMethods: [...draft.paymentMethods, { name: "Yeni Yöntem", note: "Açıklama", enabled: true }],
            })
          }
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-gold/50 hover:text-gold active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Yöntem Ekle
        </button>
      </div>

      {draft.paymentMethods.map((method, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-extrabold text-gold">Yöntem #{i + 1}</span>
            <button
              onClick={() =>
                patch({ paymentMethods: draft.paymentMethods.filter((_, idx) => idx !== i) })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Sil
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Yöntem adı">
              <input
                value={method.name}
                onChange={(e) => updateMethod(i, { name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Açıklama">
              <input
                value={method.note}
                onChange={(e) => updateMethod(i, { note: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
            <input
              type="checkbox"
              checked={method.enabled}
              onChange={(e) => updateMethod(i, { enabled: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className={method.enabled ? "text-emerald" : "text-muted-foreground"}>
              {method.enabled ? "Aktif — sitede görünür" : "Pasif — sitede gizli"}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}

function FaqTab({
  draft,
  patch,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
}) {
  function updateFaq(i: number, f: Partial<FaqItem>) {
    const faqs = draft.faqs.map((x, idx) => (idx === i ? { ...x, ...f } : x));
    patch({ faqs });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          SSS bölümündeki sorular ({draft.faqs.length})
        </p>
        <button
          onClick={() => patch({ faqs: [...draft.faqs, { q: "Yeni soru", a: "Cevap" }] })}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-gold/50 hover:text-gold active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Soru Ekle
        </button>
      </div>

      {draft.faqs.map((faq, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-extrabold text-gold">Soru #{i + 1}</span>
            <button
              onClick={() => patch({ faqs: draft.faqs.filter((_, idx) => idx !== i) })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Sil
            </button>
          </div>

          <Field label="Soru">
            <input value={faq.q} onChange={(e) => updateFaq(i, { q: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Cevap">
            <textarea value={faq.a} onChange={(e) => updateFaq(i, { a: e.target.value })} rows={3} className={textareaCls} />
          </Field>
        </div>
      ))}
    </div>
  );
}

function TestimonialsTab({
  draft,
  patch,
}: {
  draft: SiteState;
  patch: (p: Partial<SiteState>) => void;
}) {
  function updateT(i: number, t: Partial<Testimonial>) {
    const testimonials = draft.testimonials.map((x, idx) => (idx === i ? { ...x, ...t } : x));
    patch({ testimonials });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Kaydıran yorum şeridindeki müşteri yorumları ({draft.testimonials.length})
        </p>
        <button
          onClick={() =>
            patch({
              testimonials: [
                ...draft.testimonials,
                { name: "Yeni Müşteri", handle: "@kullanici", rating: 5, text: "Süper hizmet!" },
              ],
            })
          }
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-gold/50 hover:text-gold active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Yorum Ekle
        </button>
      </div>

      {draft.testimonials.map((t, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border bg-surface/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-sm font-extrabold text-gold">Yorum #{i + 1}</span>
            <button
              onClick={() => patch({ testimonials: draft.testimonials.filter((_, idx) => idx !== i) })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/20 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Sil
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="İsim">
              <input value={t.name} onChange={(e) => updateT(i, { name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Kullanıcı adı (örn. @emrek)">
              <input value={t.handle} onChange={(e) => updateT(i, { handle: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <Field label={`Puan: ${t.rating} / 5`}>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => updateT(i, { rating: n })}
                  className={cn(
                    "p-1 transition-transform active:scale-90",
                    n <= t.rating ? "text-gold" : "text-border",
                  )}
                  aria-label={`${n} yıldız`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </Field>

          <Field label="Yorum metni">
            <textarea value={t.text} onChange={(e) => updateT(i, { text: e.target.value })} rows={3} className={textareaCls} />
          </Field>
        </div>
      ))}
    </div>
  );
}
