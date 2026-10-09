"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Props = { open: boolean; onClose: () => void; lang?: "fr" | "en" };
const industriesFr = ["BTP", "Services / PME", "Retail", "Immobilier", "Droit / conseil", "Industrie / manufacturing", "Autre"];
const KOALENDAR_URL = "https://koalendar.com/e/rencontrer-contact-remparia";

export function FounderApplicationModal({ open, onClose, lang = "fr" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const tr = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const industries = lang === "fr" ? industriesFr : ["Construction", "Services / SMEs", "Retail", "Real estate", "Legal / advisory", "Manufacturing", "Other"];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("/api/founder-applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, documentLocations: [] }),
      });
      if (!response.ok) throw new Error();
      const result = (await response.json().catch(() => ({}))) as { bookingUrl?: string };
      form.reset();
      window.location.assign(result.bookingUrl || KOALENDAR_URL);
    } catch {
      setState("error");
    }
  }

  function close() {
    setState("idle");
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="rg-application"
      onCancel={e => {
        e.preventDefault();
        close();
      }}
      onClose={onClose}
    >
      <div className="rg-application__shell">
        <button className="rg-application__close" type="button" onClick={close} aria-label={tr("Fermer le formulaire", "Close form")}>
          {tr("Fermer", "Close")}&nbsp; ×
        </button>
        <header className="rg-application__head">
          <span className="rg-eyebrow">{tr("CERCLE FONDATEUR · CANDIDATURE", "FOUNDING CIRCLE · APPLICATION")}</span>
          <h2>
            {tr("Parlez-nous de", "Tell us about")}
            <br />
            <span>{tr("votre réalité.", "your reality.")}</span>
          </h2>
          <p>
            {tr(
              "Moins d’une minute. Il n’y a ni achat, ni engagement. Puis choisissez un créneau pour échanger.",
              "Less than a minute. There is no purchase or commitment. Then pick a slot to talk.",
            )}
          </p>
        </header>
        <form onSubmit={submit}>
          <fieldset>
            <legend>
              <b>01</b>
              <span>
                {tr("Vous et votre entreprise", "You and your business")}
                <small>{tr("Pour savoir avec qui nous échangeons.", "So we know who we are speaking with.")}</small>
              </span>
            </legend>
            <div className="rg-form-grid">
              <label>
                {tr("Prénom", "First name")}
                <input name="firstName" required autoComplete="given-name" />
              </label>
              <label>
                {tr("Nom", "Last name")}
                <input name="lastName" required autoComplete="family-name" />
              </label>
            </div>
            <label>
              {tr("Email professionnel", "Work email")}
              <input name="workEmail" type="email" required autoComplete="email" placeholder={tr("vous@entreprise.fr", "you@company.com")} />
            </label>
            <div className="rg-form-grid">
              <label>
                {tr("Entreprise", "Company")}
                <input name="companyName" required autoComplete="organization" />
              </label>
              <label>
                {tr("Votre fonction", "Job title")}
                <input name="jobTitle" required autoComplete="organization-title" />
              </label>
            </div>
            <div className="rg-form-grid">
              <label>
                {tr("Taille de l’entreprise", "Company size")}
                <select name="companySize" required defaultValue="">
                  <option value="" disabled>{tr("Choisir", "Choose")}</option>
                  <option>1–9</option>
                  <option>10–49</option>
                  <option>50–249</option>
                  <option>250+</option>
                </select>
              </label>
              <label>
                {tr("Secteur", "Industry")}
                <select name="industry" required defaultValue="">
                  <option value="" disabled>{tr("Choisir", "Choose")}</option>
                  {industries.map(x => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
          <label className="rg-form-consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>
              {tr(
                "J’accepte que Remparia utilise ces informations uniquement pour étudier ma candidature et me contacter au sujet du cercle fondateur.",
                "I agree that Remparia may use this information only to review my application and contact me about the founding circle.",
              )}
            </span>
          </label>
          <input className="rg-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {state === "error" && (
            <p className="rg-form-error" role="alert">
              {tr(
                "L’envoi n’a pas abouti. Réessayez ou écrivez à contact@remparia.com.",
                "Submission failed. Try again or email contact@remparia.com.",
              )}
            </p>
          )}
          <button className="rg-button rg-button--dark rg-form-submit" type="submit" disabled={state === "sending"}>
            {state === "sending"
              ? tr("Envoi en cours…", "Sending…")
              : tr("Booker un RDV ↗", "Book a meeting ↗")}
          </button>
          <p className="rg-form-footnote">
            {tr(
              "Nous envoyons vos infos à l’équipe, puis vous choisissez un créneau sur Koalendar.",
              "We send your details to the team, then you pick a slot on Koalendar.",
            )}
          </p>
        </form>
      </div>
    </dialog>
  );
}
