# 03 - Content Model And Loading

## Purpose

Use this after the scaffold exists. The goal is to connect the prepared Markdown/MDX content to the application in a structured way.

This run should make "context as files" visible: the agent turns crawled source material into a content model.

## Copy-paste prompt

```text
Now connect the prepared content to the site.

Please inspect `1 - content/` and implement a content-loading approach that can support:

- people
- research topics
- projects
- theses
- teaching
- publications
- general pages

Requirements:
- Keep the source content readable and traceable.
- Preserve source URLs from frontmatter.
- Use local image paths from `1 - content/assets/` where available.
- Prefer typed/content-collection-style loading if the chosen framework supports it.
- Do not hand-copy content into components.
- Create reusable helpers or schemas only where they genuinely reduce complexity.
- Add at least one debug or inventory page/component only if it helps verify the content model.

Verification:
- Run the build or typecheck.
- Summarize the content model and any content inconsistencies you found.
```

## Review checkpoint

Discuss:

- What did the agent infer from the content?
- Did it preserve source provenance?
- Did it avoid hardcoding content?
- Which content is clean and which still needs editorial review?

## Good outcome

The app can load core content collections and the build still passes.
