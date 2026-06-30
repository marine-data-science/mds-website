# ADR 0004: GitHub Pages Deployment

## Status

Accepted

## Context

The site is a static Astro application intended for GitHub Pages. The repository is `marine-data-science/mds-website`, so the public URL is expected to live under the repository path rather than the organization root.

The repository also contains source-only folders and demo planning prompts that must not be published as raw files.

## Decision

Deploy the site with GitHub Pages using `.github/workflows/deploy-pages.yml`.

The workflow:

- runs on pushes to `main` only when site-relevant files change
- installs dependencies with `npm ci`
- runs the production build with `npm run build`
- uploads only `dist/` with `actions/upload-pages-artifact`
- deploys with `actions/deploy-pages`
- uses minimal permissions: `contents: read`, `pages: write`, and `id-token: write`

Configure Astro with:

- `site: "https://marine-data-science.github.io"`
- `base: "/mds-website"`

Internal links and local asset URLs should use the shared base-path helper so repository-based Pages hosting works consistently.

Maintainers must enable GitHub Pages from GitHub Actions in the repository settings: Settings -> Pages -> Build and deployment -> Source: GitHub Actions.

## Consequences

The generated site should publish at `https://marine-data-science.github.io/mds-website/` after the workflow runs successfully on `main`.

Only processed static output is uploaded. Raw source-only folders, architecture docs, ADRs, and prepared prompts are not published unless a file is intentionally transformed into the generated Astro output.
