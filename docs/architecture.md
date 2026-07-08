# Architecture Overview

This document describes the current architecture of the Marine Data Science static website.

## Static Site Approach

The site is an Astro application with TypeScript, MDX, and Astro content collections. It builds to static files that can be deployed to GitHub Pages.

The default architecture avoids unnecessary client-side JavaScript. Interactive behavior should only be added when it improves a concrete user workflow and still works well on a static host.

## Deployment

Production deployment uses GitHub Pages from the static Astro build output in `dist/`. The GitHub Actions workflow at `.github/workflows/deploy-pages.yml` runs for pushes to `main` that affect site source, content, docs, package/config files, or the workflow itself.

Astro defaults to `site: "https://marine-data-science.github.io"` and `base: "/mds-website"` for repository-based Pages hosting at `https://marine-data-science.github.io/mds-website/`. Those values can be overridden at build time with `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH`; use `PUBLIC_SITE_URL=https://www.mds-lab.de PUBLIC_BASE_PATH=/` when publishing the site at the future root domain. Internal routes, local asset URLs, canonical URLs, sitemap entries, and social preview URLs must pass through the shared site helpers so links continue to work under either hosting shape.

The Pages artifact must remain the generated `dist/` directory. Source folders such as `content/` and `docs/` are not uploaded directly; only processed site output and static files under `public/` are published.

Maintainers must configure the GitHub repository under Settings -> Pages -> Build and deployment -> Source: GitHub Actions before the workflow can publish the site.

## Source Inputs

- `content/` contains website MDX content, local content assets, and the editorial guide for content maintainers.
- `content/README.md` is the first document to read when adding or updating people, research topics, projects, teaching items, or thesis topics.
- `docs/design-direction.md` contains the visual direction for the site.
- `docs/design-assets/` contains design source files that are useful for reference but are not loaded by the website.
- `public/brand/` contains static logo assets used by the layout.
- `docs/adr/` contains architectural decision records.

The former demo prompt material has been removed. It is not a website source and must not be restored as routed content or deployed output.

## Content Layer

Structured content is defined in `src/content.config.ts` using Astro content collections.

The content model uses item files as the source of truth:

- Overview pages such as `content/research/index.mdx` provide page-level metadata and copy only. `title`, `eyebrow`, and `summary` come from frontmatter; the Markdown body is rendered below the page introduction.
- Item files such as `content/research/ml-micro.mdx` provide title, summary, image, tags, and detail-page behavior for that item.
- Overview pages must not contain frontmatter arrays of item data.
- The homepage is configured by `content/pages/home.mdx`. Its `title`, `eyebrow`, and `summary` control the hero. Its optional `sections` array controls which collections appear on the homepage, in which order, and with which item limit. Section titles and descriptions still come from the matching collection overview files.
- Other files in `content/pages/` are standalone Markdown-backed pages. They are rendered at `/<filename>/`, but they are not added to the main navigation or any overview automatically. Use them for stable, externally linked landing pages such as partner or network entry points.

There are two different overview mechanisms:

- Collection overview routes such as `/research/`, `/projects/`, `/people/`, `/teaching/`, and `/theses/` load their own `content/<collection>/index.mdx` for page-level copy, then list item files from the same collection.
- The homepage loads `content/pages/home.mdx` for the hero and uses `home.mdx.sections` as a composition list. Each section entry points to a collection and may set `limit` to a number or `all`. The homepage then loads section title and description from that collection's `index.mdx` and item cards from the collection entries.

The `sections` array is intentionally not an item-data array. It contains only collection references and display limits. Item metadata must remain in the item MDX files.

The content helper in `src/lib/content.ts` loads entries from Astro collections, sorts them by `order`, resolves local content assets, and prepares view models for overview cards and detail pages.

## Rendering Layer

Reusable Astro components handle common page patterns:

- global layout and navigation
- page introductions
- cards for research topics, projects, teaching items, and previews
- people rows
- thesis topic rows
- metadata rows on detail pages
- prose rendering for MDX bodies and publication lists

Rendering components receive prepared content data. They should not contain hand-copied page content.

## Core Pages

The site includes:

- Home
- Research
- Projects
- People
- Theses
- Teaching
- Publications

Research, Projects, People, Theses, and Teaching are collection-backed content areas. Publications remain a compact year-grouped page.

Standalone pages from `content/pages/*.mdx`, except `home.mdx`, may also be published for explicit external links. They are intentionally outside the top-level navigation unless the navigation is changed by hand.

## Content Area Behavior

- People: one MDX file per person. `detailPage: true` creates a local profile page, `detailPage: false` keeps the person overview-only, and an external URL links to an external profile. `alumni: true` moves a person into the Alumni list below current members.
- Research: one MDX file per research topic. Tags and summaries come from the topic frontmatter.
- Projects: only active project files are listed. Funding, duration, partners, and contacts live in the project frontmatter.
- Teaching: semester projects, teaching material, and summer schools are item files under `content/teaching/`.
- Theses: every topic is an item file. Topics with full text use `detailPage: true`; list-only topics use `detailPage: false`. `status` groups topics on the Theses overview, while `keywords` provide the blue teaser pills.
- Publications: grouped by year from `content/publications/index.mdx`; no individual publication pages are generated.

## Quality Bar

Keep the codebase maintainable enough to continue beyond the demo. Prefer typed, testable helpers over one-off parsing embedded in components. Add tests for content loading, schema validation, route derivation, and source-boundary behavior where regressions are plausible.
