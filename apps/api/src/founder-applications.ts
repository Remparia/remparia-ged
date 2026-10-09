export type FounderApplication = {
  firstName: string; lastName: string; workEmail: string; companyName: string; jobTitle: string;
  companySize: string; industry: string; documentLocations: string[]; primaryChallenge: string;
  monthlyVolume: string; useCase: string; involvementRole: string; interviewAvailability: string;
  codesignCommitment: string; consent: string; website?: string;
};

function badRequest(message: string) {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 400;
  return error;
}

function optionalString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function validateFounderApplication(value: unknown): FounderApplication {
  if (!value || typeof value !== "object") throw badRequest("Formulaire incomplet");
  const body = value as Record<string, unknown>;
  const required = ["firstName", "lastName", "workEmail", "companyName", "jobTitle", "companySize", "industry", "consent"];
  for (const key of required) if (typeof body[key] !== "string" || !String(body[key]).trim()) throw badRequest(`Champ requis : ${key}`);
  if (!/^\S+@\S+\.\S+$/.test(String(body.workEmail))) throw badRequest("Email professionnel invalide");
  if (body.consent !== "yes") throw badRequest("Consentement requis");
  return {
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    workEmail: String(body.workEmail),
    companyName: String(body.companyName),
    jobTitle: String(body.jobTitle),
    companySize: String(body.companySize),
    industry: String(body.industry),
    documentLocations: Array.isArray(body.documentLocations) ? body.documentLocations.map(String).slice(0, 10) : [],
    primaryChallenge: optionalString(body.primaryChallenge, "Non précisé"),
    monthlyVolume: optionalString(body.monthlyVolume, "Non précisé"),
    useCase: optionalString(body.useCase, "Non précisé — rendez-vous demandé via le formulaire court."),
    involvementRole: optionalString(body.involvementRole, "Non précisé"),
    interviewAvailability: optionalString(body.interviewAvailability, "yes"),
    codesignCommitment: optionalString(body.codesignCommitment, "maybe"),
    consent: "yes",
    website: typeof body.website === "string" ? body.website : undefined,
  };
}

export function qualifyFounderApplication(a: FounderApplication) {
  let score = 40;
  const reasons: string[] = ["formulaire court — rendez-vous demandé"];
  if (["Je décide", "Je pilote le processus"].includes(a.involvementRole)) {
    score += 25;
    reasons.push("responsable proche de la décision");
  }
  if (a.interviewAvailability === "yes") {
    score += 20;
    reasons.push("disponible pour un entretien");
  }
  if (a.companySize !== "1–9") {
    score += 10;
    reasons.push("taille d’entreprise significative");
  }
  return { score, reasons, recommendation: score >= 65 ? "PRIORITY_REVIEW" : score >= 40 ? "REVIEW" : "WAITLIST" };
}
