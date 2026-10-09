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
    "primaryChallenge",
    "monthlyVolume",
    "useCase",
    "involvementRole",
    "interviewAvailability",
    "codesignCommitment",
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
  if (String(body.useCase).trim().length < 60) {
    throw new HttpError("Le cas concret doit comporter au moins 60 caractères");
  }
  if (body.consent !== "yes") throw new HttpError("Consentement requis");

  return {
    ...(body as FounderApplication),
    documentLocations: Array.isArray(body.documentLocations)
      ? body.documentLocations.map(String).slice(0, 10)
      : [],
  };
}

export function qualifyFounderApplication(a: FounderApplication) {
  let score = 0;
  const reasons: string[] = [];
  if (["Je décide", "Je pilote le processus", "I make decisions", "I lead the process"].includes(a.involvementRole)) {
    score += 25;
    reasons.push("responsable proche de la décision");
  }
  if (a.interviewAvailability === "yes") {
    score += 20;
    reasons.push("disponible pour un entretien");
  } else if (a.interviewAvailability === "maybe") score += 8;
  if (a.codesignCommitment === "yes") {
    score += 25;
    reasons.push("disponible pour la co-construction");
  } else if (a.codesignCommitment === "maybe") score += 10;
  if (!a.monthlyVolume.startsWith("Moins") && !a.monthlyVolume.startsWith("Fewer")) {
    score += 15;
    reasons.push("volume documentaire significatif");
  }
  if (a.useCase.trim().length >= 120) {
    score += 10;
    reasons.push("cas d’usage détaillé");
  }
  if (a.documentLocations.length >= 2) {
    score += 5;
    reasons.push("documents dispersés");
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
    "— Documents —",
    `Emplacements : ${application.documentLocations.length ? application.documentLocations.join(", ") : "—"}`,
    `Blocage principal : ${application.primaryChallenge}`,
    `Volume mensuel : ${application.monthlyVolume}`,
    "",
    "Cas concret :",
    application.useCase.trim(),
    "",
    "— Participation —",
    `Rôle : ${application.involvementRole}`,
    `Entretien 30–45 min : ${label(application.interviewAvailability)}`,
    `Ateliers co-construction : ${label(application.codesignCommitment)}`,
  ];

  return {
    subject: `[Cercle fondateur] ${application.firstName.trim()} ${application.lastName.trim()} — ${application.companyName.trim()}`,
    text: lines.join("\n"),
  };
}
