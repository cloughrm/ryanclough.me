import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { rmSync } from "node:fs";
import { SITE } from "./src/config";

const isDisabledRoute = (page: string) => {
  const { pathname } = new URL(page, SITE.website);
  return (
    (!SITE.showArchives && pathname.startsWith("/archives")) ||
    (!SITE.showTags && pathname.startsWith("/tags"))
  );
};

const removeDisabledRoutes = {
  name: "remove-disabled-routes",
  hooks: {
    "astro:build:done": ({ dir }: { dir: URL }) => {
      if (!SITE.showArchives) {
        rmSync(new URL("./archives", dir), { recursive: true, force: true });
      }

      if (!SITE.showTags) {
        rmSync(new URL("./tags", dir), { recursive: true, force: true });
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => !isDisabledRoute(page),
    }),
    removeDisabledRoutes,
  ],
  markdown: {
    // remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    layout: "constrained",
    responsiveStyles: true,
  },
});
