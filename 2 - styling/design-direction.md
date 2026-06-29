# Design Direction

This document describes the intended visual direction for the demo website of the Marine Data Science group. It is not a full brand manual, but a practical design brief for implementation.

## Desired Impression

The website should feel modern, clear, academic, and approachable. It should speak directly to students, prospective thesis candidates, collaborators, and people interested in the group without becoming casual or playful.

The overall impression should be:

- academic, but not old-fashioned
- maritime and marine, but not decorative or tourist-like
- minimal, but not empty
- technically confident, but still understandable
- structured enough to carry complex research topics
- welcoming for students and early-career researchers

The site should not try to look like a corporate SaaS product. It should feel like a contemporary research group with a clear scientific identity and an accessible public presence.

## Logo-Based Direction

The logo combines three important motifs:

- a wave shape for the marine context
- a node-and-edge network for data science, machine learning, and structured knowledge
- a strong condensed wordmark for institutional clarity

The website should pick up these qualities indirectly. The wave and network motif should inform the visual language, but should not be repeated as heavy decoration on every page.

Good translations into the website design:

- flowing section transitions or subtle curved image crops
- thin connecting lines in diagrams, project overviews, or research maps
- restrained use of blue gradients or overlays inspired by water depth
- clean data-oriented layouts for people, projects, publications, and thesis topics

Avoid literal ocean imagery as a generic background unless it is connected to actual research content. The marine association should mostly come through color, whitespace, photography, terminology, and the logo.

## Color Palette

The logo suggests a focused blue palette with strong contrast against white:

- Deep marine blue: `#00529F` to `#1658A2`
- Institutional blue: `#19519D`
- Medium data blue: `#6A96C9`
- Light water blue: `#A7C5E5`
- White / near-white: `#FFFFFF`, `#FCFDFE`

Suggested use:

- Use deep blue for navigation, headlines, key accents, and important links.
- Use medium and light blues for metadata, cards, separators, background bands, diagrams, and hover states.
- Keep large page backgrounds mostly white or near-white.
- Add one restrained secondary accent only if needed, for example a muted cyan or sea-green. Do not turn the site into a many-color palette.

The page should not become a dark navy interface. Blue should anchor the identity, while whitespace should keep the site academic and readable.

## Typography

The logo wordmark appears to use a heavy, condensed sans-serif. Because the available logo file contains outlined letter shapes rather than live text, the exact font cannot be identified with certainty from the asset alone.

Plausible font directions:

- For headings: a condensed geometric or grotesque sans such as `Roboto Condensed`, `Barlow Condensed`, `DIN Condensed`, `Archivo Narrow`, or `Oswald`.
- For body text: a highly readable modern sans such as `Inter`, `Source Sans 3`, `IBM Plex Sans`, or `Atkinson Hyperlegible`.
- For technical metadata or small labels: either the body font or a restrained mono such as `IBM Plex Mono`.

Recommended pairing for the demo:

- Headings: `Barlow Condensed` or `Roboto Condensed`
- Body: `Inter` or `Source Sans 3`

Use condensed type selectively. It works well for strong page titles, section labels, and large research-topic headings, but body text and project descriptions should use a normal-width font for readability.

## Layout Principles

The site should be content-first. It should make research, people, projects, publications, teaching, and thesis topics easy to scan.

Use:

- clear page hierarchy
- generous spacing around important introductions
- compact grids for people, projects, and research topics
- strong typographic contrast instead of decorative cards everywhere
- stable image aspect ratios for people and research/project previews
- concise metadata rows for roles, contacts, funding, duration, and publications

Avoid:

- oversized marketing hero sections that hide the actual content
- generic stock-photo atmosphere
- playful animations
- crowded cards with too much text
- blue-on-blue low contrast
- excessive rounded corners or glossy effects

Cards, if used, should be simple and functional: subtle border, small radius, clear title, concise description, and a visible image only when it helps identify the content.

## Content Tone

The written tone should be precise, direct, and inviting. It should explain complex topics without flattening them.

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

## Visual Treatment Of Complexity

The group works on complex machine learning and marine data science topics. The design should help structure that complexity rather than hide it.

Useful patterns:

- research-topic cards with short summaries and tags
- project detail pages with facts first, explanation second
- publication lists grouped by project or topic
- diagrams or lightweight network visuals for relationships between topics
- consistent "contact" and "related work" sections

The visual system should make complexity feel navigable.

## Implementation Guidance

For the first demo implementation:

- Use the logo prominently but calmly in the header or landing section.
- Build a first viewport that immediately signals "Marine Data Science" and shows a hint of real content below.
- Use the local content and images from `content/` and `content/assets/`.
- Prioritize the pages `Research`, `Projects`, `People`, and `Theses`.
- Let the website feel like a working research group site, not a placeholder portfolio.

The final result should feel like a credible public-facing academic website that could plausibly replace the current Squarespace site after content review and refinement.
