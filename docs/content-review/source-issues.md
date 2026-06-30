# Source Issues For Human Review

These notes record issues found while implementing the first static website version. The source files in `1 - content/` were not edited.

## Editorial And Translation Issues

- The research overview source spells "Neural Processes for Optimal Sensor Placment". The website displays "Placement" and keeps this note for review.
- The thesis source spells "Digital Subtraction Angriography" and "Student-Teacher-based Domain Adapation". The website displays corrected English titles and keeps this note for review.
- Several project pages were crawled in German (`AI4Pumps`, `Data4Sim`, `Show2Instruct`, and `KI (UBB Cluj-Napoca)`). The website renders English translations in the content normalization layer.
- Some finished thesis titles were German. The theses overview translates them for visible website copy.
- The source uses the heading "Juniorprofessur MDS" in many page footers. The site footer renders "Junior Professorship MDS"; repeated crawled page footers are filtered out of rendered detail bodies.
- The course/project source title "KI (UBB Cluj-Napoca)" is rendered as "Artificial Intelligence (UBB Cluj-Napoca)" for English site navigation.

## Links And Asset Issues

- The source contains old root-level internal links such as `/ml-micro`, `/bharathi`, and `/egoproject2026`. Rendered Markdown rewrites these to the new static routes.
- The `Show2Instruct` source links Ashwin Nedungadi to `https://ash`. Rendered Markdown rewrites this to `/people/ashwin/`.
- Several teaching/source PDF links point to `/s/...` assets that are not present in `1 - content/`. Rendered links point back to `https://www.mds-lab.de/s/...` instead of creating broken local pages.
- Most image frontmatter has empty alt text in the crawled source. The implementation uses the content title as a conservative fallback alt text, but proper descriptive alt text should be added later.
- One publication link in the ultrasound source has a malformed `https:// https://doi...` URL. The Markdown renderer strips the duplicated protocol when encountered.

## Content Model Gaps

- People listed only on `people/index.mdx` do not receive invented detail pages. They are marked as overview-only entries.
- `Transfer Learning from Medical Ultrasound to Marine Sonar Image Data` has a thesis detail file but is not listed in the source theses index. The website includes it as a source-file thesis item.
- Publications remain a compact year-grouped list as required. Individual publication detail pages were not created.
