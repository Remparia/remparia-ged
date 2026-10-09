import { describe, expect, it } from "vitest";
import { qualifyFounderApplication, validateFounderApplication } from "./founder-applications.js";

const shortForm = {
  firstName: "Alice",
  lastName: "Martin",
  workEmail: "alice@example.com",
  companyName: "Atelier Martin",
  jobTitle: "Directrice",
  companySize: "10–49",
  industry: "BTP",
  consent: "yes",
};

describe("founder applications", () => {
  it("accepte le formulaire court et le classe en revue prioritaire", () => {
    const application = validateFounderApplication(shortForm);
    expect(application.useCase).toMatch(/Non précisé/);
    const result = qualifyFounderApplication(application);
    expect(result.recommendation).toBe("PRIORITY_REVIEW");
    expect(result.score).toBeGreaterThanOrEqual(65);
  });

  it("exige un email professionnel valide", () => {
    expect(() => validateFounderApplication({ ...shortForm, workEmail: "pas-un-email" })).toThrow(/Email/);
  });
});
