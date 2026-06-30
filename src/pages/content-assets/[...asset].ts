import fs from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import { CONTENT_ROOT } from "@lib/paths";
import { getAssetStaticPaths } from "@lib/content";

export function getStaticPaths() {
  return getAssetStaticPaths();
}

function contentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

export const GET: APIRoute = async ({ params }) => {
  const asset = params.asset ?? "";
  const filePath = path.resolve(CONTENT_ROOT, asset);
  const relative = path.relative(CONTENT_ROOT, filePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return new Response("Not found", { status: 404 });
  }

  const body = await fs.readFile(filePath);
  return new Response(body, {
    headers: {
      "Content-Type": contentType(filePath),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
