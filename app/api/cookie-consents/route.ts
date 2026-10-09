import { createHash, randomUUID } from "node:crypto";

const POLICY_VERSION = "2026-10-09";

type Decision = "accept_all" | "reject_all" | "custom";

function badRequest(message: string) {
  return Response.json({ error: message, statusCode: 400 }, { status: 400 });
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim() : "";
    if (!visitorId || visitorId.length > 80) return badRequest("Identifiant visiteur invalide");

    const decision = body.decision as Decision;
    if (decision !== "accept_all" && decision !== "reject_all" && decision !== "custom") {
      return badRequest("Décision de consentement invalide");
    }

    let analytics = Boolean(body.analytics);
    let marketing = Boolean(body.marketing);
    if (decision === "accept_all") {
      analytics = true;
      marketing = true;
    } else if (decision === "reject_all") {
      analytics = false;
      marketing = false;
    }

    const policyVersion =
      typeof body.policyVersion === "string" && body.policyVersion.trim()
        ? body.policyVersion.trim().slice(0, 40)
        : POLICY_VERSION;
    const locale =
      typeof body.locale === "string" && body.locale.trim()
        ? body.locale.trim().slice(0, 10)
        : null;

    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const ipHash = forwarded
        ? createHash("sha256")
            .update(`${process.env.COOKIE_IP_SALT ?? "rempatia-cookie-salt"}:${forwarded}`)
            .digest("hex")
        : null;
      const { default: pg } = await import("pg");
      const pool = new pg.Pool({ connectionString: databaseUrl });
      try {
        await pool.query(
          `INSERT INTO cookie_consents (
            id, visitor_id, necessary, analytics, marketing, decision,
            policy_version, locale, user_agent, ip_hash
          ) VALUES ($1,$2,true,$3,$4,$5,$6,$7,$8,$9)`,
          [
            randomUUID(),
            visitorId,
            analytics,
            marketing,
            decision,
            policyVersion,
            locale,
            request.headers.get("user-agent")?.slice(0, 400) ?? null,
            ipHash,
          ],
        );
      } finally {
        await pool.end();
      }
    }

    return Response.json(
      { received: true, consentId: randomUUID(), policyVersion },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[cookie-consents]", message);
    return Response.json({ error: message, statusCode: 500 }, { status: 500 });
  }
}
