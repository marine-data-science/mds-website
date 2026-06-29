# 05 - Core Pages

## Purpose

Use this after the homepage works. The goal is to turn the site from a nice first slice into a usable research-group website.

This is a good moment to show the agent working across repeated structures.

## Copy-paste prompt

```text
Please implement the core content pages for the site.

Pages needed:
- Research overview and research detail pages
- Projects overview and project detail pages
- People overview and person detail pages where individual content exists
- Theses overview and thesis detail pages
- Teaching page
- Publications page

Requirements:
- Use the structured content from `1 - content/`.
- Reuse layout components where appropriate.
- Keep overview pages scannable.
- Use cards only for repeated items, not as the whole page layout.
- Detail pages should prioritize facts, summary, source/provenance, contact, related publications, and images where available.
- Preserve source URLs in a subtle but accessible way.
- Keep responsive behavior in mind from the start.
- Avoid inventing missing facts.

Verification:
- Run the build.
- Check that generated routes do not break on special characters or spaces.
- Summarize which pages are complete and which need editorial cleanup.
```

## Review checkpoint

Inspect:

- route structure
- repeated components
- whether project/research/thesis pages are distinguishable
- how the agent handled incomplete or inconsistent content
- whether there is any invented content

## Good outcome

The major sections exist and are navigable. The site has become a real artifact rather than a single-page mockup.
