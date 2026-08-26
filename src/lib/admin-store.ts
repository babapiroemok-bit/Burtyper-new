export async function botFetch(apiUrl: string, apiSecret: string, path: string, method = 'GET', body?: unknown): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  let base = apiUrl.replace(/\/+$/, '');
  if (!base) return { ok: false, error: 'Bot API URL girilmemis.' };
  if (!base.startsWith('http')) base = 'https://' + base;
  const sep = path.includes('?') ? '&' : '?';
  const fullUrl = base + path + sep + 'secret=' + encodeURIComponent(apiSecret);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const r = await fetch(fullUrl, { method, headers: { 'Content-Type': 'application/json', 'X-API-Secret': apiSecret }, body: body && method !== 'GET' ? JSON.stringify(body) : undefined, signal: controller.signal });
    clearTimeout(timeout);
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      let msg = 'HTTP ' + r.status;
      try { const j = JSON.parse(text); if (j.error) msg += ': ' + j.error; } catch {}
      return { ok: false, error: msg };
    }
    return await r.json();
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') return { ok: false, error: 'Baglanti zaman asimi (20sn) — bot API calismiyor olabilir.' };
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

import { createServerFn } from "@tanstack/react-start";
import {
  DISCORD_INVITE,
  PACKAGES,
  FAQS,
  TESTIMONIALS,
  PAYMENT_METHODS,
  type Pkg,
  type FaqItem,
  type Testimonial,
  type PaymentMethod,
} from "@/lib/site-config";

export type Announcement = {
  enabled: boolean;
  text: string;
};

export type HeroSettings = {
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  ctaLabel: string;
  secondaryLabel: string;
};

export type SiteStats = {
  visits: number;
  orders: number;
};

export type SiteState = {
  ordersClosed: boolean;
  siteLocked: boolean;
  ddosProtection: boolean;
  lockMessage?: string;
  announcement: Announcement;
  discordInvite: string;
  hero: HeroSettings;
  packages: Pkg[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  paymentMethods: PaymentMethod[];
  stats: SiteStats;
  botApiUrl?: string;
  botApiSecret?: string;
};

export const DEFAULT_HERO: HeroSettings = {
  titlePart1: "Bot ile satışta en hızlı,",
  titlePart2: "en güvenilir yol",
  subtitle:
    "Siparişini Discord sunucumuzdaki sipariş botuyla saniyeler içinde oluştur; ödemen onaylandığı anda bakiyen güvenle teslim edilsin. Şifre yok, karmaşa yok, bekleme yok.",
  ctaLabel: "Discord Sunucusuna Katıl",
  secondaryLabel: "Nasıl Çalışır?",
};

export const DEFAULT_STATE: SiteState = {
  ordersClosed: false,
  siteLocked: false,
  ddosProtection: false,
  announcement: { enabled: false, text: "" },
  discordInvite: DISCORD_INVITE,
  hero: DEFAULT_HERO,
  packages: PACKAGES,
  faqs: FAQS,
  testimonials: TESTIMONIALS,
  paymentMethods: PAYMENT_METHODS,
  stats: { visits: 0, orders: 0 },
  botApiUrl: "",
  botApiSecret: "Ruhi321ka",
};

const STORE_NAME = "burtyper-admin-state";
const KEY = "site-state";

// Şifre: Cloudflare Pages'de ADMIN_PASSWORD ortam değişkeni ile değiştirilebilir.
// Aksi takdirde aşağıdaki varsayılan şifre geçerlidir.
export const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "Ruhi321ka";

interface KVNamespace {
  get(key: string, type?: "text" | "json"): Promise<string | null | Record<string, unknown>>;
  put(key: string, value: string): Promise<void>;
}

// Nitro cloudflare-pages preset'inde env, fetch(cfReq, env, ctx) parametresinden gelir
// ve augmentReq tarafından request.runtime.cloudflare.env içine konur.
// (cloudflare-module preset'te globalThis.__env__ set edilir — fallback olarak o da denenir.)
type CloudflareRequest = Request & {
  runtime?: { cloudflare?: { env?: Record<string, unknown> } };
};

function getEnvFromRequest(request: unknown): Record<string, unknown> | undefined {
  const req = request as CloudflareRequest | undefined;
  return (
    req?.runtime?.cloudflare?.env ??
    (globalThis as unknown as { __env__?: Record<string, unknown> }).__env__
  );
}

function getKV(request?: unknown): KVNamespace | null {
  const env = getEnvFromRequest(request);
  return (env?.["ADMIN_STATE_KV"] as KVNamespace | undefined) ?? null;
}

async function readState(request?: unknown): Promise<SiteState> {
  try {
    const kv = getKV(request);
    if (!kv) return DEFAULT_STATE;
    const data = await kv.get(KEY, "json");
    return data ? { ...DEFAULT_STATE, ...(data as Partial<SiteState>) } : DEFAULT_STATE;
  } catch (error) {
    console.error("admin-store read hatası:", error);
    return DEFAULT_STATE;
  }
}

export { readState };

async function writeState(state: SiteState, request?: unknown): Promise<void> {
  try {
    const kv = getKV(request);
    if (!kv) return;
    await kv.put(KEY, JSON.stringify(state));
  } catch (error) {
    console.error("admin-store write hatası:", error);
    throw error;
  }
}

export { writeState };

/** Public: Hero ve diğer bileşenlerin okuduğu durum. */
export const getSiteStatus = createServerFn({ method: "GET" }).handler(async (ctx) => {
  return readState((ctx as { request?: unknown }).request);
});

/** Şifre doğrulama (state değiştirmez). */
export const verifyAdmin = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    return { ok: data.password === ADMIN_PASSWORD };
  });

/** Şifre + state güncelleme. */
export const setSiteStatus = createServerFn({ method: "POST" })
  .validator(
    (d: unknown) =>
      d as {
        password: string;
        ordersClosed?: boolean;
        siteLocked?: boolean;
        ddosProtection?: boolean;
        lockMessage?: string;
        announcement?: Announcement;
        discordInvite?: string;
        hero?: HeroSettings;
        packages?: Pkg[];
        faqs?: FaqItem[];
        testimonials?: Testimonial[];
        paymentMethods?: PaymentMethod[];
        botApiUrl?: string;
        botApiSecret?: string;
      },
  )
  .handler(async (ctx) => {
    const data = ctx.data;
    if (data.password !== ADMIN_PASSWORD) {
      return { ok: false, error: "wrong-password" as const };
    }
    const request = (ctx as { request?: unknown }).request;
    const state = await readState(request);
    if (data.ordersClosed !== undefined) state.ordersClosed = data.ordersClosed;
    if (data.siteLocked !== undefined) state.siteLocked = data.siteLocked;
    if (data.ddosProtection !== undefined) state.ddosProtection = data.ddosProtection;
    if (data.lockMessage !== undefined) state.lockMessage = data.lockMessage;
    if (data.announcement !== undefined) state.announcement = data.announcement;
    if (data.discordInvite !== undefined) state.discordInvite = data.discordInvite;
    if (data.hero !== undefined) state.hero = data.hero;
    if (data.packages !== undefined) state.packages = data.packages;
    if (data.faqs !== undefined) state.faqs = data.faqs;
    if (data.testimonials !== undefined) state.testimonials = data.testimonials;
    if (data.paymentMethods !== undefined) state.paymentMethods = data.paymentMethods;
    if (data.botApiUrl !== undefined) state.botApiUrl = data.botApiUrl;
    if (data.botApiSecret !== undefined) state.botApiSecret = data.botApiSecret;
    await writeState(state, request);
    return { ok: true, state };
  });

/** Public: ziyaret sayacını artırır (hero/index tarafından çağrılır). */
export const trackVisit = createServerFn({ method: "POST" }).handler(async (ctx) => {
  const request = (ctx as { request?: unknown }).request;
  const state = await readState(request);
  state.stats = { ...state.stats, visits: (state.stats?.visits ?? 0) + 1 };
  await writeState(state, request);
  return state.stats;
});

/** Şifre + sayaç güncelleme (sipariş sayacını artır/azalt/sıfırla). */
export const updateStats = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string; orders?: number; visits?: number })
  .handler(async (ctx) => {
    const data = ctx.data;
    if (data.password !== ADMIN_PASSWORD) {
      return { ok: false, error: "wrong-password" as const };
    }
    const request = (ctx as { request?: unknown }).request;
    const state = await readState(request);
    if (data.orders !== undefined) state.stats = { ...state.stats, orders: data.orders };
    if (data.visits !== undefined) state.stats = { ...state.stats, visits: data.visits };
    await writeState(state, request);
    return { ok: true, stats: state.stats };
  });

/** Discord bot API'sinden sunucu bilgilerini çek. */
export const fetchDiscordBotData = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { password: string })
  .handler(async (ctx) => {
    const data = ctx.data;
    if (data.password !== ADMIN_PASSWORD) {
      return { ok: false, error: "wrong-password" as const };
    }
    const request = (ctx as { request?: unknown }).request;
    const state = await readState(request);
    let apiUrl = state.botApiUrl;
    const apiSecret = state.botApiSecret || "Ruhi321ka";
    if (!apiUrl) {
      return { ok: false, error: "no-api-url" as const };
    }
    if (!apiUrl.startsWith("http")) apiUrl = "https://" + apiUrl;
    try {
      const res = await fetch(`${apiUrl}/api/server-info?secret=${encodeURIComponent(apiSecret)}`, {
        headers: { "X-API-Secret": apiSecret },
      });
      if (!res.ok) return { ok: false, error: `http-${res.status}` };
      const json = (await res.json()) as Record<string, unknown>;
      if (!json.ok) return { ok: false, error: "api-error" };
      return { ok: true, data: json.servers };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  });

export const botApiCall = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as { path: string; method?: string; body?: unknown })
  .handler(async (ctx) => {
    const { path: apiPath, method = 'GET', body } = ctx.data;
    const request = (ctx as { request?: unknown }).request;
    const state = await readState(request);
    let url = state.botApiUrl;
    const secret = state.botApiSecret || 'Ruhi321ka';
    if (!url) return { ok: false, error: 'Bot API URL ayarlanmamis' as const };
    if (!url.startsWith('http')) url = 'https://' + url;
    try {
      const opts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json', 'X-API-Secret': secret },
      };
      if (body && method !== 'GET') opts.body = JSON.stringify(body);
      const sep = url.includes('?') ? '&' : '?';
      const res = await fetch(`${url}${apiPath}${sep}secret=${encodeURIComponent(secret)}`, opts);
      const json = (await res.json()) as { ok: boolean; data?: unknown; error?: string };
      return json;
    } catch (err) {
      return { ok: false, error: (err as Error).message as string };
    }
  });
