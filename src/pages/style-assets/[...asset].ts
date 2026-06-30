import fs from "node:fs/promises";
import path from "node:path";
import type { APIRoute } from "astro";
import { STYLING_ROOT } from "@lib/paths";
import { getStyleAssetStaticPaths } from "@lib/content";

export function getStaticPaths() {
  return getStyleAssetStaticPaths();
}

function contentType(filePath: string): string {
  return path.extname(filePath).toLowerCase() === ".svg" ? "image/svg+xml" : "image/png";
}

export const GET: APIRoute = async ({ params }) => {
  const asset = params.asset ?? "";
  const filePath = path.resolve(STYLING_ROOT, asset);
  const relative = path.relative(STYLING_ROOT, filePath);

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
