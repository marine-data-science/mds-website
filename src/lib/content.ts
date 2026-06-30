import fs from "node:fs";
import path from "node:path";
import type { Dirent } from "node:fs";
import matter from "gray-matter";
import { z } from "zod";
import { CONTENT_ROOT, contentAssetUrl } from "./paths";
import { stripMarkdown } from "./markdown";
import { correctedTitle, bodyOverrides, overrideKey, summaryOverrides } from "./translations";
import { routeFor, slugFromFileName, slugify, type Section } from "./routes";

const imageSchema = z.object({
  src: z.string(),
  alt: z.string().optional().default(""),
});

const itemSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
  description: z.string().optional().default(""),
});

const frontmatterSchema = z.object({
  title: z.string(),
  sourceUrl: z.string().url().optional(),
  lastModified: z.string().optional(),
  collection: z.string().optional(),
  images: z.array(imageSchema).optional().default([]),
  items: z.array(itemSchema).optional().default([]),
});

export type SourceFrontmatter = z.infer<typeof frontmatterSchema>;

export type SourceEntry = {
  section: Section | "pages" | "teaching" | "publications";
  slug: string;
  filePath: string;
  frontmatter: SourceFrontmatter;
  body: string;
  title: string;
  href: string;
  image?: ImageRef;
  summary: string;
};

export type ImageRef = {
  src: string;
  alt: string;
};

export type Card = {
  title: string;
  href?: string;
  image?: ImageRef;
  summary: string;
  meta?: string;
  sourceUrl?: string;
};

export type PersonCard = Card & {
  role?: string;
  room?: string;
  hasDetail: boolean;
};

export type ThesisItem = {
  title: string;
  href?: string;
  description?: string;
  status: "Open" | "Ongoing" | "Finished" | "Source file";
};

const sectionIntroductions: Record<Section, string> = {
  research:
    "Machine learning methods for marine data, sensor systems, medical imaging, tabular data, and human activity recognition.",
  projects:
    "Funded and applied projects connect research methods with logistics, industry, software interaction, teaching, and marine technology.",
  people:
    "Researchers, coordinators, engineers, and students working across machine learning, marine data science, and visual computing.",
  theses:
    "Entry points for Bachelor and Master students who want to work with the group on concrete research topics.",
};

function readSource(relativePath: string): SourceEntry {
  const filePath = path.join(CONTENT_ROOT, relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = frontmatterSchema.parse(parsed.data);
  const section = relativePath.split(path.sep)[0] as SourceEntry["section"];
  const slug = slugFromFileName(path.basename(relativePath));
  const collection = section === "pages" ? "pages" : section;
  const typedSection = collection as SourceEntry["section"];
  const title = correctedTitle(frontmatter.title);
  const key = ["research", "projects", "people", "theses"].includes(typedSection)
    ? overrideKey(typedSection as Section, slug)
    : undefined;
  const rawBody = key && bodyOverrides.has(key) ? bodyOverrides.get(key)! : parsed.content;
  const body = normalizeVisibleMarkdown(rawBody);
  const image = resolveFirstImage(filePath, frontmatter.images, title);

  return {
    section: typedSection,
    slug,
    filePath,
    frontmatter,
    body,
    title,
    href: hrefForEntry(typedSection, slug),
    image,
    summary: summaryForEntry(typedSection, slug, body, frontmatter),
  };
}

function hrefForEntry(section: SourceEntry["section"], slug: string): string {
  if (section === "pages" && slug === "home") {
    return "/";
  }
  if (section === "teaching" || section === "publications") {
    return `/${section}/`;
  }
  if (section === "research" || section === "projects" || section === "people" || section === "theses") {
    return slug === "index" ? `/${section}/` : routeFor(section, slug);
  }
  return "/";
}

function normalizeVisibleMarkdown(markdown: string): string {
  return markdown
    .replace(/\[E-Mail]/g, "[Email]")
    .replace(/\n### Juniorprofessur MDS[\s\S]*$/m, "")
    .trim();
}

function resolveFirstImage(filePath: string, images: SourceFrontmatter["images"], fallbackAlt: string): ImageRef | undefined {
  const image = images[0];
  if (!image) {
    return undefined;
  }
  return {
    src: contentAssetUrl(filePath, image.src),
    alt: image.alt?.trim() || fallbackAlt,
  };
}

function summaryForEntry(
  section: SourceEntry["section"],
  slug: string,
  body: string,
  frontmatter: SourceFrontmatter,
): string {
  if (section === "research" || section === "projects" || section === "people" || section === "theses") {
    const key = overrideKey(section, slug);
    if (summaryOverrides.has(key)) {
      return summaryOverrides.get(key)!;
    }
  }

  if (frontmatter.items[0]?.description && slug === "index") {
    return frontmatter.items[0].description;
  }

  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith("#") && !paragraph.startsWith("Figure source"));
  const first = paragraphs.find((paragraph) => stripMarkdown(paragraph).length > 40) ?? "";
  return stripMarkdown(first).slice(0, 220);
}

function listMdxFiles(section: Section | "pages" | "teaching" | "publications"): string[] {
  const directory = path.join(CONTENT_ROOT, section);
  return fs
    .readdirSync(directory)
    .filter((file: string) => file.endsWith(".mdx"))
    .sort()
    .map((file: string) => path.join(section, file));
}

export function getIndex(section: Section | "pages" | "teaching" | "publications"): SourceEntry {
  const relativePath = section === "pages" ? path.join("pages", "home.mdx") : path.join(section, "index.mdx");
  return readSource(relativePath);
}

export function getEntries(section: Section): SourceEntry[] {
  return listMdxFiles(section)
    .filter((relativePath) => path.basename(relativePath) !== "index.mdx")
    .map(readSource);
}

export function getEntry(section: Section, slug: string): SourceEntry | undefined {
  return getEntries(section).find((entry) => entry.slug === slug);
}

function itemImage(indexEntry: SourceEntry, item: SourceFrontmatter["items"][number], fallbackAlt: string): ImageRef | undefined {
  if (!item.image) {
    return undefined;
  }
  return {
    src: contentAssetUrl(indexEntry.filePath, item.image),
    alt: fallbackAlt,
  };
}

function normalizedItemTitle(title: string): string {
  return correctedTitle(title);
}

function matchDetailByTitle(title: string, entries: SourceEntry[]): SourceEntry | undefined {
  const normalized = slugify(normalizedItemTitle(title));
  return entries.find((entry) => slugify(entry.title) === normalized || slugify(entry.frontmatter.title) === normalized);
}

export function getResearchCards(): Card[] {
  const index = getIndex("research");
  const details = getEntries("research");
  const used = new Set<string>();
  const cards = index.frontmatter.items.map((item) => {
    const detail = matchDetailByTitle(item.title, details);
    if (detail) {
      used.add(detail.slug);
    }
    const title = detail?.title ?? normalizedItemTitle(item.title);
    return {
      title,
      href: detail?.href,
      image: itemImage(index, item, title),
      summary: item.description,
      meta: researchMeta(title),
      sourceUrl: detail?.frontmatter.sourceUrl ?? index.frontmatter.sourceUrl,
    };
  });

  const missing = details
    .filter((entry) => !used.has(entry.slug))
    .map((entry) => ({
      title: entry.title,
      href: entry.href,
      image: entry.image,
      summary: entry.summary,
      meta: researchMeta(entry.title),
      sourceUrl: entry.frontmatter.sourceUrl,
    }));

  return [...cards, ...missing];
}

export function getProjectCards(): Card[] {
  const index = getIndex("projects");
  const details = getEntries("projects");
  const used = new Set<string>();
  const cards = index.frontmatter.items.map((item) => {
    const detail = matchDetailByTitle(item.title, details);
    if (detail) {
      used.add(detail.slug);
    }
    const key = detail ? overrideKey("projects", detail.slug) : undefined;
    const title = detail?.title ?? item.title;
    return {
      title,
      href: detail?.href,
      image: itemImage(index, item, title),
      summary: key && summaryOverrides.has(key) ? summaryOverrides.get(key)! : item.description,
      meta: projectMeta(detail?.slug ?? slugify(title)),
      sourceUrl: detail?.frontmatter.sourceUrl ?? index.frontmatter.sourceUrl,
    };
  });

  const missing = details
    .filter((entry) => !used.has(entry.slug))
    .map((entry) => ({
      title: entry.title,
      href: entry.href,
      image: entry.image,
      summary: entry.summary,
      meta: projectMeta(entry.slug),
      sourceUrl: entry.frontmatter.sourceUrl,
    }));

  return [...cards, ...missing];
}

export function getPeopleCards(): PersonCard[] {
  const index = getIndex("people");
  const details = getEntries("people");
  return index.frontmatter.items.map((item) => {
    const detail = matchDetailByTitle(item.title, details);
    const { role, room } = parsePersonDescription(item.description);
    const title = detail?.title ?? item.title;
    return {
      title,
      href: detail?.href,
      image: itemImage(index, item, title),
      summary: [role, room].filter(Boolean).join(" · "),
      role,
      room,
      hasDetail: Boolean(detail),
      sourceUrl: detail?.frontmatter.sourceUrl ?? index.frontmatter.sourceUrl,
    };
  });
}

function parsePersonDescription(description: string): { role?: string; room?: string } {
  const role = description.split("E-Mail")[0]?.trim().replace(/\s+/g, " ");
  const room = description.match(/Room\s+\d+/)?.[0];
  return { role, room };
}

function researchMeta(title: string): string {
  const value = title.toLowerCase();
  if (value.includes("sensor")) return "marine data / uncertainty";
  if (value.includes("ultrasound")) return "medical and acoustic imaging";
  if (value.includes("tabular")) return "tabular machine learning";
  if (value.includes("microbiome")) return "microbiome / ML";
  if (value.includes("activity")) return "human activity recognition";
  if (value.includes("probabilistic")) return "probabilistic inference";
  if (value.includes("neural")) return "explainable AI";
  return "research topic";
}

function projectMeta(slug: string): string {
  const meta: Record<string, string> = {
    data4sim: "BMWK · 2023-2026",
    ai4pumps: "BMWK · 2024-2026",
    show2instruct: "BMFTR · 2025-2028",
    egoproject2026: "Teaching project · 2026",
    "ki-ubb-cluj-napoca": "Teaching material",
    "ml-micro": "microbiome / ML",
    mml: "marine machine learning",
    root: "summer school",
  };
  return meta[slug] ?? "project";
}

export function getThesisItems(): ThesisItem[] {
  const details = getEntries("theses");
  const bySlug = new Map(details.map((entry) => [entry.slug, entry]));
  const linked = [
    {
      title: bySlug.get("uncertainty-aware-stenoses-segmentation")?.title ?? "",
      href: bySlug.get("uncertainty-aware-stenoses-segmentation")?.href,
      description: "Probabilistic deep learning for segmentation uncertainty in angiography.",
      status: "Open" as const,
    },
    {
      title: bySlug.get("cross-domain-translation-of-angiography")?.title ?? "",
      href: bySlug.get("cross-domain-translation-of-angiography")?.href,
      description: "Unsupervised translation from diseased to healthy vessel appearance.",
      status: "Open" as const,
    },
    {
      title: bySlug.get("transfer-learning-from-medical-ultrasound-to-marine-sonar-image-data")?.title ?? "",
      href: bySlug.get("transfer-learning-from-medical-ultrasound-to-marine-sonar-image-data")?.href,
      description: "Transfer learning between medical ultrasound and marine sonar image data.",
      status: "Source file" as const,
    },
    {
      title: bySlug.get("analyzing-microbiome-metabarcoding-data-with-tabpfn")?.title ?? "",
      href: bySlug.get("analyzing-microbiome-metabarcoding-data-with-tabpfn")?.href,
      description: "TabPFN for environmental DNA and metabarcoding data.",
      status: "Ongoing" as const,
    },
  ].filter((item) => item.title) satisfies ThesisItem[];

  const inline: ThesisItem[] = [
    {
      title: "Deep learning-based classification of phytoplankton in imaging flow cytometry data",
      status: "Open",
    },
    {
      title: "Deep learning-based age estimation of fish from otoliths",
      status: "Open",
    },
    {
      title: "Methods for Pseudo-Label Selection for Student-Teacher-based Domain Adaptation",
      description:
        "Methods for selecting pseudo-labels in semi-supervised learning scenarios to improve model performance with unlabeled data.",
      status: "Open",
    },
    {
      title: "Analysis of harbor porpoise sounds with machine learning methods",
      status: "Finished",
    },
    {
      title: "Detecting and localizing anomalies in thermal images of industrial components using unsupervised learning methods",
      status: "Finished",
    },
    {
      title: "Deep learning-based analysis of hematomas in hyperspectral images",
      status: "Finished",
    },
  ];

  return [...linked, ...inline];
}

export function sectionIntro(section: Section): string {
  return sectionIntroductions[section];
}

export function getPublicationsByYear(): { year: string; items: string[] }[] {
  const entry = getIndex("publications");
  const sections = entry.body.split(/\n(?=##\s+\d{4})/);
  return sections
    .map((section) => {
      const year = section.match(/^##\s+(\d{4})/m)?.[1];
      if (!year) return undefined;
      const items = section
        .replace(/^##\s+\d{4}/m, "")
        .split(/\n-\n/)
        .map((item) => item.trim())
        .filter(Boolean);
      return { year, items };
    })
    .filter((value): value is { year: string; items: string[] } => Boolean(value));
}

export function getAssetStaticPaths(): { params: { asset: string } }[] {
  const assetsRoot = path.join(CONTENT_ROOT, "assets");
  const files = walkFiles(assetsRoot);
  return files.map((file) => ({ params: { asset: toRouteAsset(path.relative(CONTENT_ROOT, file)) } }));
}

export function getStyleAssetStaticPaths(): { params: { asset: string } }[] {
  const files = ["Logo_MDS_1-3-Final_color.png", "Logo_MDS_1-3-Final_color.svg"];
  return files.map((file) => ({ params: { asset: file } }));
}

function walkFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry: Dirent) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function toRouteAsset(value: string): string {
  return value.split(path.sep).join("/");
}
