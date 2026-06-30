export const siteBasePath = import.meta.env.BASE_URL ?? "/";

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

  if (pathname.startsWith(base)) {
    return pathname;
  }

  return `${base.replace(/\/$/g, "")}${pathname}`;
}
