import { useEffect, useRef, useState } from "react";
import { ScrollFilm } from "../components/ScrollFilm";
import { FounderApplicationModal } from "../components/FounderApplicationModal";
import "../ged-landing.css";

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
const Check = () => <span className="rg-check" aria-hidden="true">✓</span>;
export type Lang = "fr" | "en";

const workflowFr = [
  { name: "Déposez", description: "Vos contrats, factures et attestations réunis au même endroit.", title: "Tout commence par un document.", label: "NOUVEAU DOCUMENT", file: "Assurance_RC_Pro.pdf", folder: "Boîte de réception", detail: "PDF · 4 pages", result: "Un espace commun, sans une nouvelle arborescence à gérer." },
  { name: "Organisez", description: "Le bon nom, le bon dossier, les informations qui comptent.", title: "Une place pour chaque pièce.", label: "CLASSEMENT PROPOSÉ", file: "Assurance RC Pro — Atelier Martin", folder: "Entreprise / Assurances", detail: "Type : attestation d’assurance", result: "Vérifiez la proposition. Corrigez-la si besoin. Vous gardez la main." },
  { name: "Anticipez", description: "Les dates utiles remontent. Les points à vérifier ne se perdent plus.", title: "L’échéance ne reste plus cachée.", label: "POINT À SUIVRE", file: "Renouveler l’assurance RC Pro", folder: "Échéance : 31 décembre 2026", detail: "Responsable : direction administrative", result: "Une information dans un PDF devient un suivi clair pour votre équipe." },
  { name: "Retrouvez", description: "Posez une question. Revenez directement à la source.", title: "La bonne information, sans fouiller.", label: "RÉPONSE SOURCÉE", file: "Votre RC Pro expire le 31 décembre 2026.", folder: "Source : Assurance_RC_Pro.pdf · page 2", detail: "Extrait : « Période de garantie […] 31/12/2026 »", result: "Une réponse vérifiable, construite à partir des documents accessibles." },
];

const workflowEn = [
  { name: "Upload", description: "Contracts, invoices and certificates gathered in one place.", title: "It all starts with a document.", label: "NEW DOCUMENT", file: "Professional_Insurance.pdf", folder: "Inbox", detail: "PDF · 4 pages", result: "One shared space, without another folder tree to manage." },
  { name: "Organize", description: "The right name, the right folder, and the information that matters.", title: "A place for every document.", label: "SUGGESTED FILING", file: "Professional Insurance — Martin Workshop", folder: "Company / Insurance", detail: "Type: insurance certificate", result: "Review the suggestion. Correct it if needed. You stay in control." },
  { name: "Anticipate", description: "Important dates surface. Points to review are never lost.", title: "Deadlines no longer stay hidden.", label: "FOLLOW-UP", file: "Renew professional insurance", folder: "Due: December 31, 2026", detail: "Owner: administration", result: "Information buried in a PDF becomes a clear follow-up for your team." },
  { name: "Find", description: "Ask a question. Go straight back to the source.", title: "The right information, without digging.", label: "SOURCED ANSWER", file: "Your professional insurance expires on December 31, 2026.", folder: "Source: Professional_Insurance.pdf · page 2", detail: "Excerpt: “Coverage period […] 12/31/2026”", result: "A verifiable answer, built from the documents you can access." },
];

const casesFr = [
  { name: "BTP & terrain", role: "POUR LES ÉQUIPES QUI NE SONT PAS TOUJOURS AU BUREAU", title: "Le chantier avance. Les documents suivent.", description: "Attestations, contrats de sous-traitance, assurances : retrouvez la pièce demandée sans appeler trois personnes.", question: "Est-ce que l’assurance du sous-traitant est encore valide ?", answer: "L’attestation fournie couvre la période jusqu’au 31 décembre 2026. Vérifiez que les activités garanties correspondent au chantier.", source: "Attestation_RC_Sous-traitant.pdf · p. 1–2", next: "Préparer une demande de renouvellement", files: ["Assurances", "Sous-traitants", "Dossiers chantier"] },
  { name: "Services & PME", role: "POUR LES DIRIGEANTS ET ÉQUIPES ADMINISTRATIVES", title: "Moins de recherche. Plus de temps pour vos clients.", description: "Contrats clients, factures et avenants restent reliés. Une nouvelle personne retrouve le contexte, pas seulement un fichier.", question: "Quel préavis prévoit notre contrat avec Studio Nord ?", answer: "Le contrat prévoit un préavis de 60 jours avant la date de renouvellement. L’avenant consulté ne modifie pas cette clause.", source: "Contrat_Studio_Nord.pdf · p. 6 + Avenant.pdf · p. 2", next: "Préparer un point avant renouvellement", files: ["Contrats clients", "Factures", "Avenants"] },
  { name: "Cabinets & conseils", role: "POUR CEUX QUI ACCOMPAGNENT LES ENTREPRISES", title: "Le contexte d’un dossier, enfin à portée de main.", description: "Centralisez les pièces transmises, identifiez les éléments à vérifier et revenez à la preuve lorsque vous préparez un échange.", question: "Quelle pièce manque dans le dossier Atelier Martin ?", answer: "Dans cet exemple, la liste des pièces attendues indique une attestation d’assurance actualisée. Le dossier contient uniquement la version précédente.", source: "Liste_des_pièces.pdf · p. 1 + Attestation_2025.pdf", next: "Préparer une demande de pièce au client", files: ["Pièces clients", "Courriers", "Échéances"] },
];

const casesEn = [
  { name: "Construction & field", role: "FOR TEAMS THAT ARE NOT ALWAYS AT A DESK", title: "The project moves forward. The documents follow.", description: "Certificates, subcontractor agreements and insurance: find the requested document without calling three people.", question: "Is the subcontractor’s insurance still valid?", answer: "The certificate provided covers the period through December 31, 2026. Check that the insured activities match the project.", source: "Subcontractor_Insurance.pdf · pp. 1–2", next: "Prepare a renewal request", files: ["Insurance", "Subcontractors", "Project files"] },
  { name: "Services & SMEs", role: "FOR LEADERS AND ADMINISTRATIVE TEAMS", title: "Less searching. More time for your clients.", description: "Client contracts, invoices and amendments stay connected. A new team member finds the context, not just a file.", question: "What notice period is required by our Studio Nord contract?", answer: "The contract requires 60 days’ notice before renewal. The reviewed amendment does not change this clause.", source: "Studio_Nord_Contract.pdf · p. 6 + Amendment.pdf · p. 2", next: "Prepare a pre-renewal review", files: ["Client contracts", "Invoices", "Amendments"] },
  { name: "Advisory firms", role: "FOR THOSE WHO SUPPORT BUSINESSES", title: "The context of every case, finally within reach.", description: "Centralize submitted documents, identify what needs review and return to the evidence when preparing a discussion.", question: "Which document is missing from the Martin Workshop file?", answer: "In this example, the required-document list calls for an updated insurance certificate. The file only contains the previous version.", source: "Required_documents.pdf · p. 1 + Certificate_2025.pdf", next: "Prepare a document request for the client", files: ["Client documents", "Letters", "Deadlines"] },
];

const faqsFr = [
  ["Est-ce une GED ou un assistant IA ?", "Les deux, avec une priorité : vos documents. La GED les organise et les rend accessibles. L’assistant vous aide à retrouver une information avec ses sources. L’évolution vers RempariaOS ajoute progressivement des workflows et des actions dans vos outils."],
  ["Que comprend le cercle fondateur ?", "Une inscription à la liste prioritaire, puis un échange individuel pour comprendre votre organisation documentaire. Quelques dirigeants seront invités à participer aux entretiens et ateliers de co-construction. Il ne s’agit ni d’un achat, ni d’un engagement commercial."],
  ["L’IA peut-elle accéder à tous mes documents ?", "Non. Les permissions doivent s’appliquer avant la recherche et avant l’envoi de contexte à un modèle. Un utilisateur ne doit obtenir des réponses qu’à partir des documents auxquels il a accès. Les choix d’hébergement et de traitement sont cadrés avant le dépôt de documents réels."],
  ["Dois-je remplacer mes outils actuels ?", "Non. Le premier pilote porte sur un ensemble limité de documents. Les connexions aux autres outils et l’orchestration RempariaOS sont des extensions à définir ensuite, selon vos besoins — pas une migration imposée dès le départ."],
];

const faqsEn = [
  ["Is this a DMS or an AI assistant?", "Both, with one priority: your documents. The DMS organizes them and makes them accessible. The assistant helps you find information with its sources. RempariaOS progressively adds workflows and actions across your tools."],
  ["What does the founding circle include?", "Priority-list registration followed by a one-to-one conversation to understand how your documents are managed. A small number of leaders will be invited to interviews and co-design workshops. It is neither a purchase nor a commercial commitment."],
  ["Can the AI access all my documents?", "No. Permissions must apply before search and before any context is sent to a model. Users only receive answers based on documents they are allowed to access. Hosting and processing choices are agreed before real documents are uploaded."],
  ["Do I need to replace my current tools?", "No. The first pilot covers a limited set of documents. Connections to other tools and RempariaOS orchestration can be defined later according to your needs—not imposed as an upfront migration."],
];

function ProductPreview({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const workflow = lang === "fr" ? workflowFr : workflowEn;
  const item = workflow[step];
  return <div className="rg-product-layout">
    <div className="rg-workflow" role="tablist" aria-label={lang === "fr" ? "Le parcours d’un document" : "A document’s journey"}>
      {workflow.map((stage, index) => <button type="button" key={stage.name} role="tab" id={`workflow-tab-${index}`} aria-selected={step === index} aria-controls="workflow-panel" tabIndex={step === index ? 0 : -1} onClick={() => setStep(index)} onKeyDown={event => { if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (step + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : 3)) % 4; setStep(next); document.getElementById(`workflow-tab-${next}`)?.focus(); } }}>
        <span className="rg-workflow__number">0{index + 1}</span><div><h3>{stage.name}</h3><p>{stage.description}</p></div><Arrow />
      </button>)}
    </div>
    <div className="rg-product" id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${step}`}>
      <div className="rg-product__chrome"><span className="rg-mini-brand">r<span>●</span></span><span>{lang === "fr" ? "MON ESPACE DOCUMENTAIRE" : "MY DOCUMENT WORKSPACE"}</span><span className="rg-status-dot">{lang === "fr" ? "Exemple illustratif" : "Illustrative example"}</span></div>
      <div className="rg-product__body" key={step}>
        <div className="rg-product__breadcrumb">Atelier Martin <span>/</span> Documents</div>
        <h3>{item.title}</h3>
        <div className={`rg-file-card rg-file-card--${step}`}><div className="rg-paper" aria-hidden="true"><i /><i /><i /><span>PDF</span></div><span className="rg-eyebrow">{item.label}</span><h4>{item.file}</h4><p>{item.folder}</p><small>{item.detail}</small><div className="rg-file-card__status"><Check /> {lang === "fr" ? (step === 0 ? "Prêt à être analysé" : step === 1 ? "À confirmer par votre équipe" : step === 2 ? "Suivi à préparer" : "Source disponible") : (step === 0 ? "Ready for analysis" : step === 1 ? "To be confirmed by your team" : step === 2 ? "Follow-up to prepare" : "Source available")}</div></div>
        <p className="rg-product__note"><span aria-hidden="true">↳</span>{item.result}</p>
      </div>
      <div className="rg-product__bottom"><span>{lang === "fr" ? "DOCUMENT → INFORMATION → SUIVI" : "DOCUMENT → INFORMATION → FOLLOW-UP"}</span><span>0{step + 1} / 04</span></div>
    </div>
  </div>;
}

function EcosystemMap({ lang }: { lang: Lang }) {
  return <figure className="rg-eco" aria-labelledby="eco-caption">
    <img
      className="rg-eco__image"
      src="/assets/ged/remparia-ecosystem.png?v=4"
      alt={lang === "fr" ? "Schéma Remparia GED : déposer, comprendre, agir, créer des dossiers vivants et conserver les preuves, jusqu’à RempariaOS." : "Remparia DMS diagram: upload, understand, act, create living files and retain evidence, through to RempariaOS."}
      loading="lazy"
    />
    <figcaption id="eco-caption" className="rg-eco__caption">{lang === "fr" ? "Déposer, comprendre, agir, constituer un dossier vivant et garder la preuve — puis étendre vers RempariaOS." : "Upload, understand, act, create a living file and retain evidence—then extend to RempariaOS."}</figcaption>
  </figure>;
}

const connectors = [
  { id: "sharepoint", name: "SharePoint", ext: "svg", groupFr: "Microsoft 365", groupEn: "Microsoft 365" },
  { id: "onedrive", name: "OneDrive", ext: "svg", groupFr: "Microsoft 365", groupEn: "Microsoft 365" },
  { id: "outlook", name: "Outlook", ext: "svg", groupFr: "Email", groupEn: "Email" },
  { id: "gdrive", name: "Google Drive", ext: "svg", groupFr: "Google", groupEn: "Google" },
  { id: "gmail", name: "Gmail", ext: "svg", groupFr: "Email", groupEn: "Email" },
  { id: "dropbox", name: "Dropbox", ext: "svg", groupFr: "Stockage", groupEn: "Storage" },
  { id: "box", name: "Box", ext: "svg", groupFr: "Stockage", groupEn: "Storage" },
  { id: "sage", name: "Sage", ext: "svg", groupFr: "ERP", groupEn: "ERP" },
  { id: "cegid", name: "Cegid", ext: "png", groupFr: "ERP", groupEn: "ERP" },
  { id: "sap", name: "SAP", ext: "svg", groupFr: "ERP", groupEn: "ERP" },
  { id: "docusign", name: "DocuSign", ext: "svg", groupFr: "Signature", groupEn: "E-signature" },
  { id: "adobe", name: "Adobe Sign", ext: "svg", groupFr: "Signature", groupEn: "E-signature" },
] as const;

function Connectors({ lang }: { lang: Lang }) {
  return <section className="rg-section rg-connectors" id="connexions">
    <div className="rg-section-head">
      <span className="rg-eyebrow">{lang === "fr" ? "04 / LÀ OÙ VIVENT DÉJÀ VOS DOCUMENTS" : "04 / WHERE YOUR DOCUMENTS ALREADY LIVE"}</span>
      <h2>{lang === "fr" ? <>Se connecter<br /><span>sans tout migrer.</span></> : <>Connect<br /><span>without a full migration.</span></>}</h2>
      <p>{lang === "fr"
        ? "Remparia GED peut s’appuyer sur vos outils existants pour récupérer, classer et rendre utiles les documents — emails, drives, ERP ou signatures."
        : "Remparia DMS can connect to your existing tools to retrieve, organize and make documents useful—email, drives, ERPs or e-signatures."}</p>
    </div>
    <ul className="rg-connectors__grid" aria-label={lang === "fr" ? "Outils connectables" : "Connectable tools"}>
      {connectors.map(item => (
        <li key={item.id} className="rg-connectors__item">
          <span className="rg-connectors__mark" aria-hidden="true">
            <img
              className="rg-connectors__logo"
              src={`/assets/ged/connectors/${item.id}.${item.ext}`}
              alt=""
              width={22}
              height={22}
              loading="lazy"
            />
          </span>
          <span className="rg-connectors__meta">
            <b>{item.name}</b>
            <small>{lang === "fr" ? item.groupFr : item.groupEn}</small>
          </span>
        </li>
      ))}
    </ul>
    <p className="rg-connectors__note">
      {lang === "fr"
        ? "Les connexions se déploient progressivement, selon vos priorités et le cadre de sécurité défini avec vous."
        : "Connections roll out progressively, according to your priorities and the security framework agreed with you."}
    </p>
  </section>;
}

function UseCases({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState(0);
  const cases = lang === "fr" ? casesFr : casesEn;
  const item = cases[selected];
  return <section className="rg-section rg-cases" id="usages">
    <div className="rg-section-head">
      <span className="rg-eyebrow">{lang === "fr" ? "02 / DANS VOTRE QUOTIDIEN" : "02 / IN YOUR DAILY WORK"}</span>
      <h2>{lang === "fr" ? <>Les bons documents.<br /><span>Dans la vraie vie.</span></> : <>The right documents.<br /><span>In the real world.</span></>}</h2>
      <img
        className="rg-section-head__visual"
        src="/assets/ged/usages-visual.png"
        alt={lang === "fr" ? "Chercher, vérifier et valider un document" : "Search, verify and validate a document"}
        loading="lazy"
      />
    </div>
    <div className="rg-case-tabs" aria-label={lang === "fr" ? "Choisir un secteur" : "Choose a sector"}>{cases.map((entry, index) => <button type="button" aria-pressed={index === selected} key={entry.name} onClick={() => setSelected(index)}>{entry.name}<Arrow diagonal /></button>)}</div>
    <div className="rg-case-content" key={selected}>
      <div className="rg-case-copy"><span className="rg-eyebrow">{item.role}</span><h3>{item.title}</h3><p>{item.description}</p><div className="rg-tags">{item.files.map(file => <span key={file}>{file}</span>)}</div><a className="rg-text-link" href="#pilote">{lang === "fr" ? "Parlons de votre cas" : "Tell us about your case"} <Arrow /></a></div>
      <div className="rg-chat"><div className="rg-chat__head"><span className="rg-chat__avatar">r.</span><div><b>Remparia</b><small>{lang === "fr" ? "EXEMPLE DE RECHERCHE SOURCÉE" : "EXAMPLE OF SOURCED SEARCH"}</small></div><span aria-hidden="true">✳</span></div><div className="rg-chat__question">{item.question}</div><div className="rg-chat__answer"><span className="rg-chat__avatar">r.</span><div><p>{item.answer}</p><div className="rg-source"><span aria-hidden="true">↳</span><div><small>{lang === "fr" ? "SOURCE UTILISÉE" : "SOURCE USED"}</small><span>{item.source}</span></div></div></div></div><div className="rg-chat__next"><small>{lang === "fr" ? "PROCHAINE ÉTAPE POSSIBLE" : "POSSIBLE NEXT STEP"}</small><span>{item.next}<Arrow /></span></div><p className="rg-chat__disclaimer">{lang === "fr" ? "Scénario illustratif · documents fictifs · action soumise à validation" : "Illustrative scenario · fictional documents · action subject to approval"}</p></div>
    </div>
  </section>;
}

const proofStats = [
  {
    value: "53 %",
    fr: "des dirigeants de TPE-PME craignent la perte ou le piratage de leurs données.",
    en: "of small-business leaders fear losing their data or seeing it hacked.",
  },
  {
    value: "13 %",
    fr: "des TPE-PME utilisent l’IA pour analyser ou classer des documents.",
    en: "of small businesses use AI to analyze or classify documents.",
  },
  {
    value: "39 %",
    fr: "des TPE-PME placent la réforme de la facturation électronique parmi leurs priorités numériques pour 2026–2027.",
    en: "of small businesses rank e-invoicing reform among their digital priorities for 2026–2027.",
  },
] as const;

function ProofStats({ lang }: { lang: Lang }) {
  return (
    <section className="rg-section rg-proof" id="chiffres" aria-labelledby="proof-title">
      <div className="rg-section-head">
        <span className="rg-eyebrow">{lang === "fr" ? "LE TERRAIN LE CONFIRME" : "THE FIELD CONFIRMS IT"}</span>
        <h2 id="proof-title">
          {lang === "fr" ? <>Vous n’êtes pas seuls.<br /><span>Le moment est maintenant.</span></> : <>You’re not alone.<br /><span>The moment is now.</span></>}
        </h2>
        <p>
          {lang === "fr"
            ? "Sécurité des données, IA documentaire, facturation électronique : les priorités des TPE-PME rejoignent exactement ce que Remparia GED prépare avec vous."
            : "Data security, document AI, e-invoicing: small-business priorities match exactly what Remparia DMS is building with you."}
        </p>
      </div>
      <ul className="rg-proof__grid">
        {proofStats.map(stat => (
          <li key={stat.value} className="rg-proof__item">
            <strong className="rg-proof__value">{stat.value}</strong>
            <p>{lang === "fr" ? stat.fr : stat.en}</p>
          </li>
        ))}
      </ul>
      <p className="rg-proof__source">
        {lang === "fr" ? "Source : Baromètre France Num 2026." : "Source: France Num 2026 Barometer."}
      </p>
    </section>
  );
}

export function GedLandingPage() {
  const [lang, setLang] = useState<Lang>(() => localStorage.getItem("remparia-lang") === "en" ? "en" : "fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const faqVideoRef = useRef<HTMLVideoElement>(null);
  const faqs = lang === "fr" ? faqsFr : faqsEn;
  useEffect(() => {
    const originalTitle = document.title;
    document.title = lang === "fr" ? "Remparia GED — Vos documents, enfin utiles." : "Remparia DMS — Documents that work for you.";
    document.documentElement.lang = lang;
    localStorage.setItem("remparia-lang", lang);
    document.body.classList.add("rg-landing-body");
    return () => { document.title = originalTitle; document.body.classList.remove("rg-landing-body"); };
  }, [lang]);
  useEffect(() => {
    const video = faqVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    void video.play().catch(() => undefined);
  }, []);

  return <div className="remparia-landing">
    <a className="rg-skip" href="#contenu">{lang === "fr" ? "Aller au contenu" : "Skip to content"}</a>
    <header className="rg-header"><div className="rg-header__inner">
      <a className="rg-brand" href="https://www.remparia.com/fr" aria-label="Remparia, site principal"><img src="/assets/ged/remparia-logo.png" alt="Remparia" /></a><span className="rg-header__product">GED</span>
      <button className="rg-menu-toggle" type="button" aria-label={menuOpen ? (lang === "fr" ? "Fermer le menu" : "Close menu") : (lang === "fr" ? "Ouvrir le menu" : "Open menu")} aria-expanded={menuOpen} aria-controls="landing-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? (lang === "fr" ? "Fermer −" : "Close −") : "Menu +"}</button>
      <nav id="landing-navigation" className={menuOpen ? "is-open" : ""} aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}><a href="#fonctionnement" onClick={() => setMenuOpen(false)}>{lang === "fr" ? "L’expérience" : "Experience"}</a><a href="#usages" onClick={() => setMenuOpen(false)}>{lang === "fr" ? "Les usages" : "Use cases"}</a><a href="#connexions" onClick={() => setMenuOpen(false)}>{lang === "fr" ? "Les connexions" : "Connections"}</a><a href="#confiance" onClick={() => setMenuOpen(false)}>{lang === "fr" ? "La confiance" : "Trust"}</a><a className="rg-nav-cta" href="#pilote" onClick={() => setMenuOpen(false)}>{lang === "fr" ? "Rejoindre le cercle fondateur" : "Join the founding circle"} <Arrow diagonal /></a><button className="rg-language-toggle" type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")} aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}>{lang === "fr" ? "EN" : "FR"}</button></nav>
    </div></header>
    <main id="contenu">
      <section className="rg-hero" aria-label={lang === "fr" ? "Présentation Remparia GED" : "Remparia DMS introduction"}>
        <div className="rg-hero__bg" aria-hidden="true">
          <img src="/assets/ged/ged-hero-human-v2.png?v=4" alt="" fetchPriority="high" />
        </div>
        <div className="rg-hero__inner rg-container">
          <div className="rg-hero__copy">
            <span className="rg-eyebrow rg-hero__eyebrow"><i />{lang === "fr" ? "REMPARIA GED · CERCLE FONDATEUR" : "REMPARIA DMS · FOUNDING CIRCLE"}</span>
            <h1>{lang === "fr" ? <>Vos documents,<br /><span>enfin utiles.</span></> : <>Your documents,<br /><span>finally useful.</span></>}</h1>
            <p>{lang === "fr" ? <>Rassemblez-les. Retrouvez ce qui compte.<br />Et faites avancer votre entreprise,<br className="rg-desktop-break" /> pas votre classement.</> : <>Bring them together. Find what matters.<br />Move your business forward—<br className="rg-desktop-break" /> not your filing system.</>}</p>
            <div className="rg-hero__actions">
              <a className="rg-button rg-button--dark" href="#pilote">{lang === "fr" ? "Rejoindre la liste prioritaire" : "Join the priority list"} <Arrow diagonal /></a>
              <a className="rg-text-link" href="#experience">{lang === "fr" ? "Voir l’expérience" : "See the experience"} <span aria-hidden="true">↓</span></a>
            </div>
            <div className="rg-hero__note">
              <span className="rg-small-asterisk" aria-hidden="true">✳</span>
              <span>{lang === "fr" ? <>Pour les dirigeants qui veulent participer<br />à la construction d’un nouvel outil.</> : <>For business leaders who want to help<br />shape a new kind of tool.</>}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="rg-hero-bottom rg-container"><span>{lang === "fr" ? "UNE NOUVELLE FAÇON DE TRAVAILLER AVEC VOS DOCUMENTS" : "A NEW WAY TO WORK WITH YOUR DOCUMENTS"}</span><span>{lang === "fr" ? "DÉCOUVRIR" : "DISCOVER"} <span aria-hidden="true">↓</span></span></div>
      <ScrollFilm lang={lang} />
      <section className="rg-section rg-intro" id="fonctionnement"><div className="rg-intro__statement"><span className="rg-eyebrow">{lang === "fr" ? "01 / BIEN PLUS QU’UN DOSSIER PARTAGÉ" : "01 / MORE THAN A SHARED FOLDER"}</span><h2>{lang === "fr" ? <>Le problème n’est pas<br />de stocker un PDF.<br /><span>C’est tout ce qui suit.</span></> : <>The challenge isn’t<br />storing a PDF.<br /><span>It’s everything after.</span></>}</h2></div><div className="rg-intro__copy"><p>{lang === "fr" ? "Retrouver la dernière version. Comprendre une clause. Repérer une date. Demander une pièce manquante." : "Find the latest version. Understand a clause. Spot a date. Request a missing document."}</p><p>{lang === "fr" ? "Remparia fait le lien entre vos documents et votre travail. Une GED simple pour commencer. Une base solide pour aller plus loin." : "Remparia connects your documents to your work. A simple DMS to begin with. A strong foundation to go further."}</p></div><ProductPreview lang={lang} /></section>
      <UseCases lang={lang} />
      <section className="rg-section rg-trust" id="confiance"><div className="rg-trust__visual"><img src="/assets/ged/ged-trust-human-v2.png" alt={lang === "fr" ? "Une responsable vérifie un document avant de le valider" : "A manager reviews a document before approval"} loading="lazy" /><span className="rg-eyebrow">{lang === "fr" ? "VOTRE ENTREPRISE. VOS DROITS. VOS CHOIX." : "YOUR BUSINESS. YOUR RIGHTS. YOUR CHOICES."}</span></div><div className="rg-trust__copy"><span className="rg-eyebrow">{lang === "fr" ? "03 / L’INTELLIGENCE, SANS L’ANGLE MORT" : "03 / INTELLIGENCE, WITHOUT BLIND SPOTS"}</span><h2>{lang === "fr" ? <>Une IA utile.<br /><span>Un cadre clair.</span></> : <>Useful AI.<br /><span>A clear framework.</span></>}</h2><p>{lang === "fr" ? "La confiance ne se résume pas à un cadenas. Elle doit se voir dans les accès, les sources et les décisions." : "Trust is more than a padlock. It must be visible in access controls, sources and decisions."}</p><div className="rg-trust-item"><Check /><div><h3>{lang === "fr" ? "Les droits, avant la réponse" : "Permissions before answers"}</h3><p>{lang === "fr" ? "La recherche reste dans le périmètre autorisé de chaque utilisateur." : "Search stays within each user’s authorized scope."}</p></div></div><div className="rg-trust-item"><Check /><div><h3>{lang === "fr" ? "La preuve, pas une boîte noire" : "Evidence, not a black box"}</h3><p>{lang === "fr" ? "Les réponses renvoient aux sources. Les opérations importantes laissent une trace." : "Answers link back to sources. Important operations leave an audit trail."}</p></div></div><div className="rg-trust-item"><Check /><div><h3>{lang === "fr" ? "Vous gardez le dernier mot" : "You have the final say"}</h3><p>{lang === "fr" ? "Les actions engageantes se valident. Les choix d’hébergement et de modèle se cadrent avec vous." : "Meaningful actions require approval. Hosting and model choices are agreed with you."}</p></div></div><a className="rg-text-link" href="#faq">{lang === "fr" ? "Vos questions sur le projet" : "Your questions about the project"} <Arrow /></a></div></section>
      <Connectors lang={lang} />
      <section className="rg-os" id="remparia-os"><div className="rg-section"><div className="rg-os__heading"><span className="rg-eyebrow">{lang === "fr" ? "05 / COMMENCER SIMPLE. VOIR PLUS LOIN." : "05 / START SIMPLE. THINK AHEAD."}</span><h2>{lang === "fr" ? <>Votre GED aujourd’hui.<br /><span>Votre OS demain.</span></> : <>Your DMS today.<br /><span>Your OS tomorrow.</span></>}</h2><p>{lang === "fr" ? "Pas besoin d’acheter une plateforme entière pour commencer. Vos documents sont la première étape d’un environnement qui pourra relier vos équipes, vos outils et vos actions." : "You do not need to buy an entire platform to get started. Your documents are the first step toward an environment connecting your teams, tools and actions."}</p></div><EcosystemMap lang={lang} /><div className="rg-os__roadmap"><div><small>{lang === "fr" ? "LE POINT DE DÉPART" : "THE STARTING POINT"}</small><h3>Remparia {lang === "fr" ? "GED" : "DMS"}</h3><p>{lang === "fr" ? <>Rassembler, classer,<br />retrouver les informations.</> : <>Gather, organize and<br />find information.</>}</p><span className="rg-phase">{lang === "fr" ? "PROGRAMME PILOTE" : "PILOT PROGRAM"}</span></div><span className="rg-roadmap-arrow" aria-hidden="true">→</span><div><small>{lang === "fr" ? "L’ÉTAPE SUIVANTE" : "THE NEXT STEP"}</small><h3>{lang === "fr" ? "Des dossiers vivants" : "Living files"}</h3><p>{lang === "fr" ? <>Relier les pièces, les échéances,<br />les responsables et les validations.</> : <>Connect documents, deadlines,<br />owners and approvals.</>}</p><span className="rg-phase rg-phase--future">{lang === "fr" ? "EXTENSION PROGRESSIVE" : "PROGRESSIVE EXTENSION"}</span></div><span className="rg-roadmap-arrow" aria-hidden="true">→</span><div><small>{lang === "fr" ? "À L’ÉCHELLE DE L’ENTREPRISE" : "ACROSS THE BUSINESS"}</small><h3>RempariaOS</h3><p>{lang === "fr" ? <>Connecter vos outils et orchestrer<br />des actions sous contrôle humain.</> : <>Connect your tools and orchestrate<br />human-controlled actions.</>}</p><span className="rg-phase rg-phase--future">{lang === "fr" ? "VISION PRODUIT" : "PRODUCT VISION"}</span></div></div></div></section>
      <ProofStats lang={lang} />
      <section className="rg-section rg-pilot" id="pilote"><div className="rg-pilot__copy"><span className="rg-eyebrow"><i />{lang === "fr" ? "CERCLE FONDATEUR · PRÉ-LANCEMENT" : "FOUNDING CIRCLE · PRE-LAUNCH"}</span><h2>{lang === "fr" ? <>Construisons-le<br />avec ceux qui<br /><span>s’en serviront.</span></> : <>Let’s build it<br />with the people<br /><span>who will use it.</span></>}</h2><p>{lang === "fr" ? "Nous réunissons des dirigeants de PME pour comprendre leurs vrais blocages documentaires et construire un produit qui répond au terrain. Chaque échange nourrit les priorités du modèle." : "We bring SME leaders together to understand their real document challenges and build a product grounded in day-to-day work. Every conversation shapes our priorities."}</p><div className="rg-pilot__perks"><span><Check /> {lang === "fr" ? "Partager votre réalité documentaire" : "Share your document reality"}</span><span><Check /> {lang === "fr" ? "Influencer les premiers choix du produit" : "Shape the product’s first decisions"}</span><span><Check /> {lang === "fr" ? "Accéder en priorité aux prochaines étapes" : "Get priority access to what comes next"}</span></div></div><div className="rg-pilot-card"><div className="rg-pilot-card__top"><span>{lang === "fr" ? "CANDIDATURES OUVERTES" : "APPLICATIONS OPEN"}</span><span>{lang === "fr" ? "PLACES LIMITÉES" : "LIMITED PLACES"}</span></div><span className="rg-pilot-card__asterisk" aria-hidden="true">✳</span><h3>{lang === "fr" ? <>Votre expérience.<br /><span>Notre point de départ.</span></> : <>Your experience.<br /><span>Our starting point.</span></>}</h3><div className="rg-founder-steps"><span><b>01</b> {lang === "fr" ? "Déposer sa candidature" : "Submit your application"}</span><span><b>02</b> {lang === "fr" ? "Étude par notre équipe" : "Review by our team"}</span><span><b>03</b> {lang === "fr" ? "Co-construire si nos enjeux se rejoignent" : "Co-design if our goals align"}</span></div><button className="rg-button rg-button--dark" type="button" onClick={() => setApplicationOpen(true)}>{lang === "fr" ? "Déposer ma candidature" : "Apply now"} <Arrow diagonal /></button><p>{lang === "fr" ? "Un premier échange exploratoire, sans engagement." : "An initial exploratory conversation, with no commitment."}</p><small>{lang === "fr" ? "Les informations partagées servent uniquement à qualifier les besoins et organiser les échanges de co-construction." : "Shared information is used only to understand needs and organize co-design discussions."}</small></div></section>
      <section className="rg-section rg-faq" id="faq">
        <div className="rg-section-head">
          <span className="rg-eyebrow">{lang === "fr" ? "06 / AVANT DE SE LANCER" : "06 / BEFORE YOU BEGIN"}</span>
          <h2>{lang === "fr" ? <>Les questions<br /><span>qui comptent.</span></> : <>The questions<br /><span>that matter.</span></>}</h2>
          <p>{lang === "fr"
            ? "Regardez d’abord le principe. Puis ouvrez les réponses précises sur le produit, le cercle fondateur et vos documents."
            : "Watch the principle first. Then open the precise answers about the product, the founding circle and your documents."}</p>
        </div>
        <div className="rg-faq__body">
          <figure className="rg-faq__media">
            <video
              ref={faqVideoRef}
              className="rg-faq__video"
              src="/assets/ged/faq-questions.mp4"
              playsInline
              muted
              loop
              autoPlay
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              tabIndex={-1}
            />
          </figure>
          <div className="rg-faq__panel">
            <div className="rg-faq__list">{faqs.map(([question, answer], index) => (
              <div className="rg-faq__item" key={question}>
                <h3>
                  <button type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    <span>{question}</span>
                    <span aria-hidden="true">{openFaq === index ? "−" : "+"}</span>
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={openFaq !== index}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}</div>
            <a className="rg-text-link" href="mailto:contact@remparia.com">{lang === "fr" ? "Une autre question ?" : "Another question?"} <Arrow diagonal /></a>
          </div>
        </div>
      </section>
    </main>
    <FounderApplicationModal open={applicationOpen} onClose={() => setApplicationOpen(false)} lang={lang} />
    <footer className="rg-footer"><div className="rg-container"><div className="rg-footer__top"><a className="rg-brand" href="https://www.remparia.com/fr" aria-label="Remparia"><img src="/assets/ged/remparia-logo.png" alt="Remparia" /></a><p>{lang === "fr" ? <>Commencez par vos documents.<br />Imaginez la suite.</> : <>Start with your documents.<br />Imagine what comes next.</>}</p><a className="rg-text-link" href="#pilote">{lang === "fr" ? "Rejoindre le cercle fondateur" : "Join the founding circle"} <Arrow diagonal /></a></div><div className="rg-footer__bottom"><span>© {new Date().getFullYear()} Remparia</span><span>{lang === "fr" ? "Intelligence humaine. Échelle artificielle." : "Human intelligence. Artificial scale."}</span><a href="https://www.remparia.com/fr">{lang === "fr" ? "Le site Remparia" : "Remparia website"} <Arrow diagonal /></a></div></div></footer>
  </div>;
}
