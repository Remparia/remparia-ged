"use client";

import { useEffect, useRef, useState } from "react";
import { CookieBanner, openCookiePreferences } from "../components/CookieBanner";
import { ScrollFilm } from "../components/ScrollFilm";
import { FounderApplicationModal } from "../components/FounderApplicationModal";

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
const Check = () => <span className="rg-check" aria-hidden="true">✓</span>;
const OutlineCheck = () => (
  <span className="rg-check-outline" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.2 7.2 5.8 9.7 10.8 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);
const FranceFlag = () => (
  <svg className="rg-france-flag" viewBox="0 0 3 2" width="18" height="12" aria-hidden="true" focusable="false">
    <rect width="1" height="2" x="0" fill="#002395" />
    <rect width="1" height="2" x="1" fill="#fff" />
    <rect width="1" height="2" x="2" fill="#ed2939" />
  </svg>
);
export type Lang = "fr" | "en";

const copy = {
  fr: {
    skip: "Aller au contenu",
    nav: {
      conservation: "Conservation",
      completude: "Complétude",
      classement: "Classement",
      agent: "Agent IA",
      connexions: "Les connexions",
      faq: "Questions",
      cta: "Rejoindre le cercle fondateur",
      open: "Ouvrir le menu",
      close: "Fermer le menu",
      closeShort: "Fermer −",
      main: "Navigation principale",
    },
    hero: {
      aria: "Présentation Remparia GED",
      eyebrow: "GED pour TPE et PME · Hébergée en France",
      titleBefore: "Retrouvez n’importe quel document",
      titleAccent: "en moins de 15 secondes.",
      body: "Remparia GED classe chaque document dès son dépôt, vérifie qu’il ne vous en manque aucun et le conserve le temps exigé par la loi. Et un agent IA répond à vos questions, sources à l’appui.",
      cta: "Tester sur mes documents",
      secondary: "Voir ce que ça change",
      note: "Plan de classement conforme aux règles françaises · Réponses sourcées · Vous gardez la main",
      bottomLeft: "UNE NOUVELLE FAÇON DE TRAVAILLER AVEC VOS DOCUMENTS",
      bottomRight: "DÉCOUVRIR",
    },
    pillars: [
      { num: "01 / CONSERVER", text: "Gardé le temps exigé par la loi" },
      { num: "02 / COMPLÉTER", text: "Aucune pièce ne manque" },
      { num: "03 / CLASSER", text: "Classé et indexé tout seul" },
      { num: "04 / DEMANDER", text: "Un agent IA qui connaît vos documents" },
      { num: "05 / RETROUVER", text: "En 15 secondes" },
    ],
    demo: {
      question: "Où est l’attestation décennale de 2026 ?",
      file: "Attestation décennale 2026 — Assureur Alpha",
      folder: "06 Assurances › 06.8 Décennale et garanties de construction",
      meta: "Valable jusqu’au 31/12/2026 · Conservation : 10 ans · Renouvellement suivi",
      answer: "Voici l’attestation 2026. Elle couvre les travaux de gros œuvre et expire le 31 décembre : je vous rappellerai de demander la suivante mi-novembre.",
      source: "SOURCE : ATTESTATION DÉCENNALE 2026, P. 1",
      example: "Exemple illustratif",
    },
    conservation: {
      eyebrow: "01 / CONSERVATION",
      title: <>Gardé le temps qu’il faut.<br /><span>Pas un jour de moins.</span></>,
      body: "Facture, bulletin de paie, contrat, attestation : chaque type de document porte sa durée de conservation. Remparia calcule la date de fin, vous prévient avant, et vous propose de détruire ce qui peut l’être. Rien n’est jeté par erreur, rien n’est gardé pour rien.",
      checks: [
        "Durée légale et durée recommandée pour chaque type de document",
        "Sort final clair : conserver, détruire ou trier",
        "Documents hébergés en France, sur notre propre infrastructure",
      ],
      stat: "53 %",
      statText: "des dirigeants de TPE-PME craignent la perte ou le piratage de leurs données.",
      statSource: "BAROMÈTRE FRANCE NUM 2026",
      register: "Registre de conservation",
      example: "EXEMPLE ILLUSTRATIF",
      cols: ["DOCUMENT", "DURÉE", "FIN"],
      rows: [
        { doc: "Facture fournisseur", duration: "10 ans", end: "31/12/2036", expired: false },
        { doc: "Bulletin de paie (double)", duration: "5 ans", end: "30/09/2031", expired: false },
        { doc: "Contrat commercial", duration: "5 ans après la fin", end: "Selon la fin du contrat", expired: false },
        { doc: "Devis non signé 2019", duration: "Expirée", end: "À détruire, à valider", expired: true },
      ],
      footnote: "3 documents arrivent en fin de conservation ce trimestre.",
    },
    completude: {
      eyebrow: "02 / COMPLÉTUDE",
      title: <>Sachez ce qui manque.<br /><span>Avant qu’on vous le demande.</span></>,
      body: "Kbis, attestation URSSAF, décennale, document unique, contrats de travail : Remparia connaît les documents qu’une entreprise française doit détenir. Il compare avec ce que vous avez déposé et vous signale les manques et les pièces expirées.",
      after: "Un contrôle, un appel d’offres, une cession ou une levée de fonds ? Votre dossier est déjà prêt.",
      dossier: "Dossier de l’entreprise",
      score: "12 / 14 PIÈCES",
      items: [
        { name: "Extrait Kbis de moins de 3 mois", status: "Présent", tone: "ok" },
        { name: "Attestation décennale 2026", status: "Présent", tone: "ok" },
        { name: "Attestation de vigilance URSSAF", status: "Expirée le 30/09", tone: "warn" },
        { name: "Document unique d’évaluation des risques", status: "Manquant", tone: "bad" },
        { name: "Contrat d’assurance RC Pro", status: "Présent", tone: "ok" },
      ],
    },
    classement: {
      eyebrow: "03 / CLASSEMENT ET INDEXATION",
      title: <>Vous déposez.<br /><span>Le classement se fait seul.</span></>,
      body: "Glissez un fichier, un scan ou un mail. Remparia reconnaît le type de document, le range dans le bon dossier, lui donne un nom clair et en extrait les informations utiles : émetteur, montant, dates, échéance.",
      hint: "Quand il hésite, il vous demande au lieu de deviner.",
      drop: "scan_0412.pdf déposé",
      label: "CLASSEMENT PROPOSÉ",
      confidence: "CONFIANCE ÉLEVÉE",
      path: "04 Comptabilité › 04.2 Factures fournisseurs",
      file: "2026-10-03_Facture_Fournisseur-Alpha_F-2026-118.pdf",
      fields: [
        ["Émetteur", "Fournisseur Alpha"],
        ["Montant TTC", "1 240,00 €"],
        ["Date", "03/10/2026"],
        ["Échéance", "02/11/2026"],
      ],
      validate: "Valider",
      reclass: "Reclasser",
      rule: "Règle appliquée : facture reçue d’un fournisseur",
      example: "EXEMPLE ILLUSTRATIF",
      stats: [
        ["78", "dossiers prêts à l’emploi, chacun avec son mode d’emploi"],
        ["298", "types de documents reconnus"],
        ["8", "registres tenus à jour : contrats, assurances, matériel…"],
      ],
    },
    agent: {
      eyebrow: "04 / AGENT IA",
      title: <>Un agent qui connaît<br /><span>tous vos documents.</span></>,
      body: "Posez vos questions en français, comme à un collaborateur. L’agent cherche dans toute votre base documentaire, répond, et cite chaque document utilisé pour que vous puissiez vérifier.",
      checks: [
        "Chaque réponse renvoie à ses sources",
        "Il ne voit que ce que les droits de chaque utilisateur permettent",
        "Il ne fait rien d’engageant sans votre accord",
      ],
      chatLabel: "EXEMPLE DE RECHERCHE SOURCÉE",
      q1: "Quels contrats se renouvellent avant la fin de l’année ?",
      a1: "Trois contrats se renouvellent tacitement d’ici le 31 décembre :\n• Maintenance des véhicules — préavis avant le 15/11\n• Location du dépôt — préavis avant le 30/11\n• Téléphonie mobile — préavis avant le 01/12",
      s1: "SOURCES : 3 CONTRATS · DOSSIER 02 CONTRATS",
      q2: "Prépare le Kbis et l’attestation URSSAF pour l’appel d’offres.",
      a2: "Le Kbis est prêt. L’attestation URSSAF a expiré le 30/09 : voulez-vous que je prépare la demande de renouvellement ?",
    },
    quinze: {
      eyebrow: "05 / RETROUVER",
      value: "15",
      unit: "s",
      title: <>Le temps de retrouver un document.<br /><span>Pas une matinée.</span></>,
      body: "Une recherche ou une question suffit, au bureau comme sur le téléphone. Vous obtenez le bon document, dans sa dernière version, avec le dossier où il est rangé.",
      before: "AUJOURD’HUI",
      beforeItems: [
        "Fouiller l’armoire, le serveur, les mails et le Drive",
        "Appeler le comptable ou l’assistante",
        "Douter de la bonne version",
      ],
      after: "AVEC REMPARIA GED",
      afterItems: [
        "Une recherche ou une question en français",
        "Le bon document, dans sa dernière version",
        "Sa source et son dossier, pour vérifier",
      ],
    },
    connectors: {
      eyebrow: "06 / LÀ OÙ VIVENT DÉJÀ VOS DOCUMENTS",
      title: <>Se connecter<br /><span>sans tout migrer.</span></>,
      body: "Remparia GED peut s’appuyer sur vos outils existants pour récupérer, classer et rendre utiles les documents — emails, drives, ERP ou signatures.",
      note: "Les connexions se déploient progressivement, selon vos priorités et le cadre de sécurité défini avec vous.",
      aria: "Outils connectables",
    },
    os: {
      eyebrow: "07 / COMMENCER SIMPLE. VOIR PLUS LOIN.",
      title: <>Votre GED aujourd’hui.<br /><span>Votre OS demain.</span></>,
      body: "Pas besoin d’acheter une plateforme entière pour commencer. Vos documents sont la première étape d’un environnement qui pourra relier vos équipes, vos outils et vos actions.",
      ecoAlt: "Schéma Remparia GED : déposer, comprendre, agir, créer des dossiers vivants et conserver les preuves, jusqu’à RempariaOS.",
      ecoCaption: "Déposer, comprendre, agir, constituer un dossier vivant et garder la preuve — puis étendre vers RempariaOS.",
      steps: [
        { label: "LE POINT DE DÉPART", title: "Remparia GED", text: "Rassembler, classer,\nretrouver les informations.", phase: "PROGRAMME PILOTE", future: false },
        { label: "L’ÉTAPE SUIVANTE", title: "Des dossiers vivants", text: "Relier les pièces, les échéances,\nles responsables et les validations.", phase: "EXTENSION PROGRESSIVE", future: true },
        { label: "À L’ÉCHELLE DE L’ENTREPRISE", title: "RempariaOS", text: "Connecter vos outils et orchestrer\ndes actions sous contrôle humain.", phase: "VISION PRODUIT", future: true },
      ],
    },
    proof: {
      eyebrow: "08 / LE TERRAIN LE CONFIRME",
      title: <>Vous n’êtes pas seuls.<br /><span>Le moment est maintenant.</span></>,
      body: "Sécurité des données, IA documentaire, facturation électronique : les priorités des TPE-PME rejoignent exactement ce que Remparia GED prépare avec vous.",
      source: "Source : Baromètre France Num 2026.",
      stats: [
        { value: "53 %", text: "des dirigeants de TPE-PME craignent la perte ou le piratage de leurs données." },
        { value: "13 %", text: "des TPE-PME utilisent l’IA pour analyser ou classer des documents." },
        { value: "39 %", text: "des TPE-PME placent la réforme de la facturation électronique parmi leurs priorités numériques pour 2026–2027." },
      ],
    },
    trust: {
      eyebrow: "09 / CONFIANCE",
      visual: "VOTRE ENTREPRISE. VOS DROITS. VOS CHOIX.",
      title: <>Une IA utile.<br /><span>Un cadre clair.</span></>,
      items: [
        { n: "01", h: "Hébergé en France", p: "Sur notre propre infrastructure, sans dépendre d’un cloud étranger." },
        { n: "02", h: "Des réponses sourcées", p: "Chaque réponse cite le document d’origine. Rien n’est inventé." },
        { n: "03", h: "Des droits par personne", p: "Chacun ne voit que ce qui le concerne, par société et par dossier." },
        { n: "04", h: "Vous décidez", p: "Les classements incertains et les actions engageantes attendent votre validation." },
      ],
      faqLink: "Vos questions sur le projet",
      alt: "Une responsable vérifie un document avant de le valider",
    },
    cercle: {
      eyebrow: "Cercle fondateur · places limitées",
      title: <>Testez-le sur<br /><span>vos propres documents.</span></>,
      body: "Nous ouvrons Remparia GED à un petit groupe de dirigeants de PME. Vous la testez sur vos vrais documents, vous nous aidez à la façonner, et vous gardez un tarif fondateur.",
      open: "CANDIDATURES OUVERTES",
      get: "Ce que vous obtenez",
      perks: [
        "3 mois de pilote offerts, avec mise en route accompagnée sur 50 à 100 de vos documents",
        "Tarif fondateur bloqué pendant 12 mois",
        "Un accès direct à l’équipe pour orienter le produit",
      ],
      cta: "Candidater en 2 minutes",
      note: "Un échange de 30 minutes, sans engagement.",
    },
    faq: {
      eyebrow: "10 / FAQ",
      title: <>Les questions<br /><span>qui comptent.</span></>,
      more: "Une autre question ?",
      items: [
        ["Faut-il tout migrer d’un coup ?", "Non. Vous commencez par les nouveaux documents et vous reprenez l’historique à votre rythme. Nous pouvons vous y aider."],
        ["L’IA voit-elle tous mes documents ?", "Elle ne voit que ce que les droits de l’utilisateur permettent, et chaque réponse cite ses sources."],
        ["Où sont hébergés mes documents ?", "En France, sur notre propre infrastructure."],
        ["Est-ce que ça remplace ma plateforme de facture électronique ?", "Non. Votre plateforme agréée envoie et reçoit les factures. Remparia les range et les conserve avec tous vos autres documents de gestion."],
        ["Combien ça coûte ?", "Un abonnement par utilisateur et par mois, avec l’espace de stockage et des crédits IA inclus. Les membres du cercle fondateur bénéficient d’un tarif préférentiel."],
      ] as [string, string][],
    },
    closing: {
      title: <>Commencez par vos documents.<br /><span>Imaginez la suite.</span></>,
      cta: "Rejoindre le cercle fondateur",
    },
    footer: {
      tagline: <>Commencez par vos documents.<br />Imaginez la suite.</>,
      cta: "Rejoindre le cercle fondateur",
      site: "Le site Remparia",
      slogan: "Intelligence humaine. Échelle artificielle.",
      cookies: "Gérer les cookies",
    },
    title: "Remparia GED — Retrouvez n’importe quel document en moins de 15 secondes.",
  },
  en: {
    skip: "Skip to content",
    nav: {
      conservation: "Retention",
      completude: "Completeness",
      classement: "Filing",
      agent: "AI agent",
      connexions: "Connections",
      faq: "Questions",
      cta: "Join the founding circle",
      open: "Open menu",
      close: "Close menu",
      closeShort: "Close −",
      main: "Main navigation",
    },
    hero: {
      aria: "Remparia DMS introduction",
      eyebrow: "DMS for SMEs · Hosted in France",
      titleBefore: "Find any document",
      titleAccent: "in under 15 seconds.",
      body: "Remparia DMS files every document as soon as it arrives, checks that nothing is missing, and keeps it for as long as the law requires. An AI agent answers your questions, with sources.",
      cta: "Try it on my documents",
      secondary: "See what changes",
      note: "French-compliant filing plan · Sourced answers · You stay in control",
      bottomLeft: "A NEW WAY TO WORK WITH YOUR DOCUMENTS",
      bottomRight: "DISCOVER",
    },
    pillars: [
      { num: "01 / RETAIN", text: "Kept for as long as the law requires" },
      { num: "02 / COMPLETE", text: "No missing documents" },
      { num: "03 / FILE", text: "Filed and indexed automatically" },
      { num: "04 / ASK", text: "An AI agent that knows your documents" },
      { num: "05 / FIND", text: "In 15 seconds" },
    ],
    demo: {
      question: "Where is the 2026 ten-year insurance certificate?",
      file: "Ten-year insurance 2026 — Insurer Alpha",
      folder: "06 Insurance › 06.8 Construction guarantees",
      meta: "Valid until 31/12/2026 · Retention: 10 years · Renewal tracked",
      answer: "Here is the 2026 certificate. It covers structural works and expires on 31 December: I’ll remind you mid-November to request the next one.",
      source: "SOURCE: TEN-YEAR CERTIFICATE 2026, P. 1",
      example: "Illustrative example",
    },
    conservation: {
      eyebrow: "01 / RETENTION",
      title: <>Kept for as long as needed.<br /><span>Not a day less.</span></>,
      body: "Invoice, payslip, contract, certificate: every document type has its retention period. Remparia calculates the end date, warns you beforehand, and suggests destroying what can go. Nothing is discarded by mistake, nothing is kept for nothing.",
      checks: [
        "Legal and recommended retention for every document type",
        "Clear final disposition: keep, destroy or sort",
        "Documents hosted in France, on our own infrastructure",
      ],
      stat: "53 %",
      statText: "of small-business leaders fear losing their data or seeing it hacked.",
      statSource: "FRANCE NUM 2026 BAROMETER",
      register: "Retention register",
      example: "ILLUSTRATIVE EXAMPLE",
      cols: ["DOCUMENT", "PERIOD", "END"],
      rows: [
        { doc: "Supplier invoice", duration: "10 years", end: "31/12/2036", expired: false },
        { doc: "Payslip (copy)", duration: "5 years", end: "30/09/2031", expired: false },
        { doc: "Commercial contract", duration: "5 years after end", end: "Depends on contract end", expired: false },
        { doc: "Unsigned quote 2019", duration: "Expired", end: "To destroy, pending approval", expired: true },
      ],
      footnote: "3 documents reach end of retention this quarter.",
    },
    completude: {
      eyebrow: "02 / COMPLETENESS",
      title: <>Know what’s missing.<br /><span>Before anyone asks.</span></>,
      body: "Company extract, social-security certificate, ten-year insurance, risk assessment, employment contracts: Remparia knows what a French company must hold. It compares that with what you’ve uploaded and flags gaps and expired files.",
      after: "An audit, a tender, a sale or a fundraising round? Your file is already ready.",
      dossier: "Company file",
      score: "12 / 14 DOCUMENTS",
      items: [
        { name: "Company extract less than 3 months old", status: "Present", tone: "ok" },
        { name: "Ten-year insurance 2026", status: "Present", tone: "ok" },
        { name: "URSSAF vigilance certificate", status: "Expired on 30/09", tone: "warn" },
        { name: "Workplace risk assessment document", status: "Missing", tone: "bad" },
        { name: "Professional liability insurance contract", status: "Present", tone: "ok" },
      ],
    },
    classement: {
      eyebrow: "03 / FILING AND INDEXING",
      title: <>You upload.<br /><span>Filing happens on its own.</span></>,
      body: "Drop a file, a scan or an email. Remparia recognizes the document type, puts it in the right folder, gives it a clear name and extracts useful fields: issuer, amount, dates, deadline.",
      hint: "When it’s unsure, it asks you instead of guessing.",
      drop: "scan_0412.pdf uploaded",
      label: "SUGGESTED FILING",
      confidence: "HIGH CONFIDENCE",
      path: "04 Accounting › 04.2 Supplier invoices",
      file: "2026-10-03_Invoice_Supplier-Alpha_F-2026-118.pdf",
      fields: [
        ["Issuer", "Supplier Alpha"],
        ["Amount incl. tax", "€1,240.00"],
        ["Date", "03/10/2026"],
        ["Due date", "02/11/2026"],
      ],
      validate: "Confirm",
      reclass: "Reclassify",
      rule: "Rule applied: invoice received from a supplier",
      example: "ILLUSTRATIVE EXAMPLE",
      stats: [
        ["78", "ready-to-use folders, each with its own playbook"],
        ["298", "recognized document types"],
        ["8", "registers kept up to date: contracts, insurance, assets…"],
      ],
    },
    agent: {
      eyebrow: "04 / AI AGENT",
      title: <>An agent that knows<br /><span>all your documents.</span></>,
      body: "Ask questions in plain language, as you would a colleague. The agent searches your whole document base, answers, and cites every document used so you can verify.",
      checks: [
        "Every answer links back to its sources",
        "It only sees what each user’s permissions allow",
        "It never takes binding action without your approval",
      ],
      chatLabel: "SOURCED SEARCH EXAMPLE",
      q1: "Which contracts renew before year-end?",
      a1: "Three contracts renew automatically by 31 December:\n• Vehicle maintenance — notice before 15/11\n• Warehouse lease — notice before 30/11\n• Mobile telephony — notice before 01/12",
      s1: "SOURCES: 3 CONTRACTS · FOLDER 02 CONTRACTS",
      q2: "Prepare the company extract and URSSAF certificate for the tender.",
      a2: "The company extract is ready. The URSSAF certificate expired on 30/09: shall I prepare the renewal request?",
    },
    quinze: {
      eyebrow: "05 / FIND",
      value: "15",
      unit: "s",
      title: <>The time to find a document.<br /><span>Not a morning.</span></>,
      body: "A search or a question is enough, at the desk or on the phone. You get the right document, in its latest version, with the folder where it lives.",
      before: "TODAY",
      beforeItems: [
        "Search cabinets, the server, emails and Drive",
        "Call accounting or the assistant",
        "Wonder if you have the right version",
      ],
      after: "WITH REMPARIA DMS",
      afterItems: [
        "A search or a question in plain language",
        "The right document, in its latest version",
        "Its source and folder, so you can verify",
      ],
    },
    connectors: {
      eyebrow: "06 / WHERE YOUR DOCUMENTS ALREADY LIVE",
      title: <>Connect<br /><span>without a full migration.</span></>,
      body: "Remparia DMS can connect to your existing tools to retrieve, organize and make documents useful—email, drives, ERPs or e-signatures.",
      note: "Connections roll out progressively, according to your priorities and the security framework agreed with you.",
      aria: "Connectable tools",
    },
    os: {
      eyebrow: "07 / START SIMPLE. THINK AHEAD.",
      title: <>Your DMS today.<br /><span>Your OS tomorrow.</span></>,
      body: "You do not need to buy an entire platform to get started. Your documents are the first step toward an environment connecting your teams, tools and actions.",
      ecoAlt: "Remparia DMS diagram: upload, understand, act, create living files and retain evidence, through to RempariaOS.",
      ecoCaption: "Upload, understand, act, create a living file and retain evidence—then extend to RempariaOS.",
      steps: [
        { label: "THE STARTING POINT", title: "Remparia DMS", text: "Gather, organize and\nfind information.", phase: "PILOT PROGRAM", future: false },
        { label: "THE NEXT STEP", title: "Living files", text: "Connect documents, deadlines,\nowners and approvals.", phase: "PROGRESSIVE EXTENSION", future: true },
        { label: "ACROSS THE BUSINESS", title: "RempariaOS", text: "Connect your tools and orchestrate\nhuman-controlled actions.", phase: "PRODUCT VISION", future: true },
      ],
    },
    proof: {
      eyebrow: "08 / THE FIELD CONFIRMS IT",
      title: <>You’re not alone.<br /><span>The moment is now.</span></>,
      body: "Data security, document AI, e-invoicing: small-business priorities match exactly what Remparia DMS is building with you.",
      source: "Source: France Num 2026 Barometer.",
      stats: [
        { value: "53 %", text: "of small-business leaders fear losing their data or seeing it hacked." },
        { value: "13 %", text: "of small businesses use AI to analyze or classify documents." },
        { value: "39 %", text: "of small businesses rank e-invoicing reform among their digital priorities for 2026–2027." },
      ],
    },
    trust: {
      eyebrow: "09 / TRUST",
      visual: "YOUR BUSINESS. YOUR RIGHTS. YOUR CHOICES.",
      title: <>Useful AI.<br /><span>A clear framework.</span></>,
      items: [
        { n: "01", h: "Hosted in France", p: "On our own infrastructure, without depending on a foreign cloud." },
        { n: "02", h: "Sourced answers", p: "Every answer cites the original document. Nothing is invented." },
        { n: "03", h: "Permissions per person", p: "Everyone only sees what concerns them, by company and by folder." },
        { n: "04", h: "You decide", p: "Uncertain filings and binding actions wait for your approval." },
      ],
      faqLink: "Your questions about the project",
      alt: "A manager reviews a document before approval",
    },
    cercle: {
      eyebrow: "Founding circle · limited places",
      title: <>Try it on<br /><span>your own documents.</span></>,
      body: "We are opening Remparia DMS to a small group of SME leaders. You try it on your real documents, help us shape it, and keep founder pricing.",
      open: "APPLICATIONS OPEN",
      get: "What you get",
      perks: [
        "3 months of pilot free, with guided setup on 50 to 100 of your documents",
        "Founder pricing locked for 12 months",
        "Direct access to the team to steer the product",
      ],
      cta: "Apply in 2 minutes",
      note: "A 30-minute conversation, with no commitment.",
    },
    faq: {
      eyebrow: "10 / FAQ",
      title: <>The questions<br /><span>that matter.</span></>,
      more: "Another question?",
      items: [
        ["Do I have to migrate everything at once?", "No. You start with new documents and catch up on history at your own pace. We can help."],
        ["Does the AI see all my documents?", "It only sees what the user’s permissions allow, and every answer cites its sources."],
        ["Where are my documents hosted?", "In France, on our own infrastructure."],
        ["Does this replace my e-invoicing platform?", "No. Your accredited platform sends and receives invoices. Remparia files and retains them with all your other management documents."],
        ["How much does it cost?", "A per-user monthly subscription, with storage and AI credits included. Founding-circle members get preferential pricing."],
      ] as [string, string][],
    },
    closing: {
      title: <>Start with your documents.<br /><span>Imagine what comes next.</span></>,
      cta: "Join the founding circle",
    },
    footer: {
      tagline: <>Start with your documents.<br />Imagine what comes next.</>,
      cta: "Join the founding circle",
      site: "Remparia website",
      slogan: "Human intelligence. Artificial scale.",
      cookies: "Manage cookies",
    },
    title: "Remparia DMS — Find any document in under 15 seconds.",
  },
} as const;

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

function EcosystemMap({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="rg-eco" aria-labelledby="eco-caption">
      <img
        className="rg-eco__image"
        src="/assets/ged/remparia-ecosystem.png?v=4"
        alt={alt}
        loading="lazy"
      />
      <figcaption id="eco-caption" className="rg-eco__caption">{caption}</figcaption>
    </figure>
  );
}

export function GedLandingPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const faqVideoRef = useRef<HTMLVideoElement>(null);
  const t = copy[lang];

  useEffect(() => {
    const stored = window.localStorage.getItem("remparia-lang");
    if (stored === "en" || stored === "fr") setLang(stored);
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = t.title;
    document.documentElement.lang = lang;
    window.localStorage.setItem("remparia-lang", lang);
    document.body.classList.add("rg-landing-body");
    return () => {
      document.title = originalTitle;
      document.body.classList.remove("rg-landing-body");
    };
  }, [lang, t.title]);

  useEffect(() => {
    const video = faqVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    void video.play().catch(() => undefined);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="remparia-landing">
      <a className="rg-skip" href="#contenu">{t.skip}</a>
      <header className="rg-header">
        <div className="rg-header__inner">
          <a className="rg-brand" href="https://www.remparia.com/fr" aria-label="Remparia, site principal">
            <img src="/assets/ged/remparia-logo.png" alt="Remparia" />
          </a>
          <span className="rg-header__product">GED</span>
          <button
            className="rg-menu-toggle"
            type="button"
            aria-label={menuOpen ? t.nav.close : t.nav.open}
            aria-expanded={menuOpen}
            aria-controls="landing-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? t.nav.closeShort : "Menu +"}
          </button>
          <nav id="landing-navigation" className={menuOpen ? "is-open" : ""} aria-label={t.nav.main}>
            <a href="#conservation" onClick={closeMenu}>{t.nav.conservation}</a>
            <a href="#completude" onClick={closeMenu}>{t.nav.completude}</a>
            <a href="#classement" onClick={closeMenu}>{t.nav.classement}</a>
            <a href="#agent" onClick={closeMenu}>{t.nav.agent}</a>
            <a href="#connexions" onClick={closeMenu}>{t.nav.connexions}</a>
            <a href="#faq" onClick={closeMenu}>{t.nav.faq}</a>
            <a className="rg-nav-cta" href="#cercle" onClick={closeMenu}>{t.nav.cta} <Arrow diagonal /></a>
            <button
              className="rg-language-toggle"
              type="button"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </nav>
        </div>
      </header>

      <main id="contenu">
        <section className="rg-hero" aria-label={t.hero.aria}>
          <div className="rg-hero__bg" aria-hidden="true">
            <img src="/assets/ged/ged-hero-human-v2.png?v=4" alt="" fetchPriority="high" />
          </div>
          <div className="rg-hero__inner rg-container">
            <div className="rg-hero__copy">
              <span className="rg-eyebrow rg-hero__eyebrow"><i />{t.hero.eyebrow} <FranceFlag /></span>
              <h1>
                {t.hero.titleBefore}
                <br />
                <span>{t.hero.titleAccent}</span>
              </h1>
              <p>{t.hero.body}</p>
              <div className="rg-hero__actions">
                <button className="rg-button rg-button--dark" type="button" onClick={() => setApplicationOpen(true)}>
                  {t.hero.cta} <Arrow diagonal />
                </button>
                <a className="rg-text-link" href="#experience">
                  {t.hero.secondary} <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="rg-hero__note">
                <span className="rg-small-asterisk" aria-hidden="true">✳</span>
                <span>{t.hero.note}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="rg-hero-bottom rg-container">
          <span>{t.hero.bottomLeft}</span>
          <span>{t.hero.bottomRight} <span aria-hidden="true">↓</span></span>
        </div>

        <ul className="rg-pillars rg-container" aria-label={lang === "fr" ? "Les cinq piliers" : "The five pillars"}>
          {t.pillars.map(item => (
            <li key={item.num}>
              <small>{item.num}</small>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        <ScrollFilm lang={lang} />

        <section className="rg-section rg-feature rg-conservation" id="conservation">
          <div className="rg-feature__copy">
            <span className="rg-eyebrow">{t.conservation.eyebrow}</span>
            <h2>{t.conservation.title}</h2>
            <p>{t.conservation.body}</p>
            <div className="rg-feature__checks rg-feature__checks--outline">
              {t.conservation.checks.map(item => (
                <span key={item}><OutlineCheck /> {item}</span>
              ))}
            </div>
            <aside className="rg-stat-inline">
              <strong>{t.conservation.stat}</strong>
              <p>
                {t.conservation.statText}
                <span className="rg-stat-inline__source">{t.conservation.statSource}</span>
              </p>
            </aside>
          </div>
          <div className="rg-panel rg-panel--register">
            <div className="rg-panel__head">
              <span className="rg-panel__title">{t.conservation.register}</span>
              <span className="rg-panel__tag">{t.conservation.example}</span>
            </div>
            <table className="rg-table">
              <thead>
                <tr>{t.conservation.cols.map(col => <th key={col}>{col}</th>)}</tr>
              </thead>
              <tbody>
                {t.conservation.rows.map(row => (
                  <tr key={row.doc} className={row.expired ? "is-expired" : undefined}>
                    <td>{row.doc}</td>
                    <td className={row.expired ? "rg-table__warn" : undefined}>{row.duration}</td>
                    <td>
                      {row.expired ? <span className="rg-pill rg-pill--warn">{row.end}</span> : row.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="rg-panel__alert">
              <i aria-hidden="true" />
              <span>{t.conservation.footnote}</span>
            </div>
          </div>
        </section>

        <section className="rg-section rg-feature rg-feature--reverse" id="completude">
          <div className="rg-feature__copy">
            <span className="rg-eyebrow">{t.completude.eyebrow}</span>
            <h2>{t.completude.title}</h2>
            <p>{t.completude.body}</p>
            <p>{t.completude.after}</p>
          </div>
          <div className="rg-panel">
            <div className="rg-panel__head">
              <span>{t.completude.dossier}</span>
              <span>{t.completude.score}</span>
            </div>
            <ul className="rg-checklist">
              {t.completude.items.map(item => (
                <li key={item.name} data-tone={item.tone}>
                  <span>{item.name}</span>
                  <b>{item.status}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rg-section rg-classement" id="classement">
          <div className="rg-classement__main">
            <div className="rg-feature__copy">
              <span className="rg-eyebrow">{t.classement.eyebrow}</span>
              <h2>{t.classement.title}</h2>
              <p>{t.classement.body}</p>
              <p className="rg-classement__hint">{t.classement.hint}</p>
            </div>
            <div className="rg-panel rg-classify-card">
              <div className="rg-classify-card__drop">
                <span className="rg-classify-card__drop-icon" aria-hidden="true">↑</span>
                <span>{t.classement.drop}</span>
              </div>
              <div className="rg-classify-card__body">
                <div className="rg-classify-card__meta">
                  <span className="rg-classify-card__label">{t.classement.label}</span>
                  <span className="rg-classify-card__confidence">● {t.classement.confidence}</span>
                </div>
                <p className="rg-classify-card__path">{t.classement.path}</p>
                <p className="rg-classify-card__file">{t.classement.file}</p>
                <dl className="rg-classify-card__fields">
                  {t.classement.fields.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div className="rg-classify-card__actions">
                  <span className="rg-button rg-button--dark">{t.classement.validate}</span>
                  <span className="rg-classify-card__ghost">{t.classement.reclass}</span>
                </div>
                <div className="rg-classify-card__foot">
                  <span>{t.classement.rule}</span>
                  <span className="rg-panel__tag">{t.classement.example}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rg-mini-stats">
            {t.classement.stats.map(([value, label]) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rg-section rg-feature rg-feature--reverse" id="agent">
          <div className="rg-feature__copy">
            <span className="rg-eyebrow">{t.agent.eyebrow}</span>
            <h2>{t.agent.title}</h2>
            <p>{t.agent.body}</p>
            <div className="rg-feature__checks">
              {t.agent.checks.map(item => (
                <span key={item}><Check /> {item}</span>
              ))}
            </div>
          </div>
          <div className="rg-chat">
            <div className="rg-chat__head">
              <span className="rg-chat__avatar">r.</span>
              <div>
                <b>Remparia</b>
                <small>{t.agent.chatLabel}</small>
              </div>
              <span aria-hidden="true">✳</span>
            </div>
            <div className="rg-chat__question">{t.agent.q1}</div>
            <div className="rg-chat__answer">
              <span className="rg-chat__avatar">r.</span>
              <div>
                <p style={{ whiteSpace: "pre-line" }}>{t.agent.a1}</p>
                <div className="rg-source">
                  <span aria-hidden="true">↳</span>
                  <div><small>{t.agent.s1}</small></div>
                </div>
              </div>
            </div>
            <div className="rg-chat__question">{t.agent.q2}</div>
            <div className="rg-chat__answer">
              <span className="rg-chat__avatar">r.</span>
              <div><p>{t.agent.a2}</p></div>
            </div>
          </div>
        </section>

        <section className="rg-section rg-quinze" id="quinze">
          <div className="rg-quinze__head">
            <div className="rg-quinze__metric">
              <span className="rg-eyebrow">{t.quinze.eyebrow}</span>
              <p className="rg-quinze__value">
                {t.quinze.value}<span>{t.quinze.unit}</span>
              </p>
            </div>
            <div className="rg-quinze__copy">
              <h2>{t.quinze.title}</h2>
              <p>{t.quinze.body}</p>
            </div>
          </div>
          <div className="rg-compare">
            <div className="rg-compare__today">
              <span className="rg-eyebrow">{t.quinze.before}</span>
              <ul>{t.quinze.beforeItems.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="rg-compare__remparia">
              <span className="rg-eyebrow">{t.quinze.after}</span>
              <ul>{t.quinze.afterItems.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="rg-section rg-connectors" id="connexions">
          <div className="rg-section-head">
            <span className="rg-eyebrow">{t.connectors.eyebrow}</span>
            <h2>{t.connectors.title}</h2>
            <p>{t.connectors.body}</p>
          </div>
          <ul className="rg-connectors__grid" aria-label={t.connectors.aria}>
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
          <p className="rg-connectors__note">{t.connectors.note}</p>
        </section>

        <section className="rg-os" id="remparia-os">
          <div className="rg-section">
            <div className="rg-os__heading">
              <span className="rg-eyebrow">{t.os.eyebrow}</span>
              <h2>{t.os.title}</h2>
              <p>{t.os.body}</p>
            </div>
            <EcosystemMap alt={t.os.ecoAlt} caption={t.os.ecoCaption} />
            <div className="rg-os__roadmap">
              {t.os.steps.flatMap((step, index) => {
                const card = (
                  <div key={step.title}>
                    <small>{step.label}</small>
                    <h3>{step.title}</h3>
                    <p style={{ whiteSpace: "pre-line" }}>{step.text}</p>
                    <span className={step.future ? "rg-phase rg-phase--future" : "rg-phase"}>{step.phase}</span>
                  </div>
                );
                if (index === 0) return [card];
                return [
                  <span className="rg-roadmap-arrow" aria-hidden="true" key={`arrow-${step.title}`}>→</span>,
                  card,
                ];
              })}
            </div>
          </div>
        </section>

        <section className="rg-section rg-proof" id="chiffres" aria-labelledby="proof-title">
          <div className="rg-proof__head">
            <span className="rg-eyebrow">{t.proof.eyebrow}</span>
            <div className="rg-proof__intro">
              <h2 id="proof-title">{t.proof.title}</h2>
              <p>{t.proof.body}</p>
            </div>
          </div>
          <ul className="rg-proof__grid">
            {t.proof.stats.map(stat => (
              <li key={stat.value} className="rg-proof__item">
                <strong className="rg-proof__value">{stat.value}</strong>
                <p>{stat.text}</p>
              </li>
            ))}
          </ul>
          <p className="rg-proof__source">{t.proof.source}</p>
        </section>

        <section className="rg-section rg-trust" id="confiance">
          <div className="rg-trust__visual">
            <img src="/assets/ged/ged-trust-human-v2.png" alt={t.trust.alt} loading="lazy" />
            <span className="rg-eyebrow">{t.trust.visual}</span>
          </div>
          <div className="rg-trust__copy">
            <span className="rg-eyebrow">{t.trust.eyebrow}</span>
            <h2>{t.trust.title}</h2>
            {t.trust.items.map(item => (
              <div className="rg-trust-item" key={item.n}>
                <span className="rg-trust-item__num">{item.n}</span>
                <div>
                  <h3>
                    {item.h}
                    {item.n === "01" ? <>{" "}<FranceFlag /></> : null}
                  </h3>
                  <p>{item.p}</p>
                </div>
              </div>
            ))}
            <a className="rg-text-link" href="#faq">{t.trust.faqLink} <Arrow /></a>
          </div>
        </section>

        <section className="rg-section rg-pilot" id="cercle">
          <div className="rg-pilot__copy">
            <span className="rg-eyebrow"><i />{t.cercle.eyebrow}</span>
            <h2>{t.cercle.title}</h2>
            <p>{t.cercle.body}</p>
            <div className="rg-pilot__perks">
              {t.cercle.perks.map(item => (
                <span key={item}><Check /> {item}</span>
              ))}
            </div>
          </div>
          <div className="rg-pilot-card">
            <div className="rg-pilot-card__top">
              <span>{t.cercle.open}</span>
              <span>{lang === "fr" ? "PLACES LIMITÉES" : "LIMITED PLACES"}</span>
            </div>
            <span className="rg-pilot-card__asterisk" aria-hidden="true">✳</span>
            <h3>{t.cercle.get}</h3>
            <div className="rg-pilot__perks rg-pilot-card__perks">
              {t.cercle.perks.map(item => (
                <span key={item}><Check /> {item}</span>
              ))}
            </div>
            <button className="rg-button rg-button--dark" type="button" onClick={() => setApplicationOpen(true)}>
              {t.cercle.cta} <Arrow diagonal />
            </button>
            <p>{t.cercle.note}</p>
          </div>
        </section>

        <section className="rg-section rg-faq" id="faq">
          <div className="rg-faq__intro">
            <span className="rg-eyebrow">{t.faq.eyebrow}</span>
            <h2>{t.faq.title}</h2>
          </div>
          <div className="rg-faq__panel">
            <div className="rg-faq__list">
              {t.faq.items.map(([question, answer], index) => (
                <div className="rg-faq__item" key={question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span>{question}</span>
                      <span aria-hidden="true">{openFaq === index ? "−" : "+"}</span>
                    </button>
                  </h3>
                  <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={openFaq !== index}>
                    <p>{answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <a className="rg-text-link" href="mailto:contact@remparia.com">{t.faq.more} <Arrow diagonal /></a>
          </div>
        </section>

        <section className="rg-section rg-closing" id="suite" aria-labelledby="closing-title">
          <div className="rg-closing__copy">
            <h2 id="closing-title">{t.closing.title}</h2>
            <a className="rg-button rg-button--dark" href="#cercle">
              {t.closing.cta} <Arrow diagonal />
            </a>
          </div>
          <figure className="rg-closing__media">
            <video
              ref={faqVideoRef}
              className="rg-closing__video"
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
        </section>
      </main>

      <FounderApplicationModal open={applicationOpen} onClose={() => setApplicationOpen(false)} lang={lang} />
      <CookieBanner lang={lang} />

      <footer className="rg-footer">
        <div className="rg-container">
          <div className="rg-footer__top">
            <a className="rg-brand" href="https://www.remparia.com/fr" aria-label="Remparia">
              <img src="/assets/ged/remparia-logo.png" alt="Remparia" />
            </a>
            <p>{t.footer.tagline}</p>
            <a className="rg-text-link" href="#cercle">{t.footer.cta} <Arrow diagonal /></a>
          </div>
          <div className="rg-footer__bottom">
            <span>© {new Date().getFullYear()} Remparia</span>
            <span>{t.footer.slogan}</span>
            <button type="button" onClick={openCookiePreferences}>{t.footer.cookies}</button>
            <a href="https://www.remparia.com/fr">{t.footer.site} <Arrow diagonal /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
