# Marine Data Science Website

This repository contains the static website for the Marine Data Science research group at the University of Rostock.

The site is built with Astro, TypeScript, and MDX content collections. It is designed for GitHub Pages and publishes the generated `dist/` output, not the raw source folders.

## Most Common Task: Edit Website Content

If you want to add or update people, research topics, projects, teaching items, or thesis topics, start here:

**[Content editing guide](content/README.md)**

That guide explains where to create files, which fields are required, how images work, and how to decide whether an item gets its own detail page.

You usually do not need to edit files in `src/` for routine content changes.

## How This Repository Started

This website began as an AI-agent workshop and demo project. The first version was created from prepared website content, a design direction document, and implementation prompts. The prompt material was useful during the workshop phase, but it is no longer website source and has been removed from the repository.

The durable source structure is now:

- `content/` for editable website content and content-owned images
- `docs/` for architecture notes, design direction, and ADRs
- `public/brand/` for static logo assets
- `src/` for the Astro implementation

## Important Documentation

- [Content editing guide](content/README.md)
- [Architecture overview](docs/architecture.md)
- [Design direction](docs/design-direction.md)
- [Design source assets](docs/design-assets/)
- [Architectural decision records](docs/adr/)
- [Source issues for human review](docs/content-review/source-issues.md)

## Content Editing Access

Access for editing the website content is managed through GitHub team membership.

New editors should be added to the [MDS-Staff team](https://github.com/orgs/marine-data-science/teams/mds-staff) in the [Marine Data Science GitHub organization](https://github.com/marine-data-science). Members of that team have `write` permission on this repository and can edit the website content through the normal GitHub workflow.

## Content Model In One Minute

Each website item is an `.mdx` file. Metadata lives at the top of the file between `---` lines, and the page text comes below it.

Examples:

- `content/people/anna.mdx`
- `content/research/ml-micro.mdx`
- `content/projects/data4sim.mdx`
- `content/teaching/egoproject2026.mdx`
- `content/theses/uncertainty-aware-stenoses-segmentation.mdx`

Overview pages such as `content/research/index.mdx` should only contain page-level introduction text. They should not contain arrays of people, projects, or topics. The website builds those lists from the individual item files. The visible title, eyebrow label, short description, and optional introduction text for an overview page are managed in that overview page's `index.mdx`.

The homepage is composed in `content/pages/home.mdx`. Its hero text comes from `title`, `eyebrow`, `summary`, and the Markdown body. Its `sections` list controls which collections appear on the homepage, in which order, and how many entries are shown from each collection. Section titles and descriptions still come from the matching `content/<collection>/index.mdx` files.

## Development

Install dependencies:

```sh
npm install
```

Run the local development server:

```sh
npm run dev
```

Run tests:

```sh
npm test
```

Run the production check and build:

```sh
npm run build
```

## Deployment

The site deploys to GitHub Pages through `.github/workflows/deploy-pages.yml`.

The expected public URL is:

https://marine-data-science.github.io/mds-website/

SEO-facing absolute URLs are generated from the Astro deployment settings. The default build targets the temporary GitHub Pages URL above. For the future `mds-lab.de` domain, build with:

```sh
PUBLIC_SITE_URL=https://www.mds-lab.de PUBLIC_BASE_PATH=/ npm run build
```

The repository must be configured in GitHub under Settings -> Pages -> Build and deployment -> Source: GitHub Actions.
