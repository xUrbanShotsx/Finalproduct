"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Camera, Megaphone, FileSignature, LogIn, HeartPulse, FileText, ChevronRight,
  AlertTriangle, ClipboardList, ListChecks, Users, ShieldAlert, Boxes, Map as MapIcon,
  type LucideIcon,
} from "lucide-react";
import { useField, type FieldRecord } from "./store";
import { SignOnView } from "./views/SignOnView";
import { InspectionsView } from "./views/InspectionsView";
import { PermitsView } from "./views/PermitsView";
import { ToolboxView } from "./views/ToolboxView";
import { DocumentsView } from "./views/DocumentsView";
import { MedicalView } from "./views/MedicalView";
import type { Industry, ModuleKey } from "@/config/modules";

type ViewKey = "signon" | "inspections" | "permits" | "toolbox" | "documents" | "medical";

type Tool =
  | { kind: "view"; view: ViewKey; defaultKind?: FieldRecord["kind"]; label: string; desc: string; icon: LucideIcon }
  | { kind: "link"; href: string; label: string; desc: string; icon: LucideIcon };

const META: Record<string, { title: string; desc: string }> = {
  safety:     { title: "Safety",         desc: "Report, sign and run safety in the field." },
  people:     { title: "People",         desc: "Sign on, inductions and worker info." },
  operations: { title: "Operations",     desc: "Defects, plant and site access on the go." },
  risk:       { title: "Risk",           desc: "Log hazards and check critical controls." },
  compliance: { title: "Compliance",     desc: "Documents, drawings and audits." },
  training:   { title: "Training",       desc: "Records and competencies." },
  insights:   { title: "Insights",       desc: "Performance overview." },
  governance: { title: "Governance",     desc: "Organisational governance." },
  blueprints: { title: "Blueprints",     desc: "ISO document packs." },
};

const TOOLS: Partial<Record<ModuleKey, Tool[]>> = {
  safety: [
    { kind: "view", view: "inspections", defaultKind: "Incident", label: "Report incident / hazard", desc: "Photo, voice note & GPS", icon: Camera },
    { kind: "view", view: "toolbox", label: "Toolbox talk", desc: "Run & capture attendance", icon: Megaphone },
    { kind: "view", view: "permits", label: "SWMS / permit sign-off", desc: "Read & sign · raise permit", icon: FileSignature },
    { kind: "link", href: "/safety/incidents", label: "Incidents", desc: "View the register", icon: AlertTriangle },
    { kind: "link", href: "/safety/actions", label: "My actions", desc: "Open corrective actions", icon: ListChecks },
  ],
  people: [
    { kind: "view", view: "signon", label: "Site sign-on / off", desc: "Gate QR · time & GPS", icon: LogIn },
    { kind: "view", view: "medical", label: "Medical & emergency", desc: "Contacts & broadcast", icon: HeartPulse },
    { kind: "link", href: "/people/inductions", label: "Inductions", desc: "Worker inductions", icon: ClipboardList },
    { kind: "link", href: "/people/contractor-management", label: "Contractors", desc: "Onboarding & access", icon: Users },
  ],
  operations: [
    { kind: "view", view: "inspections", defaultKind: "Defect", label: "Report a defect", desc: "Photo, annotate, out-of-service", icon: Camera },
    { kind: "link", href: "/operations/defect-reporting", label: "Defects", desc: "Defect register", icon: ListChecks },
    { kind: "link", href: "/operations/site-access-control", label: "Site access", desc: "Who's on site", icon: Users },
  ],
  risk: [
    { kind: "view", view: "inspections", defaultKind: "Hazard", label: "Log a hazard", desc: "Photo & GPS from the field", icon: Camera },
    { kind: "link", href: "/risk/hazard-register", label: "Hazard register", desc: "All hazards & controls", icon: ShieldAlert },
    { kind: "link", href: "/risk/critical-risk-controls", label: "Critical controls", desc: "Daily verification", icon: ListChecks },
  ],
  compliance: [
    { kind: "view", view: "documents", label: "Documents & drawings", desc: "SDS, SWMS, latest revisions", icon: FileText },
    { kind: "link", href: "/compliance/inspections-audits", label: "Inspections & audits", desc: "Scheduled checks", icon: ClipboardList },
  ],
  training: [
    { kind: "link", href: "/training/training-register", label: "Training register", desc: "Completed training", icon: ClipboardList },
    { kind: "link", href: "/training/competency-licences", label: "Competency & licences", desc: "Currency tracking", icon: ListChecks },
  ],
  insights: [
    { kind: "link", href: "/dashboard", label: "Dashboard", desc: "Operational snapshot", icon: Boxes },
    { kind: "link", href: "/insights/overdue-alerts", label: "Overdue & alerts", desc: "What needs attention", icon: AlertTriangle },
  ],
  blueprints: [
    { kind: "link", href: "/blueprints/library", label: "Document library", desc: "Generated ISO docs", icon: FileText },
    { kind: "link", href: "/blueprints/store", label: "Blueprint store", desc: "Browse & purchase", icon: MapIcon },
  ],
};

export function MobileModule({ moduleKey }: { moduleKey: ModuleKey; industry?: Industry }) {
  const f = useField();
  const [view, setView] = useState<{ v: ViewKey; defaultKind?: FieldRecord["kind"] } | null>(null);
  const back = () => setView(null);

  if (view) {
    if (view.v === "signon") return <SignOnView f={f} back={back} />;
    if (view.v === "inspections") return <InspectionsView f={f} back={back} defaultKind={view.defaultKind} title={META[moduleKey]?.title + " — Field report"} />;
    if (view.v === "permits") return <PermitsView back={back} />;
    if (view.v === "toolbox") return <ToolboxView back={back} />;
    if (view.v === "documents") return <DocumentsView back={back} />;
    if (view.v === "medical") return <MedicalView f={f} back={back} />;
  }

  const meta = META[moduleKey] ?? { title: moduleKey, desc: "" };
  const tools = TOOLS[moduleKey] ?? [];

  return (
    <div className="p-4 pb-24">
      <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--b-text)" }}>{meta.title}</h1>
      <p className="text-[13px] mt-0.5 mb-5" style={{ color: "var(--b-text-muted)" }}>{meta.desc}</p>

      {tools.length === 0 ? (
        <div className="border border-dashed p-8 text-center" style={{ borderColor: "var(--b-border)" }}>
          <p className="text-[13px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Best viewed on desktop</p>
          <p className="text-[12px] mt-1" style={{ color: "var(--b-text-muted)" }}>This module is detailed work — open Briesa on a larger screen.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tools.map((t) => {
            const Icon = t.icon;
            const inner = (
              <>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: "var(--b-accent-bg)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--b-accent-text)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold" style={{ color: "var(--b-text)" }}>{t.label}</div>
                  <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{t.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
              </>
            );
            const cls = "w-full flex items-center gap-3 border p-3 text-left";
            const style = { borderColor: "var(--b-border)", background: "var(--b-bg)" } as React.CSSProperties;
            return t.kind === "link"
              ? <Link key={t.label} href={t.href} className={cls} style={style}>{inner}</Link>
              : <button key={t.label} onClick={() => setView({ v: t.view, defaultKind: t.defaultKind })} className={cls} style={style}>{inner}</button>;
          })}
        </div>
      )}
    </div>
  );
}
