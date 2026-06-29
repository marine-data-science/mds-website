# 06 - Review, Polish, Accessibility

## Purpose

Use this after the core site exists. This prompt demonstrates the review-and-redirect loop: the agent is no longer just building features, it is improving quality.

## Copy-paste prompt

```text
Please review the current site like a careful frontend engineer and improve the most important issues.

Focus areas:
- responsive layout on mobile and desktop
- accessibility basics
- heading hierarchy
- color contrast
- image alt text and stable image sizing
- navigation clarity
- text density and scanability
- consistency with `2- styling/design-direction.md`

Constraints:
- Keep changes focused and explainable.
- Do not redesign the whole site from scratch.
- Do not invent content.
- Prefer improving existing components and styles.
- If you find content issues that should be fixed editorially, document them separately instead of hiding them.

Verification:
- Run the build.
- If possible, inspect the site visually in at least one desktop and one mobile viewport.
- Provide a short review summary: what improved, what remains risky, and what a human should review before publishing.
```

## Review checkpoint

Ask:

- Did the agent find issues we care about?
- Did it improve the existing design instead of starting over?
- Which quality checks were automated?
- Which decisions still need human judgment?

## Good outcome

The site becomes visibly more robust and easier to review. Remaining issues are documented.
