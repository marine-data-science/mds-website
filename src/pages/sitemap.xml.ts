import fs from "node:fs";
import {
  getEntries,
  getIndex,
  getStandalonePages,
  hasLocalDetailPage,
  pageSlugForEntry,
  slugForEntry,
  sourceFileForEntry,
  type ItemSection,
  type PageSection,
} from "@lib/content";
import { absoluteSiteUrl } from "@lib/site";

type SitemapEntry = {
  pathname: string;
  lastmod: string;
  priority: string;
};

const itemSections: ItemSection[] = [
  "research",
  "projects",
  "people",
  "theses",
  "teaching",
];

const indexSections: PageSection[] = [...itemSections, "publications"];

export async function GET() {
  const entries = await getSitemapEntries();
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => `  <url>
    <loc>${escapeXml(absoluteSiteUrl(entry.pathname))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`,
    ),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const home = await getIndex("pages");

  entries.push({
    pathname: "/",
    lastmod: lastModifiedForEntry(home),
    priority: "1.0",
  });

  const standalonePages = await getStandalonePages();
  for (const page of standalonePages) {
    entries.push({
      pathname: `/${pageSlugForEntry(page)}/`,
      lastmod: lastModifiedForEntry(page),
      priority: "0.6",
    });
  }

  for (const section of indexSections) {
    const index = await getIndex(section);
    entries.push({
      pathname: `/${section}/`,
      lastmod: lastModifiedForEntry(index),
      priority: section === "publications" ? "0.7" : "0.8",
    });
  }

  for (const section of itemSections) {
    const items = await getEntries(section);
    for (const item of items.filter(hasLocalDetailPage)) {
      entries.push({
        pathname: `/${section}/${slugForEntry(item)}/`,
        lastmod: lastModifiedForEntry(item),
        priority: section === "theses" ? "0.8" : "0.7",
      });
    }
  }

  return entries.sort((a, b) => a.pathname.localeCompare(b.pathname));
}

function lastModifiedForEntry(entry: Parameters<typeof sourceFileForEntry>[0]): string {
  if (entry.data.lastModified) {
    return toDateOnly(entry.data.lastModified);
  }

  return toDateOnly(fs.statSync(sourceFileForEntry(entry)).mtime.toISOString());
}

function toDateOnly(value: string): string {
  return value.slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
