import { randomUUID } from "node:crypto";
import {
  buildFounderApplicationEmail,
  HttpError,
  qualifyFounderApplication,
  validateFounderApplication,
} from "../../../src/lib/founder-applications";
import { sendMail } from "../../../src/lib/mail";

const KOALENDAR_URL =
  process.env.KOALENDAR_URL ?? "https://koalendar.com/e/rencontrer-contact-remparia";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const application = validateFounderApplication(body);

    if (application.website) {
      return Response.json({ received: true, bookingUrl: KOALENDAR_URL }, { status: 201 });
    }

    const qualification = qualifyFounderApplication(application);
    const id = randomUUID();

    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const { default: pg } = await import("pg");
      const pool = new pg.Pool({ connectionString: databaseUrl });
      try {
        await pool.query(
          `INSERT INTO founder_applications (
            id, first_name, last_name, work_email, company_name, job_title, company_size, industry,
            document_locations, primary_challenge, monthly_volume, use_case, involvement_role,
            interview_availability, codesign_commitment, qualification_score,
            qualification_recommendation, qualification_reasons, consent_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,now())`,
          [
            id,
            application.firstName.trim(),
            application.lastName.trim(),
            application.workEmail.trim().toLowerCase(),
            application.companyName.trim(),
            application.jobTitle.trim(),
            application.companySize,
            application.industry,
            application.documentLocations,
            application.primaryChallenge,
            application.monthlyVolume,
            application.useCase.trim(),
            application.involvementRole,
            application.interviewAvailability,
            application.codesignCommitment,
            qualification.score,
            qualification.recommendation,
            JSON.stringify(qualification.reasons),
          ],
        );
      } finally {
        await pool.end();
      }
    }

    const email = buildFounderApplicationEmail(application, {
      applicationId: id,
      score: qualification.score,
      recommendation: qualification.recommendation,
    });

    await sendMail({
      subject: email.subject,
      text: email.text,
      replyTo: application.workEmail.trim().toLowerCase(),
    });

    return Response.json(
      {
        received: true,
        applicationId: id,
        status: "SUBMITTED",
        bookingUrl: KOALENDAR_URL,
      },
      { status: 201 },
    );
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    const message =
      error instanceof Error ? error.message : "Internal error";
    console.error("[founder-applications]", message);
    return Response.json({ error: message, statusCode: status }, { status });
  }
}
