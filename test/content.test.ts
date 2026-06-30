import { describe, expect, it } from "vitest";
import { contentAssetUrl, PROMPTS_ROOT } from "../src/lib/paths";
import {
  getPeopleCards,
  getPreviewCard,
  getProjectCards,
  getResearchCards,
  getThesisItems,
  groupThesisItems,
} from "../src/lib/content";
import { rewriteHref } from "../src/lib/routes";

describe("content loading", () => {
  it("uses corrected content titles directly from source files", () => {
    const research = getResearchCards();
    expect(research.some((card) => card.title.includes("Placment"))).toBe(false);
    expect(research.some((card) => card.title === "Neural Processes for Optimal Sensor Placement")).toBe(true);
  });

  it("uses the explicit preview teaser field for the homepage preview", () => {
    const preview = getPreviewCard();
    expect(preview.title).toBe("Lifted Marginal Filtering");
  });

  it("keeps people without source files overview-only", () => {
    const people = getPeopleCards();
    const jan = people.find((person) => person.title === "Jan Meischner");
    const stefan = people.find((person) => person.title === "Stefan Lüdtke");
    expect(jan?.hasDetail).toBe(false);
    expect(stefan?.hasDetail).toBe(true);
  });

  it("translates German project summaries for visible cards", () => {
    const projects = getProjectCards();
    const data4sim = projects.find((project) => project.title === "Data4Sim");
    expect(data4sim?.summary).toContain("Sensor-based capture");
    expect(data4sim?.summary).not.toContain("In diesem Projekt");
  });

  it("includes thesis detail files and inline source topics", () => {
    const theses = getThesisItems();
    expect(theses.some((item) => item.href?.includes("transfer-learning-from-medical-ultrasound"))).toBe(true);
    expect(theses.some((item) => item.title.includes("phytoplankton"))).toBe(true);
  });

  it("groups thesis topics by status from the theses index frontmatter", () => {
    const groups = groupThesisItems(getThesisItems());
    expect(groups.map((group) => group.status)).toEqual(["Open", "Ongoing", "Finished"]);
  });
});

describe("routing and source boundaries", () => {
  it("rewrites legacy source links to current routes", () => {
    expect(rewriteHref("/ml-micro")).toBe("/projects/ml-micro/");
    expect(rewriteHref("https://ash")).toBe("/people/ashwin/");
    expect(rewriteHref("/s/intro.pdf")).toBe("https://www.mds-lab.de/s/intro.pdf");
  });

  it("rejects content assets outside the content source boundary", () => {
    expect(() => contentAssetUrl(PROMPTS_ROOT, "../3 - prepared prompts/README.md")).toThrow();
  });
});
