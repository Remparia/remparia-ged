export type FounderApplication = {
  firstName: string; lastName: string; workEmail: string; companyName: string; jobTitle: string;
  companySize: string; industry: string; documentLocations: string[]; primaryChallenge: string;
  monthlyVolume: string; useCase: string; involvementRole: string; interviewAvailability: string;
  codesignCommitment: string; consent: string; website?: string;
};

export function validateFounderApplication(value: unknown): FounderApplication {
  if (!value || typeof value !== "object") throw badRequest("Formulaire incomplet");
  const body = value as Record<string, unknown>;
  const required = ["firstName", "lastName", "workEmail", "companyName", "jobTitle", "companySize", "industry", "primaryChallenge", "monthlyVolume", "useCase", "involvementRole", "interviewAvailability", "codesignCommitment", "consent"];
  for (const key of required) if (typeof body[key] !== "string" || !String(body[key]).trim()) throw badRequest(`Champ requis : ${key}`);
  if (!/^\S+@\S+\.\S+$/.test(String(body.workEmail))) throw badRequest("Email professionnel invalide");
  if (String(body.useCase).trim().length < 60) throw badRequest("Le cas concret doit comporter au moins 60 caractères");
  if (body.consent !== "yes") throw badRequest("Consentement requis");
  return { ...(body as FounderApplication), documentLocations: Array.isArray(body.documentLocations) ? body.documentLocations.map(String).slice(0, 10) : [] };
}

export function qualifyFounderApplication(a: FounderApplication) {
  let score = 0; const reasons: string[] = [];
  if (["Je décide", "Je pilote le processus"].includes(a.involvementRole)) { score += 25; reasons.push("responsable proche de la décision"); }
  if (a.interviewAvailability === "yes") { score += 20; reasons.push("disponible pour un entretien"); }
  else if (a.interviewAvailability === "maybe") score += 8;
  if (a.codesignCommitment === "yes") { score += 25; reasons.push("disponible pour la co-construction"); }
  else if (a.codesignCommitment === "maybe") score += 10;
  if (!a.monthlyVolume.startsWith("Moins")) { score += 15; reasons.push("volume documentaire significatif"); }
  if (a.useCase.trim().length >= 120) { score += 10; reasons.push("cas d’usage détaillé"); }
  if (a.documentLocations.length >= 2) { score += 5; reasons.push("documents dispersés"); }
  return { score, reasons, recommendation: score >= 65 ? "PRIORITY_REVIEW" : score >= 40 ? "REVIEW" : "WAITLIST" };
}

function badRequest(message: string) { const error = new Error(message) as Error & { statusCode: number }; error.statusCode = 400; return error; }
