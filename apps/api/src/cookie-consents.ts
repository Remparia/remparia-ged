export const COOKIE_POLICY_VERSION = "2026-10-09";

export type CookieConsentDecision = "accept_all" | "reject_all" | "custom";

export type CookieConsentInput = {
  visitorId: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  decision: CookieConsentDecision;
  policyVersion: string;
  locale?: string;
};

function badRequest(message: string) {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 400;
  return error;
}

export function validateCookieConsent(value: unknown): CookieConsentInput {
  if (!value || typeof value !== "object") throw badRequest("Consentement incomplet");
  const body = value as Record<string, unknown>;

  const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim() : "";
  if (!visitorId || visitorId.length > 80) throw badRequest("Identifiant visiteur invalide");

  const decision = body.decision;
  if (decision !== "accept_all" && decision !== "reject_all" && decision !== "custom") {
    throw badRequest("Décision de consentement invalide");
  }

  const policyVersion =
    typeof body.policyVersion === "string" && body.policyVersion.trim()
      ? body.policyVersion.trim().slice(0, 40)
      : COOKIE_POLICY_VERSION;

  const locale =
    typeof body.locale === "string" && body.locale.trim()
      ? body.locale.trim().slice(0, 10)
      : undefined;

  let necessary = true;
  let analytics = Boolean(body.analytics);
  let marketing = Boolean(body.marketing);

  if (decision === "accept_all") {
    analytics = true;
    marketing = true;
  } else if (decision === "reject_all") {
    analytics = false;
    marketing = false;
  }

  necessary = true;

  return { visitorId, necessary, analytics, marketing, decision, policyVersion, locale };
}
