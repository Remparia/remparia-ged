import Fastify from "fastify";
import cors from "@fastify/cors";
import { v4 as uuid } from "uuid";
import { config } from "./config.js";
import { pool } from "./db.js";
import { qualifyFounderApplication, validateFounderApplication } from "./founder-applications.js";

async function main() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: config.corsOrigin });

  app.setErrorHandler((err, _req, reply) => {
    const error = err as Error & { statusCode?: number };
    const status = error.statusCode ?? 500;
    reply.status(status).send({
      error: error.message || "Internal error",
      statusCode: status,
    });
  });

  app.get("/health", async () => ({ ok: true, service: "rempatia-landing" }));

  app.post("/api/founder-applications", async (req, reply) => {
    const application = validateFounderApplication(req.body);
    if (application.website) return reply.code(201).send({ received: true });
    const qualification = qualifyFounderApplication(application);
    const id = uuid();
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
    return reply.code(201).send({ received: true, applicationId: id, status: "SUBMITTED" });
  });

  await app.listen({ host: config.host, port: config.port });
  console.log(`Remparia landing API listening on http://localhost:${config.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
