import Link from "next/link";
import {
  Smartphone,
  WifiOff,
  Plus,
  ArrowLeft,
  FileText,
  ClipboardList,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { SubModule, ModuleKey } from "@/config/modules";

const MOBILE_LABELS = {
  full:       { label: "Full mobile parity", bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  partial:    { label: "Partial mobile",     bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "read-only":{ label: "Read only on mobile",bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  none:       { label: "Web only",           bg: "var(--b-bg-active)",        color: "var(--b-text-muted)" },
};

const MODULE_LABELS: Record<ModuleKey, string> = {
  safety: "Safety",
  people: "People",
  operations: "Operations",
  risk: "Risk Management",
  compliance: "Compliance",
  governance: "Governance",
  insights: "Insights",
  training: "Training",
  blueprints: "Blueprints",
};

const CTA_LABELS: Record<string, string> = {
  incidents: "Report Incident",
  swms: "New SWMS",
  permits: "New Permit",
  "permits-to-work": "New Permit to Work",
  prestart: "Start Prestart",
  toolbox: "New Toolbox Talk",
  actions: "New Action",
  loto: "New LOTO Record",
  "hazardous-materials": "Add Material",
  "ppe-register": "Add PPE Record",
  inductions: "Record Induction",
  "white-card": "Add White Card",
  "contractor-management": "Add Contractor",
  "health-wellbeing": "Log Check-in",
  "return-to-work": "New RTW Plan",
  "fatigue-management": "Log Hours",
  "warden-register": "Add Warden",
  "visitor-access": "Sign In Visitor",
  "health-monitoring": "Log Exposure",
  "safe-work-procedures": "New Procedure",
  "site-access-control": "Manage Access",
  "work-planning": "New Work Plan",
  "defect-reporting": "Report Defect",
  "emergency-procedures": "View Procedures",
  "plant-equipment": "Pre-op Check",
  "operational-readiness": "Readiness Check",
  "isolation-shutdown": "New Isolation",
  "hazard-register": "Log Hazard",
  "risk-assessments": "New Assessment",
  "emergency-response-plans": "New ERP",
  "critical-risk-controls": "Verify Controls",
  hrcw: "New HRCW Record",
  "psychosocial-risk": "New Assessment",
  "jsa-jsea": "New JSA",
  "chemical-process-risk": "New Assessment",
  "slip-trip-fall": "Log Risk",
  "inspections-audits": "New Inspection",
  "legislative-register": "Add Legislation",
  "regulator-notices": "Add Notice",
  "hrcw-compliance": "Add Record",
  "swms-register": "Add SWMS",
  "hazardous-substances": "Add Substance",
  "exposure-monitoring": "Log Exposure",
  "essential-safety-measures": "Add Record",
  "statutory-obligations": "Add Obligation",
  "whs-dashboard": "View Dashboard",
  "incident-analytics": "View Analytics",
  "compliance-reporting": "Generate Report",
  "leading-lagging": "View Indicators",
  "overdue-alerts": "View Alerts",
  "custom-reports": "Build Report",
};

const EMPTY_ICON: Record<string, LucideIcon> = {
  incidents: AlertCircle,
  actions: ClipboardList,
};

interface SubModulePageProps {
  moduleKey: ModuleKey;
  subModule: SubModule;
}

export function SubModulePage({ moduleKey, subModule }: SubModulePageProps) {
  const mobile = MOBILE_LABELS[subModule.mobileAccess];
  const ctaLabel = CTA_LABELS[subModule.id] ?? "New Record";
  const EmptyIcon = EMPTY_ICON[subModule.id] ?? FileText;

  return (
    <div className="p-8">
      <div className="max-w-[1100px]">
        {/* Breadcrumb */}
        <Link
          href={`/${moduleKey}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors mb-6 b-icon-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {MODULE_LABELS[moduleKey]}
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>
              {subModule.name}
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              {subModule.description}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 font-medium"
                style={{ background: mobile.bg, color: mobile.color }}
              >
                <Smartphone className="w-3 h-3" />
                {mobile.label}
              </span>
              {subModule.offlineCapable && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 font-medium"
                  style={{ background: "var(--b-bg-active)", color: "var(--b-text-tertiary)" }}
                >
                  <WifiOff className="w-3 h-3" />
                  Offline capable
                </span>
              )}
              {subModule.industries !== "shared" && (
                <span
                  className="text-[11.5px] px-2.5 py-1 font-medium border capitalize"
                  style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}
                >
                  {Array.isArray(subModule.industries)
                    ? subModule.industries.join(" / ")
                    : subModule.industries}
                </span>
              )}
            </div>
          </div>

          <button
            className="b-btn-accent flex items-center gap-2 px-4 h-[38px] text-[13px] font-semibold flex-shrink-0"
          >
            <Plus className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            {ctaLabel}
          </button>
        </div>

        {/* Empty state */}
        <div className="border border-dashed" style={{ borderColor: "var(--b-border)" }}>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-12 h-12 border flex items-center justify-center mb-4"
              style={{ background: "var(--b-bg-active)", borderColor: "var(--b-border)" }}
            >
              <EmptyIcon className="w-6 h-6" style={{ color: "var(--b-text-muted)" }} />
            </div>
            <h3 className="text-[14px] font-medium mb-1" style={{ color: "var(--b-text-tertiary)" }}>
              No {subModule.name.toLowerCase()} yet
            </h3>
            <p
              className="text-[12.5px] max-w-xs mb-6 leading-relaxed"
              style={{ color: "var(--b-text-muted)" }}
            >
              Records you create will appear here. Use the button above to get started.
            </p>
            <button
              className="b-btn-ghost flex items-center gap-2 px-4 h-[38px] text-[13px]"
            >
              <Plus className="w-3.5 h-3.5" />
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
