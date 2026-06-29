# 01 - Orientation And Architecture

## Purpose

Use this as the first agent run. The goal is not implementation yet. The agent should inspect the repository, understand the prepared content and styling direction, and propose a realistic architecture for a static research-group website.

This is the moment to show:

- context matters
- the agent reads local files
- a useful run can produce a plan, not only code
- the human decides what to accept before implementation

## Copy-paste prompt

```text
We are building a demo website for the Marine Data Science research group.

Please start by understanding the repository before making code changes.

Context:
- The site should be static and deployable to GitHub Pages.
- Prepared content lives in `1 - content/`.
- Styling and visual direction live in `2 - styling/`.
- There is a logo in `2 - styling/Logo_MDS_1-3-Final_color.png` and an SVG version next to it.
- Demo planning notes live in `3 - prepared prompts/`. These files are not website content and should not become part of the generated site.
- The main audience groups are:
  - students looking for thesis topics, teaching information, and approachable entry points into the group
  - researchers, institutions, or companies looking for expertise and possible cooperation partners
- Use `2 - styling/design-direction.md` as the source of truth for the intended visual impression. Do not duplicate or reinvent the design brief unless you notice a conflict.

Please inspect the files and then propose:

1. A suitable technology choice for a static site, including why.
2. A content model for the available material.
   - For complex entities with likely overview and detail pages, such as People, Research, Projects, and possibly Teaching, consider dedicated models or collections.
   - For simple list-like material, such as Publications, prefer a compact structure rather than forcing every item into its own MDX page.
   - Treat Theses as an explicit modeling question: it may be a hybrid between a landing/list page and individual detail pages.
   - You may propose a better content structure than the current source site if it better serves the audiences above.
3. A page structure/navigation model.
4. A first implementation sequence split into small reviewable steps.
5. Risks or ambiguous points you notice in the prepared content.

Do not implement anything yet. End with a concise recommended plan and the exact first implementation step you would take next.
```

## Review checkpoint

Discuss with the audience:

- Did the agent inspect content and styling first?
- Did it make reasonable assumptions?
- Did it identify the right pages: Research, Projects, People, Theses, Teaching, Publications?
- Did it separate content modeling from visual implementation?
- What would you correct before allowing it to write code?

## Good outcome

The agent recommends a static-first stack, likely Astro with MDX/content collections, and proposes a staged implementation rather than trying to build everything in one pass.
