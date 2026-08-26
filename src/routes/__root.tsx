import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-gradient-gold">404</h1>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground">Sayfa Bulunamadı</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
          <br />
          Ana sayfaya dönerek yoluna devam edebilirsin.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-foreground transition-all active:scale-[0.98]"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Ana Sayfaya Dön
          </a>
          <a
            href="https://discord.gg/8egH5kMQYB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            Discord'a Katıl
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Burtyper — Discord Bot Satış | Robux Satış Sitesi" },
      {
        name: "description",
        content: "Burtyper ile Discord bot üzerinden hızlı, güvenli ve şeffaf Robux satış. 7/24 aktif destek, anında teslimat. Discord bot satış sitesi.",
      },
      {
        name: "keywords",
        content: "burtyper, discord bot satış, robux satış, robux satın al, discord sipariş botu, robux bot, güvenli robux, discord satış sitesi, robux fiyatları",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://burtyper.pages.dev/" },
      { property: "og:title", content: "Burtyper — Discord Bot Satış | Robux Satış Sitesi" },
      {
        property: "og:description",
        content: "Discord bot ile hızlı, güvenli ve şeffaf Robux satış deneyimi. 7/24 aktif destek, anında teslimat.",
      },
      { property: "og:site_name", content: "Burtyper" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Burtyper — Discord Bot Satış | Robux Satış Sitesi" },
      {
        name: "twitter:description",
        content: "Discord bot ile hızlı, güvenli ve şeffaf Robux satış deneyimi.",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Burtyper" },
      { name: "theme-color", content: "#1a1a2e" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
