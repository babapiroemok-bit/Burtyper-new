// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    // Deploy target for Cloudflare Pages: emits static assets in dist/ plus a
    // single-file Pages Function (dist/_worker.js) for SSR. Pages' build
    // output directory must be set to "dist".
    preset: "cloudflare-pages",
    output: {
      dir: "{{ rootDir }}/dist",
      publicDir: "{{ output.dir }}",
      serverDir: "{{ output.dir }}/_worker.js",
    },
  },
});
