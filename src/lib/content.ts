import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCollection, type CollectionEntry } from "astro:content";
import { CONTENT_ROOT, contentAssetUrl } from "./paths";
import { stripMarkdown } from "./markdown";
import { routeFor, slugFromFileName, type Section } from "./routes";

export type ItemSection = Section;
export type PageSection = ItemSection | "publications" | "pages";
export type HomeSectionConfig = {
  collection: ItemSection;
  limit?: number | "all";
};

type ItemEntry =
  | CollectionEntry<"research">
  | CollectionEntry<"projects">
  | CollectionEntry<"people">
  | CollectionEntry<"theses">
  | CollectionEntry<"teaching">;

type PageEntry = {
  id: string;
  collection: "pages";
  data: {
    title: string;
    eyebrow?: string;
    sourceUrl?: string;
    lastModified?: string;
    summary: string;
    image?: string;
    imageAlt: string;
    order: number;
    featured: boolean;
    sections: HomeSectionConfig[];
  };
  body: string;
};

export type StandalonePageEntry = CollectionEntry<"pages">;

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
  role: string;
  room?: string;
  hasDetail: boolean;
  alumni: boolean;
};

export type ThesisItem = {
  title: string;
  href?: string;
  description?: string;
  status: "Open" | "Ongoing" | "Finished";
  keywords: string[];
};

export type MetadataRow = {
  label: string;
  value: string;
  values: MetadataValue[];
};

export type MetadataValue = {
  label: string;
  href?: string;
};

export type RelatedContentGroup = {
  title: string;
  items: Card[];
};

const defaultSectionIntroductions: Record<ItemSection, string> = {
  research:
    "Machine learning methods for marine data, sensor systems, medical imaging, tabular data, and human activity recognition.",
  projects:
    "Funded and applied projects connect research methods with logistics, industry, software interaction, and marine technology.",
  people:
    "Researchers, coordinators, engineers, and students working across machine learning, marine data science, and visual computing.",
  theses:
    "Entry points for Bachelor and Master students who want to work with the group on concrete research topics.",
  teaching: "Current teaching and semester project entry points.",
};

export async function getIndex(section: PageSection): Promise<PageEntry> {
  const id = section === "pages" ? "pages/home.mdx" : `${section}/index.mdx`;
  const filePath = path.join(CONTENT_ROOT, id);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing index content for ${section}`);
  }

  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  return {
    id,
    collection: "pages",
    data: {
      title: parsed.data.title,
      eyebrow: parsed.data.eyebrow,
      sourceUrl: parsed.data.sourceUrl,
      lastModified: parsed.data.lastModified,
      summary: parsed.data.summary ?? "",
      image: parsed.data.image,
      imageAlt: parsed.data.imageAlt ?? parsed.data.title,
      order: parsed.data.order ?? 999,
      featured: parsed.data.featured ?? false,
      sections: parseHomeSections(parsed.data.sections),
    },
    body: parsed.content,
  };
}

export async function getStandalonePages(): Promise<StandalonePageEntry[]> {
  const entries = (await getCollection("pages")) as StandalonePageEntry[];

  return entries
    .filter((entry) => entry.id.startsWith("pages/"))
    .filter((entry) => pageSlugForEntry(entry) !== "home")
    .sort(
      (a, b) =>
        a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
    );
}

export function pageSlugForEntry(entry: StandalonePageEntry): string {
  return slugFromFileName(path.basename(withMdxExtension(entry.id)));
}

export async function getEntries(section: ItemSection): Promise<ItemEntry[]> {
  const entries = ((await getCollection(section)) as ItemEntry[]).filter(
    (entry) => slugForEntry(entry) !== "index",
  );
  return entries.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getEntry(
  section: ItemSection,
  slug: string,
): Promise<ItemEntry | undefined> {
  const entries = await getEntries(section);
  return entries.find((entry) => slugForEntry(entry) === slug);
}

export function slugForEntry(entry: ItemEntry | PageEntry): string {
  return slugFromFileName(path.basename(withMdxExtension(entry.id)));
}

export function sourceFileForEntry(
  entry: ItemEntry | PageEntry | StandalonePageEntry,
): string {
  if (entry.collection === "pages") {
    return path.join(CONTENT_ROOT, withMdxExtension(entry.id));
  }

  return path.join(CONTENT_ROOT, entry.collection, withMdxExtension(entry.id));
}

export function imageForEntry(
  entry: ItemEntry | PageEntry,
): ImageRef | undefined {
  const image = entry.data.image;
  if (!image) {
    return undefined;
  }

  return {
    src: contentAssetUrl(sourceFileForEntry(entry), image),
    alt: entry.data.imageAlt?.trim() || entry.data.title,
  };
}

export function summaryForEntry(
  entry: ItemEntry | PageEntry | StandalonePageEntry,
): string {
  const summary = entry.data.summary?.trim();
  if (summary) {
    return summary;
  }

  const first = firstContentParagraph(entry.body ?? "");
  return first ? stripMarkdown(first).slice(0, 220) : "";
}

export function bodyForIndex(entry: PageEntry): string {
  return entry.body.replace(/^\s*#\s+.+\n+/, "").trim();
}

export async function getResearchCards(): Promise<Card[]> {
  const entries = (await getEntries(
    "research",
  )) as CollectionEntry<"research">[];
  return entries.map((entry) =>
    cardForEntry("research", entry, entry.data.tags.join(" / ")),
  );
}

export async function getProjectCards(): Promise<Card[]> {
  const entries = (await getEntries(
    "projects",
  )) as CollectionEntry<"projects">[];
  return entries.map((entry) =>
    cardForEntry(
      "projects",
      entry,
      [entry.data.funding, entry.data.duration].filter(Boolean).join(" · "),
    ),
  );
}

export async function getTeachingCards(): Promise<Card[]> {
  const entries = (await getEntries(
    "teaching",
  )) as CollectionEntry<"teaching">[];
  return entries.map((entry) =>
    cardForEntry(
      "teaching",
      entry,
      [entry.data.kind, entry.data.semester ?? entry.data.dateRange]
        .filter(Boolean)
        .join(" · "),
    ),
  );
}

export async function getPeopleCards(): Promise<PersonCard[]> {
  const entries = (await getEntries("people")) as CollectionEntry<"people">[];
  return entries.map((entry) => {
    const href = hrefForEntry("people", entry);
    return {
      title: entry.data.title,
      href,
      image: imageForEntry(entry),
      summary: entry.data.role,
      role: entry.data.role,
      room: entry.data.room,
      hasDetail: hasLocalDetailPage(entry),
      alumni: entry.data.alumni,
    };
  });
}

export async function getThesisItems(): Promise<ThesisItem[]> {
  const entries = (await getEntries("theses")) as CollectionEntry<"theses">[];
  return entries.map((entry) => ({
    title: entry.data.title,
    href: hrefForEntry("theses", entry),
    description: summaryForEntry(entry),
    status: entry.data.status,
    keywords: entry.data.keywords,
  }));
}

export function groupThesisItems(
  items: ThesisItem[],
): { status: ThesisItem["status"]; items: ThesisItem[] }[] {
  const order: ThesisItem["status"][] = ["Open", "Ongoing", "Finished"];
  return order
    .map((status) => ({
      status,
      items: items.filter((item) => item.status === status),
    }))
    .filter((group) => group.items.length > 0);
}

export function selectHomepageThesisItems(
  items: ThesisItem[],
  targetCount: number | "all" | undefined,
): ThesisItem[] {
  const visibleItems = items.filter((item) => item.status !== "Finished");

  if (targetCount === "all" || targetCount === undefined) {
    return visibleItems;
  }

  const openItems = visibleItems.filter((item) => item.status === "Open");
  const ongoingItems = visibleItems.filter((item) => item.status === "Ongoing");
  const count = Math.max(openItems.length, targetCount);

  return [...openItems, ...ongoingItems].slice(0, count);
}

export async function getPreviewCard(): Promise<Card> {
  const sections: ItemSection[] = [
    "research",
    "projects",
    "people",
    "theses",
    "teaching",
  ];

  for (const section of sections) {
    const entry = (await getEntries(section)).find(
      (candidate) => candidate.data.featured,
    );
    if (entry) {
      return cardForEntry(section, entry);
    }
  }

  return (await getResearchCards())[0];
}

export async function sectionIntro(section: ItemSection): Promise<string> {
  const entry = await getIndex(section);
  return summaryForEntry(entry) || defaultSectionIntroductions[section];
}

export async function sectionHeader(section: ItemSection): Promise<{
  title: string;
  eyebrow?: string;
  summary: string;
}> {
  const entry = await getIndex(section);
  return {
    title: entry.data.title,
    eyebrow: entry.data.eyebrow,
    summary: summaryForEntry(entry) || defaultSectionIntroductions[section],
  };
}

export function hrefForEntry(
  section: ItemSection,
  entry: ItemEntry,
): string | undefined {
  return hrefForDetailPage(section, slugForEntry(entry), entry.data.detailPage);
}

export function hrefForDetailPage(
  section: ItemSection,
  slug: string,
  detailPage: boolean | string,
): string | undefined {
  if (typeof detailPage === "string") {
    return detailPage;
  }

  if (detailPage === false) {
    return undefined;
  }

  return routeFor(section, slug);
}

export function hasLocalDetailPage(entry: ItemEntry): boolean {
  return (
    entry.data.detailPage !== false && typeof entry.data.detailPage !== "string"
  );
}

export async function metadataRowsForEntry(entry: ItemEntry): Promise<MetadataRow[]> {
  const people = await getPeopleLinkIndex();

  if (entry.collection === "people") {
    return compactRows([
      ["Role", entry.data.role],
      ["Room", entry.data.room],
      ["Address", entry.data.address],
      ["Email", entry.data.email],
    ]);
  }

  if (entry.collection === "research") {
    return compactRows([
      ["Tags", entry.data.tags.join(", ")],
      linkedPeopleRow("Contact", entry.data.contact, people),
    ]);
  }

  if (entry.collection === "projects") {
    return compactRows([
      ["Funding", entry.data.funding],
      ["Duration", entry.data.duration],
      ["Partners", entry.data.partners.join(", ")],
      linkedPeopleRow("Contact", entry.data.contact, people),
    ]);
  }

  if (entry.collection === "teaching") {
    return compactRows([
      ["Type", entry.data.kind],
      ["Semester", entry.data.semester],
      ["Date", entry.data.dateRange],
      ["Tags", entry.data.tags.join(", ")],
    ]);
  }

  return compactRows([
    ["Status", entry.data.status],
    ["Keywords", entry.data.keywords.join(", ")],
    ["Degree", entry.data.degree],
    linkedPeopleRow("Supervisors", entry.data.supervisors, people),
    ["Skills", entry.data.skills.join(", ")],
    linkedPeopleRow("Contact", entry.data.contact, people),
  ]);
}

export async function getRelatedContentForPerson(
  person: ItemEntry,
): Promise<RelatedContentGroup[]> {
  if (person.collection !== "people") {
    return [];
  }

  const name = person.data.title;
  const groups: RelatedContentGroup[] = [];

  const research = (await getEntries("research")) as CollectionEntry<"research">[];
  const researchItems = research
    .filter((entry) => namesContainPerson(entry.data.contact, name))
    .map((entry) => cardForEntry("research", entry, entry.data.tags.join(" / ")));
  if (researchItems.length > 0) {
    groups.push({ title: "Research Topics", items: researchItems });
  }

  const projects = (await getEntries("projects")) as CollectionEntry<"projects">[];
  const projectItems = projects
    .filter((entry) => namesContainPerson(entry.data.contact, name))
    .map((entry) =>
      cardForEntry(
        "projects",
        entry,
        [entry.data.funding, entry.data.duration].filter(Boolean).join(" · "),
      ),
    );
  if (projectItems.length > 0) {
    groups.push({ title: "Projects", items: projectItems });
  }

  const theses = (await getEntries("theses")) as CollectionEntry<"theses">[];
  const thesisItems = theses
    .filter(
      (entry) =>
        namesContainPerson(entry.data.supervisors, name) ||
        namesContainPerson(entry.data.contact, name),
    )
    .map((entry) => cardForEntry("theses", entry, entry.data.status));
  if (thesisItems.length > 0) {
    groups.push({ title: "Thesis Topics", items: thesisItems });
  }

  return groups;
}

export async function getPublicationsByYear(): Promise<
  { year: string; items: string[] }[]
> {
  const entry = await getIndex("publications");
  const sections = (entry.body ?? "").split(/\n(?=##\s+\d{4})/);
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
    .filter((value): value is { year: string; items: string[] } =>
      Boolean(value),
    );
}

export function getAssetStaticPaths(): { params: { asset: string } }[] {
  const assetsRoot = path.join(CONTENT_ROOT, "assets");
  const files = walkFiles(assetsRoot);
  return files.map((file) => ({
    params: { asset: toRouteAsset(path.relative(CONTENT_ROOT, file)) },
  }));
}

function cardForEntry(
  section: ItemSection,
  entry: ItemEntry,
  meta?: string,
): Card {
  return {
    title: entry.data.title,
    href: hrefForEntry(section, entry),
    image: imageForEntry(entry),
    summary: summaryForEntry(entry),
    meta: meta || undefined,
  };
}

function parseHomeSections(value: unknown): HomeSectionConfig[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return undefined;
      }

      const collection = (item as { collection?: unknown }).collection;
      if (!isItemSection(collection)) {
        return undefined;
      }

      const limit = (item as { limit?: unknown }).limit;
      if (limit === "all" || (typeof limit === "number" && limit > 0)) {
        return { collection, limit };
      }

      return { collection };
    })
    .filter((item): item is HomeSectionConfig => Boolean(item));
}

function isItemSection(value: unknown): value is ItemSection {
  return (
    value === "research" ||
    value === "projects" ||
    value === "people" ||
    value === "theses" ||
    value === "teaching"
  );
}

function compactRows(
  rows: ([string, string | undefined] | MetadataRow | undefined)[],
): MetadataRow[] {
  return rows
    .filter((row): row is [string, string] | MetadataRow => {
      if (!row) return false;
      if (Array.isArray(row)) return Boolean(row[1]?.trim());
      return row.values.length > 0;
    })
    .map((row) => {
      if (!Array.isArray(row)) {
        return row;
      }

      const [label, value] = row;
      return textRow(label, value);
    });
}

function textRow(label: string, value: string): MetadataRow {
  return {
    label,
    value,
    values: [{ label: value }],
  };
}

function linkedPeopleRow(
  label: string,
  value: string | string[] | undefined,
  people: Map<string, MetadataValue>,
): MetadataRow | undefined {
  const names = personNames(value);
  if (names.length === 0) {
    return undefined;
  }

  const values = names.map((name) => people.get(normalizePersonName(name)) ?? { label: name });
  return {
    label,
    value: values.map((item) => item.label).join(", "),
    values,
  };
}

async function getPeopleLinkIndex(): Promise<Map<string, MetadataValue>> {
  const entries = (await getEntries("people")) as CollectionEntry<"people">[];
  return new Map(
    entries.map((entry) => [
      normalizePersonName(entry.data.title),
      {
        label: entry.data.title,
        href: hrefForEntry("people", entry),
      },
    ]),
  );
}

function namesContainPerson(value: string | string[] | undefined, name: string): boolean {
  const normalizedName = normalizePersonName(name);
  return personNames(value).some((candidate) => normalizePersonName(candidate) === normalizedName);
}

function personNames(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : value.split(";");
  return values.map((item) => item.trim()).filter(Boolean);
}

function normalizePersonName(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[\u2018\u2019\u02bc`]/g, "'")
    .replace(/\s+/g, " ");
}

function firstContentParagraph(body: string): string | undefined {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .find(
      (paragraph) =>
        paragraph &&
        !paragraph.startsWith("#") &&
        !paragraph.startsWith("Figure source") &&
        stripMarkdown(paragraph).length > 40,
    );
}

function withMdxExtension(id: string): string {
  return /\.mdx?$/i.test(id) ? id : `${id}.mdx`;
}

function walkFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function toRouteAsset(value: string): string {
  return value.split(path.sep).join("/");
}
