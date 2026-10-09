import { describe, expect, it } from "vitest";
import { validateCookieConsent } from "./cookie-consents.js";

describe("cookie consents", () => {
  it("accepte un consentement personnalisé", () => {
    const result = validateCookieConsent({
      visitorId: "visitor-1",
      analytics: true,
      marketing: false,
      decision: "custom",
      policyVersion: "2026-10-09",
      locale: "fr",
    });
    expect(result.necessary).toBe(true);
    expect(result.analytics).toBe(true);
    expect(result.marketing).toBe(false);
  });

  it("force tout à true pour accept_all", () => {
    const result = validateCookieConsent({
      visitorId: "visitor-1",
      analytics: false,
      marketing: false,
      decision: "accept_all",
    });
    expect(result.analytics).toBe(true);
    expect(result.marketing).toBe(true);
  });

  it("refuse une décision invalide", () => {
    expect(() =>
      validateCookieConsent({ visitorId: "visitor-1", decision: "maybe" }),
    ).toThrow(/Décision/);
  });
});
