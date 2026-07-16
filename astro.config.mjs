import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { postAssetsPlugin } from "./src/lib/postAssetsPlugin.ts";
import markdownNegotiation from "./src/integrations/markdown-negotiation";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.nukehub.org",
  output: "static",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Keep the PWA offline fallback out of the sitemap — it should never be indexed.
      filter: (page) => page !== "https://blog.nukehub.org/offline/",
    }),
    markdownNegotiation(),
  ],
  vite: {
    plugins: [tailwindcss(), postAssetsPlugin()],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@data": "/src/data",
        "@styles": "/src/styles",
        "@lib": "/src/lib",
        "@content": "/src/content",
      },
    },
  },
});
