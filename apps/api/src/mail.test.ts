import { describe, expect, it } from "vitest";
import { buildFounderApplicationEmail } from "./mail.js";

describe("founder application email", () => {
  it("inclut les champs principaux", () => {
    const email = buildFounderApplicationEmail(
      {
        firstName: "Alice",
        lastName: "Martin",
        workEmail: "alice@example.com",
        companyName: "Atelier Martin",
        jobTitle: "Directrice",
        companySize: "10–49",
        industry: "BTP",
        documentLocations: ["Emails"],
        primaryChallenge: "Retrouver la bonne version",
        monthlyVolume: "100–500",
        useCase: "Nous perdons du temps à retrouver les attestations avant chaque chantier et cela bloque les démarrages.",
        involvementRole: "Je décide",
        interviewAvailability: "yes",
        codesignCommitment: "maybe",
        consent: "yes",
      },
      { applicationId: "abc", score: 70, recommendation: "PRIORITY_REVIEW" },
    );

    expect(email.subject).toContain("Alice Martin");
    expect(email.text).toContain("alice@example.com");
    expect(email.text).toContain("Atelier Martin");
    expect(email.text).toContain("Entretien 30–45 min : Oui");
  });
});
