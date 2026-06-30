import { Marked, Renderer } from "marked";
import { rewriteHref } from "./routes";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`#>~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderMarkdown(markdown: string): string {
  const renderer = new Renderer();

  renderer.link = ((...args: unknown[]) => {
    const token = args[0] as { href?: string; title?: string | null; text?: string };
    const href = typeof token === "object" ? token.href : String(args[0] ?? "");
    const title = typeof token === "object" ? token.title : (args[1] as string | null);
    const text = typeof token === "object" ? token.text : String(args[2] ?? href);
    const safeHref = escapeHtml(rewriteHref(href));
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    const external = /^https?:\/\//i.test(safeHref);
    const externalAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${safeHref}"${titleAttr}${externalAttrs}>${text}</a>`;
  }) as Renderer["link"];

  renderer.image = ((...args: unknown[]) => {
    const token = args[0] as { href?: string; title?: string | null; text?: string };
    const href = typeof token === "object" ? token.href : String(args[0] ?? "");
    const title = typeof token === "object" ? token.title : (args[1] as string | null);
    const text = typeof token === "object" ? (token.text ?? "") : String(args[2] ?? "");
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${escapeHtml(rewriteHref(href))}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" />`;
  }) as Renderer["image"];

  const marked = new Marked({ renderer, gfm: true, breaks: false });
  return marked.parse(markdown) as string;
}
