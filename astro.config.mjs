// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

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

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify({
    edgeMiddleware: true,
  }),
});
