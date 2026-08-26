import { useState, type ReactNode } from "react";
import { Loader2, AlertTriangle, RefreshCw, Bot, Users, Zap, Hash, Crown, Wifi } from "lucide-react";
import { fetchDiscordBotData, type SiteState } from "@/lib/admin-store";

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-accent/60";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StatCard({ icon, label, value, sub }: { icon: ReactNode; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-5">
      <div className="flex items-center gap-2 text-gold">{icon}<span className="text-xs font-bold">{label}</span></div>
      <p className="mt-2 font-display text-3xl font-black text-gradient-gold">{typeof value === "number" ? value.toLocaleString("tr-TR") : value}</p>
      {sub && <p className="mt-1 text-xs font-semibold text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function DiscordTab({ password, draft, patch }: { password: string; draft: SiteState; patch: (p: Partial<SiteState>) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botData, setBotData] = useState<Record<string, unknown> | null>(null);

  async function fetchBotData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDiscordBotData({ data: { password } });
      if (res.ok && res.data) {
        setBotData(res.data as Record<string, unknown>);
      } else {
        setError(res.error === "no-api-url" ? "Bot API URL'si ayarlanmamis." : "Hata: " + res.error);
      }
    } catch {
      setError("Baglanti hatasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-border bg-surface/50 p-5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-gold" />
          <h3 className="text-base font-bold">Discord Bot Ayarlari</h3>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">
          Bot API adresini girerek sunucu bilgilerini buradan takip edebilirsiniz.
        </p>
        <Field label="Bot API URL (orn. https://bot-servis.up.railway.app)">
          <input
            value={draft.botApiUrl || ""}
            onChange={(e) => patch({ botApiUrl: e.target.value })}
            placeholder="https://bot-servis.up.railway.app"
            className={inputCls}
          />
        </Field>
        <Field label="API Secret (varsayilan: Ruhi321ka)">
          <input
            value={draft.botApiSecret || ""}
            onChange={(e) => patch({ botApiSecret: e.target.value })}
            placeholder="Ruhi321ka"
            className={inputCls}
          />
        </Field>
      </div>

      <button
        onClick={fetchBotData}
        disabled={loading || !draft.botApiUrl}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-foreground transition-all active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Sunucu Bilgilerini Cek
      </button>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {botData && (
        <div className="space-y-6">
          {Object.entries(botData).map(([guildId, guildRaw]) => {
            const g = guildRaw as Record<string, unknown>;
            const ch = (g.channels || {}) as Record<string, number>;
            const rl = (g.roles || {}) as Record<string, unknown>;
            const rlList = (rl.list || []) as Array<Record<string, unknown>>;
            const members = (g.topMembers || []) as Array<Record<string, unknown>>;

            return (
              <div key={guildId} className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-5">
                  {g.icon && <img src={g.icon as string} alt="" className="h-16 w-16 rounded-2xl" />}
                  <div>
                    <h3 className="font-display text-xl font-extrabold">{g.name as string}</h3>
                    <p className="text-sm font-semibold text-muted-foreground">
                      ID: {guildId} | Kurulus: {g.createdAt ? new Date(g.createdAt as string).toLocaleDateString("tr-TR") : "?"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Son guncelleme: {g.fetchedAt ? new Date(g.fetchedAt as string).toLocaleString("tr-TR") : "?"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard icon={<Users className="h-5 w-5" />} label="Toplam Uye" value={g.memberCount as number} sub={`${g.humans as number} insan, ${g.bots as number} bot`} />
                  <StatCard icon={<Wifi className="h-5 w-5" />} label="Online" value={g.online as number} sub="Aktif uye" />
                  <StatCard icon={<Zap className="h-5 w-5" />} label="Boost" value={g.boostCount as number} sub={"Seviye " + (g.boostTier as number)} />
                  <StatCard icon={<Hash className="h-5 w-5" />} label="Kanallar" value={ch.total as number} sub={`${ch.text as number} yazi, ${ch.voice as number} ses`} />
                </div>

                <div className="rounded-2xl border border-border bg-surface/50 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <Crown className="h-4 w-4 text-gold" /> Roller ({rlList.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {rlList.slice(0, 30).map((r) => (
                      <span
                        key={r.id as string}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/50 px-2.5 py-1 text-xs font-bold"
                        style={r.color && r.color !== "#000000" ? { borderColor: r.color as string, color: r.color as string } : {}}
                      >
                        {r.name as string}
                        <span className="text-muted-foreground">({r.memberCount as number})</span>
                      </span>
                    ))}
                    {rlList.length > 30 && <span className="text-xs text-muted-foreground">+{rlList.length - 30} daha...</span>}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface/50 p-5">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <Users className="h-4 w-4 text-gold" /> Son Katilan 20 Uye
                  </h4>
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div key={m.id as string} className="flex items-center gap-3 rounded-xl bg-background/50 px-4 py-2.5">
                        <img src={m.avatar as string} alt="" className="h-8 w-8 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-bold">{(m.displayName as string) || (m.username as string)}</p>
                          <p className="text-xs font-semibold text-muted-foreground">
                            @{m.username as string} | {m.joinedAt ? new Date(m.joinedAt as string).toLocaleDateString("tr-TR") : "?"}
                          </p>
                        </div>
                        <span className={"inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold " + (m.status === "online" ? "bg-emerald/20 text-emerald" : m.status === "idle" ? "bg-yellow-500/20 text-yellow-400" : m.status === "dnd" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400")}>
                          {m.isBoosting ? "BOOST" : (m.status as string)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
