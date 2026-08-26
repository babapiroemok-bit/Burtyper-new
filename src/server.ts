import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { ADMIN_PASSWORD, readState, writeState } from "./lib/admin-store";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // /admin → Emniyet Genel Müdürlüğü yönlendirmesi
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      return new Response(null, {
        status: 302,
        headers: { Location: "https://www.egm.gov.tr" },
      });
    }

    // Bot (Discord) API uçları — koruma açıkken bile erişilebilir olmalı.
    if (
      request.method === "POST" &&
      (url.pathname === "/api/site/protection" || url.pathname === "/api/site/unlock-bot")
    ) {
      return handleSiteApi(request, env, url.pathname);
    }

    // DDoS koruması orta katmanı.
    try {
      if (await isProtectionEnabled(env)) {
        if (!isAllowedUnderProtection(url.pathname)) {
          return protectionResponse();
        }
      }
    } catch (error) {
      console.error("Koruma kontrol hatası:", error);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      normalized.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      normalized.headers.set("Pragma", "no-cache");
      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }
  },
};

function isAllowedUnderProtection(pathname: string): boolean {
  return (
    pathname === "/api/site/protection" ||
    pathname === "/api/site/unlock-bot" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_serverFn/") ||
    pathname === "/burtyper" ||
    pathname.startsWith("/burtyper/")
  );
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function protectionResponse(): Response {
  const html = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Burtyper — Koruma Altında</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0a14; color: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { text-align: center; padding: 48px 32px; max-width: 480px; }
    .shield { font-size: 72px; display: block; margin-bottom: 20px; }
    h1 { font-size: 26px; margin-bottom: 12px; }
    p { color: #9ca3af; line-height: 1.7; font-size: 15px; }
    .badge { display: inline-block; margin-top: 24px; padding: 8px 16px; border: 1px solid #f59e0b; color: #fbbf24; border-radius: 9999px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="shield">🛡️</span>
    <h1>Site Şu Anda DDoS Koruması Altında</h1>
    <p>Beklenmedik yüksek trafik tespit edildi. Güvenliğiniz için site geçici olarak korumaya alındı. Lütfen birkaç dakika sonra tekrar deneyin.</p>
    <span class="badge">Burtyper Güvenlik Ekibi</span>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 429,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "30",
      "cache-control": "no-store",
    },
  });
}

const PROTECTION_CACHE_TTL_MS = 5_000;
let protectionCache: { value: boolean; at: number } | undefined;

async function isProtectionEnabled(env: unknown): Promise<boolean> {
  if (protectionCache && Date.now() - protectionCache.at < PROTECTION_CACHE_TTL_MS) {
    return protectionCache.value;
  }
  let value = false;
  try {
    const state = await readState({ runtime: { cloudflare: { env } } });
    value = state.ddosProtection === true;
  } catch (error) {
    console.error("Koruma durumu okunamadı:", error);
  }
  protectionCache = { value, at: Date.now() };
  return value;
}

async function handleSiteApi(request: Request, env: unknown, pathname: string): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return json({ ok: false, error: "json-required" }, 415);
    }

    const body = (await request.json()) as Record<string, unknown>;
    const headerSecret = request.headers.get("x-bot-secret") ?? "";
    const secret = typeof body.secret === "string" && body.secret ? body.secret : headerSecret;

    const runtimeEnv = (env ?? {}) as Record<string, unknown>;
    const adminPassword = (runtimeEnv["ADMIN_PASSWORD"] as string | undefined) ?? ADMIN_PASSWORD;
    const botSecret = (runtimeEnv["BOT_UNLOCK_SECRET"] as string | undefined) ?? adminPassword;

    const authorized =
      secret === botSecret ||
      (typeof body.password === "string" && body.password === adminPassword);
    if (!authorized) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    const fakeReq = { runtime: { cloudflare: { env } } };

    if (pathname === "/api/site/unlock-bot") {
      const state = await readState(fakeReq);
      state.siteLocked = false;
      await writeState(state, fakeReq);
      return json({ ok: true, siteLocked: false });
    }

    // /api/site/protection
    const enabled = body.enabled === true;
    const state = await readState(fakeReq);
    state.ddosProtection = enabled;
    await writeState(state, fakeReq);
    protectionCache = { value: enabled, at: Date.now() };

    let cloudflare: unknown = null;
    const cfToken = runtimeEnv["CF_API_TOKEN"] as string | undefined;
    const cfZone = runtimeEnv["CF_ZONE_ID"] as string | undefined;
    if (cfToken && cfZone) {
      try {
        const cfRes = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${cfZone}/settings/security_level`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${cfToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: enabled ? "under_attack" : "high" }),
          },
        );
        const cfData = await cfRes.json().catch(() => null);
        cloudflare = { ok: cfRes.ok, data: cfData };
      } catch (error) {
        console.error("Cloudflare API hatası:", error);
        cloudflare = { ok: false, error: "cf-api-failed" };
      }
    }

    const verify = await readState(fakeReq);
    return json(
      {
        ok: true,
        ddosProtection: enabled,
        verified: verify.ddosProtection === enabled,
        cloudflare,
      },
      200,
    );
  } catch (error) {
    console.error("[site-api]", error);
    return json({ ok: false, error: "internal" }, 500);
  }
}
