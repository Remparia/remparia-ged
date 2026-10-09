import { createHash } from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { v4 as uuid } from "uuid";
import { config } from "./config.js";
import { validateCookieConsent } from "./cookie-consents.js";
import { pool } from "./db.js";
import { qualifyFounderApplication, validateFounderApplication } from "./founder-applications.js";
import { buildFounderApplicationEmail, sendMail } from "./mail.js";

function hashIp(value: string | undefined) {
  if (!value) return null;
  return createHash("sha256").update(`${config.cookieIpSalt}:${value}`).digest("hex");
}

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

  app.post("/api/cookie-consents", async (req, reply) => {
    const consent = validateCookieConsent(req.body);
    const id = uuid();
    const forwarded = typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
      : undefined;
    await pool.query(
      `INSERT INTO cookie_consents (
        id, visitor_id, necessary, analytics, marketing, decision,
        policy_version, locale, user_agent, ip_hash
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        id,
        consent.visitorId,
        consent.necessary,
        consent.analytics,
        consent.marketing,
        consent.decision,
        consent.policyVersion,
        consent.locale ?? null,
        typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"].slice(0, 400) : null,
        hashIp(forwarded || req.ip),
      ],
    );
    return reply.code(201).send({ received: true, consentId: id, policyVersion: consent.policyVersion });
  });

  app.get("/api/cookie-consents", async (req, reply) => {
    if (!config.cookieAdminToken) {
      return reply.code(503).send({ error: "Administration cookies non configurée", statusCode: 503 });
    }
    const auth = req.headers.authorization;
    const token = typeof auth === "string" && auth.startsWith("Bearer ")
      ? auth.slice(7)
      : typeof req.headers["x-admin-token"] === "string"
        ? req.headers["x-admin-token"]
        : "";
    if (token !== config.cookieAdminToken) {
      return reply.code(401).send({ error: "Non autorisé", statusCode: 401 });
    }

    const query = req.query as { limit?: string; visitorId?: string };
    const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 200);
    const visitorId = typeof query.visitorId === "string" ? query.visitorId.trim() : "";

    const result = visitorId
      ? await pool.query(
          `SELECT id, visitor_id, necessary, analytics, marketing, decision,
                  policy_version, locale, created_at
           FROM cookie_consents
           WHERE visitor_id = $1
           ORDER BY created_at DESC
           LIMIT $2`,
          [visitorId, limit],
        )
      : await pool.query(
          `SELECT id, visitor_id, necessary, analytics, marketing, decision,
                  policy_version, locale, created_at
           FROM cookie_consents
           ORDER BY created_at DESC
           LIMIT $1`,
          [limit],
        );

    return {
      items: result.rows,
      count: result.rowCount ?? result.rows.length,
    };
  });

  app.post("/api/founder-applications", async (req, reply) => {
    const application = validateFounderApplication(req.body);
    if (application.website) {
      return reply.code(201).send({ received: true, bookingUrl: config.koalendarUrl });
    }
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

    return reply.code(201).send({
      received: true,
      applicationId: id,
      status: "SUBMITTED",
      bookingUrl: config.koalendarUrl,
    });
  });

  await app.listen({ host: config.host, port: config.port });
  console.log(`Remparia landing API listening on http://localhost:${config.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
