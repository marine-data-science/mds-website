import path from "node:path";
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import matter from "gray-matter";
import { CONTENT_ROOT, contentAssetUrl } from "../src/lib/paths";
import {
  bodyForIndex,
  getEntry,
  getIndex,
  getPeopleCards,
  getProjectCards,
  getRelatedContentForPerson,
  getResearchCards,
  getStandalonePages,
  getTeachingCards,
  getThesisItems,
  groupThesisItems,
  hrefForDetailPage,
  metadataRowsForEntry,
  pageSlugForEntry,
  selectHomepageThesisItems,
  type ThesisItem,
} from "../src/lib/content";
import { rewriteHref } from "../src/lib/routes";

describe("collection-backed overview content", () => {
  it("builds research cards from research item files and explicit frontmatter tags", async () => {
    const research = await getResearchCards();
    const titles = research.map((card) => card.title);
    const microbiome = research.find((card) => card.title === "Analyzing Microbiome Data using Machine Learning");
    const probabilistic = research.find((card) => card.title === "Tractable Probabilistic Models");

    expect(titles).toContain("Neural Processes for Optimal Sensor Placement");
    expect(titles).toContain("Analyzing Microbiome Data using Machine Learning");
    expect(titles).not.toContain("Marine Machine Learning");
    expect(microbiome?.href).toBe("/research/ml-micro/");
    expect(probabilistic?.meta).toBe("probabilistic inference / tractable models");
  });

  it("keeps projects limited to actual project files", async () => {
    const projects = await getProjectCards();

    expect(projects.map((project) => project.title)).toEqual(["Data4Sim", "AI4Pumps", "Show2Instruct"]);
    expect(projects.find((project) => project.title === "Data4Sim")?.meta).toBe("BMWK · 01.10.2023 - 31.03.2026");
  });

  it("builds teaching cards from teaching item files", async () => {
    const teaching = await getTeachingCards();

    expect(teaching.map((item) => item.title)).toEqual(["EgoProject 2026", "Artificial Intelligence (UBB Cluj-Napoca)", "RoOT"]);
    expect(teaching[0]?.href).toBe("/teaching/egoproject2026/");
  });

  it("reads people role and room from person frontmatter", async () => {
    const people = await getPeopleCards();
    const jan = people.find((person) => person.title === "Jan Meischner");
    const stefan = people.find((person) => person.title === "Stefan Lüdtke");

    expect(jan?.role).toBe("Research Coordinator");
    expect(jan?.room).toBe("Room 211");
    expect(jan?.hasDetail).toBe(false);
    expect(stefan?.hasDetail).toBe(true);
  });

  it("separates alumni from current people using person frontmatter", async () => {
    const people = await getPeopleCards();
    const clarissa = people.find((person) => person.title === "Clarissa Vock");

    expect(clarissa?.alumni).toBe(true);
    expect(clarissa?.hasDetail).toBe(false);
    expect(people.filter((person) => person.alumni).map((person) => person.title)).toEqual(["Clarissa Vock"]);
  });

  it("groups thesis topics from individual thesis item files", async () => {
    const theses = await getThesisItems();
    const groups = groupThesisItems(theses);

    expect(theses.some((item) => item.href?.includes("transfer-learning-from-medical-ultrasound"))).toBe(true);
    expect(theses.some((item) => item.title.includes("phytoplankton"))).toBe(true);
    expect(groups.map((group) => group.status)).toEqual(["Open", "Ongoing", "Finished"]);
    expect(theses.find((item) => item.title.includes("TabPFN"))?.keywords).toEqual(["microbiology"]);
  });

  it("selects open homepage thesis topics first and fills with ongoing topics only", async () => {
    const theses = await getThesisItems();
    const homepageTheses = selectHomepageThesisItems(theses, 4);

    expect(homepageTheses).toHaveLength(4);
    expect(homepageTheses.every((item) => item.status !== "Finished")).toBe(true);
    expect(homepageTheses.filter((item) => item.status === "Open")).toEqual(
      theses.filter((item) => item.status === "Open"),
    );
    expect(homepageTheses.map((item) => item.status)).toEqual(["Open", "Open", "Open", "Ongoing"]);
  });

  it("does not hide open homepage thesis topics when there are more than the target count", () => {
    const items: ThesisItem[] = [
      { title: "Open 1", status: "Open", href: "/1/", description: "", keywords: [] },
      { title: "Open 2", status: "Open", href: "/2/", description: "", keywords: [] },
      { title: "Ongoing 1", status: "Ongoing", href: "/3/", description: "", keywords: [] },
      { title: "Finished 1", status: "Finished", href: "/4/", description: "", keywords: [] },
    ];

    expect(selectHomepageThesisItems(items, 1).map((item) => item.title)).toEqual(["Open 1", "Open 2"]);
  });

  it("links thesis supervisors to matching people detail targets", async () => {
    const thesis = await getEntry("theses", "deep-learning-based-age-estimation-of-fish-from-otoliths");
    expect(thesis).toBeDefined();

    const rows = await metadataRowsForEntry(thesis!);
    const supervisors = rows.find((row) => row.label === "Supervisors");

    expect(supervisors?.values).toEqual([
      { label: "Jan Meischner", href: "https://jmeischner.com" },
    ]);
  });

  it("links project contacts to people even when apostrophe styles differ", async () => {
    const project = await getEntry("projects", "data4sim");
    expect(project).toBeDefined();

    const rows = await metadataRowsForEntry(project!);
    const contact = rows.find((row) => row.label === "Contact");

    expect(contact?.values).toEqual([
      { label: "Moh'd Khier Al Kfari", href: "/people/mohd/" },
    ]);
  });

  it("collects related projects and thesis topics for people", async () => {
    const daniel = await getEntry("people", "daniel-wulff");
    const jan = await getEntry("people", "jan-meischner");
    expect(daniel?.collection).toBe("people");
    expect(jan?.collection).toBe("people");

    const danielRelated = await getRelatedContentForPerson(daniel!);
    const janRelated = await getRelatedContentForPerson(jan!);

    expect(danielRelated.find((group) => group.title === "Projects")?.items.map((item) => item.title)).toEqual(["AI4Pumps"]);
    expect(janRelated.find((group) => group.title === "Thesis Topics")?.items.map((item) => item.title)).toEqual([
      "Deep learning-based age estimation of fish from otoliths",
    ]);
  });

  it("does not rely on overview frontmatter item arrays", async () => {
    const overviewPages = ["research", "projects", "people", "theses", "teaching"].map((section) =>
      matter(fs.readFileSync(path.join(CONTENT_ROOT, section, "index.mdx"), "utf8")),
    );

    expect(overviewPages.length).toBeGreaterThan(0);
    expect(overviewPages.every((entry) => !("items" in entry.data))).toBe(true);
  });

  it("uses overview frontmatter for title, eyebrow, and summary", async () => {
    const research = await getIndex("research");

    expect(research.data.title).toBe("Research");
    expect(research.data.eyebrow).toBe("Research topics");
    expect(research.data.summary).toContain("Machine learning methods");
  });

  it("uses home frontmatter to configure the homepage hero and collection sections", async () => {
    const home = await getIndex("pages");

    expect(home.data.title).toBe("Marine Data Science");
    expect(home.data.eyebrow).toContain("University of Rostock");
    expect(home.data.summary).toContain("machine learning");
    expect(home.data.sections).toEqual([
      { collection: "research", limit: 4 },
      { collection: "projects", limit: 3 },
      { collection: "theses", limit: 4 },
      { collection: "teaching", limit: 3 },
      { collection: "people", limit: "all" },
    ]);
    expect(bodyForIndex(home)).toContain("CORE Network");
  });

  it("renders standalone pages from content/pages without treating the homepage as a standalone route", async () => {
    const pages = await getStandalonePages();

    expect(pages.map(pageSlugForEntry)).toContain("core-network");
    expect(pages.map(pageSlugForEntry)).not.toContain("home");
    expect(pages.find((page) => pageSlugForEntry(page) === "core-network")?.data.title).toBe("CORE Network");
  });
});

describe("routing and source boundaries", () => {
  it("supports local, external, and overview-only detail page links", () => {
    expect(hrefForDetailPage("people", "stefan-ludtke", true)).toBe("/people/stefan-ludtke/");
    expect(hrefForDetailPage("people", "external-person", "https://example.com/profile")).toBe("https://example.com/profile");
    expect(hrefForDetailPage("people", "jan-meischner", false)).toBeUndefined();
  });

  it("rewrites legacy source links to current routes", () => {
    expect(rewriteHref("/ml-micro")).toBe("/research/ml-micro/");
    expect(rewriteHref("/egoproject2026")).toBe("/teaching/egoproject2026/");
    expect(rewriteHref("https://ash")).toBe("/people/ashwin/");
    expect(rewriteHref("/s/intro.pdf")).toBe("https://www.mds-lab.de/s/intro.pdf");
  });

  it("rejects content assets outside the content source boundary", () => {
    const sourceFile = path.join(CONTENT_ROOT, "research", "ml-micro.mdx");
    expect(() => contentAssetUrl(sourceFile, "../../docs/architecture.md")).toThrow();
  });

  it("keeps obsolete demo and mml content out of active source files", () => {
    expect(fs.existsSync(path.join(process.cwd(), "3 - prepared prompts"))).toBe(false);
    expect(fs.existsSync(path.join(CONTENT_ROOT, "projects", "mml.mdx"))).toBe(false);
  });
});
