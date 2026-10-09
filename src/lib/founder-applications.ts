export type FounderApplication = {
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  documentLocations: string[];
  primaryChallenge: string;
  monthlyVolume: string;
  useCase: string;
  involvementRole: string;
  interviewAvailability: string;
  codesignCommitment: string;
  consent: string;
  website?: string;
};

export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function optionalString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function validateFounderApplication(value: unknown): FounderApplication {
  if (!value || typeof value !== "object") throw new HttpError("Formulaire incomplet");
  const body = value as Record<string, unknown>;
  const required = [
    "firstName",
    "lastName",
    "workEmail",
    "companyName",
    "jobTitle",
    "companySize",
    "industry",
    "consent",
  ];
  for (const key of required) {
    if (typeof body[key] !== "string" || !String(body[key]).trim()) {
      throw new HttpError(`Champ requis : ${key}`);
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(String(body.workEmail))) {
    throw new HttpError("Email professionnel invalide");
  }
  if (body.consent !== "yes") throw new HttpError("Consentement requis");

  return {
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    workEmail: String(body.workEmail),
    companyName: String(body.companyName),
    jobTitle: String(body.jobTitle),
    companySize: String(body.companySize),
    industry: String(body.industry),
    documentLocations: Array.isArray(body.documentLocations)
      ? body.documentLocations.map(String).slice(0, 10)
      : [],
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
  if (["Je décide", "Je pilote le processus", "I make decisions", "I lead the process"].includes(a.involvementRole)) {
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
  return {
    score,
    reasons,
    recommendation: score >= 65 ? "PRIORITY_REVIEW" : score >= 40 ? "REVIEW" : "WAITLIST",
  };
}

function label(value: string) {
  return value === "yes" ? "Oui" : value === "maybe" ? "Peut-être" : value === "no" ? "Non" : value;
}

export function buildFounderApplicationEmail(
  application: FounderApplication,
  meta: { applicationId: string; score: number; recommendation: string },
) {
  const lines = [
    "Nouvelle candidature — Cercle fondateur Remparia GED",
    "",
    `ID : ${meta.applicationId}`,
    `Score : ${meta.score} · ${meta.recommendation}`,
    "",
    "— Identité —",
    `Prénom : ${application.firstName.trim()}`,
    `Nom : ${application.lastName.trim()}`,
    `Email : ${application.workEmail.trim()}`,
    `Entreprise : ${application.companyName.trim()}`,
    `Fonction : ${application.jobTitle.trim()}`,
    `Taille : ${application.companySize}`,
    `Secteur : ${application.industry}`,
    "",
    "— Suite —",
    `Entretien : ${label(application.interviewAvailability)}`,
    "Le dirigeant a demandé un créneau Koalendar après le formulaire court.",
  ];

  return {
    subject: `[Cercle fondateur] ${application.firstName.trim()} ${application.lastName.trim()} — ${application.companyName.trim()}`,
    text: lines.join("\n"),
  };
}
