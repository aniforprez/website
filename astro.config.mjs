// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://aniforprez.dev",
  redirects: {
    "/blog/": "/blog/1",
    "/blog/recommends": "/blog/recommends/1",
    "/blog/tags/[tag]": "/blog/tags/[tag]/1",
  },
  markdown: {
    remarkPlugins: ["remark-sectionize"],
    shikiConfig: { theme: "slack-dark" },
  },

  integrations: [
    expressiveCode({
      themes: ["slack-dark"],
      styleOverrides: {
        uiFontFamily: "JetBrains Mono Variable, sans-serif",
        codeFontFamily: "JetBrains Mono Variable, sans-serif",
        uiFontSize: "12px",
        borderRadius: "0px",
        frames: {
          shadowColor: "transparent",
          editorTabBarBackground: "var(--color-stone-900)",
          editorTabBarBorderBottomColor: "oklch(37.4% 0.01 67.558)",
          editorActiveTabIndicatorHeight: "2px",
          editorActiveTabIndicatorTopColor: "var(--color-emerald-600)",
          terminalTitlebarBackground: "var(--color-stone-900)",
        },
      },
    }),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify({
    edgeMiddleware: true,
  }),
});
