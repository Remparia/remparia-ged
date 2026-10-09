"use client";

import { useEffect, useState } from "react";

export type Lang = "fr" | "en";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decision: "accept_all" | "reject_all" | "custom";
  policyVersion: string;
  updatedAt: string;
};

const STORAGE_KEY = "rempatia-cookie-consent";
const VISITOR_KEY = "rempatia-cookie-visitor";
export const COOKIE_POLICY_VERSION = "2026-10-09";
export const OPEN_COOKIE_PREFERENCES_EVENT = "rempatia:open-cookie-preferences";
export const CONSENT_UPDATED_EVENT = "rempatia:consent-updated";

type Props = { lang?: Lang };

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStored(): CookiePreferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (!parsed || parsed.policyVersion !== COOKIE_POLICY_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = createVisitorId();
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return createVisitorId();
  }
}

function publishConsent(prefs: CookiePreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: prefs }));
  (window as Window & { __rempatiaConsent?: CookiePreferences }).__rempatiaConsent = prefs;
}

async function persistConsent(prefs: CookiePreferences, lang: Lang) {
  try {
    await fetch("/api/cookie-consents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        necessary: true,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        decision: prefs.decision,
        policyVersion: prefs.policyVersion,
        locale: lang,
      }),
      keepalive: true,
    });
  } catch {
    // Le choix reste appliqué localement même si l’API est indisponible.
  }
}

export function CookieBanner({ lang = "fr" }: Props) {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const fr = lang === "fr";

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
      publishConsent(stored);
      setVisible(false);
    } else {
      setVisible(true);
    }
    setReady(true);

    const openPrefs = () => {
      const current = readStored();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setPanelOpen(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPrefs);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPrefs);
  }, []);

  async function save(
    decision: CookiePreferences["decision"],
    nextAnalytics: boolean,
    nextMarketing: boolean,
  ) {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      decision,
      policyVersion: COOKIE_POLICY_VERSION,
      updatedAt: new Date().toISOString(),
    };
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    publishConsent(prefs);
    setPanelOpen(false);
    setVisible(false);
    await persistConsent(prefs, lang);
  }

  if (!ready || !visible) return null;

  return (
    <div className="rg-cookie" role="dialog" aria-modal="false" aria-labelledby="rg-cookie-title">
      <div className="rg-cookie__card">
        <div className="rg-cookie__copy">
          <span className="rg-eyebrow">{fr ? "CONFIDENTIALITÉ" : "PRIVACY"}</span>
          <h2 id="rg-cookie-title">
            {fr ? <>Vos choix.{" "}<span>Vos cookies.</span></> : <>Your choices.{" "}<span>Your cookies.</span></>}
          </h2>
          <p>
            {fr
              ? "Nous utilisons des cookies essentiels au fonctionnement du site. Les cookies de mesure d’audience et de marketing ne sont déposés qu’avec votre accord."
              : "We use essential cookies for the site to work. Analytics and marketing cookies are only set with your consent."}
          </p>
        </div>

        {panelOpen && (
          <div className="rg-cookie__prefs" role="group" aria-label={fr ? "Préférences cookies" : "Cookie preferences"}>
            <label className="rg-cookie__pref is-locked">
              <span>
                <b>{fr ? "Nécessaires" : "Necessary"}</b>
                <small>{fr ? "Toujours actifs — sécurité, langue, préférences." : "Always on — security, language, preferences."}</small>
              </span>
              <input type="checkbox" checked disabled readOnly aria-label={fr ? "Cookies nécessaires" : "Necessary cookies"} />
            </label>
            <label className="rg-cookie__pref">
              <span>
                <b>{fr ? "Mesure d’audience" : "Analytics"}</b>
                <small>{fr ? "Comprendre l’usage du site, de façon agrégée." : "Understand site usage in aggregate."}</small>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
                aria-label={fr ? "Cookies de mesure d’audience" : "Analytics cookies"}
              />
            </label>
            <label className="rg-cookie__pref">
              <span>
                <b>{fr ? "Marketing" : "Marketing"}</b>
                <small>{fr ? "Mesurer les campagnes et contenus utiles." : "Measure campaigns and useful content."}</small>
              </span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={e => setMarketing(e.target.checked)}
                aria-label={fr ? "Cookies marketing" : "Marketing cookies"}
              />
            </label>
          </div>
        )}

        <div className="rg-cookie__actions">
          {panelOpen ? (
            <button
              className="rg-button rg-button--dark"
              type="button"
              onClick={() => save("custom", analytics, marketing)}
            >
              {fr ? "Enregistrer mes choix" : "Save my choices"}
            </button>
          ) : (
            <>
              <button
                className="rg-button rg-button--dark"
                type="button"
                onClick={() => save("accept_all", true, true)}
              >
                {fr ? "Tout accepter" : "Accept all"}
              </button>
              <button
                className="rg-cookie__secondary"
                type="button"
                onClick={() => save("reject_all", false, false)}
              >
                {fr ? "Tout refuser" : "Reject all"}
              </button>
              <button
                className="rg-cookie__link"
                type="button"
                onClick={() => setPanelOpen(true)}
              >
                {fr ? "Personnaliser" : "Customize"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
