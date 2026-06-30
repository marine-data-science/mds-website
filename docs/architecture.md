# Architecture Overview

This document describes the intended architecture for the Marine Data Science static website.

## Static Site Approach

The site should be implemented as a static Astro application with TypeScript and MDX/content collections. The generated output must be suitable for GitHub Pages deployment.

The default architecture should avoid unnecessary client-side JavaScript. Interactive behavior can be added later only when it improves a concrete user workflow and still works well on a static host.

## Deployment

Production deployment uses GitHub Pages from the static Astro build output in `dist/`. The GitHub Actions workflow at `.github/workflows/deploy-pages.yml` runs only for pushes to `main` that affect site source, styling assets, package/config files, or the workflow itself.

Astro is configured with `site: "https://marine-data-science.github.io"` and `base: "/mds-website"` for repository-based Pages hosting at `https://marine-data-science.github.io/mds-website/`. Internal routes and local asset URLs must pass through the shared base-path helper so links continue to work under the repository path.

The Pages artifact must remain the generated `dist/` directory. Source-only folders such as `1 - content/`, `2 - styling/`, `docs/`, and `3 - prepared prompts/` must not be uploaded directly; only processed content and assets that are part of the generated Astro output are published.

Maintainers must configure the GitHub repository under Settings -> Pages -> Build and deployment -> Source: GitHub Actions before the workflow can publish the site.

## Source Inputs

- `1 - content/` contains prepared MDX content and local content assets.
- `2 - styling/` contains the visual direction and logo assets.
- `3 - prepared prompts/` contains demo workflow notes and must not be routed or published as website content.

The implementation should preserve the prepared source folders and read from them rather than moving or duplicating the material into component files.

## Content Layer

The content layer should load and validate source material before rendering. Use typed Astro content collections or equivalent TypeScript helpers once the scaffold exists.

The content layer is responsible for:

- preserving source provenance such as `sourceUrl`
- resolving local image references from `1 - content/assets/`
- exposing structured data for overview pages
- supporting detail pages where source files exist
- documenting source inconsistencies rather than hiding them

## Rendering Layer

The rendering layer should use reusable Astro components for common page patterns:

- global layout and navigation
- page shells and section headers
- cards for people, research topics, projects, and thesis topics
- metadata rows for roles, contacts, funding, duration, publications, and source links
- contact and related-content sections

Rendering components should receive prepared content data. They should not contain hand-copied page content.

## Core Pages

The initial site should include:

- Home
- Research
- Projects
- People
- Theses
- Teaching
- Publications

Research, Projects, People, and Theses are the priority areas because they best serve the two main audiences: students seeking entry points and external visitors seeking expertise or cooperation partners.

## Content Area Behavior

- People: overview cards for all listed members, with detail pages only where individual profile files exist.
- Research: overview cards and detail pages for research topic files.
- Projects: overview cards and detail pages for project files.
- Theses: hybrid student-facing landing page with grouped topics and detail pages for topics that have full files.
- Teaching: simple page at first, because current source material is compact.
- Publications: compact year-grouped page; do not create one page per publication for the demo.

## Quality Bar

The codebase should be clean enough to continue after the demo. Prefer small, typed, testable helpers over one-off parsing embedded in components. Add tests for content loading, schema validation, route derivation, and other logic where regressions are plausible.
