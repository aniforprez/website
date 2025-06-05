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
    "/recommends": "/recommends/1",
  },

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
