# 03 - Build Complete Astro Website

## Purpose

Use this after the architecture/content-model run and the Sketch/MCP design run.

This is intentionally a large implementation prompt. For production-quality work it would normally be split into smaller slices: scaffold, content model, homepage, core pages, polish, accessibility, and verification. In the workshop demo, this larger run is useful because it shows an experiment: how far can an agent get when it has strong context, accepted architecture decisions, prepared content, and a design artifact?

The point is not to pretend that one huge prompt is always the best workflow. The point is to show that the quality of the prompt depends heavily on prior context, constraints, source material, and review.

## Copy-paste prompt

```text
Please build the complete first version of the Marine Data Science static website.

Before making code changes, read and respect the project context:

- `AGENTS.md`
- `docs/architecture.md`
- all ADRs in `docs/adr/`
- `1 - content/`
- `2 - styling/design-direction.md`
- `2 - styling/Logo_MDS_1-3-Final_color.png`
- `2 - styling/Logo_MDS_1-3-Final_color.svg`
- the currently open Sketch document via the Sketch MCP server
- `2 - styling/MDS Website.sketch` only as a local reference/fallback if it can be inspected through available tooling

Important source boundaries:

- `1 - content/` is website source content and local content assets.
- `2 - styling/` is the design and visual asset source.
- `3 - prepared prompts/` contains demo planning notes only. Do not route, import, index, or publish it as website content.
- Preserve the prepared source folders. Do not move or rename them.
- Preserve content provenance such as `sourceUrl` where available.

Design requirement:

- The implementation should correspond to the design concept created in Sketch.
- Prefer inspecting the currently open Sketch document via the Sketch MCP server. The file is expected to be open already.
- Do not assume the `.sketch` file in the repository is directly readable as plain source. Use it only as a fallback/reference if your available tools can inspect it.
- If you cannot inspect the open Sketch document, say so clearly and use `2 - styling/design-direction.md`, the logo, and the saved assets as fallback.
- Do not create a generic SaaS landing page.
- Do not create a playful ocean-themed design.
- Keep the result modern, academic, minimal, maritime/marine, and approachable.

Language requirement:

- The final website should be English.
- The prepared source material is currently mixed German/English because it was crawled from the existing site.
- Translate German UI labels, summaries, project descriptions, thesis descriptions, navigation, calls to action, and visible page copy into clear English during implementation.
- Preserve names, publication titles, project names, funding/program names, addresses, emails, source URLs, and technical terms unless translation is clearly appropriate.
- Do not hide mixed-language source issues. If a translation is uncertain, keep the safest literal meaning and document it for human review.

Accepted architecture decisions:

- Use Astro with TypeScript and MDX/content collections.
- Build a static site suitable for GitHub Pages.
- Keep client-side JavaScript minimal.
- Use plain Astro components and CSS before adding extra UI frameworks.
- Separate content ingestion/normalization from visual rendering.
- Avoid hard-copying prepared content into components.

Accepted content model:

- People: first-class area with overview and optional detail pages.
- Research: first-class collection with overview and detail pages.
- Projects: first-class collection with overview and detail pages.
- Theses: hybrid student-facing landing/list page plus detail pages for topics with full source files.
- Teaching: simple page initially.
- Publications: compact year-grouped/list-style page, not one page per publication.
- General pages: support simple pages such as Home.

Target audiences:

- students looking for thesis topics, teaching information, and approachable entry points into the group
- researchers, institutions, and companies looking for expertise and possible cooperation partners

Please implement:

1. Project scaffold
   - Astro, TypeScript, MDX/content support.
   - Scripts for development, build, and preview.
   - Clean folder structure for layouts, components, content loading, styles, and routes.

2. Content layer
   - Load content from `1 - content/`.
   - Define schemas/helpers for People, Research, Projects, Theses, Teaching, Publications, and Pages.
   - Resolve local asset paths correctly.
   - Preserve source URLs in rendered pages.
   - Normalize visible website copy to English while preserving source provenance.
   - Document content inconsistencies instead of silently hiding them.

3. Pages and routes
   - Home
   - Research overview and detail pages
   - Projects overview and detail pages
   - People overview and detail pages where files exist
   - Theses overview and detail pages where files exist
   - Teaching
   - Publications

4. Visual implementation
   - Implement the visual system from the Sketch/design direction.
   - Use the MDS logo appropriately.
   - Use real content and local images.
   - Make the first viewport clearly signal "Marine Data Science" while showing a hint of real content below.
   - Make Research, Projects, People, and Theses easy to scan.
   - Keep cards functional and restrained.
   - Use responsive layouts for desktop and mobile.

5. Quality
   - Add tests for non-trivial content loading, schema, route, or parsing logic where useful.
   - Run the closest available verification commands, at minimum build/typecheck once available.
   - Fix build errors.
   - Do a short self-review for accessibility, responsive behavior, source-boundary compliance, and design consistency.

Constraints:

- Do not invent missing facts, publications, people, projects, or thesis topics.
- Do not leave intentionally visible website UI or page copy in German unless it is a proper noun, title, source citation, address, or clearly should remain untranslated.
- Do not publish or route `3 - prepared prompts/`.
- Do not turn the site into a marketing page.
- Do not leave obvious broken links or missing local assets.
- Keep the implementation maintainable enough to continue after the demo.

End with:

- what was implemented
- what verification commands passed
- what remains for human review
- where the implementation follows the Sketch/design concept
- any content or design issues you found but did not silently fix
```

## Review checkpoint

Discuss with the audience:

- How much context did the agent use before implementation?
- Did prior docs and ADRs constrain the result?
- Did the Sketch/MCP step visibly influence the implementation?
- Where did the agent make reasonable decisions?
- Where would a human split this into smaller review slices in real work?
- What must still be reviewed before publishing?

## Good outcome

The repository contains a working Astro website that builds locally, renders the major content areas, uses the local MDS content/assets, respects source boundaries, and visibly follows the Sketch/design direction.
