import fs from "node:fs";
import path from "node:path";
import type { Dirent } from "node:fs";
import matter from "gray-matter";
import { z } from "zod";
import { CONTENT_ROOT, contentAssetUrl } from "./paths";
import { stripMarkdown } from "./markdown";
import { rewriteHref, routeFor, slugFromFileName, slugify, type Section } from "./routes";
import { withBasePath } from "./site";

const imageSchema = z.object({
  src: z.string(),
  alt: z.string().optional().default(""),
});

const itemSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  href: z.string().optional(),
  status: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional().default(""),
});

const frontmatterSchema = z.object({
  title: z.string(),
  sourceUrl: z.string().url().optional(),
  lastModified: z.string().optional(),
  collection: z.string().optional(),
  previewTeaser: z.boolean().optional().default(false),
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
  bodyWithoutIntro: string;
  title: string;
  href: string;
  image?: ImageRef;
  summary: string;
  intro: string;
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
  status: "Open" | "Ongoing" | "Finished";
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
  const title = frontmatter.title;
  const body = normalizeVisibleMarkdown(parsed.content);
  const contentParagraph = firstContentParagraph(body);
  const image = resolveFirstImage(filePath, frontmatter.images, title);

  return {
    section: typedSection,
    slug,
    filePath,
    frontmatter,
    body,
    bodyWithoutIntro: removeFirstContentParagraph(body, contentParagraph),
    title,
    href: hrefForEntry(typedSection, slug),
    image,
    summary: summaryForEntry(slug, body, frontmatter),
    intro: introForEntry(slug, body, frontmatter),
  };
}

function hrefForEntry(section: SourceEntry["section"], slug: string): string {
  if (section === "pages" && slug === "home") {
    return withBasePath("/");
  }
  if (section === "teaching" || section === "publications") {
    return withBasePath(`/${section}/`);
  }
  if (section === "research" || section === "projects" || section === "people" || section === "theses") {
    return slug === "index" ? withBasePath(`/${section}/`) : routeFor(section, slug);
  }
  return withBasePath("/");
}

function normalizeVisibleMarkdown(markdown: string): string {
  return markdown
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

function summaryForEntry(slug: string, body: string, frontmatter: SourceFrontmatter): string {
  return introForEntry(slug, body, frontmatter).slice(0, 220);
}

function introForEntry(slug: string, body: string, frontmatter: SourceFrontmatter): string {
  if (frontmatter.items[0]?.description && slug === "index") {
    return frontmatter.items[0].description;
  }

  const first = firstContentParagraph(body);
  return first ? stripMarkdown(first) : "";
}

function firstContentParagraph(body: string): string | undefined {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph && !paragraph.startsWith("#") && !paragraph.startsWith("Figure source") && stripMarkdown(paragraph).length > 40);
}

function removeFirstContentParagraph(body: string, paragraph: string | undefined): string {
  if (!paragraph) {
    return body;
  }
  const index = body.indexOf(paragraph);
  if (index === -1) {
    return body;
  }
  return `${body.slice(0, index)}${body.slice(index + paragraph.length)}`.replace(/\n{3,}/g, "\n\n").trim();
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
  return title;
}

function matchDetail(item: SourceFrontmatter["items"][number], entries: SourceEntry[]): SourceEntry | undefined {
  if (item.slug) {
    const bySlug = entries.find((entry) => entry.slug === item.slug);
    if (bySlug) return bySlug;
  }

  const title = item.title;
  const normalized = slugify(normalizedItemTitle(title));
  return entries.find((entry) => slugify(entry.title) === normalized || slugify(entry.frontmatter.title) === normalized);
}

function itemHref(item: SourceFrontmatter["items"][number], detail: SourceEntry | undefined, section: Section): string | undefined {
  if (item.href) return rewriteHref(item.href);
  if (detail) return detail.href;
  if (item.slug && section !== "research") return routeFor(section, item.slug);
  return undefined;
}

export function getResearchCards(): Card[] {
  const index = getIndex("research");
  const details = getEntries("research");
  const used = new Set<string>();
  const cards = index.frontmatter.items.map((item) => {
    const detail = matchDetail(item, details);
    if (detail) {
      used.add(detail.slug);
    }
    const title = detail?.title ?? normalizedItemTitle(item.title);
    return {
      title,
      href: itemHref(item, detail, "research"),
      image: itemImage(index, item, title),
      summary: item.description,
      meta: researchMeta(title),
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
    }));

  return [...cards, ...missing];
}

export function getProjectCards(): Card[] {
  const index = getIndex("projects");
  const details = getEntries("projects");
  const used = new Set<string>();
  const cards = index.frontmatter.items.map((item) => {
    const detail = matchDetail(item, details);
    if (detail) {
      used.add(detail.slug);
    }
    const title = detail?.title ?? item.title;
    return {
      title,
      href: itemHref(item, detail, "projects"),
      image: itemImage(index, item, title),
      summary: item.description,
      meta: projectMeta(detail?.slug ?? slugify(title)),
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
    }));

  return [...cards, ...missing];
}

export function getPeopleCards(): PersonCard[] {
  const index = getIndex("people");
  const details = getEntries("people");
  return index.frontmatter.items.map((item) => {
    const detail = matchDetail(item, details);
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
    };
  });
}

function parsePersonDescription(description: string): { role?: string; room?: string } {
  const role = description.split("Email")[0]?.trim().replace(/\s+/g, " ");
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
  const index = getIndex("theses");
  const details = getEntries("theses");
  return index.frontmatter.items.map((item) => {
    const detail = matchDetail(item, details);
    const status = parseThesisStatus(item.status);
    return {
      title: item.title,
      href: itemHref(item, detail, "theses"),
      description: item.description,
      status,
    };
  });
}

function parseThesisStatus(status: string | undefined): ThesisItem["status"] {
  if (status === "Open" || status === "Ongoing" || status === "Finished") {
    return status;
  }
  return "Open";
}

export function groupThesisItems(items: ThesisItem[]): { status: ThesisItem["status"]; items: ThesisItem[] }[] {
  const order: ThesisItem["status"][] = ["Open", "Ongoing", "Finished"];
  return order
    .map((status) => ({ status, items: items.filter((item) => item.status === status) }))
    .filter((group) => group.items.length > 0);
}

export function getPreviewCard(): Card {
  const sections: Section[] = ["research", "projects", "people", "theses"];
  for (const section of sections) {
    const entry = getEntries(section).find((candidate) => candidate.frontmatter.previewTeaser);
    if (entry) {
      const card = cardsForSection(section).find((candidate) => candidate.href === entry.href);
      return card ?? {
        title: entry.title,
        href: entry.href,
        image: entry.image,
        summary: entry.summary,
        meta: `${sectionLabel(section)} preview`,
      };
    }
  }
  return getResearchCards()[0];
}

function cardsForSection(section: Section): Card[] {
  if (section === "research") return getResearchCards();
  if (section === "projects") return getProjectCards();
  if (section === "people") return getPeopleCards();
  return getThesisItems().map((item) => ({
    title: item.title,
    href: item.href,
    summary: item.description ?? "",
    meta: `${item.status} thesis`,
  }));
}

export function sectionIntro(section: Section): string {
  return sectionIntroductions[section];
}

function sectionLabel(section: Section): string {
  const labels: Record<Section, string> = {
    research: "Research",
    projects: "Project",
    people: "People",
    theses: "Thesis",
  };
  return labels[section];
}

export function getPublicationsByYear(): { year: string; items: string[] }[] {
  const entry = getIndex("publications");
  const sections = entry.body.split(/\n(?=##\s+\d{4})/);
  return sections
    .map((section) => {
      const year = section.match(/^##\s+(\d{4})/m)?.[1];
      if (!year) return undefined;
      const body = section.replace(/^##\s+\d{4}/m, "").trim();
      const items = body
        .split(/\n-\s+/)
        .map((item) => item.replace(/^-\s+/, "").trim())
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
