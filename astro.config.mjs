import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://marine-data-science.github.io",
  base: process.env.PUBLIC_BASE_PATH ?? "/mds-website",
  integrations: [mdx()],
  output: "static",
});
