import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://marine-data-science.github.io",
  base: "/mds-website",
  integrations: [mdx()],
  output: "static",
});
