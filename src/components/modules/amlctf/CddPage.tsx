"use client";

import { useState } from "react";
import { Shield, CheckCircle2, Clock, AlertCircle, Search, ChevronDown, ChevronRight, User } from "lucide-react";

type CddStatus = "Verified" | "In Progress" | "Overdue" | "Not Started";
type RiskLevel = "Low" | "Medium" | "High";

interface CddRecord {
  ref: string;
  vendorName: string;
  property: string;
  agent: string;
  status: CddStatus;
  risk: RiskLevel;
  primaryId: boolean;
  secondaryId: boolean;
  pepCheck: boolean;
  sanctionsCheck: boolean;
  sourceOfFunds: boolean;
  riskAssessment: boolean;
  date: string;
}

const RECORDS: CddRecord[] = [
  { ref: "CDD-001", vendorName: "James & Carol Mitchell", property: "32 Harbour Street, Manly",       agent: "Taylor Reid",  status: "Overdue",     risk: "Medium", primaryId: true,  secondaryId: true,  pepCheck: true,  sanctionsCheck: true,  sourceOfFunds: false, riskAssessment: false, date: "12 Jun 2026" },
  { ref: "CDD-002", vendorName: "Priya Sharma",           property: "7 Marine Parade, Cronulla",      agent: "Taylor Reid",  status: "Verified",    risk: "Low",    primaryId: true,  secondaryId: true,  pepCheck: true,  sanctionsCheck: true,  sourceOfFunds: true,  riskAssessment: true,  date: "2 May 2026" },
  { ref: "CDD-003", vendorName: "Robert & Sue Langford",  property: "15 Cliff Drive, Newport",        agent: "Sarah Kim",    status: "Verified",    risk: "Low",    primaryId: true,  secondaryId: true,  pepCheck: true,  sanctionsCheck: true,  sourceOfFunds: true,  riskAssessment: true,  date: "18 May 2026" },
  { ref: "CDD-004", vendorName: "Thornfield Pty Ltd",     property: "82 Pacific Highway, Gordon",     agent: "Mark Ng",      status: "In Progress", risk: "High",   primaryId: true,  secondaryId: false, pepCheck: false, sanctionsCheck: false, sourceOfFunds: false, riskAssessment: false, date: "5 Jun 2026" },
  { ref: "CDD-005", vendorName: "Elena Vasquez",          property: "4/12 Bay Street, Balmain",       agent: "Taylor Reid",  status: "Verified",    risk: "Low",    primaryId: true,  secondaryId: true,  pepCheck: true,  sanctionsCheck: true,  sourceOfFunds: true,  riskAssessment: true,  date: "10 Apr 2026" },
  { ref: "CDD-006", vendorName: "Hai & Linh Nguyen",     property: "201 Crown Street, Darlinghurst", agent: "Sarah Kim",    status: "In Progress", risk: "Low",    primaryId: true,  secondaryId: true,  pepCheck: true,  sanctionsCheck: false, sourceOfFunds: false, riskAssessment: false, date: "8 Jun 2026" },
  { ref: "CDD-007", vendorName: "Coastal Holdings Trust", property: "14 Cove Road, Watsons Bay",      agent: "Jamie Walsh",  status: "Overdue",     risk: "High",   primaryId: false, secondaryId: false, pepCheck: false, sanctionsCheck: false, sourceOfFunds: false, riskAssessment: false, date: "1 Jun 2026" },
];

const STATUS_STYLE: Record<CddStatus, React.CSSProperties> = {
  "Verified":    { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "In Progress": { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Overdue":     { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Not Started": { background: "var(--b-bg-secondary)",    color: "var(--b-text-muted)" },
};

const RISK_STYLE: Record<RiskLevel, React.CSSProperties> = {
  "Low":    { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Medium": { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "High":   { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const STATUS_ICON = {
  "Verified":    CheckCircle2,
  "In Progress": Clock,
  "Overdue":     AlertCircle,
  "Not Started": Clock,
} as const;

const CHECKS = [
  { key: "primaryId",      label: "Primary ID" },
  { key: "secondaryId",    label: "Secondary ID" },
  { key: "pepCheck",       label: "PEP Check" },
  { key: "sanctionsCheck", label: "Sanctions" },
  { key: "sourceOfFunds",  label: "Source of Funds" },
  { key: "riskAssessment", label: "Risk Assessment" },
] as const;

export function CddPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = RECORDS.filter(r =>
    r.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    r.property.toLowerCase().includes(search.toLowerCase()) ||
    r.ref.toLowerCase().includes(search.toLowerCase())
  );

  const overdue = RECORDS.filter(r => r.status === "Overdue").length;
  const verified = RECORDS.filter(r => r.status === "Verified").length;

  return (
    <div className="p-6 md:p-8 max-w-[1100px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Customer Due Diligence</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
            {verified}/{RECORDS.length} verified · {overdue > 0 && <span style={{ color: "#f06060" }}>{overdue} overdue</span>}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Records",  value: RECORDS.length, style: {} },
          { label: "Verified",       value: verified,        style: { color: "var(--b-badge-green-text)" } },
          { label: "In Progress",    value: RECORDS.filter(r => r.status === "In Progress").length, style: { color: "var(--b-badge-yellow-text)" } },
          { label: "Overdue",        value: overdue,         style: { color: "#f06060" } },
        ].map(s => (
          <div key={s.label} className="p-4 border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
            <div className="text-[2rem] font-bold leading-none" style={s.style}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 h-[38px] border mb-4 w-full md:w-80" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)" }}>
        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor, property…" className="bg-transparent text-[12.5px] outline-none flex-1" style={{ color: "var(--b-text)" }} />
      </div>

      {/* Records */}
      <div className="space-y-2">
        {filtered.map(r => {
          const StatusIcon = STATUS_ICON[r.status];
          const isOpen = expanded === r.ref;
          const completedChecks = CHECKS.filter(c => r[c.key]).length;
          return (
            <div key={r.ref} className="border" style={{ borderColor: "var(--b-border)" }}>
              <button
                className="w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors"
                style={{ background: "var(--b-bg)" }}
                onClick={() => setExpanded(isOpen ? null : r.ref)}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{r.vendorName}</span>
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{r.property} · {r.agent}</div>
                </div>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-medium" style={{ color: "var(--b-text-muted)" }}>{completedChecks}/6 checks</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold" style={RISK_STYLE[r.risk]}>{r.risk} risk</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold" style={STATUS_STYLE[r.status]}>
                    <StatusIcon className="w-3 h-3" />{r.status}
                  </span>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} /> : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--b-text-muted)" }}>Due Diligence Checks</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CHECKS.map(c => {
                      const done = r[c.key];
                      return (
                        <div key={c.key} className="flex items-center gap-2.5 px-3 py-2.5 border" style={{ background: done ? "var(--b-accent-bg)" : "var(--b-bg)", borderColor: done ? "var(--b-accent-border)" : "var(--b-border)" }}>
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" style={{ background: done ? "var(--b-badge-green-text)" : "var(--b-border-strong)" }}>
                            {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-[12px]" style={{ color: done ? "var(--b-text)" : "var(--b-text-muted)" }}>{c.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-[11px]" style={{ color: "var(--b-text-muted)" }}>Initiated: {r.date} · Agent: {r.agent}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
