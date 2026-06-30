export type Section = "research" | "projects" | "people" | "theses";

export function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.mdx$/i, "");
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function routeFor(section: Section, slug: string): string {
  return `/${section}/${slug}/`;
}

const legacyRoutes = new Map<string, string>([
  ["/home", "/"],
  ["/research", "/research/"],
  ["/projects", "/projects/"],
  ["/people", "/people/"],
  ["/theses", "/theses/"],
  ["/teaching", "/teaching/"],
  ["/publications", "/publications/"],
  ["/lifted-marginal-filtering", "/research/lifted-marginal-filtering/"],
  ["/lifted-marginal-filtering-1", "/research/neuro-symbolic-human-activity-recognition/"],
  ["/lifted-marginal-filtering-1-1", "/research/explaining-neural-networks/"],
  ["/lifted-marginal-filtering-1-1-1", "/research/tractable-probabilistic-models/"],
  ["/lifted-marginal-filtering-1-1-1-1", "/research/detecting-disorientation-of-people-with-dementia/"],
  ["/lifted-marginal-filtering-1-1-1-2", "/research/domain-adaptation-for-human-activity-recognition/"],
  ["/lifted-marginal-filtering-2", "/research/deep-learning-for-tabular-and-categorical-data/"],
  ["/optimal-sensor-placement", "/research/optimal-sensor-placement/"],
  ["/ultrasound", "/research/ultrasound/"],
  ["/ai4pumps", "/projects/ai4pumps/"],
  ["/data4sim", "/projects/data4sim/"],
  ["/egoproject2026", "/projects/egoproject2026/"],
  ["/ki-ubb-cluj-napoca", "/projects/ki-ubb-cluj-napoca/"],
  ["/ml-micro", "/projects/ml-micro/"],
  ["/mml", "/projects/mml/"],
  ["/root", "/projects/root/"],
  ["/show2instruct", "/projects/show2instruct/"],
  ["/anna", "/people/anna/"],
  ["/ashwin", "/people/ashwin/"],
  ["/bharathi", "/people/bharathi/"],
  ["/daniel-wulff", "/people/daniel-wulff/"],
  ["/mohd", "/people/mohd/"],
  ["/stefan-ludtke", "/people/stefan-ludtke/"],
  ["/microbiology-thesis", "/theses/analyzing-microbiome-metabarcoding-data-with-tabpfn/"],
  ["/thesis-1", "/theses/transfer-learning-from-medical-ultrasound-to-marine-sonar-image-data/"],
  ["/thesis-1-1", "/theses/cross-domain-translation-of-angiography/"],
  ["/thesis-1-1-1", "/theses/uncertainty-aware-stenoses-segmentation/"],
]);

export function rewriteHref(href: string | undefined): string {
  if (!href) {
    return "#";
  }

  if (href === "https://ash") {
    return "/people/ashwin/";
  }

  if (href.startsWith("https:// https://")) {
    return href.replace("https:// https://", "https://");
  }

  if (href.startsWith("/s/")) {
    return `https://www.mds-lab.de${href}`;
  }

  const [pathPart, suffix = ""] = href.split(/(?=[?#])/);
  return legacyRoutes.get(pathPart) ? `${legacyRoutes.get(pathPart)}${suffix}` : href;
}
