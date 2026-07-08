# Design Styleguide

This document describes the current visual style of the Marine Data Science website. It replaces the earlier implementation-oriented design brief with a practical styleguide for maintaining the existing site.

The implemented source of truth for visual tokens is `src/styles/global.css`. This document explains those choices in editorial and design terms so future changes can stay consistent.

## Visual Positioning

The site should continue to feel modern, clear, academic, and approachable. It speaks to students, prospective thesis candidates, collaborators, and people interested in the group without becoming casual, decorative, or corporate.

The current visual impression is:

- academic, but not old-fashioned
- maritime and marine, but not tourist-like
- minimal, but not empty
- technically confident, but still understandable
- structured enough to carry complex research topics
- welcoming for students and early-career researchers

The site should not drift toward a corporate SaaS look, a university bureaucracy look, or a decorative ocean-themed landing page. It should feel like a contemporary research group with a clear scientific identity and an accessible public presence.

## Logo And Identity

The logo remains the primary identity anchor. It combines:

- a wave shape for the marine context
- a node-and-edge network for data science, machine learning, and structured knowledge
- a strong condensed wordmark for institutional clarity

In the implemented site, the logo appears prominently in the header and again in the footer. The design picks up the logo indirectly through blue tones, condensed headings, structured cards, thin borders, and clean metadata treatments.

Avoid repeating the wave or network motif as heavy decoration on every page. The marine association should mostly come through color, whitespace, real research imagery, terminology, and the logo.

## Color Tokens

The implemented palette is defined as CSS custom properties in `src/styles/global.css`.

| Token | Value | Current role |
| --- | --- | --- |
| `--blue-deep` | `#00529F` | Primary brand blue for the top rule, footer, key accents, links, and important borders |
| `--blue-institutional` | `#19519D` | Institutional logo-derived blue; reserved for brand continuity |
| `--blue-mid` | `#6A96C9` | Medium supporting blue; available for data or secondary visual elements |
| `--blue-light` | `#A7C5E5` | Light blue for subtle borders, pills, and quiet emphasis |
| `--accent` | `#2C8F9E` | Restrained cyan/sea-green accent for link hover and focus states |
| `--ink` | `#10263F` | Main text and heading color |
| `--muted` | `#5F7188` | Secondary copy, summaries, metadata, and supporting text |
| `--line` | `#D8E5F3` | Hairline borders and section separators |
| `--surface` | `#FCFDFE` | Near-white card or content surface |
| `--surface-blue` | `#EFF6FC` | Pale blue page bands, hero background, image placeholders, and tags |
| `--white` | `#FFFFFF` | Main page background and card background |

Use `--blue-deep` as the identity anchor, not as a full-page dominant color. Most large backgrounds should remain white or near-white, with `--surface-blue` used for selected bands and panels.

Do not expand the palette into many saturated accent colors. New colors should be added only when a real content or accessibility need exists, and they should be documented here and in `src/styles/global.css`.

## Typography

The implemented typography uses a readable sans-serif body stack and a condensed heading stack. Both primary fonts are bundled through `@fontsource` and imported in `src/styles/global.css`, so the site does not depend on visitor-installed fonts or external font CDNs for its intended appearance.

Body font stack:

```css
Inter, "Source Sans 3", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Heading font stack:

```css
"Barlow Condensed", "Roboto Condensed", "Arial Narrow", Inter, sans-serif
```

Loaded font families and weights:

| Family | Weights | Current role |
| --- | --- | --- |
| `Inter` | `400`, `600`, `700`, `800` | Body text, navigation, metadata, summaries, and UI labels |
| `Barlow Condensed` | `500`, `700`, `800` | Teaser titles, headings, page titles, section titles, and hero titles |

The fallback fonts remain in the stack for resilience, but the intended appearance comes from the bundled font files.

Typography rules:

- Use condensed type for page titles, section headings, teaser titles, and other display moments.
- Use `Barlow Condensed` at `500` for teaser and card titles so dense overview pages stay lighter and more readable.
- Use `Barlow Condensed` at `700` for normal headings and `800` only for the primary hero title or similarly rare high-emphasis moments.
- Use the normal-width body stack for paragraphs, descriptions, navigation, metadata values, and long-form prose.
- Keep headings strong and compact with tight line height.
- Keep body text at a readable default size of `16px` and line height around `1.6`.
- Do not use condensed type for long body text.
- Do not use negative letter spacing; current headings use `letter-spacing: 0`.

Current important type scales:

| Context | Current sizing |
| --- | --- |
| Body | `16px`, line-height `1.6` |
| Hero heading | `clamp(3.4rem, 7vw, 5.2rem)` desktop; `2.8rem` mobile |
| Section and page headings | `clamp(2.65rem, 4.5vw, 3.7rem)` |
| Card and teaser titles | around `1.55rem` to `2rem`, usually weight `500` |
| Prose `h2` | `2.05rem` |
| Prose `h3` | `1.65rem` |
| Metadata labels | small uppercase labels around `0.78rem` |

## Layout System

The layout is content-first and intentionally restrained. It should make research, people, projects, publications, teaching, and thesis topics easy to scan.

Current layout tokens:

| Token | Value | Current role |
| --- | --- | --- |
| `--content` | `min(1120px, calc(100vw - 48px))` | Main page width on desktop |
| `--content` mobile | `calc(100vw - 32px)` | Main page width below `900px` |
| `--reading` | `760px` | Detail pages and prose measure |
| `--shadow` | `0 18px 50px rgb(0 82 159 / 10%)` | Soft shadow for elevated panels |

The site uses:

- a wide but controlled desktop content width
- a narrower reading measure for detail pages and prose
- strong page introductions followed quickly by actual content
- simple grids for people, projects, research topics, theses, and publications
- stable image aspect ratios in cards and detail pages
- compact metadata rows for roles, contacts, funding, duration, and related information

Avoid oversized marketing hero sections that hide the content, crowded cards with too much text, excessive rounded corners, glossy effects, or decorative backgrounds that compete with research material.

## Components And UI Treatment

The visual system is built from a small set of reusable patterns.

### Header

- White background with a `6px` deep-blue top rule.
- Logo on the left, explicit navigation on desktop.
- Mobile navigation uses a simple bordered menu control.
- Header height is generous on desktop and more compact on mobile.

### Footer

- Deep-blue background with white text.
- Logo is placed on a white tile for contrast.
- Contact, legal links, and institutional context stay compact.

### Cards

Cards should be functional rather than decorative:

- white background
- `1px` `--line` border
- small radius, usually `4px` to `6px`
- stable image area when an image is present
- concise metadata, title, and summary

Cards should not become heavily shadowed, glossy, or nested inside other cards.

### Pills And Tags

Pills use a thin light-blue border, deep-blue text, and a very light background. They are used for short labels and should remain compact.

### Metadata Rows

Metadata rows use uppercase small labels, muted label color, and clean top/bottom separators. This treatment is especially useful on detail pages where facts should appear before longer prose.

### Prose

Long-form content uses the `--reading` width. Source Markdown `h1` headings are hidden inside rendered prose because page templates provide the visible page title.

Prose should remain simple: readable paragraphs, modest heading hierarchy, normal list spacing, and images with subtle borders.

## Imagery

Use real content imagery from `content/assets/` where available. Images should identify people, projects, research topics, or source material rather than creating generic atmosphere.

Current image treatments:

- card images use fixed aspect ratios and `object-fit: cover`
- person images are circular avatars on overview rows
- detail images are contained, not cropped, with a maximum display height
- image borders use `--line`
- empty or loading surfaces should use `--surface-blue`

Avoid generic stock-photo ocean backgrounds unless the image is directly connected to research content.

## Content Tone

The written tone should remain precise, direct, and inviting. It should explain complex topics without flattening them.

Good tone:

- "We work on..."
- "This project investigates..."
- "Students can contribute by..."
- "The goal is to..."

Avoid:

- exaggerated claims
- sales language
- vague AI hype
- language that assumes visitors already understand every research field

For student-facing pages, emphasize concrete entry points: thesis topics, required skills, contact persons, and what the student would actually do.

## Treatment Of Complexity

The group works on complex machine learning and marine data science topics. The design should help structure that complexity rather than hide it.

Useful patterns:

- research-topic cards with short summaries and tags
- project detail pages with facts first, explanation second
- publication lists grouped by year
- compact people and thesis overviews
- consistent contact and metadata sections

The visual system should make complexity feel navigable.

## Maintenance Rules

When changing the visual system:

- Update `src/styles/global.css` first for actual implementation changes.
- Keep this document aligned with implemented tokens and recurring component patterns.
- Document new color tokens, typography changes, layout widths, or major component style changes here.
- Add or update an ADR if the change affects the stack, routing, content model, deployment strategy, source-boundary rules, or a durable design-system decision such as font loading.
- Keep `docs/design-direction.md` as the styleguide and visual status source of truth; do not recreate old prompt or demo-planning material as publishable site content.
