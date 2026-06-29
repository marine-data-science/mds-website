# 02 - Scaffold Static Site

## Purpose

Use this after the architecture plan is accepted. The goal is to create the actual app skeleton and verify that it runs/builds locally.

This is the first visible "agent changes repository state" moment.

## Copy-paste prompt

```text
Please implement the first step from the plan: scaffold the static website application.

Requirements:
- Use a static-site approach suitable for GitHub Pages.
- Prefer Astro with TypeScript if it fits the repository and content.
- Keep the existing prepared folders intact:
  - `1 - content/`
  - `2- styling/`
  - `3- prepared prompts/`
- Do not move or rename the prepared content in this step.
- Add only the minimal application structure needed to run and build the site.
- Include a basic layout, a homepage route, and global styling tokens based on the design direction.
- Use the logo asset from `2- styling/`.
- Add scripts for local development and production build.

Verification:
- Install dependencies if needed.
- Run the build or the closest available verification command.
- Tell me what changed, what command you ran, and what the next implementation step should be.
```

## Review checkpoint

Inspect:

- package choice and scripts
- whether prepared input folders were preserved
- whether the site builds
- whether the app structure is small enough to explain
- whether the first page already reflects the logo/design direction

## Good outcome

A minimal static site exists and builds. It does not yet need all content pages.
