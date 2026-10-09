import nodemailer from "nodemailer";
import { config } from "./config.js";
import type { FounderApplication } from "./founder-applications.js";

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

export async function sendMail(input: { subject: string; text: string; replyTo?: string }) {
  const to = config.mailTo;
  const from = config.mailFrom;

  if (config.resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Envoi email Resend échoué (${response.status}): ${detail}`);
    }
    return;
  }

  if (!config.smtpHost) {
    throw new Error(
      "Email non configuré. Définissez RESEND_API_KEY ou SMTP_HOST / SMTP_USER / SMTP_PASS.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: config.smtpUser
      ? { user: config.smtpUser, pass: config.smtpPass }
      : undefined,
  });

  await transporter.sendMail({
    from,
    to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  });
}
