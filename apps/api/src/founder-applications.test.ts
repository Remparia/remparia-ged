import { describe, expect, it } from "vitest";
import { qualifyFounderApplication, validateFounderApplication } from "./founder-applications.js";

const complete = {
  firstName: "Alice", lastName: "Martin", workEmail: "alice@example.com", companyName: "Atelier Martin",
  jobTitle: "Directrice", companySize: "10–49 personnes", industry: "BTP", documentLocations: ["Emails", "Dossiers partagés"],
  primaryChallenge: "Suivre les pièces manquantes", monthlyVolume: "500–2 000 documents",
  useCase: "Nous vérifions chaque semaine les attestations et contrats de nombreux sous-traitants avant leur intervention sur nos chantiers.",
  involvementRole: "Je décide", interviewAvailability: "yes", codesignCommitment: "yes", consent: "yes",
};

describe("founder applications", () => {
  it("prioritizes a concrete and committed candidate without auto-accepting them", () => {
    const result = qualifyFounderApplication(validateFounderApplication(complete));
    expect(result.recommendation).toBe("PRIORITY_REVIEW");
    expect(result.score).toBeGreaterThanOrEqual(65);
  });
  it("requires an explicit concrete use case", () => {
    expect(() => validateFounderApplication({ ...complete, useCase: "Trop court" })).toThrow(/60 caractères/);
  });
});
