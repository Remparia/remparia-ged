"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Box,
  CalendarDays,
  ChartNoAxesCombined,
  FileCheck2,
  FileText,
  History,
  ListTree,
  LockKeyhole,
  Mail,
  Send,
  SquareCheckBig,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";

type Lang = "fr" | "en";

type FlowItem = { icon: LucideIcon; label: string };
type FlowStep = {
  num: string;
  title: string;
  items: FlowItem[];
  visual: "centralize" | "structure" | "connect" | "act";
};

const copy = {
  fr: {
    aria: "Schéma Remparia GED : centraliser, structurer, relier et agir",
    caption: "Centraliser, structurer, relier et agir — avec traçabilité et droits d’accès.",
    steps: [
      {
        num: "01",
        title: "CENTRALISER",
        visual: "centralize" as const,
        items: [
          { icon: FileText, label: "PDF et pièces jointes" },
          { icon: Mail, label: "E-mails" },
          { icon: FileText, label: "Documents métier" },
        ],
      },
      {
        num: "02",
        title: "STRUCTURER",
        visual: "structure" as const,
        items: [
          { icon: FileText, label: "Classer les documents" },
          { icon: ListTree, label: "Extraire les informations" },
          { icon: CalendarDays, label: "Repérer les échéances" },
        ],
      },
      {
        num: "03",
        title: "RELIER",
        visual: "connect" as const,
        items: [
          { icon: UserRound, label: "Clients et fournisseurs" },
          { icon: UsersRound, label: "Salariés et produits" },
          { icon: Box, label: "Contrats" },
        ],
      },
      {
        num: "04",
        title: "AGIR",
        visual: "act" as const,
        items: [
          { icon: Bell, label: "Alertes d’échéance" },
          { icon: SquareCheckBig, label: "Tâches à suivre" },
          { icon: UsersRound, label: "Validations" },
          { icon: Send, label: "Relances" },
        ],
      },
    ] satisfies FlowStep[],
    traceTitle: "TRAÇABILITÉ ET ACCÈS",
    trace: [
      { icon: FileCheck2, label: "Documents sources" },
      { icon: History, label: "Historique" },
      { icon: LockKeyhole, label: "Droits d’accès" },
    ] satisfies FlowItem[],
    outcomes: [
      { icon: Target, label: "Décider avec les bonnes informations" },
      { icon: CalendarDays, label: "Suivre les échéances" },
      { icon: ChartNoAxesCombined, label: "Faire avancer les dossiers" },
    ] satisfies FlowItem[],
  },
  en: {
    aria: "Remparia DMS diagram: centralize, structure, connect and act",
    caption: "Centralize, structure, connect and act — with traceability and access rights.",
    steps: [
      {
        num: "01",
        title: "CENTRALIZE",
        visual: "centralize" as const,
        items: [
          { icon: FileText, label: "PDFs and attachments" },
          { icon: Mail, label: "Emails" },
          { icon: FileText, label: "Business documents" },
        ],
      },
      {
        num: "02",
        title: "STRUCTURE",
        visual: "structure" as const,
        items: [
          { icon: FileText, label: "File documents" },
          { icon: ListTree, label: "Extract information" },
          { icon: CalendarDays, label: "Spot deadlines" },
        ],
      },
      {
        num: "03",
        title: "CONNECT",
        visual: "connect" as const,
        items: [
          { icon: UserRound, label: "Clients and suppliers" },
          { icon: UsersRound, label: "Employees and products" },
          { icon: Box, label: "Contracts" },
        ],
      },
      {
        num: "04",
        title: "ACT",
        visual: "act" as const,
        items: [
          { icon: Bell, label: "Deadline alerts" },
          { icon: SquareCheckBig, label: "Follow-up tasks" },
          { icon: UsersRound, label: "Approvals" },
          { icon: Send, label: "Reminders" },
        ],
      },
    ] satisfies FlowStep[],
    traceTitle: "TRACEABILITY AND ACCESS",
    trace: [
      { icon: FileCheck2, label: "Source documents" },
      { icon: History, label: "History" },
      { icon: LockKeyhole, label: "Access rights" },
    ] satisfies FlowItem[],
    outcomes: [
      { icon: Target, label: "Decide with the right information" },
      { icon: CalendarDays, label: "Track deadlines" },
      { icon: ChartNoAxesCombined, label: "Move files forward" },
    ] satisfies FlowItem[],
  },
} as const;

function CentralizeArt() {
  return (
    <svg
      className="rg-flow__illu"
      viewBox="0 0 120 88"
      width="120"
      height="88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left document */}
      <path d="M18 8h14l6 6v22H18V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M32 8v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M23 22h10M23 27h8M23 32h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center document (higher) */}
      <path d="M48 2h16l7 7v26H48V2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M64 2v7h7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M54 16h12M54 21h10M54 26h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right document */}
      <path d="M82 8h14l6 6v22H82V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M96 8v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M87 22h10M87 27h8M87 32h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Arrows into inbox */}
      <path d="M28 40v10M28 50l-3.2-3.2M28 50l3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 38v14M60 52l-3.2-3.2M60 52l3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M92 40v10M92 50l-3.2-3.2M92 50l3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      {/* Inbox tray */}
      <path d="M22 62h76v18H22V62z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M22 62h18c4 8 36 8 40 0h18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function StructureArt() {
  return (
    <svg
      className="rg-flow__illu"
      viewBox="0 0 96 88"
      width="96"
      height="88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document */}
      <path d="M22 8h34l12 12v52H22V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M56 8v12h12" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M32 30h30M32 38h26M32 46h28M32 54h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Calendar badge */}
      <rect x="48" y="48" width="30" height="28" rx="4" fill="#f7f9f1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M56 45v8M70 45v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M52 58h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="56" cy="65" r="1.4" fill="currentColor" />
      <circle cx="63" cy="65" r="1.4" fill="currentColor" />
      <circle cx="70" cy="65" r="1.4" fill="currentColor" />
      <circle cx="56" cy="71" r="1.4" fill="currentColor" />
      <circle cx="63" cy="71" r="1.4" fill="currentColor" />
      <circle cx="70" cy="71" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ConnectArt() {
  return (
    <svg
      className="rg-flow__illu"
      viewBox="0 0 120 88"
      width="120"
      height="88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left document */}
      <path d="M10 8h16l5 5v18H10V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M26 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 18h10M14 22h8M14 26h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Center document */}
      <path d="M50 2h16l5 5v18H50V2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M66 2v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M54 12h10M54 16h8M54 20h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Right document */}
      <path d="M90 8h16l5 5v18H90V8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M106 8v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M94 18h10M94 22h8M94 26h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Connection lines to folder */}
      <path d="M18 32v12h30" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 26v18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M98 32v12H68" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      {/* Folder */}
      <path d="M34 52h16l4 5h32v23H34V52z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M34 57h52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ActArt() {
  return (
    <svg
      className="rg-flow__illu"
      viewBox="0 0 110 88"
      width="110"
      height="88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Checklist card */}
      <rect x="18" y="10" width="52" height="68" rx="6" stroke="currentColor" strokeWidth="1.7" />
      {/* Row 1 — checked */}
      <rect x="28" y="22" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30.2 27.2l2.2 2.2 4.4-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 25h18M44 29h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Row 2 — checked */}
      <rect x="28" y="40" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30.2 45.2l2.2 2.2 4.4-4.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 43h18M44 47h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Row 3 — empty */}
      <rect x="28" y="58" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M44 61h18M44 65h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Bell badge */}
      <circle cx="78" cy="62" r="18" fill="#f7f9f1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M70 58c0-5 3.4-8.5 8-8.5s8 3.5 8 8.5c0 5.5 2 7.5 2 7.5H68s2-2 2-7.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M75.5 67.5a2.6 2.6 0 0 0 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M88 48l3-3M91 52l3.5-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StepVisual({ kind }: { kind: FlowStep["visual"] }) {
  if (kind === "centralize") {
    return (
      <div className="rg-flow__art rg-flow__art--centralize" aria-hidden="true">
        <CentralizeArt />
      </div>
    );
  }
  if (kind === "structure") {
    return (
      <div className="rg-flow__art rg-flow__art--structure" aria-hidden="true">
        <StructureArt />
      </div>
    );
  }
  if (kind === "connect") {
    return (
      <div className="rg-flow__art rg-flow__art--connect" aria-hidden="true">
        <ConnectArt />
      </div>
    );
  }
  return (
    <div className="rg-flow__art rg-flow__art--act" aria-hidden="true">
      <ActArt />
    </div>
  );
}

export function EcosystemMap({ lang = "fr" }: { lang?: Lang }) {
  const t = copy[lang];

  return (
    <figure className="rg-eco" aria-label={t.aria}>
      <div className="rg-flow">
        <div className="rg-flow__board">
          <ol className="rg-flow__steps">
            {t.steps.map((step, index) => (
              <li key={step.num} className="rg-flow__step">
                {index > 0 && <span className="rg-flow__connector" aria-hidden="true">→</span>}
                <article className="rg-flow__card">
                  <StepVisual kind={step.visual} />
                  <p className="rg-flow__num">
                    <span>{step.num}</span> {step.title}
                  </p>
                  <ul>
                    {step.items.map(item => (
                      <li key={item.label}>
                        <item.icon size={16} strokeWidth={1.8} aria-hidden="true" />
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </article>
                <span className="rg-flow__down" aria-hidden="true">↓</span>
              </li>
            ))}
          </ol>

          <div className="rg-flow__trace">
            <p>{t.traceTitle}</p>
            <ul>
              {t.trace.map(item => (
                <li key={item.label}>
                  <item.icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="rg-flow__outcomes">
          {t.outcomes.map(item => (
            <li key={item.label}>
              <item.icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption id="eco-caption" className="rg-eco__caption">{t.caption}</figcaption>
    </figure>
  );
}
