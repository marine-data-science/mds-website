export const siteBasePath = import.meta.env.BASE_URL ?? "/";
export const siteOrigin =
  import.meta.env.SITE ?? "https://marine-data-science.github.io";

function normalizedBasePath(): string {
  if (siteBasePath === "/") {
    return "/";
  }

  return `/${siteBasePath.replace(/^\/|\/$/g, "")}/`;
}

export function withBasePath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    return pathname;
  }

  const base = normalizedBasePath();
  if (base === "/") {
    return pathname;
  }

  if (pathname === "/") {
    return base;
  }

  if (pathname === base.replace(/\/$/g, "")) {
    return base;
  }

  if (pathname.startsWith(base)) {
    return pathname;
  }

  return `${base.replace(/\/$/g, "")}${pathname}`;
}

export function absoluteSiteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  return new URL(withBasePath(pathname), siteOrigin).toString();
}
