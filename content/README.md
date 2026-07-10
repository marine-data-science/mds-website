# Content Editing Guide

This guide explains how to add and update website content without needing to know Astro or TypeScript.

## Basic Idea

Most website pages are `.mdx` files. An MDX file has two parts:

1. Metadata at the top, between `---` lines.
2. Normal page text below the metadata.

Example:

```mdx
---
title: Example Page
summary: One short sentence used in overview cards.
---

# Example Page

This is the page text.
```

Do not edit files in `src/` for normal content updates.

## Where New Content Goes

Create new files in the matching folder:

- `content/people/` for people
- `content/research/` for research topics
- `content/projects/` for projects
- `content/teaching/` for teaching items, semester projects, and summer schools
- `content/theses/` for thesis topics

Use lowercase filenames with hyphens and no spaces:

```text
anna-kujat.mdx
new-research-topic.mdx
my-new-project.mdx
```

## Managing Overview Pages

Overview pages are files named `index.mdx` inside a content folder:

```text
content/research/index.mdx
content/projects/index.mdx
content/people/index.mdx
content/teaching/index.mdx
content/theses/index.mdx
```

These files control the page-level text for the matching overview page. They do not control which items appear in the generated list. The website builds those lists from the individual item files in the same folder.

For overview pages, use frontmatter for the page title, the small label above the title, and the short description:

```mdx
---
title: Research
eyebrow: Research topics
summary: Short description shown below the title.
---

This text appears below the page introduction and above the generated list.
```

Do not add a `# Heading` to overview page bodies. The visible page title comes from `title`.

What each part controls:

- `title`: the visible page title.
- `eyebrow`: the small uppercase label above the title.
- `summary`: the short description below the title and the description used by the page layout.
- Markdown body below the frontmatter: optional longer introduction text shown before the generated item list.

What overview pages must not contain:

- `items` arrays.
- copied people, project, research, teaching, or thesis metadata.
- card text that already belongs in an item file.

To change which items appear on an overview page, edit the item files in the matching folder. To change their order, edit the `order` field in the item frontmatter. Lower numbers appear first.

## Homepage

The homepage is controlled by `content/pages/home.mdx`.

Use frontmatter for the visible hero content:

```mdx
---
title: Marine Data Science
eyebrow: University of Rostock · Institute for Visual and Analytic Computing
summary: Short text shown below the homepage title.
sections:
  - collection: research
    limit: 4
  - collection: projects
    limit: 3
  - collection: people
    limit: 4
  - collection: theses
    limit: 4
  - collection: teaching
    limit: 3
---

Optional additional hero text goes here.
```

The `sections` list controls which overview blocks appear on the homepage and in which order. Use one of these collection names:

- `research`
- `projects`
- `people`
- `theses`
- `teaching`

Use `limit: 3` or another number to show only the first entries. Use `limit: all` to show every entry from that collection. The section title and section description still come from the matching overview file, for example `content/research/index.mdx` or `content/people/index.mdx`.

The homepage thesis section has one extra rule: it shows all `Open` thesis topics first, then fills with `Ongoing` topics until it reaches the configured numeric `limit`. It never shows `Finished` topics on the homepage. If there are more open topics than the numeric limit, all open topics are still shown.

What `home.mdx` controls:

- the homepage hero title, eyebrow, summary, and optional body text.
- which collection sections appear on the homepage.
- the order of those homepage sections.
- how many items are shown from each collection.

What `home.mdx` does not control:

- the title or description of a collection section. Edit the matching `content/<collection>/index.mdx` file instead.
- the details of a card, person row, teaching item, project, research topic, or thesis. Edit the item file itself.
- whether an item has a local detail page. Use `detailPage` in the item file.

Example: if you want the homepage to show Teaching before Projects, move the `teaching` block above the `projects` block in `sections`. If you want to change the Teaching headline or description, edit `content/teaching/index.mdx`.

## Standalone Pages

Standalone Markdown pages live in `content/pages/` next to `home.mdx`.

Use them for pages that should have a stable URL but should not appear automatically in the main navigation or on an overview page, for example partner-specific landing pages:

```text
content/pages/core-network.mdx
```

This creates:

```text
/core-network/
```

Use normal frontmatter and Markdown:

```mdx
---
title: CORE Network
eyebrow: Cooperation
summary: A landing page for visitors arriving from the CORE Network.
---

Page text goes here.
```

The main navigation is maintained in `src/layouts/BaseLayout.astro`. Creating a standalone page does not add it there.

## Images

Put images under `content/assets/`, ideally grouped by category and item:

```text
content/assets/people/anna/profile.jpg
content/assets/research/new-topic/figure.png
content/assets/projects/my-project/overview.png
```

Use a relative path from the MDX file to the image:

```yaml
image: ../assets/projects/my-project/overview.png
imageAlt: Short description of what the image shows
```

Always write a useful `imageAlt`. It helps visitors who use screen readers and is also shown when an image cannot load.

## Detail Pages

Some items get their own page; others only appear in an overview list.

Use `detailPage`:

```yaml
detailPage: true
```

Creates a local detail page from the MDX body.

```yaml
detailPage: false
```

Shows the item only on the overview page.

```yaml
detailPage: "https://example.com/profile"
```

Links the item to an external page. This is especially useful for people with an external profile.

## People

Use one file per person in `content/people/`.

Minimal example:

```mdx
---
title: Jane Doe
summary: PhD student working on marine computer vision.
image: ../assets/people/jane-doe/profile.jpg
imageAlt: Jane Doe
order: 120
detailPage: true
role: PhD student
room: Room 207
address: Albert-Einstein-Str. 21, 18059 Rostock
email: jane.doe@uni-rostock.de
alumni: false
---

# Jane Doe

Jane works on machine learning methods for underwater image analysis.
```

Required fields:

- `title`
- `role`
- `detailPage`
- `alumni`

Optional fields:

- `summary`
- `image`
- `imageAlt`
- `order`
- `room`
- `address`
- `email`
- `group`

Use `detailPage: false` if the person should only appear in the People overview.

Use `alumni: true` for former members. Alumni are shown below the current members list.

## Research Topics

Use one file per topic in `content/research/`.

Minimal example:

```mdx
---
title: New Research Topic
summary: Short overview sentence for cards and page previews.
image: ../assets/research/new-topic/figure.png
imageAlt: Visualization of the new topic
order: 110
featured: false
detailPage: true
tags:
  - marine data
  - machine learning
contact: Jane Doe
---

# New Research Topic

Describe the research topic here.
```

Required fields:

- `title`
- `detailPage`

Optional fields:

- `summary`
- `image`
- `imageAlt`
- `order`
- `featured`
- `tags`
- `contact`
- `related`

Tags are shown on overview cards. Add them manually instead of relying on automatic guesses.

## Projects

Use one file per active project in `content/projects/`.

Minimal example:

```mdx
---
title: My Project
summary: Short project summary for overview cards.
image: ../assets/projects/my-project/overview.png
imageAlt: Project overview image
order: 40
detailPage: true
tags:
  - sensor data
  - applied machine learning
funding: BMWK
duration: 01.01.2026 - 31.12.2028
partners:
  - Example Partner GmbH
contact: Jane Doe
---

# My Project

Describe the project here.
```

Required fields:

- `title`
- `detailPage`

Optional fields:

- `summary`
- `image`
- `imageAlt`
- `order`
- `tags`
- `funding`
- `duration`
- `partners`
- `contact`

Only active or intentionally public projects should be placed here.

## Teaching

Use one file per teaching item in `content/teaching/`.

Minimal example:

```mdx
---
title: Computer Vision Project
summary: Semester project on visual understanding for marine data.
order: 40
detailPage: true
kind: Semester project
semester: Summer Semester 2027
tags:
  - computer vision
  - student project
---

# Computer Vision Project

Describe the teaching item, requirements, and links here.
```

Required fields:

- `title`
- `detailPage`
- `kind`

Optional fields:

- `summary`
- `image`
- `imageAlt`
- `order`
- `semester`
- `dateRange`
- `externalUrl`
- `tags`

Use `semester` for regular teaching and `dateRange` for compact events such as summer schools.

## Thesis Topics

Use one file per thesis topic in `content/theses/`.

Minimal example with a detail page:

```mdx
---
title: Thesis Topic Title
summary: Short summary for the thesis list.
order: 40
detailPage: true
status: Open
keywords:
  - marine
degree: Bachelor or Master
supervisors:
  - Jane Doe
skills:
  - Python
  - Machine learning
contact: jane.doe@uni-rostock.de
---

# Thesis Topic Title

Describe the topic, expected work, and requirements here.
```

Minimal list-only example:

```mdx
---
title: Finished Thesis Topic
summary: Optional short description.
order: 140
detailPage: false
status: Finished
---

# Finished Thesis Topic
```

Required fields:

- `title`
- `detailPage`
- `status`

Allowed `status` values:

- `Open`
- `Ongoing`
- `Finished`

Optional fields:

- `summary`
- `image`
- `imageAlt`
- `order`
- `degree`
- `keywords`
- `supervisors`
- `skills`
- `contact`

Use `status` only for grouping topics into `Open`, `Ongoing`, and `Finished` sections. Use `keywords` for the blue pills shown in thesis teasers.

When a name in `supervisors` or `contact` exactly matches a person title from `content/people/`, the website links the name automatically in metadata rows. The same matching is used to list related thesis topics, projects, and research topics at the bottom of local person detail pages.

## Before You Commit

Check these points:

- The file is in the correct folder.
- The filename is lowercase and uses hyphens.
- Required fields are present.
- `detailPage` is set intentionally.
- Image paths are relative and point to real files.
- `imageAlt` describes the image.
- Links open the intended target.
- Overview pages do not contain item arrays.
