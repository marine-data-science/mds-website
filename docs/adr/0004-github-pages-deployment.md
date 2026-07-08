# ADR 0004: GitHub Pages Deployment

## Status

Accepted

## Context

The site is a static Astro application intended for GitHub Pages. The repository is `marine-data-science/mds-website`, so the public URL is expected to live under the repository path rather than the organization root.

The repository contains source-only content and documentation folders that must not be published as raw files.

## Decision

Deploy the site with GitHub Pages using `.github/workflows/deploy-pages.yml`.

The workflow:

- runs on pushes to `main` only when site-relevant files change
- installs dependencies with `npm ci`
- runs the production build with `npm run build`
- uploads only `dist/` with `actions/upload-pages-artifact`
- deploys with `actions/deploy-pages`
- uses minimal permissions: `contents: read`, `pages: write`, and `id-token: write`

Configure Astro by default with:

- `site: "https://marine-data-science.github.io"`
- `base: "/mds-website"`

The default values support the temporary GitHub Pages URL. The same implementation also supports the future root-domain deployment by setting:

- `PUBLIC_SITE_URL=https://www.mds-lab.de`
- `PUBLIC_BASE_PATH=/`

Internal links, local asset URLs, canonical URLs, sitemap entries, and social preview URLs should use the shared site helpers so repository-based Pages hosting and root-domain hosting both work consistently.

Maintainers must enable GitHub Pages from GitHub Actions in the repository settings: Settings -> Pages -> Build and deployment -> Source: GitHub Actions.

## Consequences

The generated site should publish at `https://marine-data-science.github.io/mds-website/` after the workflow runs successfully on `main`. When the site moves to `mds-lab.de`, the deployment environment can switch the public origin and base path without changing source routes.

Only processed static output is uploaded. Raw source-only folders, architecture docs, and ADRs are not published unless a file is intentionally transformed into the generated Astro output.
